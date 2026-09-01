import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FaSignInAlt, FaEnvelope, FaLock } from 'react-icons/fa';

import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useDispatch } from 'react-redux';
import { login } from '@/store/slices/authSlice';
import { useToast } from '@/hooks/useToast';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const toast = useToast();

  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.push({ kind: 'error', message: 'Please enter email and password.' });
      return;
    }
    setSubmitting(true);
    try {
      await dispatch(login(form)).unwrap();
      toast.push({ kind: 'success', message: 'Welcome back!' });
      const redirectTo = location.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.push({ kind: 'error', message: err.message || 'Login failed' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet><title>Sign in — MS Tours & Travels</title></Helmet>
      <div className="container-page py-12 min-h-[70vh] flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full mx-auto bg-white rounded-3xl border-2 border-navy shadow-card-lift p-8"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-violet text-white flex items-center justify-center mb-3 border-2 border-navy shadow-retro">
              <FaSignInAlt className="text-2xl" />
            </div>
            <h1 className="font-fredoka text-3xl text-navy">Welcome back</h1>
            <p className="text-navy/60 text-sm">Sign in to manage your bookings</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              leftIcon={<FaLock />}
              required
            />
            <Button type="submit" fullWidth size="lg" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <p className="text-center text-navy/70 text-sm mt-6">
            New here?{' '}
            <Link to="/signup" className="text-brand-violet font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}
