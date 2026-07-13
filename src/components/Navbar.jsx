import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import arajutLogo from '../../1ecdc0d8-f4a4-4e5e-98a7-55aab2264142.png'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
export default function Navbar() {
  const { count } = useCart(); const { user } = useAuth(); const {settings}=useData(); const [query,setQuery]=useState(''); const [open,setOpen]=useState(false); const navigate=useNavigate()
  const submit=e=>{e.preventDefault(); navigate(`/products${query ? `?search=${encodeURIComponent(query)}`:''}`); setOpen(false)}
  const navClass=({isActive})=>`focus-ring rounded-lg px-3 py-2 text-sm font-semibold ${isActive?'text-primary':'text-ink hover:text-primary'}`
  return <header className="sticky top-0 z-50 border-b border-blush/70 bg-warm/95 backdrop-blur"><div className="container-page flex h-18 items-center gap-4">
    <Link to="/" className="focus-ring flex shrink-0 items-center gap-2 rounded-xl" aria-label={`${settings.brandName} - Beranda`}><img src={settings.logoImage||arajutLogo} alt="" className="h-12 w-12 rounded-full object-cover shadow-sm"/><span><span className="block font-serif text-2xl font-bold leading-none text-primary">{settings.brandName}</span><span className="mt-1 hidden text-[9px] tracking-[.16em] text-ink sm:block">{settings.tagline?.toUpperCase()}</span></span></Link>
    <form onSubmit={submit} className="mx-auto hidden max-w-xl flex-1 md:flex"><label className="sr-only" htmlFor="nav-search">Cari produk</label><input id="nav-search" value={query} onChange={e=>setQuery(e.target.value)} className="focus-ring w-full rounded-l-full border border-blush bg-white px-5 py-2.5 text-sm outline-none" placeholder="Cari karya handmade..."/><button className="focus-ring rounded-r-full bg-primary px-5 text-white hover:bg-[#d97985]" aria-label="Cari">⌕</button></form>
    <nav className="hidden items-center lg:flex"><NavLink to="/" className={navClass}>Beranda</NavLink><NavLink to="/products" className={navClass}>Belanja</NavLink></nav>
    <Link to="/cart" className="focus-ring relative grid h-11 w-11 shrink-0 place-items-center rounded-full text-primary hover:bg-blush hover:text-[#d97985]" aria-label={`Keranjang, ${count} item`}>
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M6.7 8.5h10.6l.8 11H5.9l.8-11Z" />
        <path d="M9 9V6.8a3 3 0 0 1 6 0V9" />
        <path d="M9.5 13.5c.7.7 1.5 1 2.5 1s1.8-.3 2.5-1" />
      </svg>
      {count>0&&<span className="absolute -right-0.5 -top-0.5 min-w-5 rounded-full border-2 border-warm bg-primary px-1 text-center text-[10px] font-bold leading-4 text-white">{count}</span>}
    </Link>
    <Link to={user?'/account':'/login'} className="hidden rounded-full bg-blush px-3 py-2 text-sm font-bold sm:block">{user?`◯ ${user.name.split(' ')[0]}`:'Masuk'}</Link>
    {!user&&<Link to="/signup" className="hidden rounded-full bg-primary px-4 py-2 text-sm font-bold text-white sm:block">Daftar</Link>}
    <button onClick={()=>setOpen(!open)} className="focus-ring rounded-lg p-2 text-2xl lg:hidden" aria-label="Buka menu">☰</button>
  </div>{open&&<div className="container-page border-t border-blush py-3 lg:hidden"><form onSubmit={submit} className="mb-2 flex md:hidden"><input value={query} onChange={e=>setQuery(e.target.value)} className="w-full rounded-l-full border border-blush bg-white px-4 py-2" placeholder="Cari produk..."/><button className="rounded-r-full bg-primary px-4 text-white">Cari</button></form><NavLink onClick={()=>setOpen(false)} to="/" className={navClass}>Beranda</NavLink><NavLink onClick={()=>setOpen(false)} to="/products" className={navClass}>Belanja</NavLink></div>}</header>
}
