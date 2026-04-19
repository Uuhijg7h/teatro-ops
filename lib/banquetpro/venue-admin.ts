import { getDefaultVenues } from './venues';
import type { Venue } from './types';

export interface VenueAdminFormState {
  id?: string;
  slug: string;
  name: string;
  description: string;
  seatedCapacity: number;
  standingCapacity: number;
  priceFrom: number;
  roomTurnBufferMinutesBefore: number;
  roomTurnBufferMinutesAfter: number;
  active: boolean;
}

export function createDefaultVenueAdminForms(): VenueAdminFormState[] {
  return getDefaultVenues().map((venue) => ({
    id: venue.id,
    slug: venue.slug,
    name: venue.name,
    description: venue.description || '',
    seatedCapacity: venue.seatedCapacity,
    standingCapacity: venue.standingCapacity,
    priceFrom: venue.priceFrom || 0,
    roomTurnBufferMinutesBefore: venue.roomTurnBufferMinutesBefore || 120,
    roomTurnBufferMinutesAfter: venue.roomTurnBufferMinutesAfter || 120,
    active: venue.active,
  }));
}

export function venueFormToRecord(form: VenueAdminFormState): Venue {
  return {
    id: form.id || `venue-${form.slug}`,
    slug: form.slug,
    name: form.name,
    description: form.description,
    seatedCapacity: form.seatedCapacity,
    standingCapacity: form.standingCapacity,
    priceFrom: form.priceFrom,
    roomTurnBufferMinutesBefore: form.roomTurnBufferMinutesBefore,
    roomTurnBufferMinutesAfter: form.roomTurnBufferMinutesAfter,
    active: form.active,
  };
}
