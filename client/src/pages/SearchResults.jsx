import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FaSearch } from 'react-icons/fa';

import PackageCard from '@/components/cards/PackageCard';
import SearchFilters from '@/components/search/SearchFilters';
import SortBar from '@/components/search/SortBar';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Pagination from '@/components/common/Pagination';
import * as api from '@/api/packages';
import { CATEGORIES } from '@/constants/categories';
import { DIFFICULTY } from '@/constants/difficulty';
import useDebounce from '@/hooks/useDebounce';

export default function SearchResults() {
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState({
    categories: [],
    difficulty: [],
    maxPrice: '',
    minRating: '',
  });
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ results: [], total: 0 });
  const [loading, setLoading] = useState(true);

  const debouncedFilters = useDebounce(filters, 250);
  const debouncedSort = useDebounce(sort, 100);
  const debouncedPage = useDebounce(page, 50);

  const query = {
    q: params.get('q') || '',
    destination: params.get('destination') || '',
    travelers: params.get('travelers') || '',
    date: params.get('date') || '',
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    const fetchData = async () => {
      try {
        const result = await api.searchPackages({
          ...query,
          ...(debouncedFilters.categories.length && { category: debouncedFilters.categories.join(',') }),
          ...(debouncedFilters.difficulty.length && { difficulty: debouncedFilters.difficulty.join(',') }),
          ...(debouncedFilters.maxPrice && { maxPrice: debouncedFilters.maxPrice }),
          ...(debouncedFilters.minRating && { minRating: debouncedFilters.minRating }),
          sort: debouncedSort,
          page: debouncedPage,
          limit: 12,
        });
        if (active) {
          setData({
            results: result.data || result.results || result || [],
            total: result.total || (result.data || result.results || []).length,
          });
        }
      } catch (e) {
        if (active) setData({ results: [], total: 0 });
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchData();
    return () => { active = false; };
  }, [debouncedFilters, debouncedSort, debouncedPage, query.q, query.destination]);

  return (
    <>
      <Helmet><title>Packages — MS Tours & Travels</title></Helmet>
      <div className="bg-cream-200 border-b-2 border-navy/10">
        <div className="container-page py-8">
          <h1 className="font-fredoka text-3xl sm:text-4xl text-navy">
            {query.q ? `Packages to ${query.q}` : 'All packages'}
          </h1>
          <p className="text-navy/60 mt-1">{data.total} experiences found</p>
        </div>
      </div>

      <div className="container-page py-8 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <aside>
          <SearchFilters
            filters={filters}
            onChange={setFilters}
            options={{ categories: CATEGORIES, difficulty: DIFFICULTY, price: true, minRating: true }}
          />
        </aside>

        <div>
          <SortBar
            value={sort}
            onChange={setSort}
            total={data.total}
            options={[
              { value: '', label: 'Recommended' },
              { value: 'price-asc', label: 'Price: Low → High' },
              { value: 'price-desc', label: 'Price: High → Low' },
              { value: 'rating', label: 'Rating' },
              { value: 'duration', label: 'Duration' },
            ]}
          />

          <div className="mt-5">
            {loading ? (
              <div className="flex justify-center py-20"><LoadingSpinner size={40} /></div>
            ) : data.results.length === 0 ? (
              <EmptyState
                icon={<FaSearch />}
                title="No packages match your filters"
                description="Try removing a filter or broadening your dates."
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {data.results.map((p) => (
                    <motion.div
                      key={p._id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <PackageCard pkg={p} />
                    </motion.div>
                  ))}
                </div>
                <Pagination
                  page={page}
                  total={data.total}
                  pageSize={12}
                  onChange={setPage}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
