// End-to-end Travelport stub smoke test: search → create → retrieve → cancel.
// No Mongo, no Redis, no network — fixtures only.
process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/_unused';
process.env.REDIS_URL = '';
process.env.JWT_SECRET = 'smoke';
process.env.TRAVELPORT_MODE = 'stub';
process.env.NODE_ENV = 'test';

const lowfare = (await import('../server/src/integrations/travelport/lowfare.js')).default;
const pnr     = (await import('../server/src/integrations/travelport/pnr.js')).default;
const { getStatus } = await import('../server/src/integrations/travelport/index.js');

console.log('STATUS', await getStatus());

const search = await lowfare.searchFlights({
  origin:'DEL', destination:'BOM', date:'2026-09-15',
  adults:1, children:0, fareClass:'Economy', currency:'INR',
});
const offers = search.data;
console.log('SEARCH', { mode: search.mode, count: search.count, cached: search.cached });
console.log('OFFER[0]', offers[0] && {
  provider: offers[0].provider,
  origin: offers[0].origin?.code,
  destination: offers[0].destination?.code,
  price: offers[0].price,
  currency: offers[0].currency,
});

const created = await pnr.createPnr({
  offer: offers[0],
  travelers: [{ name:'Smoke Test', type:'adult' }],
  totalPrice: offers[0].price,
  currency: 'INR',
});
console.log('CREATED', { stub: created.stub, locator: created.locator, status: created.status });

const got = await pnr.retrievePnr({ locator: created.locator, lastName:'Test' });
console.log('RETRIEVED', { stub: got.stub, locator: got.itinerary.locator, segs: got.itinerary.segments.length });

const cancelled = await pnr.cancelPnr({ locator: created.locator });
console.log('CANCELLED', { stub: cancelled.stub, locator: cancelled.locator, status: cancelled.status });
