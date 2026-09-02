import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaSearch, FaSatelliteDish, FaPlane, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';

import SectionHeading from '@/components/common/SectionHeading';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import Badge from '@/components/common/Badge';
import { retrievePnr } from '@/store/slices/travelportSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@/hooks/useToast';

export default function PnrLookup() {
  const dispatch = useDispatch();
  const toast = useToast();
  const pnr = useSelector((s) => s.travelport.pnr);
  const tpStatus = useSelector((s) => s.travelport.status);
  const [form, setForm] = useState({ locator: '', lastName: '' });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.locator) {
      toast.push({ kind: 'error', message: 'Locator is required' });
      return;
    }
    setLoading(true);
    try {
      await dispatch(retrievePnr({ locator: form.locator.toUpperCase(), lastName: form.lastName })).unwrap();
    } catch (err) {
      toast.push({ kind: 'error', message: err.message || 'PNR not found' });
    } finally {
      setLoading(false);
    }
  };

  const itinerary = pnr?.itinerary;
  const segments = itinerary?.segments || pnr?.booking?.segments || [];
  const isStub = tpStatus?.mode === 'stub';

  return (
    <>
      <Helmet><title>Check your PNR — MS Tours & Travels</title></Helmet>

      <div className="bg-gradient-to-br from-brand-violet/15 to-brand-sky/15 border-b-2 border-navy/10">
        <div className="container-page py-10">
          <div className="flex items-center gap-3 mb-2 text-navy/60">
            <FaSatelliteDish /> <span>Travelport PNR lookup</span>
          </div>
          <h1 className="font-fredoka text-3xl sm:text-4xl text-navy">Check your booking</h1>
          <p className="text-navy/70 mt-1 max-w-xl">
            Enter the 6-character PNR we sent you. We'll pull the live record from Travelport.
          </p>
          {isStub && (
            <div className="mt-4 p-3 rounded-2xl bg-cream-200 border-2 border-navy/10 text-sm text-navy/80">
              <strong>Simulated mode.</strong> Without Travelport credentials this returns the fixture record (6NKJ2K). See <code>.env.example</code>.
            </div>
          )}
        </div>
      </div>

      <div className="container-page py-10">
        <form onSubmit={onSubmit} className="bg-white rounded-3xl border-2 border-navy shadow-card-soft p-6 grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3">
          <Input
            label="PNR / Locator"
            placeholder="6NKJ2K"
            value={form.locator}
            onChange={(e) => setForm({ ...form, locator: e.target.value.toUpperCase() })}
            maxLength={8}
          />
          <Input
            label="Last name (optional)"
            placeholder="Doe"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
          <div className="self-end">
            <Button type="submit" disabled={loading} leftIcon={<FaSearch />}>
              {loading ? 'Looking up…' : 'Look up PNR'}
            </Button>
          </div>
        </form>

        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center py-12"><LoadingSpinner size={36} /></div>
          ) : !itinerary && !pnr?.booking ? (
            <EmptyState
              icon={<FaSatelliteDish />}
              title="No PNR to show yet"
              description="Enter a locator above to pull a live booking."
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border-2 border-navy shadow-card-soft p-6"
            >
              <div className="flex items-center gap-3 flex-wrap mb-4">
                <Badge tone="violet">{pnr?.booking?.pnr || itinerary?.locator || pnr?.locator}</Badge>
                <Badge tone="green"><FaCheckCircle /> {pnr?.booking?.status || itinerary?.status || 'Confirmed'}</Badge>
                {pnr?.stub && <Badge tone="orange">Sandbox data</Badge>}
              </div>
              <h2 className="font-fredoka text-xl text-navy mb-4">Itinerary</h2>
              <div className="space-y-3">
                {segments.map((s, i) => (
                  <div key={i} className="p-4 rounded-2xl border-2 border-navy/10 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-sky/15 text-brand-sky flex items-center justify-center text-xl">
                      <FaPlane />
                    </div>
                    <div className="flex-1">
                      <div className="font-fredoka text-navy">
                        {s.carrier || s.airline} {s.flightNumber}
                      </div>
                      <div className="text-sm text-navy/60">
                        {s.origin || s.originCode} → {s.destination || s.destinationCode}
                      </div>
                    </div>
                    <div className="text-right text-sm text-navy/60">
                      <div><FaCalendarAlt className="inline mr-1" />{formatDateTime(s.departure || s.departureTime)}</div>
                      <div>arr {formatDateTime(s.arrival || s.arrivalTime)}</div>
                    </div>
                  </div>
                ))}
                {segments.length === 0 && (
                  <p className="text-navy/60 text-sm">No segment details in this PNR.</p>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}

function formatDateTime(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return iso;
  }
}
