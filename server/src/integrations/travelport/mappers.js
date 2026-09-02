// Maps uAPI responses to the shapes our app uses elsewhere:
//   - flight offers for the search grid (FlightCard-compatible)
//   - Universal Record → itinerary JSON (segments, passengers, fare, status)
//
// Designed to work on parsed-JS (fast-xml-parser) input.

const SAFE = (v, d = '') => (v === undefined || v === null ? d : v);
const asArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

// --- Search → offers -----------------------------------------------

// Take a parsed LowFareSearchRsp and return a flat list of offers.
export function mapLowFare(parsed) {
  const env = parsed?.['SOAP:Envelope'] || parsed?.Envelope;
  const body = env?.['SOAP:Body'] || env?.Body;
  const rsp = body?.['air:LowFareSearchRsp'] || body?.LowFareSearchRsp;
  if (!rsp) return [];

  const solutions = asArray(rsp?.['air:AirPricingSolution'] || rsp?.AirPricingSolution);

  return solutions.map((sol, idx) => {
    const segments = asArray(sol?.['air:AirSegment'] || sol?.AirSegment).map(mapSegment);
    const passengers = asArray(sol?.['air:PassengerType'] || sol?.PassengerType);
    const total = Number(sol?.['@_TotalPrice'] || sol?.TotalPrice || 0);
    const currency = SAFE(sol?.['@_Currency'] || sol?.Currency, 'INR');
    const fareInfoRef = SAFE(sol?.['air:FareInfo']?.['@_Key'] || sol?.FareInfo?.Key, '');

    return {
      _offerId: `tp-${idx + 1}-${Date.now().toString(36)}`,
      provider: 'travelport',
      total: Number.isFinite(total) ? total : 0,
      currency,
      segments,
      fareInfoRef,
      passengerCounts: {
        adults: passengers.filter((p) => p?.['@_Code'] === 'ADT' || p?.Code === 'ADT').length || 1,
        children: passengers.filter((p) => p?.['@_Code'] === 'CNN' || p?.Code === 'CNN').length,
        infants: 0,
      },
    };
  });
}

function mapSegment(s) {
  // In uAPI, Origin/Destination are attributes on AirSegment (the city
  // name appears in nested <air:Origin>/<air:Destination> elements, but
  // the IATA code we want is the attribute).
  const originAttr =
    s?.['@_Origin'] || s?.Origin || s?.['air:Origin']?.['@_Code'] || s?.['air:Origin'] || '';
  const destAttr =
    s?.['@_Destination'] ||
    s?.Destination ||
    s?.['air:Destination']?.['@_Code'] ||
    s?.['air:Destination'] ||
    '';
  return {
    key: SAFE(s?.['@_Key'], ''),
    group: Number(s?.['@_Group'] || 0),
    carrier: SAFE(s?.['@_Carrier'] || s?.Carrier, ''),
    flightNumber: SAFE(s?.['@_FlightNumber'] || s?.FlightNumber, ''),
    origin: originAttr,
    destination: destAttr,
    departure: SAFE(s?.['@_DepartureTime'] || s?.DepartureTime, ''),
    arrival: SAFE(s?.['@_ArrivalTime'] || s?.ArrivalTime, ''),
    flightTime: Number(s?.['@_FlightTime'] || s?.FlightTime || 0),
    distance: Number(s?.['@_Distance'] || s?.Distance || 0),
    equipment: SAFE(s?.['@_Equipment'] || s?.Equipment, ''),
    cabinClass: SAFE(s?.['@_CabinClass'] || s?.CabinClass, 'Economy'),
    fareBasis: SAFE(s?.['@_FareBasis'] || s?.FareBasis, ''),
  };
}

// Adapt an offer to the FlightCard shape used in the client. The result
// is a "synthetic" flight (so FlightSearch can render it without touching
// the seeded Flight collection).
export function offerToFlightShape(offer) {
  const first = offer.segments[0] || {};
  const last = offer.segments[offer.segments.length - 1] || first;
  const stops = Math.max(0, offer.segments.length - 1);
  const durationMin = offer.segments.reduce(
    (acc, s) => acc + (Number(s.flightTime) || 0),
    0
  );
  const hh = Math.floor(durationMin / 60);
  const mm = durationMin % 60;
  return {
    _id: offer._offerId,
    provider: 'travelport',
    airline: first.carrier || 'Carrier',
    flightNumber: first.flightNumber || '',
    origin: {
      code: first.origin,
      city: first.origin,
    },
    destination: {
      code: last.destination,
      city: last.destination,
    },
    departureTime: (first.departure || '').slice(11, 16),
    arrivalTime: (last.arrival || '').slice(11, 16),
    price: offer.total,
    currency: offer.currency,
    duration: `${hh}h ${mm}m`,
    stops,
    fareClass: (first.cabinClass || 'Economy').toLowerCase(),
    seatsAvailable: 9,
    aircraft: first.equipment || '',
    date: (first.departure || '').slice(0, 10),
  };
}

// --- Universal Record → itinerary ----------------------------------

export function mapUniversalRecord(parsed) {
  const env = parsed?.['SOAP:Envelope'] || parsed?.Envelope;
  const body = env?.['SOAP:Body'] || env?.Body;
  const rsp =
    body?.['unv:UniversalRecordRetrieveRsp'] ||
    body?.UniversalRecordRetrieveRsp ||
    body?.['unv:UniversalRecordCreateRsp'] ||
    body?.UniversalRecordCreateRsp;
  if (!rsp) return null;

  const record = rsp?.['unv:UniversalRecord'] || rsp?.UniversalRecord;
  if (!record) return null;

  const locator = SAFE(
    record?.['unv:ProviderLocatorCode'] || record?.ProviderLocatorCode,
    ''
  );
  const status = SAFE(record?.['@_Status'] || record?.Status, 'Confirmed');

  const travelers = asArray(
    record?.['unv:BookingTraveler'] || record?.BookingTraveler
  ).map((t) => ({
    lastName: SAFE(t?.['@_LastName'] || t?.LastName, ''),
    firstName: SAFE(t?.['@_FirstName'] || t?.FirstName, ''),
    travelersCount: 1,
  }));

  // Air segments (or any BaseAirSegment under the air product).
  const products = asArray(record?.['unv:AirReservation'] || record?.AirReservation);
  const segments = products.flatMap((p) =>
    asArray(
      p?.['unv:AirSegment'] || p?.['air:AirSegment'] || p?.AirSegment
    ).map(mapSegment)
  );

  return { locator, status, travelers, segments };
}

export default { mapLowFare, mapUniversalRecord, offerToFlightShape };
