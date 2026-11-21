/**
 * Hamza Autos - Global Shopping Cart Context
 * Preserves cart items across navigation, validates stock, and calculates live totals
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, ShopProduct } from '../types/shop';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: ShopProduct, quantity?: number, selectedCompatibility?: string) => { success: boolean; message: string };
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => { success: boolean; message?: string };
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'hamza_autos_shop_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, [items]);

  const addToCart = (
    product: ShopProduct, 
    quantity = 1, 
    selectedCompatibility?: string
  ): { success: boolean; message: string } => {
    if (product.stockQuantity <= 0) {
      return { success: false, message: `"${product.name}" is currently out of stock.` };
    }

    let success = true;
    let message = `Added ${quantity}x "${product.name}" to cart.`;

    setItems(prev => {
      const existingIndex = prev.findIndex(item => item.productId === product.id);

      if (existingIndex > -1) {
        const existing = prev[existingIndex];
        const newQty = existing.quantity + quantity;

        if (newQty > product.stockQuantity) {
          success = false;
          message = `Cannot add more. Only ${product.stockQuantity} items in stock.`;
          return prev;
        }

        const updated = [...prev];
        updated[existingIndex] = {
          ...existing,
          quantity: newQty,
          maxStock: product.stockQuantity,
          selectedCompatibility: selectedCompatibility || existing.selectedCompatibility
        };
        return updated;
      }

      if (quantity > product.stockQuantity) {
        success = false;
        message = `Cannot add ${quantity}. Only ${product.stockQuantity} available in stock.`;
        return prev;
      }

      const newItem: CartItem = {
        productId: product.id,
        sku: product.sku,
        name: product.name,
        slug: product.slug,
        image: product.images[0]?.url || '/assets/images/services/motorcycle-spare-parts.webp',
        unitPrice: product.discountedPrice || product.price,
        quantity,
        maxStock: product.stockQuantity,
        selectedCompatibility
      };

      return [...prev, newItem];
    });

    return { success, message };
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number): { success: boolean; message?: string } => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return { success: true };
    }

    let success = true;
    let message = '';

    setItems(prev => {
      return prev.map(item => {
        if (item.productId === productId) {
          if (quantity > item.maxStock) {
            success = false;
            message = `Cannot increase. Maximum available stock is ${item.maxStock}.`;
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      });
    });

    return { success, message };
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      itemCount,
      subtotal
    }}>
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
