import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCheckCircle, FaUser, FaBed, FaPlane, FaSuitcase, FaCalendarAlt, FaArrowLeft
} from 'react-icons/fa';

import StepIndicator from '@/components/booking/StepIndicator';
import BookingPriceSummary from '@/components/booking/BookingPriceSummary';
import PaymentForm from '@/components/booking/PaymentForm';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PassengerSelector from '@/components/forms/PassengerSelector';
import RoomsSelector from '@/components/forms/RoomsSelector';
import FareClassSelector from '@/components/forms/FareClassSelector';

import { useDispatch, useSelector } from 'react-redux';
import { createBooking, clearDetail as clearBooking } from '@/store/slices/bookingSlice';
import { processPayment } from '@/api/payments';
import { getPackage } from '@/api/packages';
import { getHotel } from '@/api/hotels';
import { getFlight } from '@/api/flights';
import { formatINR, formatDate, addDaysISO, todayISO } from '@/utils/formatters';
import { useToast } from '@/hooks/useToast';
import { nightsBetween } from '@/utils/formatters';
import useAuth from '@/hooks/useAuth';
import { createPnrThunk } from '@/store/slices/travelportSlice';
import { useLocation } from 'react-router-dom';

const STEPS = ['Trip Details', 'Travelers', 'Payment'];

