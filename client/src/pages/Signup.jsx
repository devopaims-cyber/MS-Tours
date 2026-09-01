import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaUserPlus, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';

import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useDispatch } from 'react-redux';
import { register } from '@/store/slices/authSlice';
import { useToast } from '@/hooks/useToast';

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.push({ kind: 'error', message: 'Please complete all fields.' });
      return;
    }
    if (form.password.length < 6) {
      toast.push({ kind: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }
    setSubmitting(true);
    try {
      await dispatch(register(form)).unwrap();
      toast.push({ kind: 'success', message: 'Account created — welcome aboard!' });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.push({ kind: 'error', message: err.message || 'Signup failed' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet><title>Create account — MS Tours & Travels</title></Helmet>
      <div className="container-page py-12 min-h-[70vh] flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full mx-auto bg-white rounded-3xl border-2 border-navy shadow-card-lift p-8"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-orange text-white flex items-center justify-center mb-3 border-2 border-navy shadow-retro">
              <FaUserPlus className="text-2xl" />
            </div>
            <h1 className="font-fredoka text-3xl text-navy">Create your account</h1>
            <p className="text-navy/60 text-sm">Join MS Tours & start exploring</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full name"
              placeholder="Jane Traveller"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              leftIcon={<FaUser />}
              required
            />
            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              leftIcon={<FaEnvelope />}
              required
            />
            <Input
              type="password"
              label="Password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              leftIcon={<FaLock />}
              required
            />
            <Button type="submit" fullWidth size="lg" disabled={submitting}>
              {submitting ? 'Creating account…' : 'Create account'}
            </Button>
          </form>

          <p className="text-center text-navy/70 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-violet font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}
