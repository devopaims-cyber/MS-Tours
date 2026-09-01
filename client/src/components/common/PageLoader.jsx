export default function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-4 border-navy/10" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-orange animate-spin-slow" />
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-brand-green animate-spin-slow [animation-direction:reverse]" />
        </div>
        <p className="font-fredoka text-navy text-lg">Packing your bags…</p>
      </div>
    </div>
  );
}
