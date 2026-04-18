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
  customer_name: string;
  event_name: string;
  event_date: string;
  guests: number;
  food_style: string;
  dietary: string;
};

const fmt = (n: number) => 'NPR ' + (n || 0).toLocaleString();

export default function MenuPage() {
  const supabase = createClientComponentClient();
  const [packages, setPackages] = useState<MenuPackage[]>([]);
  const [assignments, setAssignments] = useState<CateringAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: pkgs } = await supabase.from('menu_packages').select('*');
      if (pkgs) setPackages(pkgs);

      const { data: assigns } = await supabase
        .from('bookings')
        .select('id, customer_name, event_name, event_date, guests, food_style, dietary')
        .order('event_date', { ascending: false });
      if (assigns) setAssignments(assigns as CateringAssignment[]);
      
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>;

  return (
    <div className="space-y-8">
      {/* Menu Packages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((p) => (
          <div key={p.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">{p.name}</h3>
              <span className="text-sm font-black text-blue-600">{fmt(p.price_per_head)}<span className="text-[10px] text-gray-400 font-bold">/HEAD</span></span>
            </div>
            <p className="text-[12px] text-gray-500 font-medium leading-relaxed">{p.description}</p>
          </div>
        ))}
      </div>

      {/* Catering Assignments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-[#f7f8fa]">
          <h2 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Catering Assignments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f7f8fa] border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Client</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Event Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Guests</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Food Style</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dietary Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {assignments.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="text-[13px] font-bold text-blue-600">{a.customer_name}</div>
                    <div className="text-[11px] text-gray-400 font-medium uppercase tracking-tighter">{a.event_name}</div>
                  </td>
                  <td className="px-6 py-5 text-[13px] font-bold text-gray-700">{a.event_date}</td>
                  <td className="px-6 py-5 text-[13px] font-black text-gray-900">{a.guests}</td>
                  <td className="px-6 py-5">
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-md tracking-wider">
                      {a.food_style || 'Not Set'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-[12px] text-gray-500 italic">{a.dietary || 'None'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
