import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa';

import SectionHeading from '@/components/common/SectionHeading';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import { fetchDestinations } from '@/api/destinations';
import { searchPackages } from '@/api/packages';

export default function Destinations() {
  const [list, setList] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await fetchDestinations();
        const dests = data.data || data || [];
        if (!active) return;
        setList(dests);

        // Get package counts per destination
        const pairs = await Promise.all(
          dests.map(async (d) => {
            try {
              const res = await searchPackages({ destination: d._id, limit: 1 });
              const total = res.total ?? res.data?.length ?? 0;
              return [d._id, total];
            } catch {
              return [d._id, 0];
            }
          })
        );
        if (active) setCounts(Object.fromEntries(pairs));
      } catch {
        // soft fail
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  return (
    <>
      <Helmet><title>Destinations — MS Tours & Travels</title></Helmet>

      <div className="bg-gradient-to-br from-brand-sky/15 to-brand-mint/10 border-b-2 border-navy/10">
        <div className="container-page py-12">
          <h1 className="font-fredoka text-4xl text-navy">Where to next?</h1>
          <p className="text-navy/60 mt-1">Hand-picked destinations across India and beyond.</p>
        </div>
      </div>

      <div className="container-page py-10">
        {loading ? (
          <div className="flex justify-center py-12"><LoadingSpinner size={40} /></div>
        ) : list.length === 0 ? (
          <EmptyState
            icon={<FaMapMarkerAlt />}
            title="No destinations yet"
            description="We're curating new spots — check back soon."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((d, i) => (
              <motion.div
                key={d._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/packages?destination=${d._id}`}
                  className="block group rounded-3xl overflow-hidden border-2 border-navy bg-white shadow-card-soft hover:shadow-card-lift transition"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-cream-200">
                    {d.image ? (
                      <img
                        src={d.image}
                        alt={d.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-navy/30 text-6xl">
                        <FaMapMarkerAlt />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-navy/60 text-xs">
                      <FaMapMarkerAlt /> {d.country}
                    </div>
                    <div className="font-fredoka text-xl text-navy mt-1">{d.name}</div>
                    <div className="flex items-center justify-between mt-2 text-sm">
                      <span className="text-navy/60">{counts[d._id] ?? 0} packages</span>
                      {d.rating > 0 && (
                        <span className="inline-flex items-center gap-1 text-navy/70">
                          <FaStar className="text-brand-orange" /> {d.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
