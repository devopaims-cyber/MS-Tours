import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaCheck } from 'react-icons/fa';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setDone(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-brand-violet to-navy rounded-3xl border-2 border-navy p-8 sm:p-10 text-white relative overflow-hidden"
    >
      <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-brand-orange/30 blur-3xl" />
      <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-brand-sky/40 blur-2xl" />
      <div className="relative max-w-2xl">
        <h3 className="font-fredoka text-2xl sm:text-3xl mb-2">Wander more, spend less</h3>
        <p className="text-cream-200/90 mb-5">
          Subscribe to our newsletter for hand-picked deals, new destinations, and a monthly dose of travel inspo.
        </p>
        {done ? (
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-5 py-3 rounded-2xl font-semibold">
            <FaCheck /> You're in! Check your inbox.
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 px-4 py-3 rounded-2xl bg-white text-navy outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-brand-orange text-white font-semibold border-2 border-white inline-flex items-center justify-center gap-2"
            >
              <FaPaperPlane /> Subscribe
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
}