export default function BookingFlow() {
  const { type, id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const { user } = useAuth();
  const { lastCreated, creating } = useSelector((s) => s.bookings);
  const pnrState = useSelector((s) => s.travelport.pnr);

  const [step, setStep] = useState(1);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [bookingRef, setBookingRef] = useState(null);
  const [pnrLocator, setPnrLocator] = useState(null);

  // Form state
  const [form, setForm] = useState({
    date: todayISO(),
    endDate: addDaysISO(todayISO(), 3),
    travelers: { adults: 2, children: 0, infants: 0 },
    rooms: [],
    seats: 1,
    passengerDetails: [],
    fareClass: 'economy',
  });

  // Load item by type
  useEffect(() => {
    let active = true;
    setLoading(true);
    const load = {
      package: () => getPackage(id).then((r) => r.data || r),
      hotel: () => getHotel(id).then((r) => r.data || r),
      flight: () => getFlight(id).then((r) => r.data || r),
      // 'live' = Travelport offer passed via location.state from FlightSearch
      live: () => Promise.resolve(location.state?.flight || null),
    }[type];

    if (!load) {
      navigate('/');
      return;
    }

    load()
      .then((data) => {
        if (active) setItem(data);
      })
      .catch(() => toast.push({ kind: 'error', message: 'Failed to load booking details.' }))
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, [type, id, navigate, toast, location.state]);

  // Pre-fill passenger details once item + user load
  useEffect(() => {
    if (!item || !user) return;
    const count = (form.travelers.adults || 1) + (form.travelers.children || 0);
    setForm((f) => ({
      ...f,
      passengerDetails: Array.from({ length: count }, (_, i) => ({
        name: i === 0 ? user.name || '' : '',
        age: '',
        type: i < form.travelers.adults ? 'adult' : 'child',
        gender: '',
      })),
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?._id, user?._id, form.travelers.adults, form.travelers.children]);

  if (loading || !item) {
    return <div className="flex justify-center py-20"><LoadingSpinner size={40} /></div>;
  }

  // Compute price
  const computePrice = () => {
    if (type === 'package') {
      const price = item.discountPrice ?? item.price;
      const total = (form.travelers.adults + form.travelers.children) * price;
      return { total, breakdown: [
        { label: `${form.travelers.adults + form.travelers.children} × ${item.title}`, amount: total },
      ]};
    }
    if (type === 'hotel') {
      const nights = nightsBetween(form.date, form.endDate);
      const subtotal = (form.rooms || []).reduce((acc, r) => {
        const rt = item.roomTypes?.find((x) => x.name === r.roomType);
        return acc + (rt?.pricePerNight || 0) * r.quantity * nights;
      }, 0);
      return { total: subtotal, breakdown: [
        { label: `${nights} night${nights > 1 ? 's' : ''}`, amount: 0 },
        ...(form.rooms || []).map((r) => {
          const rt = item.roomTypes?.find((x) => x.name === r.roomType);
          return {
            label: `${r.quantity} × ${r.roomType} × ${nights} nights`,
            amount: (rt?.pricePerNight || 0) * r.quantity * nights,
          };
        }),
      ]};
    }
    if (type === 'flight' || type === 'live') {
      return { total: item.price * form.seats, breakdown: [
        { label: `${form.seats} × ${item.airline} ${item.flightNumber}`, amount: item.price * form.seats },
      ]};
    }
    return { total: 0, breakdown: [] };
  };

  const { total, breakdown } = computePrice();

  const goNext = () => setStep((s) => Math.min(STEPS.length, s + 1));
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  // Server expects the field names documented in server/src/controllers/booking.controller.js
  // (the server is authoritative — it recomputes totalPrice and never trusts the client).
  const handleCreate = async () => {
    // Live Travelport offer: skip our local Booking model, talk to TP.
    if (type === 'live') {
      const payload = {
        offerId: item._id,
        search: location.state?.lastSearch,
        travelers: form.passengerDetails,
        totalPrice: item.price * form.seats,
      };
      try {
        const r = await dispatch(createPnrThunk(payload)).unwrap();
        return r.booking || r;
      } catch (e) {
        toast.push({ kind: 'error', message: e.message || 'PNR creation failed' });
        return null;
      }
    }

    const payload = {
      type,
      ...(type === 'package' && {
        package: item._id,
        startDate: form.date,
        travelers: form.passengerDetails,
      }),
      ...(type === 'hotel' && {
        hotel: item._id,
        checkIn: form.date,
        checkOut: form.endDate,
        rooms: form.rooms,
        travelers: form.passengerDetails,
      }),
      ...(type === 'flight' && {
        flight: item._id,
        date: form.date,
        seats: form.seats,
        travelers: form.passengerDetails,
        fareClass: form.fareClass,
      }),
    };

    try {
      const result = await dispatch(createBooking(payload)).unwrap();
      const booking = result.data || result;
      return booking;
    } catch (e) {
      toast.push({ kind: 'error', message: e.message || 'Booking failed' });
      return null;
    }
  };

  const handlePayment = async ({ cardToken }) => {
    setPaymentLoading(true);
    const booking = await handleCreate();
    if (!booking) { setPaymentLoading(false); return; }

    if (type === 'live') {
      // The PNR endpoint already marks the booking paid.
      setBookingRef(booking.bookingRef);
      setPnrLocator(booking.pnr);
      toast.push({ kind: 'success', message: 'PNR created successfully!' });
      setStep(4);
      setPaymentLoading(false);
      return;
    }

    try {
      const res = await processPayment({ bookingId: booking._id, cardToken });
      const data = res.data || res;
      setBookingRef(data.booking?.bookingRef || data.bookingRef);
      toast.push({ kind: 'success', message: 'Payment successful!' });
      setStep(4);
    } catch (e) {
      toast.push({ kind: 'error', message: e.message || 'Payment failed' });
    } finally {
      setPaymentLoading(false);
    }
  };

  if (step === 4) {
    return (
      <div className="container-page py-20 max-w-2xl mx-auto text-center">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}>
          <FaCheckCircle className="text-7xl text-brand-green mx-auto mb-6" />
          <h1 className="font-fredoka text-4xl text-navy mb-3">You’re going places!</h1>
          <p className="text-navy/70 mb-2">Your booking is confirmed.</p>
          {pnrLocator && (
            <>
              <p className="text-navy/60 text-sm mb-1">Travelport locator (GDS)</p>
              <p className="font-fredoka text-3xl text-brand-orange mb-3 tracking-widest">{pnrLocator}</p>
            </>
          )}
          <p className="text-navy/60 text-sm mb-1">Reference</p>
          <p className="font-fredoka text-3xl text-brand-violet mb-8 tracking-widest">{bookingRef}</p>
          <div className="flex gap-3 justify-center">
            <Button variant="primary" onClick={() => navigate('/dashboard')}>View my bookings</Button>
            <Button variant="secondary" onClick={() => navigate('/')}>Back to home</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Book your {type} — MS Tours</title></Helmet>

      <div className="container-page py-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-navy/60 hover:text-navy text-sm mb-4"
        >
          <FaArrowLeft /> Back
        </button>

        <h1 className="font-fredoka text-3xl sm:text-4xl text-navy mb-2">Complete your booking</h1>
        <p className="text-navy/60 mb-8">Booking: <span className="text-navy font-semibold">{item.title || item.name || `${item.airline} ${item.flightNumber}`}</span></p>

        <StepIndicator steps={STEPS} current={step} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          <div>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  className="bg-white rounded-3xl border-2 border-navy shadow-card-soft p-6 space-y-5"
                >
                  <h2 className="font-fredoka text-xl text-navy flex items-center gap-2">
                    {type === 'package' && <><FaSuitcase /> Trip dates & travelers</>}
                    {type === 'hotel' && <><FaBed /> Stay dates & rooms</>}
                    {type === 'flight' && <><FaPlane /> Flight details</>}
                  </h2>

                  {type === 'package' && (
                    <>
                      <Input
                        label="Travel date"
                        type="date"
                        value={form.date}
                        min={todayISO()}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                      />
                      <div>
                        <label className="block text-sm font-semibold text-navy mb-2">Travelers</label>
                        <PassengerSelector
                          value={form.travelers}
                          onChange={(t) => setForm({ ...form, travelers: t })}
                        />
                      </div>
                    </>
                  )}

                  {type === 'hotel' && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="Check-in"
                          type="date"
                          value={form.date}
                          min={todayISO()}
                          onChange={(e) => setForm({ ...form, date: e.target.value })}
                        />
                        <Input
                          label="Check-out"
                          type="date"
                          value={form.endDate}
                          min={addDaysISO(form.date, 1)}
                          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-navy mb-2">Rooms</label>
                        <RoomsSelector
                          roomTypes={item.roomTypes || []}
                          value={form.rooms}
                          onChange={(r) => setForm({ ...form, rooms: r })}
                        />
                      </div>
                    </>
                  )}

                  {type === 'flight' && (
                    <>
                      <Input
                        label="Travel date"
                        type="date"
                        value={form.date}
                        min={todayISO()}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                      />
                      <Input
                        label="Seats"
                        type="number"
                        min={1}
                        max={Math.min(9, item.seatsAvailable || 9)}
                        value={form.seats}
                        onChange={(e) => setForm({ ...form, seats: Number(e.target.value) })}
                      />
                      <div>
                        <label className="block text-sm font-semibold text-navy mb-2">Fare class</label>
                        <FareClassSelector
                          value={form.fareClass}
                          onChange={(c) => setForm({ ...form, fareClass: c })}
                        />
                      </div>
                    </>
                  )}

                  {type === 'live' && (
                    <>
                      <div className="p-4 rounded-2xl bg-brand-violet/10 border-2 border-navy/10">
                        <div className="font-fredoka text-navy">{item.airline} {item.flightNumber}</div>
                        <div className="text-navy/60 text-sm">
                          {item.origin?.code} → {item.destination?.code} · {item.departureTime}–{item.arrivalTime}
                        </div>
                        <div className="text-navy/50 text-xs mt-1">via Travelport (live data)</div>
                      </div>
                      <Input
                        label="Travel date"
                        type="date"
                        value={form.date}
                        min={todayISO()}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                      />
                      <Input
                        label="Seats"
                        type="number"
                        min={1}
                        max={Math.min(9, item.seatsAvailable || 9)}
                        value={form.seats}
                        onChange={(e) => setForm({ ...form, seats: Number(e.target.value) })}
                      />
                    </>
                  )}

                  <div className="pt-3 flex justify-end">
                    <Button onClick={goNext}>Continue</Button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  className="bg-white rounded-3xl border-2 border-navy shadow-card-soft p-6 space-y-5"
                >
                  <h2 className="font-fredoka text-xl text-navy flex items-center gap-2">
                    <FaUser /> Traveler details
                  </h2>
                  {form.passengerDetails.length === 0 && (
                    <p className="text-navy/60 text-sm">Please complete the previous step to add travelers.</p>
                  )}
                  {form.passengerDetails.map((p, i) => (
                    <div key={i} className="p-4 rounded-2xl border-2 border-navy/10 space-y-3">
                      <div className="font-fredoka text-navy">Traveler {i + 1} <span className="text-xs text-navy/50">({p.type})</span></div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input
                          placeholder="Full name"
                          value={p.name}
                          onChange={(e) => {
                            const next = [...form.passengerDetails];
                            next[i] = { ...next[i], name: e.target.value };
                            setForm({ ...form, passengerDetails: next });
                          }}
                        />
                        <Input
                          placeholder="Age"
                          type="number"
                          value={p.age}
                          onChange={(e) => {
                            const next = [...form.passengerDetails];
                            next[i] = { ...next[i], age: e.target.value };
                            setForm({ ...form, passengerDetails: next });
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="pt-3 flex justify-between">
                    <Button variant="ghost" onClick={goBack}>Back</Button>
                    <Button onClick={goNext}>Continue to payment</Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  className="bg-white rounded-3xl border-2 border-navy shadow-card-soft p-6"
                >
                  <h2 className="font-fredoka text-xl text-navy mb-5">Payment</h2>
                  <PaymentForm
                    onSubmit={handlePayment}
                    submitting={paymentLoading}
                    total={formatINR(total)}
                  />
                  <div className="mt-4">
                    <Button variant="ghost" onClick={goBack}>Back</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <BookingPriceSummary
              title="Price summary"
              items={breakdown.filter((b) => b.amount > 0)}
              total={total}
              subtitle={type}
            />
            <div className="mt-4 bg-cream-200 rounded-2xl p-4 text-sm text-navy/70">
              <div className="font-fredoka text-navy mb-1">What happens next?</div>
              <ol className="list-decimal list-inside space-y-1">
                <li>Confirm dates and travelers</li>
                <li>Securely pay (mock)</li>
                <li>Get instant confirmation</li>
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
