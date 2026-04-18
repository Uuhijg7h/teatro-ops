'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

type Booking = {
  id: string;
  client_name: string;
  event_type: string;
  event_date: string;
  hall: string;
  status: string;
  guest_count: number;
};

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function CalendarPage() {
  const supabase = createClientComponentClient();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [current, setCurrent] = useState(new Date());

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('bookings').select('id,client_name,event_type,event_date,hall,status,guest_count');
      if (data) setBookings(data);
    };
    fetch();
  }, []);

  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const bookingMap: { [date: string]: Booking[] } = {};
  bookings.forEach(b => {
    if (!bookingMap[b.event_date]) bookingMap[b.event_date] = [];
    bookingMap[b.event_date].push(b);
  });

  const upcoming = bookings
    .filter(b => b.event_date >= today.toISOString().split('T')[0])
    .sort((a, b) => a.event_date.localeCompare(b.event_date))
    .slice(0, 10);

  const prevMonth = () => setCurrent(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrent(new Date(year, month + 1, 1));

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex gap-4">
        {/* Calendar */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-5">
          {/* Month Nav */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-md text-gray-600">‹</button>
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <span>📅</span> {MONTHS[month]} {year}
            </h2>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-md text-gray-600">›</button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (day === null) return <div key={`e-${i}`} />;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayBookings = bookingMap[dateStr] || [];
              const isToday = year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
              return (
                <div
                  key={dateStr}
                  className={`min-h-[70px] border rounded-md p-1 text-xs ${
                    isToday ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <span className={`font-semibold text-xs ${isToday ? 'text-blue-600' : 'text-gray-600'}`}>{day}</span>
                  {dayBookings.map(b => (
                    <Link
                      key={b.id}
                      href={`/booking/${b.id}`}
                      className="block mt-0.5 px-1 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] truncate hover:bg-blue-200"
                    >
                      {b.client_name}
                    </Link>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex gap-4 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-100 inline-block"></span> Has event</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border border-blue-400 inline-block"></span> Today</span>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="w-[260px] bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Upcoming Events</h2>
          {upcoming.length === 0 ? (
            <p className="text-sm text-gray-400">No upcoming events</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map(b => (
                <Link key={b.id} href={`/booking/${b.id}`} className="block hover:bg-gray-50 rounded-md p-2 -mx-2 transition-colors">
                  <div className="font-medium text-sm text-gray-900">{b.client_name}</div>
                  <div className="text-xs text-gray-500">{b.event_date}</div>
                  <div className="text-xs text-gray-400">{b.hall} · {b.guest_count} guests</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
