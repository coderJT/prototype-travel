// Booking.com Demand API (Sandbox v3.2) Simulator Service
// Enables autonomous, zero-touch mock reservations without requiring human form filling or private credentials.

const STORAGE_KEY = 'escapeplan_demand_ai_bookings';
export const DEMAND_API_BASE_URL = 'https://demandapi-sandbox.booking.com/3.2';

export const getStoredBookings = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read demand bookings from localStorage:', err);
    return [];
  }
};

export const saveBookingToStorage = (booking) => {
  try {
    const current = getStoredBookings();
    const updated = [booking, ...current.filter(b => b.id !== booking.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save demand booking:', err);
    return [];
  }
};

export const cancelStoredBooking = (bookingId) => {
  try {
    const current = getStoredBookings();
    const updated = current.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'CANCELLED',
          cancelledAt: new Date().toISOString()
        };
      }
      return b;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to cancel demand booking:', err);
    return [];
  }
};

export const isHotelBooked = (hotelNameOrId) => {
  const bookings = getStoredBookings();
  return bookings.find(
    b => (b.hotelId === hotelNameOrId || (hotelNameOrId && b.hotelName && b.hotelName.toLowerCase().includes(hotelNameOrId.toLowerCase()))) && b.status === 'CONFIRMED'
  );
};

// Generates simulated Booking.com PNR & Reference
const generateBookingRef = () => {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `BKG-DEMAND-${num}-TYO`;
};

const generatePnr = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let pnr = '';
  for (let i = 0; i < 6; i++) {
    pnr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pnr;
};

/**
 * Simulates the 4-step autonomous Booking.com Demand API v3.2 booking pipeline:
 * 1. POST /accommodations/search
 * 2. POST /accommodations/availability
 * 3. POST /orders/preview
 * 4. POST /orders/confirm
 */
export const executeDemandAiAutonomousBooking = async ({
  hotel,
  travelers = [],
  checkin = '2026-11-12',
  checkout = '2026-11-16',
  onStepChange = () => {}
}) => {
  const leadTraveler = travelers.find(t => t.id === 'alice') || travelers[0] || {
    name: 'Alice Lin',
    role: 'Squad Lead'
  };

  const guestManifest = travelers.map((t, idx) => ({
    id: `gst-${idx + 1}`,
    fullName: t.name || `Traveler ${idx + 1}`,
    type: 'ADULT',
    isLead: t.id === leadTraveler.id,
    preferences: t.dietary || 'Standard comfort suite',
    specialRequests: idx === 0 ? 'Quiet floor, high level if available' : null
  }));

  // Step 1: Query Demand API Sandbox
  onStepChange({
    step: 1,
    endpoint: `${DEMAND_API_BASE_URL}/accommodations/search`,
    method: 'POST',
    title: 'Querying Booking.com Demand API Sandbox',
    detail: `Searching accommodations in ${hotel.neighborhood} for 3 guests...`,
    status: 'processing'
  });
  await new Promise(r => setTimeout(r, 600));

  // Step 2: Availability & Rate Lock
  onStepChange({
    step: 2,
    endpoint: `${DEMAND_API_BASE_URL}/accommodations/availability`,
    method: 'POST',
    title: 'Rate Lock & Free Cancellation Validation',
    detail: `Securing guaranteed group rate of $${hotel.pricePerNightPerPerson}/night per person with 100% free cancellation...`,
    status: 'processing'
  });
  await new Promise(r => setTimeout(r, 650));

  // Step 3: Zero-Touch Guest Order Preview
  onStepChange({
    step: 3,
    endpoint: `${DEMAND_API_BASE_URL}/orders/preview`,
    method: 'POST',
    title: 'Zero-Touch Guest Synthesis (Alice, Bob & Charlie)',
    detail: `Autonomous concierge binding guest manifest and room configuration with 0 human inputs...`,
    status: 'processing'
  });
  await new Promise(r => setTimeout(r, 650));

  // Step 4: Reservation Confirmation
  const bookingReference = generateBookingRef();
  const pnr = generatePnr();
  const pin = Math.floor(1000 + Math.random() * 9000).toString();

  onStepChange({
    step: 4,
    endpoint: `${DEMAND_API_BASE_URL}/orders/confirm`,
    method: 'POST',
    title: 'Issuing Demand API Instant Voucher & Confirmation',
    detail: `Voucher reference ${bookingReference} minted with confirmed status!`,
    status: 'completed'
  });
  await new Promise(r => setTimeout(r, 450));

  const confirmedBooking = {
    id: `bkg-${Date.now()}`,
    reference: bookingReference,
    pnr,
    pin,
    hotelId: hotel.id,
    hotelName: hotel.name,
    neighborhood: hotel.neighborhood,
    roomType: hotel.roomType,
    image: hotel.image,
    checkIn: checkin,
    checkOut: checkout,
    nights: 4,
    guestCount: travelers.length || 3,
    guests: guestManifest,
    leadGuestName: leadTraveler.name,
    pricePerPerson: hotel.totalPricePerPerson || 340,
    totalPrice: hotel.totalGroupStay || 1020,
    currency: 'USD',
    status: 'CONFIRMED',
    cancellationPolicy: 'Free cancellation until Nov 10, 2026 (23:59 JST)',
    paymentMethod: 'Pre-authorized via Squad Corporate Shared Card',
    bookedAt: new Date().toISOString(),
    apiSimulationLogs: {
      apiVersion: 'Demand API v3.2',
      environment: 'SANDBOX',
      endpointsTriggered: [
        'POST /accommodations/search',
        'POST /accommodations/availability',
        'POST /orders/preview',
        'POST /orders/confirm'
      ],
      rawPayloadPreview: {
        order: {
          accommodation_id: hotel.id,
          booker: {
            first_name: leadTraveler.name.split(' ')[0] || 'Alice',
            last_name: leadTraveler.name.split(' ')[1] || 'Lin',
            email: 'squad.escapeplan@demo.travel',
            phone: '+1 555-019-2849'
          },
          guests: guestManifest,
          room: {
            type: hotel.roomType,
            beds: '3 Single / Twin Beds',
            non_smoking: true
          },
          stay: {
            checkin: checkin,
            checkout: checkout,
            nights: 4
          },
          pricing: {
            total_amount: hotel.totalGroupStay || 1020,
            currency: 'USD',
            split_per_person: hotel.totalPricePerPerson || 340
          },
          automation: {
            provider: 'Booking.com Demand API',
            mode: 'AUTONOMOUS_DEMAND_AI',
            human_interaction: 'NONE'
          }
        }
      }
    }
  };

  saveBookingToStorage(confirmedBooking);
  return confirmedBooking;
};
