'use client';

import { useState, useEffect } from 'react';
import { Booking } from '@/lib/types/booking';
import { DEMO_BOOKINGS } from './demoBookings';

export function useDemoMode() {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoBookings, setDemoBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Check if we're in demo mode (no Supabase or explicit demo flag)
    const demoFlag = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
    const noSupabase = !process.env.NEXT_PUBLIC_SUPABASE_URL;
    
    if (demoFlag || noSupabase) {
      setIsDemoMode(true);
      // Load from localStorage or use default
      const stored = localStorage.getItem('demo_bookings');
      setDemoBookings(stored ? JSON.parse(stored) : DEMO_BOOKINGS);
    }
  }, []);

  const addDemoBooking = (booking: Booking) => {
    const updated = [...demoBookings, booking];
    setDemoBookings(updated);
    localStorage.setItem('demo_bookings', JSON.stringify(updated));
  };

  const updateDemoBooking = (id: string, booking: Partial<Booking>) => {
    const updated = demoBookings.map(b => b.id === id ? { ...b, ...booking } : b);
    setDemoBookings(updated);
    localStorage.setItem('demo_bookings', JSON.stringify(updated));
  };

  const deleteDemoBooking = (id: string) => {
    const updated = demoBookings.filter(b => b.id !== id);
    setDemoBookings(updated);
    localStorage.setItem('demo_bookings', JSON.stringify(updated));
  };

  return {
    isDemoMode,
    demoBookings,
    addDemoBooking,
    updateDemoBooking,
    deleteDemoBooking
  };
}
