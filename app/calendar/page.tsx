'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type Booking = {
  id: string;
  customer_name: string;
  event_name: string;
  event_date: string;
  venue: string;
  status: string;
  guests: number;
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarPage() {
  const supabase = createClientComponentClient();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchBookings = async () => {
      const { data } = await supabase
        .from('bookings')
        .select('id, customer_name, event_name, event_date, venue, status, guests');
      if (data) setBookings(data as Booking[]);
    };
    fetchBookings();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const bookingMap: { [date: string]: Booking[] } = {};
  bookings.forEach(b => {
    if (!bookingMap[b.event_date]) bookingMap[b.event_date] = [];
    bookingMap[b.event_date].push(b);
  });

  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const upcoming = bookings
    .filter(b => b.event_date >= today.toISOString().split('T')[0])
    .sort((a, b) => a.event_date.localeCompare(b.event_date))
    .slice(0, 5);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Calendar Grid */}
      <div className="flex-1 space-y-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
              <span className="text-xl">📅</span> {MONTHS[month]} {year}
            </h2>
            <div className="flex bg-[#f7f8fa] p-1 rounded-lg border border-gray-100">
              <button onClick={prevMonth} className="px-3 py-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600 font-black">‹</button>
              <button onClick={() => setCurrentDate(new Date())} className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:shadow-sm rounded-md transition-all text-blue-600">Today</button>
              <button onClick={nextMonth} className="px-3 py-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600 font-black">›</button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px bg-gray-100 border border-gray-100 rounded-lg overflow-hidden">
            {DAYS.map(day => (
              <div key={day} className="bg-[#f7f8fa] py-3 text-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{day}</span>
              </div>
            ))}
            {cells.map((day, i) => {
              const dateStr = day ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : null;
              const isToday = day && day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const dayBookings = dateStr ? bookingMap[dateStr] : [];

              return (
                <div key={i} className={`bg-white min-h-[120px] p-2 transition-colors hover:bg-gray-50 ${!day ? 'bg-[#fcfcfc]' : ''}`}>
                  {day && (
                    <>
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-[12px] font-black px-1.5 py-0.5 rounded-md ${isToday ? 'bg-blue-600 text-white' : 'text-gray-900'}`}>
                          {day}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {dayBookings.map(b => (
                          <div key={b.id} className="text-[10px] p-1.5 rounded bg-blue-50 border border-blue-100 text-blue-700 font-bold leading-tight truncate">
                            {b.customer_name}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sidebar: Upcoming Events */}
      <div className="w-full lg:w-80 space-y-6">
        <h2 className="text-sm font-black text-gray-900 uppercase tracking-tight">Upcoming Events</h2>
        <div className="space-y-4">
          {upcoming.map(b => (
            <div key={b.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex flex-col items-center justify-center text-blue-600">
                  <span className="text-[9px] font-black uppercase tracking-tighter">{new Date(b.event_date).toLocaleString('en-US', { month: 'short' })}</span>
                  <span className="text-[14px] font-black leading-none">{new Date(b.event_date).getDate()}</span>
                </div>
                <div>
                  <div className="text-[13px] font-black text-gray-900 leading-tight">{b.customer_name}</div>
                  <div className="text-[11px] text-gray-400 font-medium uppercase tracking-tighter">{b.event_name}</div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">📍 {b.venue}</span>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{b.guests} Guests</span>
              </div>
            </div>
          ))}
          {upcoming.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
              <span className="text-gray-400 text-xs font-medium uppercase tracking-widest">No upcoming events</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
