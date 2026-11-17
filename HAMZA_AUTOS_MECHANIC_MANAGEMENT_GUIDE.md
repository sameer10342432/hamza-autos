# Hamza Autos — Mechanic Management System User & Technical Guide
**Location:** Workshop Operations Portal, Abu Bakar Road, Badami Bagh, Lahore  
**Architecture:** Database-Free File-Based JSON Storage (`storage/mechanics*.json`)  
**Route:** `/admin/mechanics` and `/admin/attendance`

---

## 1. Overview & Operational Role
The **Mechanic Management System** tracks the workshop's backbone: Ustad mechanics, technicians, electrical specialists, and apprentice helpers. It provides operational visibility into mechanic skills, daily wage/salary payroll, bay assignments, active workloads, and daily biometric/manual attendance registers.

---

## 2. File-Based Storage Architecture
- `storage/mechanics.json`: Mechanic roster including full name, phone number, CNIC, employment type (Full-Time, Part-Time, Daily Wage), daily wage/monthly salary in PKR, assigned repair bay, and technical specializations.
- `storage/mechanic-attendance.json`: Daily attendance logs tracking date, check-in time, check-out time, attendance status (`Present`, `Absent`, `Late`, `Half-Day`, `On-Leave`), and daily wage disbursement note.

---

## 3. Technical Specializations & Skill Matrix
Mechanics can be assigned multiple skill badges to facilitate smart job allocation:
- **Engine Overhauling:** Cylinder bore, piston ring replacement, valve seating, crank balancing.
- **Clutch & Transmission:** Friction plate replacement, clutch housing alignment, gear shift drum repair.
- **Wiring & Electrical:** CDI unit testing, stator coil winding, self-starter motor servicing, wiring harness loom.
- **EFI & Fuel Injection:** Throttle body ultrasonic cleaning, injector calibration, oxygen sensor diagnostics (Honda 125F, Suzuki GSX/GD, Yamaha YBR).
- **Suspension & Chassis:** Front fork straightening, hydraulic seal replacement, rear mono-shock setup.
- **Carburetor Tuning & Mileage:** Jet calibration, slide needle tuning, fuel mixture optimization.

---

## 4. Live Workload & Job Card Assignment
- The mechanic directory dynamically cross-references `storage/job-cards.json`.
- It displays the exact number of active repair jobs assigned to each mechanic.
- Mechanics with over 3 active jobs display a high-workload warning badge to prevent bottlenecks and ensure repair deadlines are met.
- Admins can assign or reassign any active job card to an on-duty mechanic with a single click.

---

## 5. Daily Attendance Register
- Accessible at `/admin/attendance`.
- Filter by date with single-click date picker (defaults to today in `Asia/Karachi` timezone).
- **"Quick Mark All Present"** button for fast morning roster roll call.
- Tracks check-in and check-out times with calculated daily wage realization.

---

## 6. API Reference
- `GET /api/mechanics`: Retrieve list of all mechanics with calculated active job count.
- `POST /api/mechanics`: Add a new mechanic with phone and CNIC validation.
- `PUT /api/mechanics/:id`: Edit mechanic details, daily rate, or bay assignment.
- `DELETE /api/mechanics/:id`: Deactivate or archive mechanic.
- `GET /api/mechanics/attendance?date=YYYY-MM-DD`: Fetch attendance register for specific date.
- `POST /api/mechanics/attendance`: Record or update attendance entry.
