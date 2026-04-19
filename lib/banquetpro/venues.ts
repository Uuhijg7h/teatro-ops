import { TEATRO_VENUES } from './constants';
import type { Venue } from './types';

export function getDefaultVenues(): Venue[] {
  return TEATRO_VENUES.map((venue, index) => ({
    id: `venue-${index + 1}`,
    slug: venue.slug,
    name: venue.name,
    description: venue.description,
    seatedCapacity: venue.seatedCapacity,
    standingCapacity: venue.standingCapacity,
    roomTurnBufferMinutesBefore: 120,
    roomTurnBufferMinutesAfter: 120,
    active: true,
  }));
}

export function getVenueBySlug(slug: string): Venue | undefined {
  return getDefaultVenues().find((venue) => venue.slug === slug);
}

export function getVenueCapacityWarning(
  venue: Pick<Venue, 'seatedCapacity' | 'standingCapacity' | 'name'>,
  guestCount: number,
  mode: 'seated' | 'standing' = 'seated',
): string | null {
  const capacity = mode === 'standing' ? venue.standingCapacity : venue.seatedCapacity;
  if (!guestCount || guestCount <= capacity) return null;
  return `${venue.name} exceeds its ${mode} capacity of ${capacity} guests.`;
}
