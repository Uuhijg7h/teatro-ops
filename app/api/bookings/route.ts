import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// GET - Fetch all bookings or a single booking
export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  try {
    if (id) {
      // Fetch single booking with all details
      const { data: booking, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customer: customers(*),
          venue: venues(*),
          package: packages(*),
          menu: menus(*),
          bev: beverages(*),
          setup_details: setup_details(*),
          add_items: additional_items(*),
          av_reqs: av_requirements(*),
          timeline: event_timeline(*),
          billing: billing_info(*)
        `)
        .eq('id', id)
        .single()

      if (error) throw error

      return NextResponse.json({ success: true, data: booking })
    } else {
      // Fetch all bookings
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customer: customers(*),
          venue: venues(*)
        `)
        .order('event_date', { ascending: true })

      if (error) throw error

      return NextResponse.json({ success: true, data: bookings })
    }
  } catch (error: any) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

// POST - Create a new booking
export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const body = await request.json()

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        customer_id: body.customer_id,
        venue_id: body.venue_id,
        package_id: body.package_id,
        menu_id: body.menu_id,
        bev_id: body.bev_id,
        event_date: body.event_date,
        event_time: body.event_time,
        guests: body.guests,
        event_type: body.event_type,
        setup_details: body.setup_details,
        add_items: body.add_items,
        av_reqs: body.av_reqs,
        timeline: body.timeline,
        billing: body.billing,
        total_cad: parseFloat(body.total_cad) || 0,
        deposit_cad: parseFloat(body.deposit_cad) || 0,
        payment_status: body.payment_status || 'Outstanding',
        status: 'tentative',
        internal_notes: body.internal_notes
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PATCH - Update an existing booking
export async function PATCH(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Delete a booking
export async function DELETE(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  try {
    if (!id) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
