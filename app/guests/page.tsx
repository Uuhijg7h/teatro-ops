'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function GuestsPage() {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const res = await fetch('/api/bookings');
    const data = await res.json();
    setBookings(data);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const getStatusBadge = (status: string) => {
    if (status === 'paid') return 'bg-green-100 text-green-800';
    if (status === 'deposit') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusText = (status: string) => {
    if (status === 'paid') return 'Fully Paid';
    if (status === 'deposit') return 'Deposit Paid';
    return 'Outstanding';
  };

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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Guests & Clients</h1>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">Client</th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">Contact</th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">Event Type</th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">Event Date</th>
                  <th className="text-center text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">Guests</th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">Hall</th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">Manager</th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-semibold text-sm">
                          {getInitials(booking.name)}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{booking.name}</div>
                          <div className="text-xs text-gray-500">{booking.resNo || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">{booking.phone}</div>
                      <div className="text-xs text-gray-500">{booking.email}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">{booking.type}</td>
                    <td className="px-4 py-3 text-sm">{booking.eventDate}</td>
                    <td className="px-4 py-3 text-center text-sm">{booking.guests || 0}</td>
                    <td className="px-4 py-3 text-sm">{booking.hall}</td>
                    <td className="px-4 py-3 text-sm">{booking.manager || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded ${getStatusBadge(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
