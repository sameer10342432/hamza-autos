import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  UserCheck, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Search, 
  Save, 
  CheckSquare 
} from 'lucide-react';
import { MechanicAttendance, AttendanceStatus, MechanicProfile } from '../../types';
import { AdminApiService } from '../../services/adminApiService';

interface MechanicAttendanceSectionProps {
  onNotify?: (msg: string) => void;
}

export const MechanicAttendanceSection: React.FC<MechanicAttendanceSectionProps> = ({
  onNotify = () => {}
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [mechanics, setMechanics] = useState<MechanicProfile[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, MechanicAttendance>>({});
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [mechRes, attRes] = await Promise.all([
        AdminApiService.getMechanics(),
        AdminApiService.getMechanicAttendance({ date: selectedDate })
      ]);

      if (mechRes.success && mechRes.mechanics) {
        setMechanics(mechRes.mechanics);
      }

      const map: Record<string, MechanicAttendance> = {};
      if (attRes.success && attRes.attendance) {
        attRes.attendance.forEach((rec: MechanicAttendance) => {
          map[rec.mechanicId] = rec;
        });
      }
      setAttendanceRecords(map);
    } catch (err) {
      console.error('Failed to load attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const handleUpdateStatus = async (mechanic: MechanicProfile, status: AttendanceStatus) => {
    const existing = attendanceRecords[mechanic.id];
    const updatedRecord: Partial<MechanicAttendance> = {
      mechanicId: mechanic.id,
      mechanicName: mechanic.fullName,
      date: selectedDate,
      checkInTime: existing?.checkInTime || (status === 'Present' ? '08:45 AM' : ''),
      checkOutTime: existing?.checkOutTime || '',
      status,
      notes: existing?.notes || ''
    };

    try {
      const res = await AdminApiService.recordMechanicAttendance(updatedRecord);
      if (res.success) {
        setAttendanceRecords(prev => ({ ...prev, [mechanic.id]: res.attendanceRecord }));
        onNotify(`Updated ${mechanic.fullName}: ${status}`);
      }
    } catch (err: any) {
      alert(`Error updating attendance: ${err.message}`);
    }
  };

  const handleMarkAllPresent = async () => {
    try {
      for (const m of mechanics) {
        if (m.employmentStatus === 'Active') {
          await AdminApiService.recordMechanicAttendance({
            mechanicId: m.id,
            mechanicName: m.fullName,
            date: selectedDate,
            checkInTime: '08:45 AM',
            status: 'Present',
            notes: 'Marked present via Quick Register.'
          });
        }
      }
      await loadData();
      onNotify('All active workshop mechanics marked present for ' + selectedDate);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const presentCount = Object.values(attendanceRecords).filter(a => a.status === 'Present').length;
  const absentCount = Object.values(attendanceRecords).filter(a => a.status === 'Absent').length;
  const leaveCount = Object.values(attendanceRecords).filter(a => ['Leave', 'Half Day'].includes(a.status)).length;

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-black uppercase tracking-wider text-red-600 mb-0.5">
            STAFF ATTENDANCE REGISTER
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Mechanic Attendance Tracking
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Record daily workshop attendance, bay duty reporting times, and leave logs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="py-1.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:outline-none focus:border-red-500"
          />

          <button
            onClick={handleMarkAllPresent}
            className="h-9 px-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Mark All Present</span>
          </button>
        </div>
      </div>

      {/* 2. Quick Attendance Summary Cards */}
      <div className="grid grid-cols-3 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs text-center">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600">Present Today</div>
          <div className="text-2xl font-black text-emerald-900 mt-1 tabular-nums">{presentCount}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs text-center">
          <div className="text-xs font-bold uppercase tracking-wider text-red-600">Absent</div>
          <div className="text-2xl font-black text-red-900 mt-1 tabular-nums">{absentCount}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs text-center">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-700">Leave / Half Day</div>
          <div className="text-2xl font-black text-amber-900 mt-1 tabular-nums">{leaveCount}</div>
        </div>
      </div>

      {/* 3. Daily Attendance Register Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Mechanic</th>
                <th className="py-3 px-4">Reporting Bay</th>
                <th className="py-3 px-4">Check-in Time</th>
                <th className="py-3 px-4">Check-out Time</th>
                <th className="py-3 px-4">Attendance Status</th>
                <th className="py-3 px-4">Quick Mark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mechanics.map(m => {
                const rec = attendanceRecords[m.id];
                const currentStatus = rec?.status || 'Present';
                return (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{m.fullName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{m.phoneNumber}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {m.assignedBays?.join(', ') || 'General Bay'}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                      {rec?.checkInTime || '—'}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                      {rec?.checkOutTime || '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        currentStatus === 'Present' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        currentStatus === 'Absent' ? 'bg-red-50 text-red-700 border border-red-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {currentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        {(['Present', 'Absent', 'Leave', 'Half Day'] as const).map(st => (
                          <button
                            key={st}
                            onClick={() => handleUpdateStatus(m, st)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              currentStatus === st
                                ? 'bg-slate-900 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
