import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedMotorcycle, MaintenanceReminder } from '../types';

const GARAGE_STORAGE_KEY = '@hamza_autos_garage_bikes_v1';
const REMINDERS_STORAGE_KEY = '@hamza_autos_garage_reminders_v1';

const DEFAULT_BIKES: SavedMotorcycle[] = [
  {
    id: 'bike-1',
    brand: 'Honda',
    model: 'CD 70',
    year: '2023',
    registrationNumber: 'LEN-23-4412',
    nickname: 'Daily Commuter',
    mileageKm: 8500,
    lastOilChangeKm: 7800,
    lastTuningKm: 6000,
  },
];

const DEFAULT_REMINDERS: MaintenanceReminder[] = [
  {
    id: 'rem-1',
    bikeId: 'bike-1',
    bikeName: 'Honda CD 70 (LEN-23-4412)',
    title: 'Engine Oil Change Due (Caltex 20W-50)',
    type: 'Oil Change',
    dueDate: '2026-12-01',
    dueKm: 8800,
    isCompleted: false,
  },
  {
    id: 'rem-2',
    bikeId: 'bike-1',
    bikeName: 'Honda CD 70 (LEN-23-4412)',
    title: 'Carburetor & Tappet Tuning Check',
    type: 'Bike Tuning',
    dueDate: '2026-12-15',
    dueKm: 9000,
    isCompleted: false,
  },
  {
    id: 'rem-3',
    bikeId: 'bike-1',
    bikeName: 'Honda CD 70 (LEN-23-4412)',
    title: 'Drive Chain Tension & Lubrication',
    type: 'Chain Lubrication',
    dueDate: '2026-11-28',
    dueKm: 8600,
    isCompleted: false,
  },
];

interface GarageContextType {
  bikes: SavedMotorcycle[];
  reminders: MaintenanceReminder[];
  activeBike: SavedMotorcycle | null;
  setActiveBike: (bike: SavedMotorcycle) => void;
  addBike: (bike: Omit<SavedMotorcycle, 'id'>) => Promise<void>;
  updateBike: (id: string, updates: Partial<SavedMotorcycle>) => Promise<void>;
  removeBike: (id: string) => Promise<void>;
  toggleReminder: (id: string) => Promise<void>;
  addReminder: (reminder: Omit<MaintenanceReminder, 'id' | 'isCompleted'>) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  isLoading: boolean;
}

const GarageContext = createContext<GarageContextType | undefined>(undefined);

export const GarageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bikes, setBikes] = useState<SavedMotorcycle[]>(DEFAULT_BIKES);
  const [reminders, setReminders] = useState<MaintenanceReminder[]>(DEFAULT_REMINDERS);
  const [activeBike, setActiveBikeState] = useState<SavedMotorcycle | null>(DEFAULT_BIKES[0] || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadGarageData() {
      try {
        const storedBikes = await AsyncStorage.getItem(GARAGE_STORAGE_KEY);
        const storedReminders = await AsyncStorage.getItem(REMINDERS_STORAGE_KEY);

        if (storedBikes) {
          const parsed = JSON.parse(storedBikes);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setBikes(parsed);
            setActiveBikeState(parsed[0]);
          }
        }
        if (storedReminders) {
          const parsedRem = JSON.parse(storedReminders);
          if (Array.isArray(parsedRem)) {
            setReminders(parsedRem);
          }
        }
      } catch (err) {
        console.warn('Failed to load garage data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadGarageData();
  }, []);

  const saveBikes = async (newBikes: SavedMotorcycle[]) => {
    setBikes(newBikes);
    try {
      await AsyncStorage.setItem(GARAGE_STORAGE_KEY, JSON.stringify(newBikes));
    } catch (e) {
      console.warn('Failed to save bikes:', e);
    }
  };

  const saveReminders = async (newReminders: MaintenanceReminder[]) => {
    setReminders(newReminders);
    try {
      await AsyncStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(newReminders));
    } catch (e) {
      console.warn('Failed to save reminders:', e);
    }
  };

  const addBike = async (data: Omit<SavedMotorcycle, 'id'>) => {
    const newBike: SavedMotorcycle = {
      ...data,
      id: `bike_${Date.now()}`,
    };
    const updated = [...bikes, newBike];
    await saveBikes(updated);
    if (!activeBike) {
      setActiveBikeState(newBike);
    }

    // Auto-create initial maintenance reminders for the new bike
    const initialReminders: MaintenanceReminder[] = [
      {
        id: `rem_${Date.now()}_1`,
        bikeId: newBike.id,
        bikeName: `${newBike.brand} ${newBike.model}`,
        title: 'Initial Oil Change & Sump Check',
        type: 'Oil Change',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        dueKm: (newBike.mileageKm || 0) + 1000,
        isCompleted: false,
      },
      {
        id: `rem_${Date.now()}_2`,
        bikeId: newBike.id,
        bikeName: `${newBike.brand} ${newBike.model}`,
        title: 'Brake & Chain Inspection',
        type: 'Brake Inspection',
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        dueKm: (newBike.mileageKm || 0) + 500,
        isCompleted: false,
      },
    ];
    await saveReminders([...reminders, ...initialReminders]);
  };

  const updateBike = async (id: string, updates: Partial<SavedMotorcycle>) => {
    const updated = bikes.map((b) => (b.id === id ? { ...b, ...updates } : b));
    await saveBikes(updated);
    if (activeBike?.id === id) {
      setActiveBikeState({ ...activeBike, ...updates });
    }
  };

  const removeBike = async (id: string) => {
    const updated = bikes.filter((b) => b.id !== id);
    await saveBikes(updated);
    const updatedReminders = reminders.filter((r) => r.bikeId !== id);
    await saveReminders(updatedReminders);
    if (activeBike?.id === id) {
      setActiveBikeState(updated[0] || null);
    }
  };

  const toggleReminder = async (id: string) => {
    const updated = reminders.map((r) =>
      r.id === id ? { ...r, isCompleted: !r.isCompleted } : r
    );
    await saveReminders(updated);
  };

  const addReminder = async (reminder: Omit<MaintenanceReminder, 'id' | 'isCompleted'>) => {
    const newRem: MaintenanceReminder = {
      ...reminder,
      id: `rem_${Date.now()}`,
      isCompleted: false,
    };
    await saveReminders([...reminders, newRem]);
  };

  const deleteReminder = async (id: string) => {
    const updated = reminders.filter((r) => r.id !== id);
    await saveReminders(updated);
  };

  return (
    <GarageContext.Provider
      value={{
        bikes,
        reminders,
        activeBike,
        setActiveBike: setActiveBikeState,
        addBike,
        updateBike,
        removeBike,
        toggleReminder,
        addReminder,
        deleteReminder,
        isLoading,
      }}
    >
      {children}
    </GarageContext.Provider>
  );
};

export const useGarage = () => {
  const context = useContext(GarageContext);
  if (!context) {
    throw new Error('useGarage must be used within a GarageProvider');
  }
  return context;
};
