// Sample bookings — 6 spread across users, statuses, and booking types.
// All dates are upcoming relative to seed time so the dashboard "Upcoming" tab has data.

const futureDate = (offsetDays) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offsetDays);
  return d;
};

export const bookings = [
  {
    _seedId: 'bk-1',
    userId: 'user-demo',
    type: 'package',
    packageId: 'pkg-goa-beach',
    checkInOrStartDate: futureDate(14),
    travelers: [
      { name: 'Mustafa Demo', age: 28, type: 'adult', gender: 'male' },
      { name: 'Sara Demo', age: 27, type: 'adult', gender: 'female' },
    ],
    totalPrice: 29998,
    status: 'confirmed',
    paymentStatus: 'paid',
    bookingRef: 'MST-AB12CD',
  },
  {
    _seedId: 'bk-2',
    userId: 'user-demo',
    type: 'hotel',
    hotelId: 'hotel-raj-oberoi',
    checkInOrStartDate: futureDate(45),
    checkOutDate: futureDate(48),
    rooms: [{ roomType: 'Luxury Tent', quantity: 1 }],
    travelers: [{ name: 'Mustafa Demo', age: 28, type: 'adult' }],
    totalPrice: 67500,
    status: 'confirmed',
    paymentStatus: 'paid',
    bookingRef: 'MST-XY34ZW',
  },
  {
    _seedId: 'bk-3',
    userId: 'user-priya',
    type: 'package',
    packageId: 'pkg-kashmir-honeymoon',
    checkInOrStartDate: futureDate(30),
    travelers: [
      { name: 'Priya Mehta', age: 26, type: 'adult', gender: 'female' },
      { name: 'Aman Mehta', age: 30, type: 'adult', gender: 'male' },
    ],
    totalPrice: 75998,
    status: 'confirmed',
    paymentStatus: 'paid',
    bookingRef: 'MST-KS91LM',
  },
  {
    _seedId: 'bk-4',
    userId: 'user-priya',
    type: 'flight',
    flightId: 'fl-emirates-201',
    checkInOrStartDate: futureDate(30),
    seats: 2,
    travelers: [
      { name: 'Priya Mehta', age: 26, type: 'adult' },
      { name: 'Aman Mehta', age: 30, type: 'adult' },
    ],
    totalPrice: 37000,
    status: 'pending',
    paymentStatus: 'pending',
    bookingRef: 'MST-FL22QR',
  },
  {
    _seedId: 'bk-5',
    userId: 'user-rahul',
    type: 'package',
    packageId: 'pkg-ladakh-classic',
    checkInOrStartDate: futureDate(60),
    travelers: [
      { name: 'Rahul Verma', age: 32, type: 'adult' },
      { name: 'Vikram Iyer', age: 33, type: 'adult' },
    ],
    totalPrice: 87998,
    status: 'confirmed',
    paymentStatus: 'paid',
    bookingRef: 'MST-LD77PP',
  },
  {
    _seedId: 'bk-6',
    userId: 'user-rahul',
    type: 'package',
    packageId: 'pkg-manali-spiti',
    checkInOrStartDate: futureDate(-30),
    travelers: [{ name: 'Rahul Verma', age: 32, type: 'adult' }],
    totalPrice: 34999,
    status: 'cancelled',
    paymentStatus: 'refunded',
    bookingRef: 'MST-CM99TT',
  },
];
