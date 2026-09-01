import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaSearch, FaBed, FaPlaneDeparture, FaSuitcase } from 'react-icons/fa';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import { todayISO, addDaysISO } from '@/utils/formatters';

const tabs = [
  { id: 'packages', label: 'Packages', icon: <FaSuitcase /> },
  { id: 'hotels', label: 'Hotels', icon: <FaBed /> },
  { id: 'flights', label: 'Flights', icon: <FaPlaneDeparture /> },
];

export default function HeroSearch({ initialTab = 'packages' }) {
  const [tab, setTab] = useState(initialTab);
  const navigate = useNavigate();

  // Shared fields
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState(todayISO());
  const [travelers, setTravelers] = useState(2);

  // Hotel
  const [checkOut, setCheckOut] = useState(addDaysISO(todayISO(), 1));
  const [rooms, setRooms] = useState(1);

  // Flights
  const [origin, setOrigin] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [fareClass, setFareClass] = useState('economy');

  const submit = (e) => {
    e?.preventDefault();
    if (tab === 'packages') {
      navigate(`/packages?q=${encodeURIComponent(destination)}&travelers=${travelers}&date=${date}`);
    } else if (tab === 'hotels') {
      navigate(`/hotels?city=${encodeURIComponent(destination)}&checkIn=${date}&checkOut=${checkOut}&rooms=${rooms}&guests=${travelers}`);
    } else {
      navigate(`/flights?origin=${origin}&destination=${destination}&date=${date}&passengers=${passengers}&fareClass=${fareClass}`);
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-navy shadow-card-lift p-3 sm:p-4 max-w-4xl mx-auto">
      <div className="flex gap-1 bg-cream-200 rounded-2xl p-1 mb-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
              tab === t.id ? 'bg-navy text-white' : 'text-navy/70 hover:text-navy'
            }`}
          >
            {t.icon} <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={submit}>
        <AnimatePresence mode="wait">
          {tab === 'packages' && (
            <motion.div
              key="packages"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="grid grid-cols-1 sm:grid-cols-4 gap-3"
            >
              <Input
                label="Where to?"
                placeholder="Goa, Kerala, Bali…"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                leftIcon={<FaMapMarkerAlt />}
                className="sm:col-span-2"
              />
              <Input
                label="Travel date"
                type="date"
                value={date}
                min={todayISO()}
                onChange={(e) => setDate(e.target.value)}
                leftIcon={<FaCalendarAlt />}
              />
              <Input
                label="Travelers"
                type="number"
                min={1}
                max={20}
                value={travelers}
                onChange={(e) => setTravelers(Number(e.target.value))}
                leftIcon={<FaUsers />}
              />
            </motion.div>
          )}

          {tab === 'hotels' && (
            <motion.div
              key="hotels"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="grid grid-cols-1 sm:grid-cols-5 gap-3"
            >
              <Input
                label="City"
                placeholder="Mumbai, Goa…"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                leftIcon={<FaMapMarkerAlt />}
                className="sm:col-span-2"
              />
              <Input
                label="Check-in"
                type="date"
                value={date}
                min={todayISO()}
                onChange={(e) => setDate(e.target.value)}
              />
              <Input
                label="Check-out"
                type="date"
                value={checkOut}
                min={addDaysISO(date, 1)}
                onChange={(e) => setCheckOut(e.target.value)}
              />
              <Input
                label="Rooms"
                type="number"
                min={1}
                max={10}
                value={rooms}
                onChange={(e) => setRooms(Number(e.target.value))}
              />
            </motion.div>
          )}

          {tab === 'flights' && (
            <motion.div
              key="flights"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="grid grid-cols-1 sm:grid-cols-5 gap-3"
            >
              <Input
                label="From"
                placeholder="DEL"
                value={origin}
                onChange={(e) => setOrigin(e.target.value.toUpperCase())}
              />
              <Input
                label="To"
                placeholder="BOM"
                value={destination}
                onChange={(e) => setDestination(e.target.value.toUpperCase())}
              />
              <Input
                label="Date"
                type="date"
                value={date}
                min={todayISO()}
                onChange={(e) => setDate(e.target.value)}
              />
              <Input
                label="Passengers"
                type="number"
                min={1}
                max={9}
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
              />
              <Select
                label="Class"
                value={fareClass}
                onChange={(e) => setFareClass(e.target.value)}
                options={[
                  { value: 'economy', label: 'Economy' },
                  { value: 'premium', label: 'Premium' },
                  { value: 'business', label: 'Business' },
                ]}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 flex justify-end">
          <Button type="submit" variant="primary" size="lg" icon={<FaSearch />}>
            Search
          </Button>
        </div>
      </form>
    </div>
  );
}
