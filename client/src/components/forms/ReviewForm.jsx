import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import Button from '../common/Button';
import Textarea from '../common/Textarea';
import { createReview } from '@/api/reviews';
import { useToast } from '@/hooks/useToast';
import useAuth from '@/hooks/useAuth';
import { fetchPackageById } from '@/store/slices/packageSlice';
import { fetchHotelById } from '@/store/slices/hotelSlice';

export default function ReviewForm({ type, targetId, onCreated }) {
  const { isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const toast = useToast();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="p-5 rounded-2xl bg-cream-200 text-navy/70 text-sm">
        Please <a href="/login" className="text-brand-violet font-semibold">log in</a> to leave a review.
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    if (rating < 1) {
      toast.push({ kind: 'error', message: 'Please pick a rating.' });
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        rating,
        comment,
        ...(type === 'package' ? { packageId: targetId } : { hotelId: targetId }),
      };
      await createReview(payload);
      toast.push({ kind: 'success', message: 'Thanks for your review!' });
      setComment('');
      setRating(0);
      // refresh detail so aggregate updates
      if (type === 'package') await dispatch(fetchPackageById(targetId));
      else await dispatch(fetchHotelById(targetId));
      onCreated?.();
    } catch (err) {
      toast.push({ kind: 'error', message: err.message || 'Failed to submit review.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl border-2 border-navy/10 p-5 space-y-4">
      <h4 className="font-fredoka text-navy text-lg">Write a review</h4>
      <div>
        <label className="block text-sm font-semibold text-navy mb-1.5">Your rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.button
              key={i}
              type="button"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(i)}
              aria-label={`${i} star${i > 1 ? 's' : ''}`}
            >
              <FaStar
                size={26}
                className={i <= (hover || rating) ? 'text-brand-orange' : 'text-navy/20'}
              />
            </motion.button>
          ))}
        </div>
      </div>
      <Textarea
        label="Your experience"
        placeholder="Tell others what made the trip special…"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
      />
      <Button type="submit" variant="primary" loading={submitting}>
        Submit review
      </Button>
    </form>
  );
}
