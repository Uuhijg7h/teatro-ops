'use client';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const STATUS_CLS: Record<string,string> = {
  confirmed: 'bg-green-500',
  tentative: 'bg-yellow-400',
  cancelled: 'bg-red-400',
  completed: 'bg-gray-400',
};

export default function CalendarPage() {
  const supabase = createClientComponentClient();
  const [bookings, setBookings] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selected, setSelected] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('bookings').select('id,client_name,event_type,event_date,hall,status,guests').then(({ data }) => {
      setBookings(data || []);
    });
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const bookingsByDate: Record<string, any[]> = {};
  bookings.forEach(b => {
    if (b.event_date) {
      const d = b.event_date.split('T')[0];
      if (!bookingsByDate[d]) bookingsByDate[d] = [];
      bookingsByDate[d].push(b);
    }
  });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const today = new Date().toISOString().split('T')[0];

  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Calendar</h2>
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600">&larr;</button>
          <span className="text-base font-semibold text-gray-900 w-40 text-center">{MONTHS[month]} {year}</span>
          <button onClick={nextMonth} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600">&rarr;</button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-7">
          {DAYS.map(d => (
            <div key={d} className="py-3 text-center text-xs font-semibold text-gray-400 uppercase border-b border-gray-100">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} className="min-h-[100px] border-b border-r border-gray-100 bg-gray-50" />;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayBookings = bookingsByDate[dateStr] || [];
            const isToday = dateStr === today;
            return (
              <div key={dateStr}
                onClick={() => setSelected(dayBookings)}
                className={`min-h-[100px] border-b border-r border-gray-100 p-2 cursor-pointer hover:bg-blue-50 transition-colors ${
                  isToday ? 'bg-blue-50' : ''
                }`}>
                <span className={`text-sm font-medium ${
                  isToday ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-gray-700'
                }`}>{day}</span>
                <div className="mt-1 space-y-0.5">
                  {dayBookings.slice(0, 3).map(b => (
                    <div key={b.id} className={`text-xs px-1.5 py-0.5 rounded text-white truncate ${STATUS_CLS[b.status] || 'bg-gray-400'}`}>
                      {b.event_type || b.client_name}
                    </div>
                  ))}
                  {dayBookings.length > 3 && <div className="text-xs text-gray-400">+{dayBookings.length - 3} more</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected day bookings */}
      {selected.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">{selected.length} booking{selected.length > 1 ? 's' : ''} on this day</h3>
            <button onClick={() => setSelected([])} className="text-gray-400 hover:text-gray-600 text-sm">Close</button>
          </div>
          <div className="space-y-2">
            {selected.map(b => (
              <Link key={b.id} href={`/bookings/${b.id}`}
                className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{b.event_type || 'Event'}</p>
                  <p className="text-xs text-gray-500">{b.client_name} &bull; {b.hall || 'TBD'} &bull; {b.guests || 0} guests</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded text-white ${STATUS_CLS[b.status] || 'bg-gray-400'}`}>{b.status}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4">
        {[['confirmed','bg-green-500'],['tentative','bg-yellow-400'],['cancelled','bg-red-400'],['completed','bg-gray-400']].map(([s,c]) => (
          <div key={s} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded ${c}`} />
            <span className="text-xs text-gray-500 capitalize">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
