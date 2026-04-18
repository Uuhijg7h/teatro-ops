'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Booking {
  id: string;
  name: string;
  eventDate: string;
  hall: string;
  status: string;
}

export default function CalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const res = await fetch('/api/bookings');
    const data = await res.json();
    setBookings(data);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`empty-${i}`} className="min-h-24 border border-gray-200 rounded p-2"></div>);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayBookings = bookings.filter(b => b.eventDate === dateStr);
    const isToday = d === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

    cells.push(
      <div key={d} className={`min-h-24 border rounded p-2 cursor-pointer hover:bg-gray-50 ${
        dayBookings.length > 0 ? 'bg-blue-50' : ''
      } ${isToday ? 'border-blue-500 border-2' : 'border-gray-200'}`}>
        <div className={`text-sm ${isToday ? 'font-bold' : ''}`}>{d}</div>
        {dayBookings.slice(0, 2).map(b => (
          <div key={b.id} className="bg-blue-600 text-white text-xs rounded px-2 py-1 mt-1 truncate">
            {b.name.split(' ')[0]} - {b.hall.replace('Hall', '').replace('Suite', '').trim()}
          </div>
        ))}
        {dayBookings.length > 2 && (
          <div className="text-xs text-gray-600 mt-1">{dayBookings.length - 2} more</div>
        )}
      </div>
    );
  }

  const upcoming = bookings.filter(b => new Date(b.eventDate) >= new Date()).sort((a, b) => a.eventDate.localeCompare(b.eventDate)).slice(0, 10);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">Teatro Banquet Hall</Link>
          <div className="flex gap-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
          </div>
        </div>
      </nav>

      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Event Calendar</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
                >
                  Previous
                </button>
                <h2 className="text-lg font-semibold">{months[month]} {year}</h2>
                <button 
                  onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
                >
                  Next
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {days.map(day => (
                  <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {cells}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 flex gap-4 text-xs text-gray-600">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-50 border border-gray-200 rounded inline-block"></span>
                Has event
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 border-2 border-blue-500 rounded inline-block"></span>
                Today
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold">Upcoming Events</h3>
            </div>
            {upcoming.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">No upcoming events</div>
            ) : (
              upcoming.map(b => (
                <div key={b.id} className="p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <div className="font-semibold text-sm">{b.name}</div>
                  <div className="text-xs text-gray-600 mt-1">{b.eventDate} - {b.hall}</div>
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      b.status === 'paid' ? 'bg-green-100 text-green-800' :
                      b.status === 'deposit' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {b.status === 'paid' ? 'Fully Paid' : b.status === 'deposit' ? 'Deposit Paid' : 'Outstanding'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
