import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomerProfile, DeliveryAddress } from '../types';

const AUTH_TOKEN_KEY = 'hamza_autos_auth_token_v1';
const CUSTOMER_PROFILE_KEY = '@hamza_autos_customer_profile_v1';

interface AuthContextType {
  customer: CustomerProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phoneNumber: string, name?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<CustomerProfile>) => Promise<void>;
  addSavedAddress: (address: DeliveryAddress) => Promise<void>;
  removeSavedAddress: (index: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
        if (token) {
          const profileRaw = await AsyncStorage.getItem(CUSTOMER_PROFILE_KEY);
          if (profileRaw) {
            setCustomer(JSON.parse(profileRaw));
          }
        }
      } catch (err) {
        console.warn('Error restoring auth session:', err);
      } finally {
        setIsLoading(false);
      }
    }
    restoreSession();
  }, []);

  const login = async (phoneNumber: string, name?: string): Promise<boolean> => {
    try {
      const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');
      const token = `ha_tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      // Create or update customer profile
      const newProfile: CustomerProfile = {
        id: customer?.id || `cust_${Date.now()}`,
        name: name || customer?.name || 'Hamza Autos Rider',
        phoneNumber: cleanPhone,
        area: customer?.area || 'Badami Bagh, Lahore',
        savedAddresses: customer?.savedAddresses || [],
        bikes: customer?.bikes || [
          {
            id: 'bike-def-1',
            brand: 'Honda',
            model: 'CD 70',
            year: '2023',
            registrationNumber: 'LEN-23-4412',
            mileageKm: 8500,
          },
        ],
      };

      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
      await AsyncStorage.setItem(CUSTOMER_PROFILE_KEY, JSON.stringify(newProfile));
      setCustomer(newProfile);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(CUSTOMER_PROFILE_KEY);
      setCustomer(null);
    } catch (err) {
      console.warn('Logout error:', err);
    }
  };

  const updateProfile = async (updates: Partial<CustomerProfile>) => {
    if (!customer) return;
    const updated = { ...customer, ...updates };
    setCustomer(updated);
    await AsyncStorage.setItem(CUSTOMER_PROFILE_KEY, JSON.stringify(updated));
  };

  const addSavedAddress = async (address: DeliveryAddress) => {
    if (!customer) return;
    const updatedAddresses = [...customer.savedAddresses, address];
    await updateProfile({ savedAddresses: updatedAddresses });
  };

  const removeSavedAddress = async (index: number) => {
    if (!customer) return;
    const updatedAddresses = customer.savedAddresses.filter((_, i) => i !== index);
    await updateProfile({ savedAddresses: updatedAddresses });
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        isAuthenticated: !!customer,
        isLoading,
        login,
        logout,
        updateProfile,
        addSavedAddress,
        removeSavedAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
