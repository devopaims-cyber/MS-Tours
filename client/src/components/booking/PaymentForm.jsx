import { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { FaCreditCard, FaLock } from 'react-icons/fa';

export default function PaymentForm({ onSubmit, submitting, total, label = 'Pay now' }) {
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });

  const formatCard = (v) => v.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  const formatExpiry = (v) => v.replace(/\D/g, '').replace(/(.{2})(.{1,2})/, '$1/$2').slice(0, 5);

  const submit = (e) => {
    e.preventDefault();
    if (card.number.replace(/\s/g, '').length < 4) return;
    onSubmit({ cardToken: card.number.replace(/\s/g, '') });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="bg-gradient-to-br from-brand-violet to-navy text-white rounded-2xl p-5 shadow-card-lift">
        <div className="flex items-center justify-between mb-6">
          <FaCreditCard size={28} />
          <span className="text-xs tracking-widest opacity-80">SECURE CHECKOUT</span>
        </div>
        <div className="font-fredoka text-lg tracking-wider mb-1">
          {card.number || '•••• •••• •••• ••••'}
        </div>
        <div className="flex justify-between text-sm">
          <span>{card.name || 'CARDHOLDER'}</span>
          <span>{card.expiry || 'MM/YY'}</span>
        </div>
      </div>

      <Input
        label="Card number"
        placeholder="4242 4242 4242 4242"
        value={card.number}
        onChange={(e) => setCard({ ...card, number: formatCard(e.target.value) })}
      />
      <Input
        label="Cardholder name"
        placeholder="Name on card"
        value={card.name}
        onChange={(e) => setCard({ ...card, name: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Expiry"
          placeholder="MM/YY"
          value={card.expiry}
          onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
        />
        <Input
          label="CVV"
          placeholder="123"
          type="password"
          maxLength={4}
          value={card.cvv}
          onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '') })}
        />
      </div>

      <Button type="submit" variant="primary" size="lg" fullWidth loading={submitting} icon={<FaLock />}>
        {label} · {total}
      </Button>
      <p className="text-xs text-navy/50 text-center">
        This is a mock payment — no real charge will be made. Use any test data.
      </p>
    </form>
  );
}
