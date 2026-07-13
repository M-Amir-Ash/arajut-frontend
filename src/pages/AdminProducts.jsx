import {useState} from 'react'
import {Link} from 'react-router-dom'
import ImageWithFallback from '../components/ImageWithFallback'
import {useData} from '../context/DataContext'
import {formatRupiah} from '../utils/format'

export default function AdminProducts(){
  const{products,deleteProduct,loading,error,refresh}=useData()
  const[q,setQ]=useState('')
  const[cat,setCat]=useState('all')
  const[actionError,setActionError]=useState('')
  const[deleting,setDeleting]=useState(null)
  const cats=[...new Set(products.map(p=>p.category))]
  const list=products.filter(p=>p.name.toLowerCase().includes(q.toLowerCase())&&(cat==='all'||p.category===cat))

  const remove=async product=>{
    if(!confirm(`Hapus ${product.name}?`))return
    setDeleting(product.id)
    setActionError('')
    try{await deleteProduct(product.id)}catch(err){setActionError(err.message)}finally{setDeleting(null)}
  }

  return <>
    <div className="flex flex-wrap justify-between gap-4"><div><h1 className="font-serif text-3xl font-bold">Produk</h1><p className="text-sm text-ink/55">Kelola produk yang tampil di storefront.</p></div><Link to="/admin/products/new" className="rounded-full bg-primary px-5 py-3 font-bold text-white">+ Tambah produk</Link></div>
    {(error||actionError)&&<div className="mt-5 flex items-center justify-between gap-4 rounded-xl bg-red-50 p-4 text-sm text-red-700"><span>{actionError||error}</span><button onClick={refresh} className="font-bold underline">Coba lagi</button></div>}
    <div className="mt-6 flex gap-3"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari produk..." className="h-11 flex-1 rounded-xl border border-ink/10 px-4"/><select value={cat} onChange={e=>setCat(e.target.value)} className="rounded-xl border border-ink/10 px-4"><option value="all">Semua kategori</option>{cats.map(x=><option key={x}>{x}</option>)}</select></div>
    <div className="mt-5 overflow-x-auto rounded-2xl bg-white p-3"><table className="w-full min-w-[850px] text-left text-sm"><thead><tr>{['Produk','Harga','Stok','Status','Unggulan','Aktif','Aksi'].map(x=><th key={x} className="border-b border-blush p-3">{x}</th>)}</tr></thead><tbody>{list.map(p=><tr key={p.id} className="border-b border-ink/5"><td className="p-3"><div className="flex items-center gap-3"><ImageWithFallback src={p.image} alt="" className="h-12 w-12 rounded-lg object-cover"/><div><b>{p.name}</b><p className="text-xs text-ink/50">{p.category}</p></div></div></td><td>{formatRupiah(p.price)}</td><td>{p.stock}</td><td>{p.readyStock?'Ready':'Pre-order'}</td><td>{p.featured?'Ya':'—'}</td><td>{p.active!==false?'Ya':'Tidak'}</td><td><div className="flex gap-3"><Link className="font-bold text-primary" to={`/admin/products/${p.id}/edit`}>Edit</Link><button disabled={deleting===p.id} onClick={()=>remove(p)} className="font-bold text-red-600 disabled:opacity-50">{deleting===p.id?'Menghapus...':'Hapus'}</button></div></td></tr>)}</tbody></table>{loading&&products.length===0&&<p className="p-8 text-center text-ink/55">Memuat produk...</p>}{!loading&&!error&&list.length===0&&<p className="p-8 text-center text-ink/55">Tidak ada produk yang sesuai.</p>}</div>
  </>
}
