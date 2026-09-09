// Booking.com Demand API (Sandbox v3.2) Simulator Service
// Enables autonomous, zero-touch mock reservations for both Accommodations and Flights without requiring human form filling or private credentials.

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
  if (!hotelNameOrId) return null;
  const bookings = getStoredBookings();
  return bookings.find(
    b => (b.bookingType === 'hotel' || !b.bookingType) &&
         (b.hotelId === hotelNameOrId || (b.hotelName && b.hotelName.toLowerCase().includes(hotelNameOrId.toLowerCase()))) &&
         b.status === 'CONFIRMED'
  );
};

export const isFlightBooked = (flightNumberOrId) => {
  if (!flightNumberOrId) return null;
  const bookings = getStoredBookings();
  const query = flightNumberOrId.toLowerCase();
  return bookings.find(
    b => b.bookingType === 'flight' &&
         (b.flightId === flightNumberOrId ||
          (b.flightNumber && b.flightNumber.toLowerCase().includes(query)) ||
          (b.title && b.title.toLowerCase().includes(query)) ||
          query.includes(b.flightNumber ? b.flightNumber.toLowerCase() : '---')) &&
         b.status === 'CONFIRMED'
  );
};

export const getTripBookingStatus = (hotelName = 'Hotel Groove Shinjuku', flightNumber = 'JL 038') => {
  const hotelBooking = isHotelBooked(hotelName);
  const flightBooking = isFlightBooked(flightNumber);
  return {
    hotelBooking,
    flightBooking,
    isHotelBooked: !!hotelBooking,
    isFlightBooked: !!flightBooking,
    isTripFullyBooked: !!hotelBooking && !!flightBooking
  };
};

