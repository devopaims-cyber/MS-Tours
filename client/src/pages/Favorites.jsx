import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaHeart, FaArrowRight } from 'react-icons/fa';

import PackageCard from '@/components/cards/PackageCard';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites } from '@/store/slices/favoriteSlice';
import { searchPackages } from '@/api/packages';
import useFetch from '@/hooks/useFetch';

export default function Favorites() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { ids, status } = useSelector((s) => s.favorites);
  const { isAuthenticated } = useSelector((s) => s.auth);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchFavorites());
  }, [dispatch, isAuthenticated]);

  const { data, loading } = useFetch(
    () => ids.length
      ? searchPackages({ ids: ids.join(',') }).then((r) => r.data || r)
      : Promise.resolve([]),
    [ids.join(',')]
  );

  if (!isAuthenticated) {
    return (
      <>
        <Helmet><title>Favorites — MS Tours & Travels</title></Helmet>
        <div className="container-page py-20 max-w-md mx-auto text-center">
          <FaHeart className="text-6xl text-brand-rose mx-auto mb-4" />
          <h1 className="font-fredoka text-3xl text-navy mb-2">Sign in to see favorites</h1>
          <p className="text-navy/60 mb-6">Save trips to your wishlist and pick up where you left off.</p>
          <Button onClick={() => navigate('/login', { state: { from: { pathname: '/favorites' } } })}>
            Sign in <FaArrowRight className="ml-2" />
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet><title>My Favorites — MS Tours & Travels</title></Helmet>
      <div className="container-page py-10">
        <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
          <div>
            <h1 className="font-fredoka text-3xl sm:text-4xl text-navy">My Favorites</h1>
            <p className="text-navy/60 text-sm">{ids.length} saved trip{ids.length === 1 ? '' : 's'}</p>
          </div>
          <Link to="/packages" className="text-brand-violet font-semibold hover:underline">
            Browse more →
          </Link>
        </div>

        {loading || status === 'loading' ? (
          <div className="flex justify-center py-12"><LoadingSpinner size={40} /></div>
        ) : !ids.length ? (
          <EmptyState
            icon={<FaHeart />}
            title="No favorites yet"
            description="Tap the heart icon on any package to save it for later."
            action={<Button onClick={() => navigate('/packages')}>Explore packages</Button>}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(data || []).map((p) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <PackageCard pkg={p} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
