import {useEffect,useRef,useState} from 'react'
import {useNavigate,useParams} from 'react-router-dom'
import {apiRequest} from '../config/api'
import FormField from '../components/FormField'
import ImageWithFallback from '../components/ImageWithFallback'
import {useData} from '../context/DataContext'

const slugify=value=>value.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
const empty={name:'',slug:'',category:'',shortDescription:'',fullDescription:'',price:'',stock:0,readyStock:true,preorderDuration:'',featured:false,active:true,image:'',images:[]}
const allowedTypes=['image/jpeg','image/png','image/webp']

export default function ProductForm(){
  const{id}=useParams()
  const{products,categories,saveProduct,refresh}=useData()
  const found=products.find(product=>String(product.id)===id)
  const[form,setForm]=useState(found||empty)
  const[files,setFiles]=useState([])
  const[error,setError]=useState('')
  const[saving,setSaving]=useState(false)
  const inputRef=useRef(null)
  const navigate=useNavigate()

  // Product data arrives asynchronously when an edit route is opened directly.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(()=>{if(found)setForm(found)},[found])
  const set=(key,value)=>setForm(current=>({...current,[key]:value}))
  const addFiles=incoming=>{
    setError('')
    const accepted=[]
    for(const file of incoming){
      if(!allowedTypes.includes(file.type)){setError('Semua gambar harus JPG, PNG, atau WebP.');continue}
      if(file.size>1024*1024){setError(`Gambar ${file.name||'clipboard'} melebihi batas 1 MB.`);continue}
      accepted.push({file,preview:URL.createObjectURL(file),key:`${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`})
    }
    setFiles(current=>[...current,...accepted])
  }
  const chooseImages=event=>{addFiles([...event.target.files]);event.target.value=''}
  const pasteImages=event=>{
    const pasted=[...event.clipboardData.items].filter(item=>item.kind==='file'&&item.type.startsWith('image/')).map(item=>item.getAsFile()).filter(Boolean)
    if(pasted.length){event.preventDefault();addFiles(pasted)}
  }
  const removeFile=key=>setFiles(current=>{const target=current.find(item=>item.key===key);if(target)URL.revokeObjectURL(target.preview);return current.filter(item=>item.key!==key)})

  const submit=async event=>{
    event.preventDefault()
    const effectiveDescription=form.fullDescription||form.description||''
    if(!form.name||!form.slug||!form.category||!effectiveDescription.trim()||Number(form.price)<=0||Number(form.stock)<0||(!form.readyStock&&!form.preorderDuration))return setError('Lengkapi semua kolom wajib dengan nilai yang valid.')
    setSaving(true);setError('')
    try{
      const saved=await saveProduct({...form,fullDescription:effectiveDescription,price:Number(form.price),stock:Number(form.stock)})
      for(const item of files){
        const body=new FormData()
        body.append('image',item.file)
        body.append('type','product')
        body.append('product_id',saved.id)
        await apiRequest('/admin/uploads',{method:'POST',body})
      }
      await refresh()
      navigate('/admin/products')
    }catch(requestError){
      const uploadMessages={storage_not_configured:'Konfigurasi Supabase Storage di Railway belum lengkap.',storage_curl_error_6:'Railway tidak dapat menemukan host Supabase. Periksa SUPABASE_URL.',storage_curl_error_28:'Koneksi Railway ke Supabase kehabisan waktu.',storage_rejected_401:'Supabase menolak secret key. Perbarui SUPABASE_SECRET_KEY di Railway.',storage_rejected_403:'Secret key tidak memiliki izin upload ke bucket.',storage_rejected_404:'Bucket product-images tidak ditemukan.'}
      setError(uploadMessages[requestError.code]||requestError.message||'Produk belum dapat disimpan.')
    }finally{setSaving(false)}
  }

  const existingImages=[...new Set([form.image,...(form.images||[])].filter(Boolean))]
  return <form onSubmit={submit} onPaste={pasteImages} className="max-w-4xl"><h1 className="font-serif text-3xl font-bold">{found?'Edit':'Tambah'} Produk</h1>{error&&<p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="mt-6 grid gap-5 rounded-2xl bg-white p-6 sm:grid-cols-2"><FormField label="Nama produk *" value={form.name} onChange={event=>setForm({...form,name:event.target.value,slug:found?form.slug:slugify(event.target.value)})}/><FormField label="Slug *" value={form.slug} onChange={event=>set('slug',slugify(event.target.value))}/><label className="text-sm font-semibold">Kategori *<select value={form.category} onChange={event=>set('category',event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-ink/15 px-4"><option value="">Pilih kategori</option>{categories.map(category=><option key={category.id}>{category.name}</option>)}</select></label><FormField label="Harga *" type="number" min="1" value={form.price} onChange={event=>set('price',event.target.value)}/><FormField label="Stok *" type="number" min="0" value={form.stock} onChange={event=>set('stock',event.target.value)}/><FormField label="Deskripsi singkat" value={form.shortDescription||''} onChange={event=>set('shortDescription',event.target.value)}/><label className="sm:col-span-2 text-sm font-semibold">Deskripsi lengkap *<textarea value={form.fullDescription||form.description||''} onChange={event=>set('fullDescription',event.target.value)} className="mt-2 min-h-28 w-full rounded-xl border border-ink/15 p-4"/></label><label><input type="checkbox" checked={form.readyStock} onChange={event=>set('readyStock',event.target.checked)}/> Ready stock</label>{!form.readyStock&&<FormField label="Durasi pre-order *" value={form.preorderDuration} onChange={event=>set('preorderDuration',event.target.value)}/>}<label><input type="checkbox" checked={form.featured} onChange={event=>set('featured',event.target.checked)}/> Produk unggulan</label><label><input type="checkbox" checked={form.active} onChange={event=>set('active',event.target.checked)}/> Aktif</label><section className="sm:col-span-2"><h2 className="font-bold">Galeri produk</h2><p className="mt-1 text-sm text-ink/55">Pilih beberapa gambar atau paste gambar dengan Ctrl+V. JPG, PNG, WebP; maksimal 1 MB per gambar.</p><input ref={inputRef} type="file" multiple accept="image/png,image/jpeg,image/webp" onChange={chooseImages} className="sr-only"/><button type="button" onClick={()=>inputRef.current?.click()} className="mt-4 rounded-full bg-primary px-5 py-2.5 font-bold text-white hover:bg-[#d97985]">+ Upload gambar</button><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{existingImages.map((src,index)=><div key={src} className="relative"><ImageWithFallback src={src} alt={`Gambar tersimpan ${index+1}`} className="aspect-square w-full rounded-xl object-cover"/><span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-1 text-xs font-bold">Tersimpan</span></div>)}{files.map((item,index)=><div key={item.key} className="relative"><img src={item.preview} alt={`Gambar baru ${index+1}`} className="aspect-square w-full rounded-xl object-cover"/><button type="button" onClick={()=>removeFile(item.key)} className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-ink text-white" aria-label="Hapus gambar baru">×</button><span className="absolute bottom-2 left-2 rounded-full bg-primary px-2 py-1 text-xs font-bold text-white">Baru</span></div>)}</div></section></div><button disabled={saving} className="mt-6 rounded-full bg-primary px-7 py-3 font-bold text-white disabled:opacity-50">{saving?`Mengunggah ${files.length} gambar...`:'Simpan produk'}</button></form>
}
