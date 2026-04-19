'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const HALLS = ['Grand Hall A', 'Crystal Hall B', 'Executive Suite', 'Garden Terrace', 'Rooftop Lounge'];
const EVENT_TYPES = ['Wedding Reception', 'Corporate Dinner', 'Birthday Party', 'Anniversary', 'Graduation', 'Engagement Party', 'Baby Shower', 'Fundraiser', 'Other'];
const FOOD_STYLES = ['South Asian - Buffet', 'Continental - Plated', 'Continental - Buffet', 'Italian - Plated', 'Mixed - Buffet', 'Cocktail Reception'];
const MANAGERS = ['Sarah Mitchell', 'James Kowalski', 'Priya Sharma', 'David Chen', 'Lisa Nguyen'];

export default function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    client_name: '', onsite_contact: '', email: '', phone: '',
    event_date: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0], booking_date: new Date().toISOString().split('T')[0],    hall: '', guests: '', start_time: '', end_time: '', setup_time: '',
    event_type: '', food_style: '', dietary_notes: '',
    total_amount: '', deposit_paid: '',
    payment_status: 'outstanding', manager_name: '', onsite_mgr_name: '',
    apps: '', notes: '',
  });

  const titles: { [key: string]: string } = {
    '/dashboard': 'Dashboard',
    '/bookings': 'Bookings',
    '/calendar': 'Calendar',
    '/guests': 'Guests & Clients',
    '/menu': 'Menu & Catering',
    '/staff': 'Staff',
    '/finance': 'Finance',
    '/beo': 'BEO Documents',
  };

  const title = Object.entries(titles).find(([k]) => pathname === k || pathname.startsWith(k + '/')).[1] || 'Dashboard';

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const total = parseFloat(form.total_amount) || 0;
    const deposit = parseFloat(form.deposit_paid) || 0;
    const { data, error } = await supabase.from('bookings').insert([{
      client_name: form.client_name,
      onsite_contact: form.onsite_contact || form.client_name,
      email: form.email,
      phone: form.phone,
      event_date: form.event_date,
      booking_date: form.booking_date,
      hall: form.hall,
      guests: parseInt(form.guests) || 0,
      start_time: form.start_time,
      end_time: form.end_time,
      setup_time: form.setup_time,
      event_type: form.event_type,
      food_style: form.food_style,
      dietary_notes: form.dietary_notes,
      total_amount: total,
      deposit_paid: deposit,
      balance_due: total - deposit,
      payment_status: form.payment_status,
      manager_name: form.manager_name,
      onsite_mgr_name: form.onsite_mgr_name || form.manager_name,
      apps: form.apps,
      notes: form.notes,
      status: 'tentative'
    }]).select();
    setSaving(false);
    if (!error && data) {
      setShowModal(false);
      setForm({ client_name: '', onsite_contact: '', email: '', phone: '', event_date: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0] booking_date: new Date().toISOString().split('T')[0], hall: '', guests: '', start_time: '', end_time: '', setup_time: '', event_type: '', food_style: '', dietary_notes: '', total_amount: '', deposit_paid: '', payment_status: 'outstanding', manager_name: '', onsite_mgr_name: '', apps: '', notes: '' });
      router.refresh();
    } else {
      alert('Error saving booking: ' + (error?.message || 'Unknown error'));
    }
  }

  const inp = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300';
  const sel = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white';
  const lbl = 'block text-xs font-medium text-gray-600 mb-1';

  return (
    <>
      <header className="h-[60px] bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800">
          <span>+</span><span>NEW BOOKING</span>
        </button>
      </header>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">New Booking</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">CLIENT INFORMATION</div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={lbl}>Booking Contact *</label><input type="text" required value={form.client_name} onChange={e => set('client_name', e.target.value)} placeholder="Full name" className={inp} /></div>
                  <div><label className={lbl}>On-Site Contact</label><input type="text" value={form.onsite_contact} onChange={e => set('onsite_contact', e.target.value)} placeholder="Same as booking contact" className={inp} /></div>
                  <div><label className={lbl}>Email</label><input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" className={inp} /></div>
                  <div><label className={lbl}>Phone</label><input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="905-000-0000" className={inp} /></div>
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">EVENT DETAILS</div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={lbl}>Event Type *</label><select required value={form.event_type} onChange={e => set('event_type', e.target.value)} className={sel}><option value="">Select type</option>{EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                  <div><label className={lbl}>Event Date *</label><input type="date" required value={form.event_date} onChange={e => set('event_date', e.target.value)} className={inp} /></div>
                  <div><label className={lbl}>Hall / Location *</label><select required value={form.hall} onChange={e => set('hall', e.target.value)} className={sel}><option value="">Select hall</option>{HALLS.map(h => <option key={h} value={h}>{h}</option>)}</select></div>
                  <div><label className={lbl}>Number of Guests</label><input type="number" value={form.guests} onChange={e => set('guests', e.target.value)} placeholder="0" className={inp} /></div>
                  <div><label className={lbl}>Start Time</label><input type="text" value={form.start_time} onChange={e => set('start_time', e.target.value)} placeholder="5:00 PM" className={inp} /></div>
                  <div><label className={lbl}>End Time</label><input type="text" value={form.end_time} onChange={e => set('end_time', e.target.value)} placeholder="11:00 PM" className={inp} /></div>
                  <div className="col-span-2"><label className={lbl}>Setup Start Time</label><input type="text" value={form.setup_time} onChange={e => set('setup_time', e.target.value)} placeholder="Day before after 3pm" className={inp} /></div>
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">FOOD & BEVERAGE</div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={lbl}>Food Type / Style</label><select value={form.food_style} onChange={e => set('food_style', e.target.value)} className={sel}><option value="">Select style</option>{FOOD_STYLES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                  <div><label className={lbl}>Apps / Beverages</label><input type="text" value={form.apps} onChange={e => set('apps', e.target.value)} placeholder="Bar, welcome drinks..." className={inp} /></div>
                  <div className="col-span-2"><label className={lbl}>Dietary Notes</label><textarea value={form.dietary_notes} onChange={e => set('dietary_notes', e.target.value)} placeholder="Halal, vegetarian, allergies..." className={inp} rows={2} /></div>
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">FINANCE</div>
                <div className="grid grid-cols-3 gap-4">
                  <div><label className={lbl}>Estimated Total (CAD)</label><input type="number" step="0.01" value={form.total_amount} onChange={e => set('total_amount', e.target.value)} placeholder="0.00" className={inp} /></div>
                  <div><label className={lbl}>Deposit Paid (CAD)</label><input type="number" step="0.01" value={form.deposit_paid} onChange={e => set('deposit_paid', e.target.value)} placeholder="0.00" className={inp} /></div>
                  <div><label className={lbl}>Payment Status</label><select value={form.payment_status} onChange={e => set('payment_status', e.target.value)} className={sel}><option value="outstanding">Outstanding</option><option value="deposit_paid">Deposit Paid</option><option value="fully_paid">Fully Paid</option></select></div>
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">STAFF ASSIGNMENT</div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={lbl}>Booking Manager</label><select value={form.manager_name} onChange={e => set('manager_name', e.target.value)} className={sel}><option value="">Select manager</option>{MANAGERS.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
                  <div><label className={lbl}>On-Site Manager</label><select value={form.onsite_mgr_name} onChange={e => set('onsite_mgr_name', e.target.value)} className={sel}><option value="">Same as booking manager</option>{MANAGERS.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Internal Notes</div>
                <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any additional notes..." className={inp} rows={3} />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 disabled:opacity-50">{saving ? 'Saving...' : 'Create Booking'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
