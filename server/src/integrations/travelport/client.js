// Travelport HTTP client. In stub mode it returns fixture data. In live
// mode it sends SOAP envelopes (built in ./soap.js) to the configured
// endpoint and parses the response. Auth is OAuth2 (bearer) or WSSE
// UsernameToken (in the SOAP header).

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { config, isStub, hasCreds } from './config.js';
import {
  buildEnvelope,
  buildHeader,
  parseXml,
} from './soap.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(__dirname, 'fixtures');

// --- Token cache (OAuth only) -------------------------------------

let _token = null;
let _tokenExp = 0;

async function getOAuthToken() {
  if (_token && Date.now() < _tokenExp - 30_000) return _token;
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: config.username,
    client_secret: config.password,
  });
  const res = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Travelport token request failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  _token = data.access_token;
  _tokenExp = Date.now() + (data.expires_in || 1800) * 1000;
  return _token;
}

async function readFixture(name) {
  return readFile(path.join(FIXTURES, name), 'utf8');
}

// POST a SOAP envelope. Returns parsed object { envelope, body }.
// `action` is the SOAPAction HTTP header (uAPI uses these to route).
// `fixtureName` is the stub fallback file when not in live mode.
async function postSoap({ action, bodyXml, fixtureName }) {
  if (isStub() || !hasCreds()) {
    const xml = await readFixture(fixtureName);
    return { xml, parsed: parseXml(xml), stub: true };
  }
  const envelope = buildEnvelope({ header: buildHeader(), body: bodyXml });
  const headers = {
    'Content-Type': 'text/xml; charset=utf-8',
    SOAPAction: action,
  };
  if (config.auth === 'oauth') {
    headers.Authorization = `Bearer ${await getOAuthToken()}`;
  }
  const res = await fetch(config.endpointUrl, {
    method: 'POST',
    headers,
    body: envelope,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Travelport ${action} failed: ${res.status} ${text}`);
  }
  const xml = await res.text();
  return { xml, parsed: parseXml(xml), stub: false };
}

export default { postSoap };
