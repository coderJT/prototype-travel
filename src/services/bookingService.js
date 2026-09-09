// Real-World Booking Deep-Link Generator & Travel Data
// Links directly to Google Flights, Skyscanner, Booking.com, Agoda, and Airbnb without requiring private API keys.

export const generateGoogleFlightsUrl = ({
  origin = 'SIN',
  destination = 'HND',
  departDate = '2026-11-12',
  returnDate = '2026-11-16',
  passengers = 3
}) => {
  const query = `Flights to ${destination} from ${origin} on ${departDate} through ${returnDate} for ${passengers} passengers`;
  return `https://www.google.com/travel/flights?q=${encodeURIComponent(query)}`;
};

export const generateSkyscannerUrl = ({
  origin = 'SIN',
  destination = 'TYO',
  departDate = '261112',
  returnDate = '261116'
}) => {
  return `https://www.skyscanner.com/transport/flights/${origin.toLowerCase()}/${destination.toLowerCase()}/${departDate}/${returnDate}/?adultsv2=3&cabinclass=economy`;
};

export const generateBookingComUrl = ({
  hotelName = 'Hotel Groove Shinjuku',
  destination = 'Tokyo, Japan',
  checkin = '2026-11-12',
  checkout = '2026-11-16',
  guests = 3
}) => {
  const query = `${hotelName} ${destination}`;
  return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(query)}&checkin=${checkin}&checkout=${checkout}&group_adults=${guests}&no_rooms=1`;
};

export const generateAgodaUrl = ({
  hotelName = 'Hotel Groove Shinjuku',
  destination = 'Tokyo',
  checkin = '2026-11-12',
  checkout = '2026-11-16',
  guests = 3
}) => {
  return `https://www.agoda.com/search?text=${encodeURIComponent(hotelName + ' ' + destination)}&checkIn=${checkin}&checkOut=${checkout}&rooms=1&adults=${guests}`;
};

export const generateAirbnbUrl = ({
  destination = 'Tokyo--Japan',
  checkin = '2026-11-12',
  checkout = '2026-11-16',
  guests = 3
}) => {
  return `https://www.airbnb.com/s/${encodeURIComponent(destination)}/homes?checkin=${checkin}&checkout=${checkout}&adults=${guests}`;
};

export const REAL_WORLD_FLIGHTS = [
  {
    id: 'fl-1',
    airline: 'All Nippon Airways (ANA)',
    airlineLogo: '✈️',
    flightNumber: 'NH 802',
    origin: 'Singapore (SIN)',
    destination: 'Tokyo Narita (NRT)',
    departTime: '06:10 AM',
    arriveTime: '13:55 PM',
    duration: '6h 45m',
    type: 'Non-stop',
    pricePerPerson: 420,
    totalGroupPrice: 1260,
    baggage: '2 x 23kg included',
    advocate: 'Alice-Bot (Best value-to-quality rating on Skytrax)',
    harmonyScore: 94,
    deepLinkType: 'google-flights'
  },
  {
    id: 'fl-2',
    airline: 'Japan Airlines (JAL)',
    airlineLogo: '🌸',
    flightNumber: 'JL 038',
    origin: 'Singapore (SIN)',
    destination: 'Tokyo Haneda (HND)',
    departTime: '11:45 AM',
    arriveTime: '19:30 PM',
    duration: '6h 45m',
    type: 'Non-stop',
    pricePerPerson: 460,
    totalGroupPrice: 1380,
    baggage: '2 x 23kg included',
    advocate: 'Bob-Bot (Departs after 11 AM - respects sleep schedule!)',
    harmonyScore: 97,
    recommended: true,
    deepLinkType: 'google-flights'
  },
  {
    id: 'fl-3',
    airline: 'Singapore Airlines (SIA)',
    airlineLogo: '⭐',
    flightNumber: 'SQ 638',
    origin: 'Singapore (SIN)',
    destination: 'Tokyo Narita (NRT)',
    departTime: '23:55 PM (Red-eye)',
    arriveTime: '07:30 AM (+1)',
    duration: '6h 35m',
    type: 'Overnight non-stop',
    pricePerPerson: 510,
    totalGroupPrice: 1530,
    baggage: '25kg included',
    advocate: 'Charlie-Bot (Saves daytime travel hours, world-class comfort)',
    harmonyScore: 89,
    deepLinkType: 'skyscanner'
  }
];

export const REAL_WORLD_HOTELS = [
  {
    id: 'ht-1',
    name: 'Hotel Groove Shinjuku (Kabukicho Tower)',
    neighborhood: 'Shinjuku, Tokyo',
    rating: 9.1,
    reviewCount: '2,840 reviews',
    roomType: 'Deluxe Triple Room (3 Single Beds)',
    pricePerNightPerPerson: 85,
    totalPricePerPerson: 340,
    totalGroupStay: 1020,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    amenities: ['Direct Airport Limousine Bus', 'Floor 18-38 Skyline Views', 'Steps from Omoide Yokocho'],
    advocate: 'Aegis Consensus (Central hub, zero transfer friction for Charlie)',
    recommended: true
  },
  {
    id: 'ht-2',
    name: 'MIMARU Tokyo Shinjuku West',
    neighborhood: 'Nishi-Shinjuku, Tokyo',
    rating: 9.3,
    reviewCount: '1,420 reviews',
    roomType: 'Family Apartment with Kitchen & Dining Area',
    pricePerNightPerPerson: 78,
    totalPricePerPerson: 312,
    totalGroupStay: 936,
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    amenities: ['Full Kitchen & Fridge', 'In-room Washer/Dryer', 'Separate Japanese Tatami space'],
    advocate: 'Alice-Bot (Lowest cost per night & can cook breakfast)',
    recommended: false
  },
  {
    id: 'ht-3',
    name: 'Onyado Nono Asakusa Natural Hot Spring',
    neighborhood: 'Asakusa, Tokyo',
    rating: 8.9,
    reviewCount: '3,100 reviews',
    roomType: 'Tatami Triple Comfort Room with Onsen Access',
    pricePerNightPerPerson: 92,
    totalPricePerPerson: 368,
    totalGroupStay: 1104,
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
    amenities: ['Natural Mineral Hot Spring Onsen', 'Free Evening Yonaki Soba Noodles', 'Tatami-matted floors'],
    advocate: 'Charlie-Bot (Restorative onsen bath after walking)',
    recommended: false
  }
];
