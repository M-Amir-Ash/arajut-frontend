export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/40"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </svg>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring h-12 w-full rounded-xl border border-ink/10 bg-white pl-12 pr-4 text-sm outline-none placeholder:text-ink/35 hover:border-primary/50"
        placeholder="Nama produk, misalnya cardigan..."
        aria-label="Cari nama produk"
      />
    </div>
  )
}
