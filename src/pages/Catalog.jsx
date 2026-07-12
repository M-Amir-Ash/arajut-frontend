import { useMemo, useState } from 'react'
/* eslint-disable react-hooks/exhaustive-deps */
import { useSearchParams } from 'react-router-dom'
import { useData } from '../context/DataContext'
import ProductGrid from '../components/ProductGrid'
import SearchBar from '../components/SearchBar'

const selectOptions = {
  stock: [
    ['all', 'Semua status'],
    ['ready', 'Ready stock'],
    ['preorder', 'Pre-order'],
  ],
  sort: [
    ['default', 'Paling relevan'],
    ['low', 'Harga terendah'],
    ['high', 'Harga tertinggi'],
  ],
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="block text-xs font-semibold text-ink/60">
      <span className="mb-2 block">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring h-12 w-full rounded-xl border border-ink/10 bg-white px-4 text-sm font-semibold text-ink outline-none hover:border-primary/50"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>{optionLabel}</option>
        ))}
      </select>
    </label>
  )
}

export default function Catalog() {
  const { products: storedProducts, loading, error, refresh } = useData()
  const products = storedProducts.filter((product) => product.active !== false)
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState(params.get('search') || '')
  const [category, setCategory] = useState(params.get('category') || 'all')
  const [stock, setStock] = useState('all')
  const [sort, setSort] = useState('default')
  const categories = [...new Set(products.map((product) => product.category))]

  const shown = useMemo(() => products
    .filter((product) => product.name.toLowerCase().includes(search.toLowerCase().trim()))
    .filter((product) => category === 'all' || product.category === category)
    .filter((product) => stock === 'all' || (stock === 'ready' ? product.readyStock : !product.readyStock))
    .sort((a, b) => sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : a.id - b.id),
  [search, category, stock, sort])

  const changeSearch = (value) => {
    setSearch(value)
    setParams((oldParams) => {
      const next = new URLSearchParams(oldParams)
      value ? next.set('search', value) : next.delete('search')
      return next
    }, { replace: true })
  }

  const resetFilters = () => {
    setSearch('')
    setCategory('all')
    setStock('all')
    setSort('default')
    setParams({}, { replace: true })
  }

  const hasFilters = search || category !== 'all' || stock !== 'all' || sort !== 'default'
  const categoryOptions = [['all', 'Semua kategori'], ...categories.map((item) => [item, item])]

  if (loading) return <div className="container-page py-20 text-center"><div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blush border-t-primary"/><p className="mt-4 text-ink/60">Memuat koleksi Arajut...</p></div>
  if (error) return <div className="container-page py-16 text-center"><h1 className="text-2xl font-bold">Koleksi belum dapat dimuat</h1><p className="mt-2 text-ink/60">{error}</p><button onClick={refresh} className="mt-5 rounded-full bg-primary px-6 py-3 font-bold text-white">Coba lagi</button></div>
  return (
    <div className="container-page py-10 md:py-14">
      <div className="max-w-2xl">
        <p className="font-bold uppercase tracking-widest text-primary">Koleksi Arajut</p>
        <h1 className="mt-2 font-serif text-4xl font-bold">Temukan rajutan favoritmu</h1>
        <p className="mt-3 text-ink/65">Setiap produk dibuat dengan teliti dalam jumlah terbatas.</p>
      </div>

      <section aria-label="Filter produk" className="mt-8 rounded-2xl border border-ink/5 bg-white p-4 shadow-[0_8px_30px_rgba(56,47,50,0.06)] md:p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <label className="block text-xs font-semibold text-ink/60 sm:col-span-2 lg:col-span-1">
            <span className="mb-2 block">Cari produk</span>
            <SearchBar value={search} onChange={changeSearch} />
          </label>
          <FilterSelect label="Kategori" value={category} onChange={setCategory} options={categoryOptions} />
          <FilterSelect label="Ketersediaan" value={stock} onChange={setStock} options={selectOptions.stock} />
          <FilterSelect label="Urutkan" value={sort} onChange={setSort} options={selectOptions.sort} />
        </div>
      </section>

      <div className="my-6 flex items-center justify-between gap-4 text-sm text-ink/60">
        <p><strong className="text-ink">{shown.length}</strong> produk ditemukan</p>
        {hasFilters && <button onClick={resetFilters} className="focus-ring rounded-lg font-semibold text-primary hover:text-ink">Hapus semua filter</button>}
      </div>
      <ProductGrid products={shown} />
    </div>
  )
}
