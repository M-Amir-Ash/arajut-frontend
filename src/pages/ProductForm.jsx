import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { apiRequest } from '../config/api'
import FormField from '../components/FormField'
import ImageWithFallback from '../components/ImageWithFallback'

const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const empty = { name:'', slug:'', category:'', shortDescription:'', fullDescription:'', price:'', stock:0, readyStock:true, preorderDuration:'', featured:false, active:true, image:'' }

export default function ProductForm() {
  const { id } = useParams()
  const { products, categories, saveProduct, refresh } = useData()
  const found = products.find((product) => String(product.id) === id)
  const [form, setForm] = useState(found || empty)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(found?.image || '')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  // Product data arrives asynchronously from Laravel when an edit route is opened.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (found) { setForm(found); setPreview(found.image || '') } }, [found])
  useEffect(() => () => { if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview) }, [preview])

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const selectImage = (event) => {
    const selected = event.target.files?.[0]
    setError('')
    if (!selected) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(selected.type)) return setError('Gambar harus JPG, PNG, atau WebP.')
    if (selected.size > 1024 * 1024) return setError('Ukuran gambar maksimal 1 MB.')
    if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview)
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  const submit = async (event) => {
    event.preventDefault()
    const effectiveDescription = form.fullDescription || form.description || ''
    if (!form.name || !form.slug || !form.category || !effectiveDescription.trim() || Number(form.price) <= 0 || Number(form.stock) < 0 || (!form.readyStock && !form.preorderDuration)) return setError('Lengkapi semua kolom wajib dengan nilai yang valid.')
    setSaving(true); setError('')
    try {
      await saveProduct({ ...form, fullDescription:effectiveDescription, price:Number(form.price), stock:Number(form.stock) })
      if (file) {
        const product = await apiRequest(`/products/${form.slug}`)
        const body = new FormData()
        body.append('image', file)
        body.append('type', 'product')
        body.append('product_id', product.data.id)
        await apiRequest('/admin/uploads', { method:'POST', body })
        await refresh()
      }
      navigate('/admin/products')
    } catch (requestError) {
      setError(requestError.message || 'Produk belum dapat disimpan.')
    } finally { setSaving(false) }
  }

  return <form onSubmit={submit} className="max-w-4xl"><h1 className="font-serif text-3xl font-bold">{found ? 'Edit' : 'Tambah'} Produk</h1>{error&&<p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="mt-6 grid gap-5 rounded-2xl bg-white p-6 sm:grid-cols-2"><FormField label="Nama produk *" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value,slug:found?form.slug:slugify(e.target.value)})}/><FormField label="Slug *" value={form.slug} onChange={(e)=>set('slug',slugify(e.target.value))}/><label className="text-sm font-semibold">Kategori *<select value={form.category} onChange={(e)=>set('category',e.target.value)} className="mt-2 h-12 w-full rounded-xl border border-ink/15 px-4"><option value="">Pilih kategori</option>{categories.map((category)=><option key={category.id}>{category.name}</option>)}</select></label><FormField label="Harga *" type="number" min="1" value={form.price} onChange={(e)=>set('price',e.target.value)}/><FormField label="Stok *" type="number" min="0" value={form.stock} onChange={(e)=>set('stock',e.target.value)}/><FormField label="Deskripsi singkat" value={form.shortDescription||''} onChange={(e)=>set('shortDescription',e.target.value)}/><label className="sm:col-span-2 text-sm font-semibold">Deskripsi lengkap *<textarea value={form.fullDescription||form.description||''} onChange={(e)=>set('fullDescription',e.target.value)} className="mt-2 min-h-28 w-full rounded-xl border border-ink/15 p-4"/></label><label><input type="checkbox" checked={form.readyStock} onChange={(e)=>set('readyStock',e.target.checked)}/> Ready stock</label>{!form.readyStock&&<FormField label="Durasi pre-order *" value={form.preorderDuration} onChange={(e)=>set('preorderDuration',e.target.value)}/>}<label><input type="checkbox" checked={form.featured} onChange={(e)=>set('featured',e.target.checked)}/> Produk unggulan</label><label><input type="checkbox" checked={form.active} onChange={(e)=>set('active',e.target.checked)}/> Aktif</label><div className="sm:col-span-2"><FormField label="URL gambar utama (opsional)" value={form.image||''} onChange={(e)=>{set('image',e.target.value);setPreview(e.target.value)}}/><label className="mt-4 block text-sm font-semibold">Upload gambar ke Supabase (maks. 1 MB)<input type="file" accept="image/png,image/jpeg,image/webp" onChange={selectImage} className="mt-2 block text-sm"/></label>{preview&&<ImageWithFallback src={preview} alt="Pratinjau produk" className="mt-4 h-48 w-48 rounded-xl object-cover"/>}</div></div><button disabled={saving} className="mt-6 rounded-full bg-primary px-7 py-3 font-bold text-white disabled:opacity-50">{saving?'Menyimpan...':'Simpan produk'}</button></form>
}
