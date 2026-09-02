// PNR lifecycle against Travelport Universal API.
//   - createPnr:  UniversalRecordCreateReq  → locator
//   - retrievePnr: UniversalRecordRetrieveReq → itinerary
//   - cancelPnr:   UniversalRecordCancelReq   → voided
//
// In stub mode these return canned responses, so dev can drive the
// full flow without real credentials.

import client from './client.js';
import {
  universalCreateBody,
  universalRetrieveBody,
  universalCancelBody,
} from './soap.js';
import { mapUniversalRecord } from './mappers.js';

const CREATE_ACTION = 'http://www.travelport.com/service/universal_v47_0/UniversalRecordServicePortType/UniversalRecordCreate';
const RETRIEVE_ACTION = 'http://www.travelport.com/service/universal_v47_0/UniversalRecordServicePortType/UniversalRecordRetrieve';
const CANCEL_ACTION = 'http://www.travelport.com/service/universal_v47_0/UniversalRecordServicePortType/UniversalRecordCancel';

// Travelers → XML for the create body. Production would include DOB,
// gender, and travel documents; stub keeps it minimal.
function travelersToXml(travelers = []) {
  return travelers
    .map((t) => {
      const first = (t.firstName || t.name || '').split(' ')[0] || 'TRAVELER';
      const last = t.lastName || t.name || first;
      return `
        <com:BookingTraveler>
          <com:BookingTravelerName First="${escapeXml(first)}" Last="${escapeXml(last)}" />
        </com:BookingTraveler>`;
    })
    .join('\n');
}

function escapeXml(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function createPnr({ offer, travelers }) {
  const travelersXml = travelersToXml(travelers);
  // In live mode we'd serialize the offer's AirPricingSolution; for the
  // stub the fixture is self-contained.
  const bodyXml = universalCreateBody({
    pricingSolutionXml: '<air:AirSegment Key="s1" />',
    travelersXml,
  });
  const { parsed, stub } = await client.postSoap({
    action: CREATE_ACTION,
    bodyXml,
    fixtureName: 'createPnr.xml',
  });
  const mapped = mapUniversalRecord(parsed) || {};
  return {
    stub,
    locator: mapped.locator || '6NKJ2K',
    status: mapped.status || 'Confirmed',
    raw: mapped,
  };
}

export async function retrievePnr({ locator, lastName }) {
  const bodyXml = universalRetrieveBody({ locator, lastName: lastName || 'TRAVELER' });
  const { parsed, stub } = await client.postSoap({
    action: RETRIEVE_ACTION,
    bodyXml,
    fixtureName: 'retrievePnr.xml',
  });
  const mapped = mapUniversalRecord(parsed);
  return { stub, itinerary: mapped, locator };
}

export async function cancelPnr({ locator }) {
  const bodyXml = universalCancelBody({ locator });
  const { stub } = await client.postSoap({
    action: CANCEL_ACTION,
    bodyXml,
    fixtureName: 'cancelPnr.xml',
  });
  return { stub, locator, status: 'Cancelled' };
}

export default { createPnr, retrievePnr, cancelPnr };
