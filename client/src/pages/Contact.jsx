import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';

import Input from '@/components/common/Input';
import Textarea from '@/components/common/Textarea';
import Button from '@/components/common/Button';
import { useToast } from '@/hooks/useToast';

const CHANNELS = [
  { icon: <FaEnvelope />, label: 'Email', value: 'hello@mstours.example', tone: 'bg-brand-violet/15 text-brand-violet' },
  { icon: <FaPhone />, label: 'Phone', value: '+91 98765 43210', tone: 'bg-brand-green/15 text-brand-green' },
  { icon: <FaWhatsapp />, label: 'WhatsApp', value: '+91 98765 43210', tone: 'bg-brand-green/15 text-brand-green' },
  { icon: <FaMapMarkerAlt />, label: 'Studio', value: 'Bandra W, Mumbai', tone: 'bg-brand-orange/15 text-brand-orange' },
];

export default function Contact() {
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.push({ kind: 'error', message: 'Name, email and message are required.' });
      return;
    }
    setSubmitting(true);
    // mock submission
    await new Promise((r) => setTimeout(r, 700));
    toast.push({ kind: 'success', message: 'Message sent — we’ll reply within 24h.' });
    setForm({ name: '', email: '', subject: '', message: '' });
    setSubmitting(false);
  };

  return (
    <>
      <Helmet><title>Contact — MS Tours & Travels</title></Helmet>

      <div className="bg-gradient-to-br from-brand-orange/15 to-cream-100 border-b-2 border-navy/10">
        <div className="container-page py-14">
          <h1 className="font-fredoka text-4xl text-navy">Let’s plan something good</h1>
          <p className="text-navy/70 mt-2 max-w-xl">
            Tell us where you want to go, when, and who’s coming. We usually reply within a few hours.
          </p>
        </div>
      </div>

      <div className="container-page py-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border-2 border-navy shadow-card-soft p-6 sm:p-8 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              type="email"
              label="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <Input
            label="Subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            placeholder="Bali trip for 4 in December"
          />
          <Textarea
            label="Message"
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Tell us a bit about what you have in mind…"
            required
          />
          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? 'Sending…' : 'Send message'}
          </Button>
        </motion.form>

        <div className="space-y-4">
          {CHANNELS.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white border-2 border-navy/10"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${c.tone}`}>
                {c.icon}
              </div>
              <div>
                <div className="text-xs text-navy/50 uppercase tracking-wider">{c.label}</div>
                <div className="font-fredoka text-navy">{c.value}</div>
              </div>
            </motion.div>
          ))}

          <div className="p-5 rounded-2xl bg-cream-200 text-navy/80 text-sm border-2 border-navy/10">
            <div className="font-fredoka text-navy mb-1">Working hours</div>
            Mon–Sat, 9:00–19:00 IST. WhatsApp is monitored for in-trip travellers 24/7.
          </div>
        </div>
      </div>
    </>
  );
}
