import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSlidersH, FaTimes } from 'react-icons/fa';
import Input from '../common/Input';
import Select from '../common/Select';
import Checkbox from '../common/Checkbox';
import Button from '../common/Button';

export default function SearchFilters({ filters, onChange, options = {} }) {
  const [open, setOpen] = useState(true);

  const update = (patch) => onChange({ ...filters, ...patch });
  const toggleArray = (key, value) => {
    const list = filters[key] || [];
    const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
    update({ [key]: next });
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-navy shadow-card-soft overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-3 bg-cream-200 border-b-2 border-navy/10"
      >
        <span className="font-fredoka text-navy flex items-center gap-2">
          <FaSlidersH /> Filters
        </span>
        <span className="text-navy/50 text-sm">{open ? '−' : '+'}</span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0 }}
        className="overflow-hidden"
      >
        <div className="p-5 space-y-5">
          {options.price && (
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5 font-fredoka">Max price (₹)</label>
              <Input
                type="number"
                placeholder="Any"
                value={filters.maxPrice || ''}
                onChange={(e) => update({ maxPrice: e.target.value })}
              />
            </div>
          )}

          {options.categories?.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-navy mb-2 font-fredoka">Category</label>
              <div className="flex flex-wrap gap-2">
                {options.categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => toggleArray('categories', c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition ${
                      filters.categories?.includes(c)
                        ? 'bg-brand-violet text-white border-navy'
                        : 'bg-white text-navy border-navy/20 hover:border-navy/50'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {options.difficulty?.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-navy mb-2 font-fredoka">Difficulty</label>
              <div className="flex flex-wrap gap-2">
                {options.difficulty.map((d) => (
                  <button
                    key={d}
                    onClick={() => toggleArray('difficulty', d)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition ${
                      filters.difficulty?.includes(d)
                        ? 'bg-brand-green text-white border-navy'
                        : 'bg-white text-navy border-navy/20 hover:border-navy/50'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          {options.minRating && (
            <div>
              <Select
                label="Min rating"
                value={filters.minRating || ''}
                onChange={(e) => update({ minRating: e.target.value })}
                options={[
                  { value: '', label: 'Any' },
                  { value: '4', label: '4+ stars' },
                  { value: '4.5', label: '4.5+ stars' },
                ]}
              />
            </div>
          )}

          {(Object.keys(filters).some((k) => {
            const v = filters[k];
            if (Array.isArray(v)) return v.length > 0;
            return v != null && v !== '';
          })) && (
            <Button
              variant="ghost"
              size="sm"
              icon={<FaTimes />}
              onClick={() => onChange({})}
            >
              Clear filters
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
