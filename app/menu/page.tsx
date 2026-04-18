'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type MenuPackage = {
  id: string;
  name: string;
  price_per_person: number;
  description: string;
  is_active: boolean;
};

type CateringAssignment = {
  id: string;
  client_name: string;
  event_type: string;
  event_date: string;
  guests: number;
  food_style: string;
  dietary_notes: string;
};

export default function MenuPage() {
  const supabase = createClientComponentClient();
  const [packages, setPackages] = useState<MenuPackage[]>([]);
  const [assignments, setAssignments] = useState<CateringAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: pkgs } = await supabase.from('menu_packages').select('*').eq('is_active', true).order('name');
      if (pkgs) setPackages(pkgs);

      const { data: assigns } = await supabase
        .from('bookings')
        .select('id,client_name,event_type,event_date,guests,food_style,dietary_notes')
        .order('event_date', { ascending: false });
      if (assigns) setAssignments(assigns);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Menu &amp; Catering</h1>
      </div>

      {/* Package Cards */}
      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading...</div>
      ) : packages.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 mb-6">
          No menu packages yet. Add packages to get started.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {packages.map(pkg => (
            <div key={pkg.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">{pkg.name}</span>
                <span className="text-sm font-semibold text-blue-600">CAD {pkg.price_per_person?.toFixed(2)}/head</span>
              </div>
              <p className="text-sm text-gray-500">{pkg.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Catering Assignments per Booking */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Catering Assignments per Booking</h2>
        </div>
        {!loading && assignments.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No bookings yet</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Booking</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Event Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Guests</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Food Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Dietary Notes</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map(a => (
                <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="font-medium text-gray-900">{a.client_name}</div>
                    <div className="text-xs text-gray-400">{a.event_type}</div>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{a.event_date}</td>
                  <td className="px-5 py-3 text-gray-600">{a.guests}</td>
                  <td className="px-5 py-3 text-gray-700">{a.food_style || '-'}</td>
                  <td className="px-5 py-3 text-gray-500">{a.dietary_notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
