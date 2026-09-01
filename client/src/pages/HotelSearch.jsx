import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

import HotelCard from '@/components/cards/HotelCard';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import * as api from '@/api/hotels';
import { todayISO, addDaysISO } from '@/utils/formatters';

export default function HotelSearch() {
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    city: params.get('city') || '',
    checkIn: params.get('checkIn') || todayISO(),
    checkOut: params.get('checkOut') || addDaysISO(todayISO(), 1),
    guests: params.get('guests') || 2,
    starRating: params.get('starRating') || '',
    maxPrice: params.get('maxPrice') || '',
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const run = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const data = await api.searchHotels({
        city: form.city,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: form.guests,
        ...(form.starRating && { starRating: form.starRating }),
        ...(form.maxPrice && { maxPrice: form.maxPrice }),
      });
      setResults(data.data || data || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { run(); /* eslint-disable-next-line */ }, []);

  return (
    <>
      <Helmet><title>Hotels — MS Tours & Travels</title></Helmet>

      <div className="bg-gradient-to-br from-brand-sky/15 to-brand-violet/10 border-b-2 border-navy/10">
        <div className="container-page py-10">
          <h1 className="font-fredoka text-3xl sm:text-4xl text-navy">Find your stay</h1>
          <p className="text-navy/60 mt-1">From boutique hideaways to beachfront resorts.</p>

          <form onSubmit={run} className="mt-6 bg-white rounded-3xl border-2 border-navy p-4 grid grid-cols-1 sm:grid-cols-6 gap-3">
            <Input
              label="City"
              placeholder="Goa, Mumbai…"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              leftIcon={<FaMapMarkerAlt />}
              className="sm:col-span-2"
            />
            <Input
              label="Check-in"
              type="date"
              value={form.checkIn}
              min={todayISO()}
              onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
            />
            <Input
              label="Check-out"
              type="date"
              value={form.checkOut}
              min={addDaysISO(form.checkIn, 1)}
              onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
            />
            <Input
              label="Guests"
              type="number"
              min={1}
              value={form.guests}
              onChange={(e) => setForm({ ...form, guests: e.target.value })}
            />
            <button
              type="submit"
              className="self-end px-5 py-2.5 rounded-2xl bg-brand-orange text-white font-semibold border-2 border-navy shadow-retro hover:-translate-y-0.5 transition flex items-center justify-center gap-2"
            >
              <FaSearch /> Search
            </button>
          </form>
        </div>
      </div>

      <div className="container-page py-10">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <p className="text-navy/70">{results.length} hotels found</p>
          <div className="flex gap-2 flex-wrap">
            <Select
              value={form.starRating}
              onChange={(e) => setForm({ ...form, starRating: e.target.value })}
              options={[
                { value: '', label: 'Any rating' },
                { value: '5', label: '5★' },
                { value: '4', label: '4★+' },
                { value: '3', label: '3★+' },
              ]}
              className="!w-36"
            />
            <Input
              placeholder="Max ₹/night"
              type="number"
              value={form.maxPrice}
              onChange={(e) => setForm({ ...form, maxPrice: e.target.value })}
              className="!w-40"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><LoadingSpinner size={40} /></div>
        ) : results.length === 0 ? (
          <EmptyState icon={<FaSearch />} title="No hotels match" description="Try a different city or change your dates." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((h) => <HotelCard key={h._id} hotel={h} />)}
          </div>
        )}
      </div>
    </>
  );
}
