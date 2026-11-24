import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Colors } from '../constants/colors';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { GarageProvider } from '../context/GarageContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <GarageProvider>
              <StatusBar style="light" />
              <Stack
                screenOptions={{
                  headerStyle: {
                    backgroundColor: Colors.navy,
                  },
                  headerTintColor: '#FFFFFF',
                  headerTitleStyle: {
                    fontWeight: '700',
                    fontSize: 17,
                  },
                  headerBackTitle: 'Back',
                  contentStyle: {
                    backgroundColor: Colors.background,
                  },
                }}
              >
                {/* Bottom Navigation Tabs */}
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

                {/* Common Stack Screens */}
                <Stack.Screen
                  name="search"
                  options={{ title: 'Search Parts & Services', presentation: 'card' }}
                />
                <Stack.Screen
                  name="cart"
                  options={{ title: 'Shopping Cart', presentation: 'card' }}
                />
                <Stack.Screen
                  name="checkout"
                  options={{ title: 'Checkout & Delivery', presentation: 'card' }}
                />
                <Stack.Screen
                  name="product/[id]"
                  options={{ title: 'Spare Part Details', presentation: 'card' }}
                />
                <Stack.Screen
                  name="service/[slug]"
                  options={{ title: 'Workshop Service', presentation: 'card' }}
                />
                <Stack.Screen
                  name="repair-booking"
                  options={{ title: 'Book Workshop Service', presentation: 'card' }}
                />
                <Stack.Screen
                  name="repair-tracking"
                  options={{ title: 'Track Active Repair', presentation: 'card' }}
                />
                <Stack.Screen
                  name="order-tracking"
                  options={{ title: 'Track Spare Parts Order', presentation: 'card' }}
                />
                <Stack.Screen
                  name="my-garage"
                  options={{ title: 'My Garage & Bikes', presentation: 'card' }}
                />
                <Stack.Screen
                  name="bike-health"
                  options={{ title: 'Motorcycle Health Report', presentation: 'card' }}
                />
                <Stack.Screen
                  name="notifications"
                  options={{ title: 'Notifications', presentation: 'card' }}
                />
                <Stack.Screen
                  name="saved-addresses"
                  options={{ title: 'Saved Addresses', presentation: 'card' }}
                />
                <Stack.Screen
                  name="support"
                  options={{ title: 'Customer Support & Hotline', presentation: 'card' }}
                />
              </Stack>
            </GarageProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
