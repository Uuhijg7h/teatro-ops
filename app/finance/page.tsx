'use client';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

const fmt = (n: number) => '$' + (n || 0).toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const PAY_LABELS: Record<string, string> = { fully_paid: 'Fully Paid', deposit_paid: 'Deposit Paid', outstanding: 'Outstanding' };
const PAY_CLS: Record<string, string> = { fully_paid: 'bg-green-100 text-green-700', deposit_paid: 'bg-blue-100 text-blue-700', outstanding: 'bg-orange-100 text-orange-700' };

export default function FinancePage() {
  const supabase = createClientComponentClient();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    supabase.from('bookings').select('*').order('event_date', { ascending: false }).then(({ data }) => {
      setBookings(data || []);
      setLoading(false);
    });
  }, []);

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.payment_status === filter);
  const totalRevenue = bookings.reduce((s, b) => s + (b.total_amount || 0), 0);
  const totalDeposit = bookings.reduce((s, b) => s + (b.deposit_paid || 0), 0);
  const balanceDue = bookings.reduce((s, b) => s + ((b.total_amount || 0) - (b.deposit_paid || 0)), 0);
  const fullyPaidCount = bookings.filter(b => b.payment_status === 'fully_paid').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Finance</h2>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: fmt(totalRevenue), cls: 'text-green-600 bg-green-50' },
          { label: 'Deposits Collected', value: fmt(totalDeposit), cls: 'text-blue-600 bg-blue-50' },
          { label: 'Balance Due', value: fmt(balanceDue), cls: 'text-orange-600 bg-orange-50' },
          { label: 'Fully Paid', value: fullyPaidCount + ' bookings', cls: 'text-purple-600 bg-purple-50' },
        ].map(c => (
          <div key={c.label} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{c.label}</p>
            <p className={`text-2xl font-bold mt-2 ${c.cls.split(' ')[0]}`}>{loading ? '...' : c.value}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${c.cls}`}>CAD</span>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-1 px-4 pt-4">
          {[['all','All'],['outstanding','Outstanding'],['deposit_paid','Deposit Paid'],['fully_paid','Fully Paid']].map(([v,l]) => (
            <button key={v} onClick={() => setFilter(v)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === v ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}>{l}</button>
          ))}
        </div>
        <div className="overflow-x-auto mt-4">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3 text-left">Booking</th>
                <th className="px-6 py-3 text-left">Client</th>
                <th className="px-6 py-3 text-left">Event Date</th>
                <th className="px-6 py-3 text-right">Total (CAD)</th>
                <th className="px-6 py-3 text-right">Deposit (CAD)</th>
                <th className="px-6 py-3 text-right">Balance (CAD)</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400 text-sm">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400 text-sm">No records found.</td></tr>
              ) : filtered.map((b, i) => (
                <tr key={b.id} className={`hover:bg-gray-50 ${i !== filtered.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <td className="px-6 py-4">
                    <Link href={`/bookings/${b.id}`} className="font-medium text-gray-900 hover:underline text-sm">
                      {b.event_type || 'Event'}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{b.client_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {b.event_date ? new Date(b.event_date + 'T00:00:00').toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">{fmt(b.total_amount)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-right">{fmt(b.deposit_paid)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-orange-600 text-right">{fmt((b.total_amount || 0) - (b.deposit_paid || 0))}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${PAY_CLS[b.payment_status] || 'bg-gray-100 text-gray-600'}`}>
                      {PAY_LABELS[b.payment_status] || b.payment_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            {!loading && filtered.length > 0 && (
              <tfoot>
                <tr className="border-t-2 border-gray-200 bg-gray-50">
                  <td colSpan={3} className="px-6 py-3 text-sm font-semibold text-gray-700">Totals ({filtered.length} bookings)</td>
                  <td className="px-6 py-3 text-sm font-bold text-gray-900 text-right">{fmt(filtered.reduce((s,b)=>s+(b.total_amount||0),0))}</td>
                  <td className="px-6 py-3 text-sm font-bold text-gray-900 text-right">{fmt(filtered.reduce((s,b)=>s+(b.deposit_paid||0),0))}</td>
                  <td className="px-6 py-3 text-sm font-bold text-orange-600 text-right">{fmt(filtered.reduce((s,b)=>s+((b.total_amount||0)-(b.deposit_paid||0)),0))}</td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
