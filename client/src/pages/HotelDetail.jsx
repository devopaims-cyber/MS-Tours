import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaMapMarkerAlt, FaStar, FaWifi, FaSwimmingPool, FaParking, FaUtensils, FaSpa } from 'react-icons/fa';

import ImageGallery from '@/components/gallery/ImageGallery';
import ReviewCard from '@/components/cards/ReviewCard';
import ReviewForm from '@/components/forms/ReviewForm';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import RatingStars from '@/components/common/RatingStars';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHotelById, clearDetail } from '@/store/slices/hotelSlice';
import { fetchHotelReviews } from '@/api/reviews';
import useFetch from '@/hooks/useFetch';
import { formatINR } from '@/utils/formatters';

const amenityIcon = (a) => {
  const k = a.toLowerCase();
  if (k.includes('wi')) return <FaWifi />;
  if (k.includes('pool')) return <FaSwimmingPool />;
  if (k.includes('parking')) return <FaParking />;
  if (k.includes('restaurant') || k.includes('breakfast')) return <FaUtensils />;
  if (k.includes('spa')) return <FaSpa />;
  return <FaStar />;
};

export default function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { detail, status } = useSelector((s) => s.hotels);

  const { data: reviewsData, refetch } = useFetch(
    () => fetchHotelReviews(id).then((r) => r?.data || r || []),
    [id]
  );

  useEffect(() => {
    dispatch(fetchHotelById(id));
    return () => dispatch(clearDetail());
  }, [dispatch, id]);

  if (status === 'loading' || !detail) {
    return <div className="flex justify-center py-20"><LoadingSpinner size={40} /></div>;
  }

  const reviews = Array.isArray(reviewsData) ? reviewsData : reviewsData?.data || [];

  return (
    <>
      <Helmet>
        <title>{detail.name} — MS Tours & Travels</title>
        <meta name="description" content={detail.description?.slice(0, 160)} />
      </Helmet>

      <div className="container-page py-8">
        <div className="flex items-center gap-2 text-sm text-navy/60 mb-4">
          <Link to="/hotels" className="hover:text-navy">Hotels</Link>
          <span>›</span>
          <span className="text-navy">{detail.name}</span>
        </div>

        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              {Array.from({ length: detail.starRating || 0 }).map((_, i) => (
                <FaStar key={i} className="text-brand-orange" />
              ))}
              {detail.featured && <Badge tone="orange">Featured</Badge>}
            </div>
            <h1 className="font-fredoka text-3xl sm:text-4xl text-navy">{detail.name}</h1>
            <div className="flex items-center gap-2 text-navy/70 text-sm mt-1">
              <FaMapMarkerAlt /> {detail.address}, {detail.city}, {detail.country}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <RatingStars value={detail.rating || 0} showValue />
              <span className="text-sm text-navy/50">({detail.reviewCount || 0} reviews)</span>
            </div>
          </div>
        </div>

        <ImageGallery images={detail.images} alt={detail.name} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 mt-10">
          <div className="space-y-8">
            <section>
              <h2 className="font-fredoka text-2xl text-navy mb-3">About this stay</h2>
              <p className="text-navy/80 leading-relaxed">{detail.description}</p>
            </section>

            {detail.amenities?.length > 0 && (
              <section>
                <h2 className="font-fredoka text-2xl text-navy mb-3">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {detail.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 p-3 rounded-2xl bg-cream-200 text-navy/80 text-sm">
                      <span className="text-brand-violet">{amenityIcon(a)}</span> {a}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {detail.roomTypes?.length > 0 && (
              <section>
                <h2 className="font-fredoka text-2xl text-navy mb-3">Room types</h2>
                <div className="space-y-2">
                  {detail.roomTypes.map((rt) => (
                    <div key={rt.name} className="flex items-center justify-between p-4 rounded-2xl border-2 border-navy/10">
                      <div>
                        <div className="font-fredoka text-navy">{rt.name}</div>
                        <div className="text-xs text-navy/60">Sleeps {rt.capacity} · {rt.available} left</div>
                      </div>
                      <div className="text-right">
                        <div className="font-fredoka text-xl text-navy">{formatINR(rt.pricePerNight)}</div>
                        <div className="text-xs text-navy/50">per night</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="font-fredoka text-2xl text-navy mb-4">Guest reviews</h2>
              <div className="space-y-3">
                {reviews.length === 0 ? (
                  <p className="text-navy/60 text-sm">No reviews yet — be the first to share your experience!</p>
                ) : (
                  reviews.map((r) => <ReviewCard key={r._id} review={r} />)
                )}
              </div>
              <div className="mt-6">
                <ReviewForm type="hotel" targetId={detail._id} onCreated={refetch} />
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-white rounded-3xl border-2 border-navy shadow-card-lift p-5 space-y-4">
              <div>
                <div className="font-fredoka text-3xl text-navy">{formatINR(detail.pricePerNight)}</div>
                <div className="text-xs text-navy/50">per night, taxes included</div>
              </div>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => navigate(`/book/hotel/${detail._id}`)}
              >
                Book now
              </Button>
              <p className="text-xs text-navy/50 text-center">Free cancellation up to 24h before check-in.</p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
