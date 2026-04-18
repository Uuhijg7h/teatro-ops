'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type Staff = {
  id: string;
  name: string;
  role: string;
  phone: string;
  status: string;
  events_assigned: number;
};

type EventAssignment = {
  id: string;
  client_name: string;
  event_type: string;
  event_date: string;
  hall: string;
  manager: string;
  guest_count: number;
};

function initials(name: string) {
  return name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??';
}

export default function StaffPage() {
  const supabase = createClientComponentClient();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [assignments, setAssignments] = useState<EventAssignment[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data: s } = await supabase.from('staff').select('*');
      if (s) setStaff(s);
      const { data: a } = await supabase.from('bookings').select('id,client_name,event_type,event_date,hall,manager,guest_count').order('event_date');
      if (a) setAssignments(a);
    };
    load();
  }, []);

  const colorClass = (name: string) => {
    const colors = ['bg-teal-100 text-teal-700','bg-blue-100 text-blue-700','bg-purple-100 text-purple-700','bg-orange-100 text-orange-700','bg-pink-100 text-pink-700'];
    return colors[(name?.charCodeAt(0) || 0) % colors.length];
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Staff & Assignments</h1>
      {staff.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {staff.map(s => (
            <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${colorClass(s.name)}`}>{initials(s.name)}</div>
                <div>
                  <div className="font-semibold text-gray-900">{s.name}</div>
                  <div className="text-xs text-gray-400">{s.role}</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{s.phone}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.status === 'available' ? 'text-green-700 bg-green-50' : 'text-orange-600 bg-orange-50'}`}>{s.status}</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">{s.events_assigned || 0} events assigned</p>
            </div>
          ))}
        </div>
      )}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">All Event Assignments</h2>
        {assignments.length === 0 ? (
          <p className="text-sm text-gray-400 py-4">No assignments yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['EVENT','DATE','HALL','BOOKING MANAGER','ON-SITE MANAGER','GUESTS'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assignments.map(a => (
                <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-3"><div className="font-medium text-gray-900">{a.client_name}</div><div className="text-xs text-gray-400">{a.event_type}</div></td>
                  <td className="py-3 px-3 text-gray-700">{a.event_date}</td>
                  <td className="py-3 px-3 text-gray-700">{a.hall}</td>
                  <td className="py-3 px-3">{a.manager && <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">{a.manager}</span>}</td>
                  <td className="py-3 px-3">{a.manager && <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">{a.manager}</span>}</td>
                  <td className="py-3 px-3 font-semibold text-gray-900 text-right">{a.guest_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
