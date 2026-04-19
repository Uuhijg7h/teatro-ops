'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createDefaultVenueAdminForms } from '../../lib/banquetpro/venue-admin';

export default function VenuesPage() {
  const fallback = createDefaultVenueAdminForms();
  const [venues, setVenues] = useState(fallback);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Venues & Halls</h1>
        <p className="text-sm text-gray-500 mt-1">
          Teatro venue administration now runs from BanquetPro models so capacities, pricing, and room-turn rules can move into the web app.
        </p>
      </div>

      {loading ? <div className="text-sm text-gray-400">Loading venues...</div> : null}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {venues.map((venue) => (
          <section key={venue.slug} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{venue.name}</h2>
                <p className="text-sm text-gray-500 mt-1">{venue.description}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${venue.active ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}>
                {venue.active ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
                <div className="text-gray-500 text-xs uppercase tracking-wide">Seated</div>
                <div className="text-lg font-semibold text-gray-900">{venue.seatedCapacity}</div>
              </div>
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
                <div className="text-gray-500 text-xs uppercase tracking-wide">Standing</div>
                <div className="text-lg font-semibold text-gray-900">{venue.standingCapacity}</div>
              </div>
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
                <div className="text-gray-500 text-xs uppercase tracking-wide">Turn Before</div>
                <div className="text-lg font-semibold text-gray-900">{venue.roomTurnBufferMinutesBefore}m</div>
              </div>
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
                <div className="text-gray-500 text-xs uppercase tracking-wide">Turn After</div>
                <div className="text-lg font-semibold text-gray-900">{venue.roomTurnBufferMinutesAfter}m</div>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">Editable fields prepared:</span> name, description, capacities, starting price, active state, and room-turn buffers.
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
