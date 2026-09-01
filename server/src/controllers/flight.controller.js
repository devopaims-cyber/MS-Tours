import Flight from '../models/Flight.js';
import { AppError } from '../utils/AppError.js';

// GET /api/flights/search?origin=&destination=&date=&passengers=&fareClass=&stops=&sort=
export const search = async (req, res) => {
  const {
    origin, // airport code e.g. DEL
    destination, // airport code e.g. BOM
    date,
    passengers = 1,
    fareClass,
    stops,
    sort = 'price',
  } = req.query;

  const query = {};
  if (origin) query['origin.code'] = origin.toUpperCase();
  if (destination) query['destination.code'] = destination.toUpperCase();
  if (fareClass) query.fareClass = fareClass;
  if (stops !== undefined && stops !== '') query.stops = Number(stops);
  if (date) {
    const d = new Date(date);
    if (!isNaN(d)) {
      const start = new Date(d);
      start.setHours(0, 0, 0, 0);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }
  }
  // Only show flights with available seats
  query.seatsAvailable = { $gte: Number(passengers) || 1 };

  const sortObj = parseSort(sort);

  const items = await Flight.find(query).sort(sortObj).limit(100);
  res.json({ success: true, count: items.length, data: items });
};

// GET /api/flights/:id
export const getById = async (req, res) => {
  const flight = await Flight.findById(req.params.id);
  if (!flight) throw new AppError('Flight not found', 404);
  res.json({ success: true, data: flight });
};

function parseSort(s) {
  const desc = s.startsWith('-');
  const key = desc ? s.slice(1) : s;
  const allowed = ['price', 'duration', 'date', 'departureTime'];
  if (!allowed.includes(key)) return { price: 1 };
  return { [key]: desc ? -1 : 1 };
}
