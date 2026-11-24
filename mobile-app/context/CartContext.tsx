import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, SparePart, PakistanProvince } from '../types';
import { SHIPPING_RATES } from '../data/initialData';

const CART_STORAGE_KEY = '@hamza_autos_cart_v1';

interface CartContextType {
  items: CartItem[];
  addToCart: (part: SparePart, quantity?: number) => void;
  removeFromCart: (partId: string) => void;
  updateQuantity: (partId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  selectedProvince: PakistanProvince;
  selectedCity: string;
  shippingFee: number;
  totalAmount: number;
  setDeliveryLocation: (province: PakistanProvince, city: string) => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<PakistanProvince>('Punjab');
  const [selectedCity, setSelectedCity] = useState<string>('Lahore');
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from AsyncStorage on startup
  useEffect(() => {
    async function loadStoredCart() {
      try {
        const raw = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setItems(parsed);
          }
        }
      } catch (err) {
        console.warn('Failed to load cart from AsyncStorage:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStoredCart();
  }, []);

  // Persist cart to AsyncStorage whenever it changes
  const saveCartToStorage = async (updatedItems: CartItem[]) => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedItems));
    } catch (err) {
      console.warn('Failed to persist cart to AsyncStorage:', err);
    }
  };

  const addToCart = (part: SparePart, quantity: number = 1) => {
    if (quantity <= 0) return;
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.part.id === part.id);
      let updated: CartItem[];
      if (existingIndex > -1) {
        updated = [...prev];
        const newQty = Math.min(
          part.stockQuantity,
          updated[existingIndex].quantity + quantity
        );
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
      } else {
        const initialQty = Math.min(part.stockQuantity, quantity);
        updated = [...prev, { part, quantity: initialQty }];
      }
      saveCartToStorage(updated);
      return updated;
    });
  };

  const removeFromCart = (partId: string) => {
    setItems((prev) => {
      const updated = prev.filter((item) => item.part.id !== partId);
      saveCartToStorage(updated);
      return updated;
    });
  };

  const updateQuantity = (partId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        const updated = prev.filter((item) => item.part.id !== partId);
        saveCartToStorage(updated);
        return updated;
      }
      const updated = prev.map((item) => {
        if (item.part.id === partId) {
          const clamped = Math.min(item.part.stockQuantity, quantity);
          return { ...item, quantity: clamped };
        }
        return item;
      });
      saveCartToStorage(updated);
      return updated;
    });
  };

  const clearCart = () => {
    setItems([]);
    saveCartToStorage([]);
  };

  const setDeliveryLocation = (province: PakistanProvince, city: string) => {
    setSelectedProvince(province);
    setSelectedCity(city);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    const price = item.part.discountedPrice || item.part.sellingPrice;
    return sum + price * item.quantity;
  }, 0);

  // Calculate Pakistan shipping fee
  const shippingFee =
    selectedCity.toLowerCase() === 'lahore'
      ? SHIPPING_RATES['Lahore']
      : SHIPPING_RATES[selectedProvince] || 300;

  const totalAmount = subtotal > 0 ? subtotal + shippingFee : 0;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        selectedProvince,
        selectedCity,
        shippingFee,
        totalAmount,
        setDeliveryLocation,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
