// Barrel for the Travelport integration. Lets other files do:
//   import { searchFlights, createPnr, retrievePnr, cancelPnr, getStatus } from '.../travelport';

export { config, isStub, hasCreds } from './config.js';
export { searchFlights, getOffer } from './lowfare.js';
export { createPnr, retrievePnr, cancelPnr } from './pnr.js';
export { mapLowFare, mapUniversalRecord, offerToFlightShape } from './mappers.js';

import { config, isStub, hasCreds } from './config.js';

export function getStatus() {
  return {
    provider: 'travelport',
    mode: isStub() ? 'stub' : 'live',
    env: config.env,
    credsConfigured: hasCreds(),
    note: isStub()
      ? 'Stub mode: no credentials configured. Returning fixture data. See .env.example for TRAVELPORT_* vars.'
      : 'Live mode: talking to Travelport uAPI.',
  };
}
