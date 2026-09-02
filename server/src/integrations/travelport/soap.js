// SOAP envelope + WSSE UsernameToken builder, and an XML ↔ object helper
// using fast-xml-parser. All envelopes follow the documented uAPI shapes
// (air_v47_0 / universal_v47_0 / common_v47_0). When real creds land, the
// outgoing XML produced here is what actually goes on the wire.

import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import { config } from './config.js';

const SOAP_NS = 'http://schemas.xmlsoap.org/soap/envelope/';
const WSSE_NS =
  'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd';
const WSU_NS = 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-utility-1.0.xsd';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  removeNSPrefix: false,
  parseTagValue: false,
  parseAttributeValue: false,
  trimValues: true,
});

const builder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  format: true,
  suppressEmptyNode: true,
});

// Escape a string for safe inclusion in XML text/attribute.
function xmlEscape(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Build a non-empty `<wsu:Timestamp>` with a 5-minute window.
function wsseTimestamp() {
  const now = new Date();
  const exp = new Date(now.getTime() + 5 * 60 * 1000);
  // ISO 8601 with 'Z' suffix; uAPI accepts both.
  const fmt = (d) => d.toISOString();
  return `
    <wsu:Timestamp wsu:Id="TS-${Date.now()}">
      <wsu:Created>${fmt(now)}</wsu:Created>
      <wsu:Expires>${fmt(exp)}</wsu:Expires>
    </wsu:Timestamp>`;
}

// Build the WSSE Security header (UsernameToken, password = PasswordText).
// Travelport uAPI accepts PasswordText + a Timestamp; it's a known-good combo.
function wsseHeader() {
  const u = xmlEscape(config.username);
  const p = xmlEscape(config.password);
  return `
    <wsse:Security soapenv:mustUnderstand="1"
      xmlns:wsse="${WSSE_NS}"
      xmlns:wsu="${WSU_NS}">
      ${wsseTimestamp()}
      <wsse:UsernameToken wsu:Id="UT-${Date.now()}">
        <wsse:Username>${u}</wsse:Username>
        <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">${p}</wsse:Password>
      </wsse:UsernameToken>
    </wsse:Security>`;
}

function billingPointOfSale() {
  return `
    <com:BillingPointOfSaleInfo OriginApplication="UAPI" />`;
}

// Wrap a request body in the standard SOAP envelope. The `header` is the
// complete `<soapenv:Header>` content (we don't add a SOAPAction for the
// uAPI cert endpoint — it goes in the HTTP header).
export function buildEnvelope({ header = '', body }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope
  xmlns:soapenv="${SOAP_NS}"
  xmlns:com="http://www.travelport.com/schema/common_v47_0"
  xmlns:unv="http://www.travelport.com/schema/universal_v47_0"
  xmlns:air="http://www.travelport.com/schema/air_v47_0"
  xmlns:soa="http://www.travelport.com/schema/soa_v47_0"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <soapenv:Header>
    ${header}
  </soapenv:Header>
  <soapenv:Body>
    ${body}
  </soapenv:Body>
</soapenv:Envelope>`;
}

// Standard uAPI header: WSSE + BillingPointOfSale. Use this for every request.
export function buildHeader() {
  return `${wsseHeader()}${billingPointOfSale()}`;
}

// --- Request body templates ----------------------------------------

// LowFareSearchReq — flight search. Adults/children only (no infants for
// LowFareSearch; create a UniversalRecord with infants later if needed).
export function lowFareSearchBody({
  origin,            // IATA airport code e.g. DEL
  destination,       // IATA airport code e.g. BOM
  departureDate,     // YYYY-MM-DD
  returnDate = null, // YYYY-MM-DD or null for one-way
  adults = 1,
  children = 0,
  fareClass = 'Economy', // Economy | PremiumEconomy | Business | First
  currency = 'INR',
}) {
  const searchPassenger = (code, age = null) => {
    const ageNode = age != null ? ` xsi:type="air:SearchPassengerType"><air:Age>${age}` : '>';
    return `<air:SearchPassenger Key="" Code="${code}"${ageNode}</air:SearchPassenger>`;
  };
  const passengers = [
    ...Array.from({ length: adults }, () => searchPassenger('ADT')),
    ...Array.from({ length: children }, () => searchPassenger('CNN', 9)),
  ].join('\n          ');

  const legs = `
        <air:SearchAirLeg Key="leg1">
          <air:SearchOrigin Key="o1"><air:Airport Code="${xmlEscape(origin)}" /></air:SearchOrigin>
          <air:SearchDestination Key="d1"><air:Airport Code="${xmlEscape(destination)}" /></air:SearchDestination>
          <air:SearchDepTime PreferredTime="${departureDate}T00:00:00" />
          <air:AirLegModifiers FareType="PublicFareOnly">
            <air:PreferredCabins>
              <air:CabinClass Type="${fareClass}" />
            </air:PreferredCabins>
          </air:AirLegModifiers>
        </air:SearchAirLeg>`;

  return `
    <air:LowFareSearchReq TargetBranch="${xmlEscape(config.targetBranch)}"
      SolutionResult="true" ReturnSameURL="false">
      ${legs}
      <air:SearchPassenger Key="pax" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" Code="ADT" />
      <air:AirPricingModifiers CurrencyType="${currency}" />
    </air:LowFareSearchReq>`;
}

// UniversalRecordCreateReq — book the chosen offer into a PNR.
export function universalCreateBody({
  // The chosen offer (AirPricePoint + AirSegment list) is converted to
  // XML by the controller; this template is a structural skeleton.
  pricingSolutionXml, // string: serialized <air:AirPricingSolution> from mapper
  travelersXml,       // string: one or more <BookingTraveler> blocks
  paymentXml = '',    // optional: <air:Payment> stub
}) {
  return `
    <unv:UniversalRecordCreateReq TargetBranch="${xmlEscape(config.targetBranch)}" Synchronous="true">
      <com:BookingTraveler>
        ${travelersXml}
      </com:BookingTraveler>
      <com:ProviderReservationDetail>
        <com:ProviderReservationLocator ProviderCode="1G" />
      </com:ProviderReservationDetail>
      <air:AirPricingSolution>
        ${pricingSolutionXml}
      </air:AirPricingSolution>
      ${paymentXml}
    </unv:UniversalRecordCreateReq>`;
}

// UniversalRecordRetrieveReq — pull a PNR by locator.
export function universalRetrieveBody({ locator, lastName }) {
  return `
    <unv:UniversalRecordRetrieveReq TargetBranch="${xmlEscape(config.targetBranch)}">
      <unv:ProviderLocatorCode>${xmlEscape(locator)}</unv:ProviderLocatorCode>
      <com:BookingTraveler LastName="${xmlEscape(lastName)}" />
    </unv:UniversalRecordRetrieveReq>`;
}

// UniversalRecordCancelReq — void a PNR.
export function universalCancelBody({ locator, reason = 'Cancelled by user' }) {
  return `
    <unv:UniversalRecordCancelReq TargetBranch="${xmlEscape(config.targetBranch)}">
      <unv:ProviderLocatorCode>${xmlEscape(locator)}</unv:ProviderLocatorCode>
      <com:BaseAirSegmentReason Code="A" Type="VOID" />
    </unv:UniversalRecordCancelReq>
    <com:Remark>${xmlEscape(reason)}</com:Remark>`;
}

// --- XML helpers ----------------------------------------------------

export function parseXml(xml) {
  return parser.parse(xml);
}

export function buildXml(obj) {
  return builder.build(obj);
}