// Generates simulated Booking.com PNR & Reference
const generateBookingRef = (prefix = 'BKG-DEMAND') => {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${num}-TYO`;
};

const generatePnr = (prefix = '') => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let pnr = prefix;
  for (let i = 0; i < (prefix ? 4 : 6); i++) {
    pnr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pnr;
};

/**
 * Simulates the 4-step autonomous Booking.com Demand API v3.2 Accommodation booking pipeline:
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
    detail: `Searching accommodations in ${hotel?.neighborhood || 'Tokyo'} for 3 guests...`,
    status: 'processing'
  });
  await new Promise(r => setTimeout(r, 500));

  // Step 2: Availability & Rate Lock
  onStepChange({
    step: 2,
    endpoint: `${DEMAND_API_BASE_URL}/accommodations/availability`,
    method: 'POST',
    title: 'Rate Lock & Free Cancellation Validation',
    detail: `Securing guaranteed group rate of $${hotel?.pricePerNightPerPerson || 85}/night per person with 100% free cancellation...`,
    status: 'processing'
  });
  await new Promise(r => setTimeout(r, 550));

  // Step 3: Zero-Touch Guest Order Preview
  onStepChange({
    step: 3,
    endpoint: `${DEMAND_API_BASE_URL}/orders/preview`,
    method: 'POST',
    title: 'Zero-Touch Guest Synthesis (Alice, Bob & Charlie)',
    detail: `Autonomous concierge binding guest manifest and room configuration with 0 human inputs...`,
    status: 'processing'
  });
  await new Promise(r => setTimeout(r, 550));

  // Step 4: Reservation Confirmation
  const bookingReference = generateBookingRef('BKG-DEMAND');
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
  await new Promise(r => setTimeout(r, 400));

  const confirmedBooking = {
    id: `bkg-ht-${Date.now()}`,
    bookingType: 'hotel',
    reference: bookingReference,
    pnr,
    pin,
    hotelId: hotel?.id || 'ht-1',
    hotelName: hotel?.name || 'Hotel Groove Shinjuku (Kabukicho Tower)',
    neighborhood: hotel?.neighborhood || 'Shinjuku, Tokyo',
    roomType: hotel?.roomType || 'Deluxe Triple Room (3 Single Beds)',
    image: hotel?.image || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    checkIn: checkin,
    checkOut: checkout,
    nights: 4,
    guestCount: travelers.length || 3,
    guests: guestManifest,
    leadGuestName: leadTraveler.name,
    pricePerPerson: hotel?.totalPricePerPerson || 340,
    totalPrice: hotel?.totalGroupStay || 1020,
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
          accommodation_id: hotel?.id || 'ht-1',
          booker: {
            first_name: leadTraveler.name.split(' ')[0] || 'Alice',
            last_name: leadTraveler.name.split(' ')[1] || 'Lin',
            email: 'squad.escapeplan@demo.travel',
            phone: '+1 555-019-2849'
          },
          guests: guestManifest,
          room: {
            type: hotel?.roomType || 'Deluxe Triple Room',
            beds: '3 Single / Twin Beds',
            non_smoking: true
          },
          stay: {
            checkin: checkin,
            checkout: checkout,
            nights: 4
          },
          pricing: {
            total_amount: hotel?.totalGroupStay || 1020,
            currency: 'USD',
            split_per_person: hotel?.totalPricePerPerson || 340
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

/**
 * Simulates the 4-step autonomous Booking.com Demand API v3.2 Flight booking pipeline:
 * 1. POST /flights/search
 * 2. POST /flights/offers
 * 3. POST /orders/preview
 * 4. POST /orders/confirm
 */
export const executeDemandAiAutonomousFlightBooking = async ({
  flight,
  travelers = [],
  departDate = '2026-11-12',
  returnDate = '2026-11-16',
  onStepChange = () => {}
}) => {
  const leadTraveler = travelers.find(t => t.id === 'alice') || travelers[0] || {
    name: 'Alice Lin',
    role: 'Squad Lead'
  };

  const passengerManifest = travelers.map((t, idx) => ({
    id: `pax-${idx + 1}`,
    fullName: t.name || `Traveler ${idx + 1}`,
    type: 'ADULT',
    isLead: t.id === leadTraveler.id,
    seat: ['14A (Window)', '14B (Middle)', '14C (Aisle)'][idx] || `15${String.fromCharCode(65 + idx)}`,
    eTicketNumber: `131-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    baggage: '2 x 23kg check-in + 7kg cabin',
    mealPreference: t.dietary || 'Standard in-flight meal'
  }));

  // Step 1: Query Demand API Transport Sandbox
  onStepChange({
    step: 1,
    endpoint: `${DEMAND_API_BASE_URL}/flights/search`,
    method: 'POST',
    title: 'Querying Booking.com Transport & Flight Sandbox',
    detail: `Searching flight schedules for ${flight?.origin || 'SIN'} ➔ ${flight?.destination || 'HND'} (3 Passengers)...`,
    status: 'processing'
  });
  await new Promise(r => setTimeout(r, 500));

  // Step 2: Fare Lock & Inventory Hold
  onStepChange({
    step: 2,
    endpoint: `${DEMAND_API_BASE_URL}/flights/offers`,
    method: 'POST',
    title: 'Group Fare Lock & Seat Inventory Hold',
    detail: `Holding 3 contiguous Economy seats on ${flight?.airline || 'Japan Airlines'} (${flight?.flightNumber || 'JL 038'}) at $${flight?.pricePerPerson || 460}/pax...`,
    status: 'processing'
  });
  await new Promise(r => setTimeout(r, 550));

  // Step 3: Zero-Touch Passenger Manifest Synthesis
  onStepChange({
    step: 3,
    endpoint: `${DEMAND_API_BASE_URL}/orders/preview`,
    method: 'POST',
    title: 'Zero-Touch Passenger Synthesis (Alice, Bob & Charlie)',
    detail: `Autonomous concierge binding passport profiles, seating, and baggage with 0 human inputs...`,
    status: 'processing'
  });
  await new Promise(r => setTimeout(r, 550));

  // Step 4: E-Ticket Confirmation & Issuance
  const bookingReference = generateBookingRef('FL-DEMAND');
  const pnr = generatePnr('JL');

  onStepChange({
    step: 4,
    endpoint: `${DEMAND_API_BASE_URL}/orders/confirm`,
    method: 'POST',
    title: 'Issuing Demand API E-Tickets & Boarding Passes',
    detail: `Airline PNR ${pnr} issued with electronic boarding passes minted!`,
    status: 'completed'
  });
  await new Promise(r => setTimeout(r, 400));

  const confirmedFlight = {
    id: `bkg-fl-${Date.now()}`,
    bookingType: 'flight',
    flightId: flight?.id || 'fl-2',
    reference: bookingReference,
    pnr,
    airline: flight?.airline || 'Japan Airlines (JAL)',
    airlineLogo: flight?.airlineLogo || '🌸',
    flightNumber: flight?.flightNumber || 'JL 038',
    origin: flight?.origin || 'Singapore (SIN)',
    destination: flight?.destination || 'Tokyo Haneda (HND)',
    departTime: flight?.departTime || '11:45 AM',
    arriveTime: flight?.arriveTime || '19:30 PM',
    duration: flight?.duration || '6h 45m',
    departDate,
    returnDate,
    cabinClass: 'Economy Class (Group Fare)',
    terminal: 'Terminal 1',
    gate: 'Gate D42',
    boardingTime: '11:00 AM (45m before departure)',
    baggage: flight?.baggage || '2 x 23kg included per passenger',
    guestCount: travelers.length || 3,
    passengers: passengerManifest,
    leadPassengerName: leadTraveler.name,
    pricePerPerson: flight?.pricePerPerson || 460,
    totalPrice: flight?.totalGroupPrice || 1380,
    currency: 'USD',
    status: 'CONFIRMED',
    cancellationPolicy: 'Refundable within 24h of issuance in sandbox',
    paymentMethod: 'Pre-authorized via Squad Travel Card',
    bookedAt: new Date().toISOString(),
    apiSimulationLogs: {
      apiVersion: 'Demand API v3.2 (Transport & Flights)',
      environment: 'SANDBOX',
      endpointsTriggered: [
        'POST /flights/search',
        'POST /flights/offers',
        'POST /orders/preview',
        'POST /orders/confirm'
      ],
      rawPayloadPreview: {
        order: {
          transport_type: 'FLIGHT',
          flight_number: flight?.flightNumber || 'JL 038',
          airline: flight?.airline || 'Japan Airlines',
          route: {
            from: flight?.origin || 'SIN',
            to: flight?.destination || 'HND',
            departure: `${departDate}T11:45:00Z`,
            arrival: `${departDate}T19:30:00Z`
          },
          passengers: passengerManifest,
          pricing: {
            currency: 'USD',
            total_amount: flight?.totalGroupPrice || 1380,
            split_per_person: flight?.pricePerPerson || 460
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

  saveBookingToStorage(confirmedFlight);
  return confirmedFlight;
};

/**
 * Autonomously executes both Flight and Hotel bookings sequentially for the complete trip.
 */
export const executeFullTripAutonomousBooking = async ({
  hotel,
  flight,
  travelers,
  onFlightStep = () => {},
  onHotelStep = () => {}
}) => {
  const flightResult = await executeDemandAiAutonomousFlightBooking({
    flight,
    travelers,
    onStepChange: onFlightStep
  });

  const hotelResult = await executeDemandAiAutonomousBooking({
    hotel,
    travelers,
    onStepChange: onHotelStep
  });

  return { flightResult, hotelResult };
};
