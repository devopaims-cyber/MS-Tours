// One-shot dry-boot inspector. Verifies all server modules import and
// the Express app registers the expected routes, without actually
// starting the listener or connecting to Mongo.
import app from '../server/server.js';

const rows = [];
app._router.stack.forEach((layer) => {
  if (layer.route) {
    const methods = Object.keys(layer.route.methods).join(',').toUpperCase();
    rows.push(`${methods.padEnd(10)} ${layer.route.path}`);
  } else if (layer.regexp && layer.handle && layer.handle.stack) {
    const m = layer.regexp.toString().match(/\^\\\/([^\\]+)/);
    const base = m ? `/${m[1]}` : '<mount>';
    rows.push(`--- MOUNT ${base} ---`);
  }
});

console.log('Express app loaded:', typeof app);
console.log('Registered routes:');
rows.forEach((r) => console.log('  ' + r));
