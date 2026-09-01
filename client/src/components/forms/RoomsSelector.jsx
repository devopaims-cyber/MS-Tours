import { FaBed } from 'react-icons/fa';

export default function RoomsSelector({ roomTypes = [], value = [], onChange }) {
  const updateQty = (name, qty) => {
    const next = value.filter((r) => r.roomType !== name);
    if (qty > 0) next.push({ roomType: name, quantity: qty });
    onChange(next);
  };

  const getQty = (name) => value.find((r) => r.roomType === name)?.quantity || 0;

  return (
    <div className="space-y-3">
      {roomTypes.map((rt) => (
        <div key={rt.name} className="flex items-center justify-between gap-3 p-3 rounded-2xl border-2 border-navy/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-sky/15 flex items-center justify-center text-brand-sky">
              <FaBed />
            </div>
            <div>
              <div className="font-fredoka text-navy">{rt.name}</div>
              <div className="text-xs text-navy/50">Sleeps {rt.capacity} · ₹{rt.pricePerNight}/night</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => updateQty(rt.name, Math.max(0, getQty(rt.name) - 1))}
              className="w-8 h-8 rounded-full border-2 border-navy/20 hover:border-navy"
            >
              −
            </button>
            <span className="w-8 text-center font-semibold">{getQty(rt.name)}</span>
            <button
              type="button"
              onClick={() => updateQty(rt.name, getQty(rt.name) + 1)}
              className="w-8 h-8 rounded-full border-2 border-navy/20 hover:border-navy"
            >
              +
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
