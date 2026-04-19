'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createDefaultVenueAdminForms } from '../../lib/banquetpro/venue-admin';

export default function VenuesPage() {
  const fallback = createDefaultVenueAdminForms();
  const [venues, setVenues] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase.from('venues').select('*').order('name', { ascending: true });
        if (!data || data.length === 0) {
          setVenues(fallback);
        } else {
          setVenues(
            data.map((venue: any) => ({
              id: venue.id,
              slug: venue.slug,
              name: venue.name,
              description: venue.description || '',
              seatedCapacity: venue.seated_capacity || 0,
              standingCapacity: venue.standing_capacity || 0,
              priceFrom: Number(venue.price_from || 0),
              roomTurnBufferMinutesBefore: venue.room_turn_buffer_before_minutes || 120,
              roomTurnBufferMinutesAfter: venue.room_turn_buffer_after_minutes || 120,
              active: venue.active ?? true,
            })),
          );
        }
      } catch {
        setVenues(fallback);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function patchVenue(id: string | undefined, patch: Record<string, unknown>) {
    setVenues((current) => current.map((venue) => (venue.id === id ? { ...venue, ...patch } : venue)));
  }

  async function saveVenue(id: string | undefined) {
    const venue = venues.find((v) => v.id === id);
    if (!venue) return;

    setMessage('');
    setError('');

    if (!venue.name.trim()) {
      setError('Venue name is required.');
      return;
    }
    if (!venue.slug.trim()) {
      setError('Venue slug is required.');
      return;
    }
    if (venue.seatedCapacity < 0 || venue.standingCapacity < 0 || venue.priceFrom < 0) {
      setError('Capacities and pricing must be zero or greater.');
      return;
    }

    setSavingId(id || null);
    try {
      const payload = {
        id: venue.id?.startsWith('venue-') ? undefined : venue.id,
        slug: venue.slug,
        name: venue.name,
        description: venue.description,
        seated_capacity: venue.seatedCapacity,
        standing_capacity: venue.standingCapacity,
        price_from: venue.priceFrom,
        room_turn_buffer_before_minutes: venue.roomTurnBufferMinutesBefore,
        room_turn_buffer_after_minutes: venue.roomTurnBufferMinutesAfter,
        active: venue.active,
      };

      const { data, error } = await supabase.from('venues').upsert(payload).select('id').single();
      if (error) throw error;
      if (data?.id) {
        setVenues((current) => current.map((v) => (v.id === venue.id ? { ...v, id: data.id } : v)));
      }
      setMessage(`Saved venue: ${venue.name}`);
    } catch {
      setError(`Could not save venue: ${venue.name}`);
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Venues & Halls</h1>
          <p className="text-sm text-gray-500 mt-1">
            Teatro venue administration now runs from BanquetPro models so capacities, pricing, and room-turn rules can move into the web app.
          </p>
        </div>
      </div>

      {message ? <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div> : null}
      {error ? <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
      {loading ? <div className="text-sm text-gray-400">Loading venues...</div> : null}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {venues.map((venue) => (
          <section key={venue.slug} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <input
                  className="w-full text-lg font-semibold text-gray-900 bg-transparent border border-gray-200 rounded-lg px-3 py-2"
                  value={venue.name}
                  onChange={(e) => patchVenue(venue.id, { name: e.target.value })}
                />
                <textarea
                  className="w-full text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-2 min-h-[90px]"
                  value={venue.description}
                  onChange={(e) => patchVenue(venue.id, { description: e.target.value })}
                />
              </div>
              <label className="text-xs flex items-center gap-2 text-gray-600">
                <input type="checkbox" checked={venue.active} onChange={(e) => patchVenue(venue.id, { active: e.target.checked })} />
                Active
              </label>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <label className="block text-gray-500 text-xs uppercase tracking-wide mb-1">Seated</label>
                <input type="number" className="w-full rounded-lg border border-gray-200 px-3 py-2" value={venue.seatedCapacity} onChange={(e) => patchVenue(venue.id, { seatedCapacity: Number(e.target.value || 0) })} />
              </div>
              <div>
                <label className="block text-gray-500 text-xs uppercase tracking-wide mb-1">Standing</label>
                <input type="number" className="w-full rounded-lg border border-gray-200 px-3 py-2" value={venue.standingCapacity} onChange={(e) => patchVenue(venue.id, { standingCapacity: Number(e.target.value || 0) })} />
              </div>
              <div>
                <label className="block text-gray-500 text-xs uppercase tracking-wide mb-1">Turn Before</label>
                <input type="number" className="w-full rounded-lg border border-gray-200 px-3 py-2" value={venue.roomTurnBufferMinutesBefore} onChange={(e) => patchVenue(venue.id, { roomTurnBufferMinutesBefore: Number(e.target.value || 0) })} />
              </div>
              <div>
                <label className="block text-gray-500 text-xs uppercase tracking-wide mb-1">Turn After</label>
                <input type="number" className="w-full rounded-lg border border-gray-200 px-3 py-2" value={venue.roomTurnBufferMinutesAfter} onChange={(e) => patchVenue(venue.id, { roomTurnBufferMinutesAfter: Number(e.target.value || 0) })} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-500 text-xs uppercase tracking-wide mb-1">Slug</label>
                <input className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" value={venue.slug} onChange={(e) => patchVenue(venue.id, { slug: e.target.value })} />
              </div>
              <div>
                <label className="block text-gray-500 text-xs uppercase tracking-wide mb-1">Starting Price</label>
                <input type="number" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" value={venue.priceFrom} onChange={(e) => patchVenue(venue.id, { priceFrom: Number(e.target.value || 0) })} />
              </div>
            </div>

            <div className="flex justify-end">
              <button onClick={() => saveVenue(venue.id)} disabled={savingId === venue.id} className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-50">
                {savingId === venue.id ? 'Saving…' : 'Save Venue'}
              </button>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
