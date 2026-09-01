import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Input from '../common/Input';
import Button from '../common/Button';
import { updateProfile } from '@/api/users';
import { useToast } from '@/hooks/useToast';

export default function ProfileForm() {
  const { user } = useSelector((s) => s.auth);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
      toast.push({ kind: 'success', message: 'Profile updated.' });
    } catch (err) {
      toast.push({ kind: 'error', message: err.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 max-w-xl"
    >
      <Input label="Full name" value={form.name} onChange={update('name')} required />
      <Input label="Email" type="email" value={form.email} onChange={update('email')} required />
      <Input label="Phone" value={form.phone} onChange={update('phone')} />
      <Button type="submit" variant="primary" loading={saving}>Save changes</Button>
    </motion.form>
  );
}
