import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaLeaf, FaCompass, FaHeart, FaUsers } from 'react-icons/fa';

import SectionHeading from '@/components/common/SectionHeading';

const VALUES = [
  {
    icon: <FaCompass />,
    title: 'Curated, not crowded',
    body: 'Every itinerary is hand-built by travellers who have actually been there. No filler, no fluff.',
    tone: 'bg-brand-violet/15 text-brand-violet',
  },
  {
    icon: <FaLeaf />,
    title: 'Travel that gives back',
    body: 'We partner with local homestays and guides so tourism dollars stay where they should.',
    tone: 'bg-brand-green/15 text-brand-green',
  },
  {
    icon: <FaHeart />,
    title: 'Support that answers',
    body: 'Real humans on WhatsApp 7 days a week, from booking day to landing day.',
    tone: 'bg-brand-rose/15 text-brand-rose',
  },
  {
    icon: <FaUsers />,
    title: 'Built for groups',
    body: 'Solo, couple, family or 30-strong offsite — we scale the experience, not the headache.',
    tone: 'bg-brand-sky/15 text-brand-sky',
  },
];

export default function About() {
  return (
    <>
      <Helmet><title>About — MS Tours & Travels</title></Helmet>

      <section className="bg-gradient-to-br from-brand-violet/15 via-cream-100 to-brand-sky/15 border-b-2 border-navy/10">
        <div className="container-page py-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-fredoka text-4xl sm:text-5xl text-navy max-w-2xl"
          >
            We make trips worth telling stories about.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-navy/70 text-lg max-w-2xl mt-4"
          >
            MS Tours & Travels is a small, opinionated travel team. We don't do 50-stop bus tours or
            "see it all in 3 days" itineraries. We do trips that linger.
          </motion.p>
        </div>
      </section>

      <section className="container-page py-14">
        <SectionHeading
          eyebrow="Our values"
          title="What we care about"
          subtitle="Four simple promises that shape every booking we make."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-3xl bg-white border-2 border-navy shadow-card-soft"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${v.tone}`}>
                {v.icon}
              </div>
              <div className="font-fredoka text-navy text-lg mt-3">{v.title}</div>
              <p className="text-navy/70 text-sm mt-1">{v.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container-page py-10">
        <div className="bg-white rounded-3xl border-2 border-navy shadow-card-soft p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="text-brand-violet font-semibold text-sm uppercase tracking-wider">Our story</div>
            <h2 className="font-fredoka text-3xl text-navy mt-1">From a borrowed scooter to a full team</h2>
            <p className="text-navy/70 mt-3">
              We started in 2018 with one Goa itinerary and a phone full of recommendations from friends.
              Six years later, we run trips across India, Southeast Asia and the Middle East — but the
              rule is the same: if we wouldn't send our own family, we won't send yours.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { n: '10K+', l: 'Travellers' },
              { n: '40+', l: 'Destinations' },
              { n: '4.8★', l: 'Avg rating' },
              { n: '24/7', l: 'On-trip help' },
            ].map((s) => (
              <div key={s.l} className="p-4 rounded-2xl bg-cream-200 border-2 border-navy/10 text-center">
                <div className="font-fredoka text-2xl text-brand-violet">{s.n}</div>
                <div className="text-xs text-navy/60">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
