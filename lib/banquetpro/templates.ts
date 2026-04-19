import type { BanquetTemplate, Booking } from './types';
import { formatCad } from './pricing';

export const DEFAULT_TEMPLATE_KEYS = [
  'beo',
  'quote',
  'invoice',
  'run_sheet',
  'booking_summary',
] as const;

export function getDefaultTemplates(): BanquetTemplate[] {
  return [
    {
      id: 'tpl-beo-default',
      key: 'beo',
      name: 'Default BEO Template',
      description: 'Operational banquet event order template.',
      active: true,
      content: [
        '# Banquet Event Order',
        'Client: {{client_name}}',
        'Event: {{event_title}}',
        'Date: {{event_date}}',
        'Venue: {{venue_name}}',
        'Guests: {{guest_confirmed}}',
        'Food: {{food_package_name}}',
        'Beverage: {{beverage_mode}}',
        'Dietary Notes: {{dietary_notes}}',
        'Internal Notes: {{internal_notes}}',
      ].join('\n'),
    },
    {
      id: 'tpl-quote-default',
      key: 'quote',
      name: 'Default Quote Template',
      description: 'Client-facing quote / estimate template.',
      active: true,
      content: 'Quote for {{client_name}} — Total {{grand_total}}',
    },
    {
      id: 'tpl-invoice-default',
      key: 'invoice',
      name: 'Default Invoice Template',
      description: 'Invoice summary template.',
      active: true,
      content: 'Invoice for {{client_name}} — Balance Due {{balance_due}}',
    },
    {
      id: 'tpl-run-sheet-default',
      key: 'run_sheet',
      name: 'Default Run Sheet Template',
      description: 'Event execution run sheet template.',
      active: true,
      content: 'Run Sheet — {{event_title}} on {{event_date}}',
    },
    {
      id: 'tpl-booking-summary-default',
      key: 'booking_summary',
      name: 'Default Booking Summary Template',
      description: 'Internal booking summary template.',
      active: true,
      content: 'Booking Summary — {{event_title}} / {{client_name}} / {{grand_total}}',
    },
  ];
}

export function buildTemplateTokenMap(booking: Booking): Record<string, string> {
  return {
    client_name: booking.clientName || '',
    event_title: booking.eventTitle || '',
    event_type: booking.eventType || '',
    event_date: booking.eventDate || '',
    venue_name: booking.venueName || '',
    guest_confirmed: String(booking.guestConfirmed || 0),
    food_package_name: booking.foodPackageName || '',
    beverage_mode: booking.beverageMode || '',
    dietary_notes: booking.dietaryNotes || '',
    internal_notes: booking.internalNotes || '',
    subtotal: formatCad(booking.pricing.subtotal),
    tax_amount: formatCad(booking.pricing.taxAmount),
    gratuity_amount: formatCad(booking.pricing.gratuityAmount),
    grand_total: formatCad(booking.pricing.grandTotal),
    balance_due: formatCad(booking.pricing.balanceDue),
  };
}

export function renderTemplate(content: string, tokens: Record<string, string>): string {
  return Object.entries(tokens).reduce((output, [key, value]) => {
    return output.replaceAll(`{{${key}}}`, value ?? '');
  }, content);
}
