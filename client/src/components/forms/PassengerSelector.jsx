import { FaUser, FaChild, FaBaby } from 'react-icons/fa';

function Counter({ label, sub, value, onChange, min = 0, max = 10, icon }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-brand-violet/15 flex items-center justify-center text-brand-violet">
          {icon}
        </div>
        <div>
          <div className="font-fredoka text-navy">{label}</div>
          <div className="text-xs text-navy/50">{sub}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-8 h-8 rounded-full border-2 border-navy/20 hover:border-navy"
        >
          −
        </button>
        <span className="w-8 text-center font-semibold text-navy">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-8 h-8 rounded-full border-2 border-navy/20 hover:border-navy"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function PassengerSelector({ value, onChange }) {
  const v = value || { adults: 1, children: 0, infants: 0 };
  const set = (k) => (n) => onChange({ ...v, [k]: n });
  return (
    <div className="divide-y divide-navy/10">
      <Counter
        label="Adults"
        sub="12+ years"
        value={v.adults}
        onChange={set('adults')}
        min={1}
        max={9}
        icon={<FaUser />}
      />
      <Counter
        label="Children"
        sub="2–11 years"
        value={v.children}
        onChange={set('children')}
        max={8}
        icon={<FaChild />}
      />
      <Counter
        label="Infants"
        sub="Under 2"
        value={v.infants}
        onChange={set('infants')}
        max={4}
        icon={<FaBaby />}
      />
    </div>
  );
}
