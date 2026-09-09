import React, { useState } from 'react';
import {
  Plane,
  Building2,
  ExternalLink,
  Calendar,
  Users,
  Clock,
  Sparkles,
  Bot,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Search,
  Luggage,
  BedDouble,
  MapPin,
  Star
} from 'lucide-react';
import {
  REAL_WORLD_FLIGHTS,
  REAL_WORLD_HOTELS,
  generateGoogleFlightsUrl,
  generateSkyscannerUrl,
  generateBookingComUrl,
  generateAgodaUrl,
  generateAirbnbUrl
} from '../services/bookingService';

export default function BookingHub({ currentDestination = 'Tokyo' }) {
  const [activeCategory, setActiveCategory] = useState('flights'); // 'flights' or 'hotels'
  const [origin, setOrigin] = useState('SIN');
  const [destAirport, setDestAirport] = useState('HND');
  const [departDate, setDepartDate] = useState('2026-11-12');
  const [returnDate, setReturnDate] = useState('2026-11-16');
  const [passengers, setPassengers] = useState(3);

  const googleFlightsLink = generateGoogleFlightsUrl({
    origin,
    destination: destAirport,
    departDate,
    returnDate,
    passengers
  });

  const skyscannerLink = generateSkyscannerUrl({
    origin,
    destination: 'TYO',
    departDate: '261112',
    returnDate: '261116'
  });

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 space-y-8">
      {/* Friendly Top Header */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700">
            <Plane className="w-4 h-4 text-indigo-600" />
            <span>Real-World Booking Integration</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Live Flight & Hotel Booking Hub ✈️🏨
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Directly linked to <strong>Google Flights</strong>, <strong>Skyscanner</strong>, <strong>Booking.com</strong>, and <strong>Agoda</strong>. 
            Pre-configured with group passenger counts, dates, and AI-recommended options without needing private API credentials.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-indigo-50/70 px-4 py-2.5 rounded-2xl border border-indigo-100 text-xs text-indigo-800 font-bold shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>No Credentials Needed • Live Deep Links</span>
        </div>
      </div>

      {/* Booking Category Switcher & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
        {/* Toggle Pills */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setActiveCategory('flights')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'flights'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plane className="w-4 h-4" />
            <span>Flight Deals & Schedules</span>
          </button>

          <button
            onClick={() => setActiveCategory('hotels')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'hotels'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Hotels & Group Apartments</span>
          </button>
        </div>

        {/* Dynamic Route Inputs */}
        {activeCategory === 'flights' && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Departure City:
              </label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-indigo-500"
              >
                <option value="SIN">Singapore (SIN)</option>
                <option value="KUL">Kuala Lumpur (KUL)</option>
                <option value="HKG">Hong Kong (HKG)</option>
                <option value="SFO">San Francisco (SFO)</option>
                <option value="JFK">New York (JFK)</option>
                <option value="LHR">London Heathrow (LHR)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Destination Airport:
              </label>
              <select
                value={destAirport}
                onChange={(e) => setDestAirport(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-indigo-500"
              >
                <option value="HND">Tokyo Haneda (HND) - Closer to city</option>
                <option value="NRT">Tokyo Narita (NRT)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Trip Dates:
              </label>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 font-bold flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Nov 12 - Nov 16, 2026</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Travelers:
              </label>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 font-bold flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>3 Adults (Group Trip)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* 1. FLIGHTS LISTING */}
      {/* ==================================================== */}
      {activeCategory === 'flights' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900">
              Curated Flight Options for the Squad
            </h3>
            <div className="flex items-center gap-2">
              <a
                href={googleFlightsLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <span>Open Google Flights</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={skyscannerLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                <span>Skyscanner</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            {REAL_WORLD_FLIGHTS.map((flight) => (
              <div
                key={flight.id}
                className={`bg-white border rounded-3xl p-6 sm:p-7 transition-all shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 ${
                  flight.recommended
                    ? 'border-indigo-400 ring-2 ring-indigo-200/60'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex-1 space-y-4">
                  {/* Top Meta */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xl">{flight.airlineLogo}</span>
                    <span className="font-extrabold text-sm text-slate-900">{flight.airline}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono font-bold">
                      {flight.flightNumber}
                    </span>
                    {flight.recommended && (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold">
                        ⭐ SQUAD RECOMMENDED
                      </span>
                    )}
                    <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                      Harmony Match: {flight.harmonyScore}%
                    </span>
                  </div>

                  {/* Flight Timeline */}
                  <div className="flex items-center gap-6 text-xs sm:text-sm">
                    <div>
                      <div className="font-black text-slate-900 text-base">{flight.departTime}</div>
                      <div className="text-slate-500 text-xs font-medium mt-0.5">{flight.origin}</div>
                    </div>

                    <div className="flex-1 max-w-[180px] flex flex-col items-center">
                      <div className="text-[11px] text-slate-400 font-semibold">{flight.duration}</div>
                      <div className="w-full flex items-center gap-1 my-1">
                        <div className="h-0.5 flex-1 bg-slate-200"></div>
                        <Plane className="w-3 h-3 text-indigo-600" />
                        <div className="h-0.5 flex-1 bg-slate-200"></div>
                      </div>
                      <div className="text-[10px] text-emerald-600 font-bold uppercase">{flight.type}</div>
                    </div>

                    <div>
                      <div className="font-black text-slate-900 text-base">{flight.arriveTime}</div>
                      <div className="text-slate-500 text-xs font-medium mt-0.5">{flight.destination}</div>
                    </div>
                  </div>

                  {/* Multi-Agent Advocate Origin */}
                  <div className="flex items-center gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <Bot className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Reason: <strong className="text-indigo-700">{flight.advocate}</strong></span>
                  </div>
                </div>

                {/* Price & Booking Deep Link */}
                <div className="lg:border-l border-slate-200 lg:pl-8 flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-4 shrink-0">
                  <div className="text-left lg:text-right">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Per Traveler</div>
                    <div className="text-2xl font-black text-slate-900">${flight.pricePerPerson}</div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      ${flight.totalGroupPrice} total (3 guests)
                    </div>
                  </div>

                  <a
                    href={flight.deepLinkType === 'google-flights' ? googleFlightsLink : skyscannerLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold transition-all shadow-xs"
                  >
                    <span>Check on {flight.deepLinkType === 'google-flights' ? 'Google Flights' : 'Skyscanner'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 2. HOTELS LISTING */}
      {/* ==================================================== */}
      {activeCategory === 'hotels' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900">
              Vetted Accommodations for 3 Travelers
            </h3>
            <a
              href={generateBookingComUrl({ destination: currentDestination })}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <span>Search all on Booking.com</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REAL_WORLD_HOTELS.map((hotel) => {
              const bookingComUrl = generateBookingComUrl({
                hotelName: hotel.name,
                destination: hotel.neighborhood
              });
              const agodaUrl = generateAgodaUrl({
                hotelName: hotel.name,
                destination: 'Tokyo'
              });

              return (
                <div
                  key={hotel.id}
                  className={`bg-white border rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between transition-all ${
                    hotel.recommended
                      ? 'border-indigo-400 ring-2 ring-indigo-200/60'
                      : 'border-slate-200'
                  }`}
                >
                  <div>
                    {/* Hotel Image */}
                    <div className="relative aspect-video overflow-hidden bg-slate-100">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                      {hotel.recommended && (
                        <span className="absolute top-3 left-3 bg-indigo-600 text-white font-extrabold text-[10px] px-3 py-1 rounded-full shadow-xs">
                          ⭐ SQUAD TOP PICK
                        </span>
                      )}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-slate-900 font-extrabold text-xs flex items-center gap-1 shadow-xs">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{hotel.rating}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-3">
                      <div>
                        <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{hotel.neighborhood}</span>
                        </div>
                        <h4 className="text-base font-black text-slate-900 mt-1 leading-tight">
                          {hotel.name}
                        </h4>
                        <div className="text-xs text-slate-500 font-medium mt-1">
                          {hotel.roomType}
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        {hotel.amenities.map((am, i) => (
                          <div key={i} className="text-xs text-slate-600 flex items-center gap-2 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>{am}</span>
                          </div>
                        ))}
                      </div>

                      {/* Multi-Agent Advocate */}
                      <div className="p-3 bg-indigo-50/70 rounded-2xl border border-indigo-100 text-xs text-indigo-900 leading-relaxed">
                        <div className="font-bold flex items-center gap-1.5 mb-0.5 text-indigo-800">
                          <Bot className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Why chosen:</span>
                        </div>
                        {hotel.advocate}
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Booking Buttons */}
                  <div className="p-6 pt-0 space-y-3">
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Per Person / Night</span>
                        <div className="text-xl font-black text-slate-900">${hotel.pricePerNightPerPerson}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">4-Night Group Total</span>
                        <div className="text-sm font-black text-emerald-600">${hotel.totalGroupStay}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={bookingComUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1.5 py-3 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold transition-all text-center"
                      >
                        <span>Booking.com</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <a
                        href={agodaUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1.5 py-3 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition-all text-center"
                      >
                        <span>Agoda</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
