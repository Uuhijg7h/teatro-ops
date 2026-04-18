'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type MenuPackage = {
  id: string;
  name: string;
  price_per_head: number;
  description: string;
};

type CateringAssignment = {
  id: string;
  client_name: string;
  event_type: string;
  event_date: string;
  guest_count: number;
  food_type: string;
  dietary_notes: string;
};

function fmt(n: number) {
  return 'CAD ' + (n || 0).toLocaleString('en-CA', { minimumFractionDigits: 0 });
}

export default function MenuPage() {
  const supabase = createClientComponentClient();
  const [packages, setPackages] = useState<MenuPackage[]>([]);
  const [assignments, setAssignments] = useState<CateringAssignment[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data: pkgs } = await supabase.from('menu_packages').select('*');
      if (pkgs) setPackages(pkgs);
      const { data: assigns } = await supabase
        .from('bookings')
        .select('id,client_name,event_type,event_date,guest_count,food_type,dietary_notes')
        .order('event_date');
      if (assigns) setAssignments(assigns);
    };
    fetch();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Menu & Catering</h1>

      {/* Packages */}
      {packages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {packages.map(p => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{p.name}</h3>
                <span className="text-sm font-semibold text-blue-600">{fmt(p.price_per_head)}/head</span>
              </div>
              <p className="text-sm text-gray-500">{p.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Catering Assignments */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Catering Assignments per Booking</h2>
        {assignments.length === 0 ? (
          <p className="text-sm text-gray-400 py-4">No catering assignments yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['BOOKING', 'EVENT DATE', 'GUESTS', 'FOOD TYPE', 'DIETARY NOTES'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assignments.map(a => (
                <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-medium text-gray-900">{a.client_name}</div>
                    <div className="text-xs text-gray-400">{a.event_type}</div>
                  </td>
                  <td className="py-3 px-3 text-gray-700">{a.event_date}</td>
                  <td className="py-3 px-3 text-gray-700 text-center">{a.guest_count}</td>
                  <td className="py-3 px-3 text-gray-700">{a.food_type || <span className="text-gray-300">Not set</span>}</td>
                  <td className="py-3 px-3 text-gray-500 text-xs">{a.dietary_notes || <span className="text-gray-300">None</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
