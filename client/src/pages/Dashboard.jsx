import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  FaSuitcase, FaPlane, FaBed, FaCalendarAlt, FaUser, FaHeart,
  FaSignOutAlt, FaTrash, FaSatelliteDish
} from 'react-icons/fa';

import SectionHeading from '@/components/common/SectionHeading';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Input from '@/components/common/Input';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import ProfileForm from '@/components/forms/ProfileForm';
import PackageCard from '@/components/cards/PackageCard';

import { useDispatch, useSelector } from 'react-redux';
import { logout, updateProfile } from '@/store/slices/authSlice';
import { fetchBookings, cancelBooking } from '@/store/slices/bookingSlice';
import { fetchFavorites, removeFavorite } from '@/store/slices/favoriteSlice';
import { searchPackages } from '@/api/packages';
import { formatINR, formatDate } from '@/utils/formatters';
import { useToast } from '@/hooks/useToast';
import useFetch from '@/hooks/useFetch';

const TABS = ['Upcoming Trips', 'History', 'Profile', 'Favorites'];

function BookingRow({ booking, onCancel }) {
  const meta = {
    package: { icon: <FaSuitcase />, label: 'Package' },
    hotel: { icon: <FaBed />, label: 'Hotel' },
    flight: { icon: <FaPlane />, label: 'Flight' },
  }[booking.type] || { icon: <FaCalendarAlt />, label: booking.type };

  const title =
    booking.package?.title || booking.hotel?.name ||
    (booking.flight ? `${booking.flight.airline} ${booking.flight.flightNumber}` : 'Booking');

  const isGds = booking.provider === 'travelport' || Boolean(booking.pnr);
  const segSummary = (booking.segments || [])
    .map((s) => `${s.originCode || s.origin} → ${s.destinationCode || s.destination}`)
    .join(' · ');

  return (
    <div className="p-4 rounded-2xl border-2 border-navy/10 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl bg-brand-violet/15 text-brand-violet flex items-center justify-center text-xl border-2 border-navy/10">
          {isGds ? <FaSatelliteDish /> : meta.icon}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={isGds ? 'orange' : 'violet'}>
              {isGds ? 'GDS' : meta.label}
            </Badge>
            <Badge tone={booking.status === 'cancelled' ? 'rose' : 'green'}>
              {booking.status}
            </Badge>
            {booking.pnr && (
              <Badge tone="sky">PNR {booking.pnr}</Badge>
            )}
            <span className="text-xs text-navy/50">#{booking.bookingRef}</span>
          </div>
          <div className="font-fredoka text-navy mt-1">
            {isGds && segSummary ? segSummary : title}
          </div>
          <div className="text-xs text-navy/60">
            {formatDate(booking.checkInOrStartDate)}
            {booking.checkOutDate && ` → ${formatDate(booking.checkOutDate)}`}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="font-fredoka text-navy text-lg">{formatINR(booking.totalPrice)}</div>
          <div className="text-xs text-navy/50">{booking.paymentStatus}</div>
        </div>
        {booking.status !== 'cancelled' && (
          <button
            onClick={() => onCancel(booking._id)}
            className="p-2 rounded-xl border-2 border-navy/10 hover:border-rose-300 hover:text-rose-500"
            aria-label="Cancel booking"
            title="Cancel booking"
          >
            <FaTrash />
          </button>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const { user } = useSelector((s) => s.auth);
  const { list: bookings, status } = useSelector((s) => s.bookings);
  const { ids: favIds } = useSelector((s) => s.favorites);

  const [tab, setTab] = useState(0);

  // Load favorite packages for the Favorites tab
  const { data: favPackages } = useFetch(
    () => favIds.length
      ? searchPackages({ ids: favIds.join(',') }).then((r) => r.data || r)
      : Promise.resolve([]),
    [favIds.join(',')]
  );

  useEffect(() => {
    dispatch(fetchBookings());
    if (!favIds.length) dispatch(fetchFavorites());
  }, [dispatch, favIds.length]);

  const upcoming = bookings.filter((b) => b.status !== 'cancelled' && new Date(b.checkInOrStartDate) >= new Date());
  const history = bookings.filter((b) => b.status === 'cancelled' || new Date(b.checkInOrStartDate) < new Date());

  const onCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await dispatch(cancelBooking(id)).unwrap();
      toast.push({ kind: 'info', message: 'Booking cancelled.' });
    } catch (e) {
      toast.push({ kind: 'error', message: e.message || 'Failed to cancel.' });
    }
  };

  const onSaveProfile = async (data) => {
    try {
      await dispatch(updateProfile(data)).unwrap();
      toast.push({ kind: 'success', message: 'Profile updated.' });
    } catch (e) {
      toast.push({ kind: 'error', message: e.message || 'Update failed' });
    }
  };

  const onRemoveFav = async (id) => {
    try {
      await dispatch(removeFavorite(id)).unwrap();
      toast.push({ kind: 'info', message: 'Removed from favorites.' });
    } catch (e) {
      toast.push({ kind: 'error', message: e.message });
    }
  };

  return (
    <>
      <Helmet><title>My Dashboard — MS Tours & Travels</title></Helmet>

      <div className="container-page py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-brand-violet/15 to-brand-sky/15 rounded-3xl border-2 border-navy p-6 sm:p-8 mb-8"
        >
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-brand-orange text-white flex items-center justify-center font-fredoka text-2xl border-2 border-navy shadow-retro">
                {user?.name?.[0]?.toUpperCase() || <FaUser />}
              </div>
              <div>
                <div className="text-navy/60 text-sm">Hello,</div>
                <div className="font-fredoka text-2xl text-navy">{user?.name}</div>
                <div className="text-navy/60 text-sm">{user?.email}</div>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={() => { dispatch(logout()); navigate('/'); }}
              leftIcon={<FaSignOutAlt />}
            >
              Sign out
            </Button>
          </div>
        </motion.div>

        <div className="flex gap-2 flex-wrap mb-6 border-b-2 border-navy/10">
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={`px-4 py-2 font-semibold text-sm rounded-t-2xl border-2 border-b-0 transition ${
                tab === i
                  ? 'bg-white border-navy text-navy'
                  : 'bg-transparent border-transparent text-navy/60 hover:text-navy'
              }`}
            >
              {t}
              {t === 'Upcoming Trips' && upcoming.length > 0 && (
                <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-brand-orange text-white">{upcoming.length}</span>
              )}
              {t === 'Favorites' && favIds.length > 0 && (
                <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-brand-rose text-white">{favIds.length}</span>
              )}
            </button>
          ))}
        </div>

        {tab === 0 && (
          <div>
            {status === 'loading' ? (
              <div className="flex justify-center py-12"><LoadingSpinner size={36} /></div>
            ) : upcoming.length === 0 ? (
              <EmptyState
                icon={<FaSuitcase />}
                title="No upcoming trips yet"
                description="Browse packages and start your next adventure."
                action={<Button onClick={() => navigate('/packages')}>Explore packages</Button>}
              />
            ) : (
              <div className="space-y-3">
                {upcoming.map((b) => <BookingRow key={b._id} booking={b} onCancel={onCancel} />)}
              </div>
            )}
          </div>
        )}

        {tab === 1 && (
          <div>
            {history.length === 0 ? (
              <EmptyState icon={<FaCalendarAlt />} title="No past bookings" description="Your completed trips will appear here." />
            ) : (
              <div className="space-y-3">
                {history.map((b) => <BookingRow key={b._id} booking={b} onCancel={onCancel} />)}
              </div>
            )}
          </div>
        )}

        {tab === 2 && (
          <div className="bg-white rounded-3xl border-2 border-navy shadow-card-soft p-6">
            <h2 className="font-fredoka text-2xl text-navy mb-5">Your profile</h2>
            <ProfileForm user={user} onSubmit={onSaveProfile} />
          </div>
        )}

        {tab === 3 && (
          <div>
            {favIds.length === 0 ? (
              <EmptyState
                icon={<FaHeart />}
                title="No favorites yet"
                description="Tap the heart on any package to save it here."
                action={<Button onClick={() => navigate('/packages')}>Browse packages</Button>}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {(favPackages || []).map((p) => (
                  <div key={p._id} className="relative">
                    <PackageCard pkg={p} />
                    <button
                      onClick={() => onRemoveFav(p._id)}
                      className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white border-2 border-navy flex items-center justify-center hover:bg-rose-50"
                      aria-label="Remove favorite"
                    >
                      <FaTrash className="text-rose-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
