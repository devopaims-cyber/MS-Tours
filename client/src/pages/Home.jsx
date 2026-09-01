import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FaShieldAlt, FaHeadset, FaTag, FaLeaf } from 'react-icons/fa';

import HeroSearch from '@/components/search/HeroSearch';
import DestinationCard from '@/components/cards/DestinationCard';
import PackageCard from '@/components/cards/PackageCard';
import TestimonialCard from '@/components/cards/TestimonialCard';
import SectionHeading from '@/components/common/SectionHeading';
import NewsletterForm from '@/components/newsletter/NewsletterForm';
import LoadingSpinner from '@/components/common/LoadingSpinner';

import { fetchFeaturedPackages } from '@/store/slices/packageSlice';
import * as destApi from '@/api/destinations';
import { TESTIMONIALS } from '@/constants/testimonials';
import { ILLUST_PLANE, ILLUST_SUITCASE, ILLUST_PALM, ILLUST_MOUNTAIN } from '@/constants/illustrations.jsx';
import useFetch from '@/hooks/useFetch';

const features = [
  { icon: <FaShieldAlt />, title: 'Safe & Secure', text: 'PCI-compliant payments and verified partners.' },
  { icon: <FaTag />, title: 'Best Price Promise', text: 'Found it cheaper? We’ll match it.' },
  { icon: <FaHeadset />, title: '24/7 Support', text: 'Real humans on WhatsApp when you need us.' },
  { icon: <FaLeaf />, title: 'Carbon-offset Trips', text: 'Travel greener with one-click offsetting.' },
];

export default function Home() {
  const dispatch = useDispatch();
  const { featured, status } = useSelector((s) => s.packages);

  useEffect(() => {
    if (!featured.length) dispatch(fetchFeaturedPackages());
  }, [dispatch, featured.length]);

  const { data: destData } = useFetch(() => destApi.listDestinations().then((r) => r.data || r));
  const destinations = Array.isArray(destData) ? destData : destData?.data || [];

  return (
    <>
      <Helmet>
        <title>MS Tours & Travels — Packages, Hotels & Flights</title>
        <meta name="description" content="Discover curated travel packages, dreamy hotels, and the smoothest flights across India and the world. Bold trips, playful journeys." />
      </Helmet>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cream-100 via-cream-200 to-brand-mint/30 pt-12 pb-24">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-brand-orange/15 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-brand-violet/20 blur-3xl" />

        <div className="container-page relative">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="pill bg-brand-violet/15 text-brand-violet border border-brand-violet/30 mb-4">
                ✈️ Where will you go next?
              </span>
              <h1 className="font-fredoka text-5xl sm:text-6xl lg:text-7xl text-navy leading-[1.05]">
                Trips that <span className="text-brand-orange">spark</span>,
                <br /> stays that <span className="text-brand-violet">soothe</span>.
              </h1>
              <p className="text-navy/70 text-lg mt-5 max-w-xl">
                Hand-picked packages, dreamy hotels, and flights that don’t feel like a chore — all from one playful little OTA.
              </p>
              <div className="mt-8">
                <HeroSearch />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-orange to-brand-rose opacity-90 animate-float" />
                <div className="absolute inset-6 rounded-full border-2 border-navy bg-cream-200 overflow-hidden shadow-card-lift">
                  <div className="absolute inset-0 bg-grain" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {ILLUST_PLANE}
                  </div>
                </div>
                <motion.div
                  className="absolute -top-4 -right-4 w-28 h-28"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                >
                  {ILLUST_SUITCASE}
                </motion.div>
                <motion.div
                  className="absolute -bottom-4 -left-4 w-32 h-32"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 5, delay: 1 }}
                >
                  {ILLUST_PALM}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURED DESTINATIONS */}
      <section className="py-16 sm:py-20">
        <div className="container-page">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
            <SectionHeading
              eyebrow="Where to next?"
              title="Featured destinations"
              subtitle="From sun-soaked coasts to snowy peaks — pick your mood."
            />
            <Link to="/destinations" className="text-brand-violet font-semibold hover:underline">View all →</Link>
          </div>
          {destinations.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {destinations.slice(0, 5).map((d) => (
                <DestinationCard key={d._id} destination={d} />
              ))}
            </div>
          ) : (
            <div className="flex justify-center py-12"><LoadingSpinner /></div>
          )}
        </div>
      </section>

      {/* TRENDING PACKAGES */}
      <section className="py-16 sm:py-20 bg-cream-200">
        <div className="container-page">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
            <SectionHeading
              eyebrow="Trending now"
              title="Packages people are loving"
              subtitle="Curated escapes that fill up fast. Book before they do."
            />
            <Link to="/packages" className="text-brand-violet font-semibold hover:underline">Browse all →</Link>
          </div>
          {status === 'loading' && (
            <div className="flex justify-center py-12"><LoadingSpinner /></div>
          )}
          {featured.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.slice(0, 6).map((p) => (
                <PackageCard key={p._id} pkg={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WHY US */}
      <section className="py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Why MS Tours"
            title="Travel that’s as easy as it gets"
            align="center"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-white rounded-3xl border-2 border-navy shadow-card-soft p-6 text-center"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-orange/15 flex items-center justify-center text-brand-orange text-2xl mb-3">
                  {f.icon}
                </div>
                <h3 className="font-fredoka text-navy text-lg mb-1">{f.title}</h3>
                <p className="text-sm text-navy/60">{f.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-brand-violet/10 to-brand-sky/10">
        <div className="container-page">
          <SectionHeading eyebrow="Loved by travellers" title="Real stories from real trips" align="center" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {TESTIMONIALS.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-16 sm:py-20">
        <div className="container-page">
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
