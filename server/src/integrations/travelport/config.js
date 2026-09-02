// Travelport uAPI config. Reads from env; if any credential is missing
// the integration runs in `stub` mode and returns fixture data.
//
// See .env.example for the full list of vars.

const ENV = process.env.TRAVELPORT_ENV === 'prod' ? 'prod' : 'cert';
const MODE = (process.env.TRAVELPORT_MODE || 'demo').toLowerCase(); // demo | stub | live
const AUTH = (process.env.TRAVELPORT_AUTH || 'oauth').toLowerCase(); // oauth | wsse

const HOST = ENV === 'prod' ? 'apis.travelport.com' : 'apicert.travelport.com';

export const config = {
  mode: MODE,
  env: ENV,
  auth: AUTH,
  username: process.env.TRAVELPORT_USERNAME || '',
  password: process.env.TRAVELPORT_PASSWORD || '',
  pcc: process.env.TRAVELPORT_PCC || '',
  targetBranch: process.env.TRAVELPORT_TARGET_BRANCH || '',
  apiKey: process.env.TRAVELPORT_APIKEY || '',
  tokenUrl:
    process.env.TRAVELPORT_TOKEN_URL ||
    `https://${HOST}/api/oauth/v2/token`,
  endpointUrl:
    process.env.TRAVELPORT_ENDPOINT_URL ||
    `https://${HOST}/soap/TravelportUniversalApi/services`,
};

// True when we should NEVER hit the network. The fixtures live in ./fixtures/*.xml
// and match the documented uAPI response shapes.
export function isStub() {
  if (MODE === 'live') return false; // user explicitly asked for live
  return true; // demo + stub both never hit the network
}

// True when all the credentials needed to talk to the real API are present.
export function hasCreds() {
  if (AUTH === 'oauth') {
    return Boolean(
      config.username && config.password && config.clientId && config.clientSecret
    );
  }
  // wsse
  return Boolean(config.username && config.password && config.targetBranch);
}

export default config;
