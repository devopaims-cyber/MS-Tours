import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  FaMapMarkerAlt, FaClock, FaUsers, FaCheck, FaTimes, FaHeart, FaRegHeart,
  FaChevronDown, FaStar
} from 'react-icons/fa';

import ImageGallery from '@/components/gallery/ImageGallery';
import ReviewCard from '@/components/cards/ReviewCard';
import ReviewForm from '@/components/forms/ReviewForm';
import PackageCard from '@/components/cards/PackageCard';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import RatingStars from '@/components/common/RatingStars';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPackageById, clearDetail
} from '@/store/slices/packageSlice';
import { fetchPackageReviews } from '@/api/reviews';
import * as packageApi from '@/api/packages';
import * as favApi from '@/api/users';
import useAuth from '@/hooks/useAuth';
import useFetch from '@/hooks/useFetch';
import { formatINR, formatDurationDays } from '@/utils/formatters';
import { useToast } from '@/hooks/useToast';

function ItineraryDay({ day, index }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className="border-2 border-navy/10 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 bg-cream-200 hover:bg-cream-300 transition text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-violet text-white font-fredoka flex items-center justify-center">
            {index + 1}
          </div>
          <div>
            <div className="font-fredoka text-navy">{day.title}</div>
            {day.description && <div className="text-xs text-navy/60">{day.description}</div>}
          </div>
        </div>
        <FaChevronDown className={`transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-5 space-y-2"
        >
          {day.activities?.length > 0 ? (
            <ul className="space-y-2">
              {day.activities.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-navy/80">
                  <FaCheck className="text-brand-green mt-1" /> {a}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-navy/60 text-sm">Free time / customise this day.</p>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default function PackageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const { detail, status } = useSelector((s) => s.packages);
  const { ids: favIds } = useSelector((s) => s.favorites);

  const { data: reviewsData, refetch: refetchReviews } = useFetch(
    () => fetchPackageReviews(id).then((r) => r?.data || r || []),
    [id]
  );
  const { data: related } = useFetch(
    () => packageApi.searchPackages({ limit: 3, destination: detail?.destination?._id }).then((r) => r.data || r),
    [detail?._id]
  );

  useEffect(() => {
    dispatch(fetchPackageById(id));
    return () => dispatch(clearDetail());
  }, [dispatch, id]);

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      if (favIds.includes(detail._id)) {
        await favApi.removeFavorite(detail._id);
        toast.push({ kind: 'info', message: 'Removed from favorites.' });
      } else {
        await favApi.addFavorite(detail._id);
        toast.push({ kind: 'success', message: 'Added to favorites!' });
      }
    } catch (e) {
      toast.push({ kind: 'error', message: e.message });
    }
  };

  if (status === 'loading' || !detail) {
    return <div className="flex justify-center py-20"><LoadingSpinner size={40} /></div>;
  }

  const price = detail.discountPrice ?? detail.price;
  const isFav = favIds.includes(detail._id);
  const reviews = Array.isArray(reviewsData) ? reviewsData : reviewsData?.data || [];

  return (
    <>
      <Helmet>
        <title>{detail.title} — MS Tours & Travels</title>
        <meta name="description" content={detail.description?.slice(0, 160)} />
      </Helmet>

      <div className="container-page py-8">
        <div className="flex items-center gap-2 text-sm text-navy/60 mb-4">
          <Link to="/packages" className="hover:text-navy">Packages</Link>
          <span>›</span>
          <span className="text-navy">{detail.title}</span>
        </div>

        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {detail.category && <Badge tone="violet">{detail.category}</Badge>}
              {detail.difficulty && <Badge tone="green">{detail.difficulty}</Badge>}
            </div>
            <h1 className="font-fredoka text-3xl sm:text-4xl text-navy">{detail.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-navy/70 text-sm">
              {detail.destination?.name && (
                <span className="inline-flex items-center gap-1"><FaMapMarkerAlt /> {detail.destination.name}</span>
              )}
              <span className="inline-flex items-center gap-1"><FaClock /> {formatDurationDays(detail.duration)}</span>
              <span className="inline-flex items-center gap-1"><FaUsers /> {detail.difficulty}</span>
              <span className="inline-flex items-center gap-1"><FaStar className="text-brand-orange" /> {detail.rating?.toFixed(1) || '—'} ({detail.reviewCount || 0})</span>
            </div>
          </div>
          <button
            onClick={toggleFavorite}
            className="w-12 h-12 rounded-full bg-white border-2 border-navy flex items-center justify-center hover:bg-cream-200"
            aria-label="Toggle favorite"
          >
            {isFav ? <FaHeart className="text-rose-500" /> : <FaRegHeart />}
          </button>
        </div>

        <ImageGallery images={detail.images} alt={detail.title} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 mt-10">
          <div className="space-y-8">
            <section>
              <h2 className="font-fredoka text-2xl text-navy mb-3">About this trip</h2>
              <p className="text-navy/80 leading-relaxed whitespace-pre-line">{detail.description}</p>
            </section>

            {detail.highlights?.length > 0 && (
              <section>
                <h2 className="font-fredoka text-2xl text-navy mb-3">Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {detail.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 rounded-2xl bg-cream-200">
                      <FaCheck className="text-brand-green mt-1 flex-shrink-0" />
                      <span className="text-navy/80">{h}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {detail.itinerary?.length > 0 && (
              <section>
                <h2 className="font-fredoka text-2xl text-navy mb-3">Itinerary</h2>
                <div className="space-y-2">
                  {detail.itinerary.map((day, i) => (
                    <ItineraryDay key={i} day={day} index={i} />
                  ))}
                </div>
              </section>
            )}

            <section className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {detail.inclusions?.length > 0 && (
                <div className="bg-brand-green/10 rounded-3xl border-2 border-brand-green/30 p-5">
                  <h3 className="font-fredoka text-navy mb-3">What’s included</h3>
                  <ul className="space-y-2 text-sm text-navy/80">
                    {detail.inclusions.map((x, i) => (
                      <li key={i} className="flex items-start gap-2"><FaCheck className="text-brand-green mt-0.5" /> {x}</li>
                    ))}
                  </ul>
                </div>
              )}
              {detail.exclusions?.length > 0 && (
                <div className="bg-rose-50 rounded-3xl border-2 border-rose-200 p-5">
                  <h3 className="font-fredoka text-navy mb-3">Not included</h3>
                  <ul className="space-y-2 text-sm text-navy/80">
                    {detail.exclusions.map((x, i) => (
                      <li key={i} className="flex items-start gap-2"><FaTimes className="text-rose-500 mt-0.5" /> {x}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            <section>
              <h2 className="font-fredoka text-2xl text-navy mb-4">Reviews ({detail.reviewCount || 0})</h2>
              <div className="space-y-3">
                {reviews.length === 0 ? (
                  <p className="text-navy/60 text-sm">No reviews yet — be the first to share your experience!</p>
                ) : (
                  reviews.map((r) => <ReviewCard key={r._id} review={r} />)
                )}
              </div>
              <div className="mt-6">
                <ReviewForm type="package" targetId={detail._id} onCreated={refetchReviews} />
              </div>
            </section>
          </div>

          {/* Sticky booking card */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-white rounded-3xl border-2 border-navy shadow-card-lift p-5 space-y-4">
              <div>
                {detail.discountPrice && (
                  <span className="text-navy/40 line-through mr-1">{formatINR(detail.price)}</span>
                )}
                <div className="font-fredoka text-3xl text-navy">{formatINR(price)}</div>
                <div className="text-xs text-navy/50">per person</div>
              </div>
              <RatingStars value={detail.rating || 0} showValue />
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => navigate(`/book/package/${detail._id}`)}
              >
                Book now
              </Button>
              <p className="text-xs text-navy/50 text-center">No charges until you confirm.</p>
            </div>
          </aside>
        </div>

        {related?.length > 0 && (
          <section className="mt-16">
            <h2 className="font-fredoka text-2xl text-navy mb-5">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.filter((p) => p._id !== detail._id).slice(0, 3).map((p) => (
                <PackageCard key={p._id} pkg={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
