import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaPlane, FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaSearch } from 'react-icons/fa';

import FlightCard from '@/components/cards/FlightCard';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import * as api from '@/api/flights';
import { todayISO } from '@/utils/formatters';
import { useToast } from '@/hooks/useToast';

export default function FlightSearch() {
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    origin: params.get('origin') || '',
    destination: params.get('destination') || '',
    date: params.get('date') || todayISO(),
    passengers: params.get('passengers') || 1,
    fareClass: params.get('fareClass') || 'economy',
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState('price-asc');
  const navigate = useNavigate();
  const toast = useToast();

  const run = async (e) => {
    e?.preventDefault();
    if (!form.origin || !form.destination) {
      toast.push({ kind: 'error', message: 'Please enter both origin and destination.' });
      return;
    }
    setLoading(true);
    try {
      const data = await api.searchFlights({
        origin: form.origin.toUpperCase(),
        destination: form.destination.toUpperCase(),
        date: form.date,
        fareClass: form.fareClass,
      });
      setResults(data.data || data || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const sorted = [...results].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'duration') return a.duration.localeCompare(b.duration);
    return 0;
  });

  return (
    <>
      <Helmet><title>Flights — MS Tours & Travels</title></Helmet>

      <div className="bg-gradient-to-br from-brand-sky/15 to-brand-mint/10 border-b-2 border-navy/10">
        <div className="container-page py-10">
          <h1 className="font-fredoka text-3xl sm:text-4xl text-navy">Search flights</h1>
          <p className="text-navy/60 mt-1">Domestic + international, all major carriers.</p>

          <form onSubmit={run} className="mt-6 bg-white rounded-3xl border-2 border-navy p-4 grid grid-cols-1 sm:grid-cols-5 gap-3">
            <Input
              label="From"
              placeholder="DEL"
              value={form.origin}
              onChange={(e) => setForm({ ...form, origin: e.target.value.toUpperCase() })}
            />
            <Input
              label="To"
              placeholder="BOM"
              value={form.destination}
              onChange={(e) => setForm({ ...form, destination: e.target.value.toUpperCase() })}
            />
            <Input
              label="Departure"
              type="date"
              value={form.date}
              min={todayISO()}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            <Input
              label="Passengers"
              type="number"
              min={1}
              max={9}
              value={form.passengers}
              onChange={(e) => setForm({ ...form, passengers: e.target.value })}
            />
            <Select
              label="Class"
              value={form.fareClass}
              onChange={(e) => setForm({ ...form, fareClass: e.target.value })}
              options={[
                { value: 'economy', label: 'Economy' },
                { value: 'premium', label: 'Premium' },
                { value: 'business', label: 'Business' },
              ]}
            />
            <button
              type="submit"
              className="sm:col-span-5 px-5 py-3 rounded-2xl bg-brand-orange text-white font-semibold border-2 border-navy shadow-retro hover:-translate-y-0.5 transition flex items-center justify-center gap-2"
            >
              <FaSearch /> Search flights
            </button>
          </form>
        </div>
      </div>

      <div className="container-page py-10">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <p className="text-navy/70">{results.length} flights found</p>
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            options={[
              { value: 'price-asc', label: 'Price: Low → High' },
              { value: 'price-desc', label: 'Price: High → Low' },
              { value: 'duration', label: 'Duration' },
            ]}
            className="!w-56"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><LoadingSpinner size={40} /></div>
        ) : sorted.length === 0 ? (
          <EmptyState
            icon={<FaPlane />}
            title="No flights found"
            description="Try a different route or date."
          />
        ) : (
          <div className="space-y-4">
            {sorted.map((f) => (
              <FlightCard
                key={f._id}
                flight={f}
                onSelect={(flight) => navigate(`/book/flight/${flight._id}`, { state: { flight, passengers: form.passengers } })}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
