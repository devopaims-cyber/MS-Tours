// LowFareSearchReq — public flight search. Cached in Redis (when available).
//
// In stub mode: reads a canned LowFareSearchRsp and maps it to the app's
// flight offer shape, so the client can develop against a real-looking
// response without hitting the network.

import crypto from 'node:crypto';

import client from './client.js';
import { lowFareSearchBody } from './soap.js';
import { mapLowFare, offerToFlightShape } from './mappers.js';
import { cacheGet, cacheSet } from '../../config/redis.js';
import { config, isStub } from './config.js';

const SOAP_ACTION = 'http://www.travelport.com/service/air_v47_0/AirLowFareSearchPortType/LowFareSearch';
const CACHE_TTL = 180; // seconds

function cacheKey(params) {
  const h = crypto.createHash('sha1').update(JSON.stringify(params)).digest('hex');
  return `tp:search:${h}`;
}

export async function searchFlights(params) {
  const {
    origin, destination, date, adults = 1, children = 0,
    fareClass = 'Economy', currency = 'INR',
  } = params;

  if (!origin || !destination || !date) {
    const err = new Error('origin, destination, date are required');
    err.statusCode = 400;
    throw err;
  }

  const cacheParams = { origin, destination, date, adults, children, fareClass, currency };
  const key = cacheKey(cacheParams);
  const cached = await cacheGet(key);
  if (cached) return { ...cached, cached: true };

  let offers;
  if (isStub() || !params.real) {
    // Read fixture and map. The fixture already matches LowFareSearchRsp.
    const { parsed } = await client.postSoap({
      action: SOAP_ACTION,
      bodyXml: lowFareSearchBody({ origin, destination, departureDate: date, adults, children, fareClass, currency }),
      fixtureName: 'lowfare.xml',
    });
    offers = mapLowFare(parsed);
  } else {
    const { parsed } = await client.postSoap({
      action: SOAP_ACTION,
      bodyXml: lowFareSearchBody({ origin, destination, departureDate: date, adults, children, fareClass, currency }),
      fixtureName: 'lowfare.xml', // not used in live, but required by signature
    });
    offers = mapLowFare(parsed);
  }

  // Adapt to the client's FlightCard shape.
  const data = offers.map(offerToFlightShape);
  const payload = {
    success: true,
    mode: isStub() ? 'stub' : 'live',
    env: config.env,
    count: data.length,
    data,
  };
  await cacheSet(key, payload, CACHE_TTL);
  return { ...payload, cached: false };
}

// Resolve an offerId back to the full offer (after the user has selected
// one in the booking flow). In stub mode we re-run a search and pick the
// matching synthetic offer; in live mode we hit the cache.
export async function getOffer(offerId, searchParams) {
  const { data } = await searchFlights(searchParams);
  return data.find((o) => o._id === offerId) || null;
}

export default { searchFlights, getOffer };
