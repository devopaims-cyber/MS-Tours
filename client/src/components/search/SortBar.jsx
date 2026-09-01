import Select from '../common/Select';

export default function SortBar({ value, onChange, total, options }) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3 bg-white rounded-2xl border-2 border-navy/10 px-4 py-3">
      <div className="text-sm text-navy/70">
        <span className="font-semibold text-navy">{total}</span> results
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-navy/60">Sort by</span>
        <div className="w-48">
          <Select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            options={options || [
              { value: '', label: 'Recommended' },
              { value: 'price-asc', label: 'Price: Low → High' },
              { value: 'price-desc', label: 'Price: High → Low' },
              { value: 'rating', label: 'Rating' },
              { value: 'duration', label: 'Duration' },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
