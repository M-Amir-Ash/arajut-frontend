import {useEffect,useRef,useState} from 'react'
import {apiRequest} from '../config/api'
import ImageWithFallback from '../components/ImageWithFallback'
import {useData} from '../context/DataContext'

const allowedTypes=['image/jpeg','image/png','image/webp']

export default function SiteSettings(){
  const{settings,saveSettings,refresh}=useData()
  const[f,setF]=useState(settings)
  const[file,setFile]=useState(null)
  const[preview,setPreview]=useState('')
  const[message,setMessage]=useState('')
  const[error,setError]=useState('')
  const[saving,setSaving]=useState(false)
  const inputRef=useRef(null)

  // Settings arrive asynchronously from Laravel when this route opens directly.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(()=>{setF(settings);setPreview(settings.heroImage||'')},[settings])
  useEffect(()=>{const warn=event=>{if(JSON.stringify(f)!==JSON.stringify(settings)||file){event.preventDefault();event.returnValue=''}};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn)},[f,settings,file])

  const selectImage=selected=>{
    setError('');setMessage('')
    if(!selected)return
    if(!allowedTypes.includes(selected.type))return setError('Gambar hero harus JPG, PNG, atau WebP.')
    if(selected.size>1024*1024)return setError('Ukuran gambar hero maksimal 1 MB.')
    if(preview.startsWith('blob:'))URL.revokeObjectURL(preview)
    setFile(selected);setPreview(URL.createObjectURL(selected))
  }
  const paste=event=>{const image=[...event.clipboardData.items].find(item=>item.kind==='file'&&item.type.startsWith('image/'))?.getAsFile();if(image){event.preventDefault();selectImage(image)}}
  const submit=async event=>{
    event.preventDefault();setSaving(true);setError('');setMessage('')
    try{
      await saveSettings(f)
      if(file){const body=new FormData();body.append('image',file);body.append('type','hero');await apiRequest('/admin/uploads',{method:'POST',body})}
      setFile(null);await refresh();setMessage('Konten website berhasil disimpan.')
    }catch(requestError){setError(requestError.message||'Konten belum dapat disimpan.')}finally{setSaving(false)}
  }
  const fields=[['Nama brand','brandName'],['Tagline','tagline'],['Badge hero','heroBadge'],['Judul hero','heroHeading'],['Teks sorotan hero','heroHighlight'],['Deskripsi hero','heroDescription'],['Judul promosi','promoTitle'],['Deskripsi promosi','promoDescription'],['Instagram','instagram'],['WhatsApp','whatsapp'],['Email kontak','email'],['Teks footer','footerText']]

  return <form onSubmit={submit} onPaste={paste} className="max-w-3xl"><h1 className="font-serif text-3xl font-bold">Konten Website</h1><p className="mt-2 text-sm text-ink/55">Perubahan tersimpan akan langsung muncul di storefront.</p>{message&&<p className="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-700">{message}</p>}{error&&<p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="mt-6 grid gap-5 rounded-2xl bg-white p-6 sm:grid-cols-2">{fields.map(([label,key])=><label key={key} className={`text-sm font-semibold ${key.includes('Description')||key==='footerText'?'sm:col-span-2':''}`}>{label}<input value={f[key]||''} onChange={event=>{setMessage('');setF({...f,[key]:event.target.value})}} className="mt-2 h-12 w-full rounded-xl border border-ink/15 px-4"/></label>)}<section className="sm:col-span-2"><h2 className="font-bold">Gambar hero</h2><p className="mt-1 text-sm text-ink/55">Upload atau paste gambar dengan Ctrl+V. Maksimal 1 MB.</p><input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={event=>{selectImage(event.target.files?.[0]);event.target.value=''}} className="sr-only"/><button type="button" onClick={()=>inputRef.current?.click()} className="mt-3 rounded-full bg-primary px-5 py-2.5 font-bold text-white">{preview?'Ganti gambar hero':'Upload gambar hero'}</button>{preview&&<div className="relative mt-4"><ImageWithFallback src={preview} alt="Pratinjau hero" className="h-64 w-full rounded-xl object-cover"/>{file&&<span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">Belum disimpan</span>}</div>}</section></div><button disabled={saving} className="mt-6 rounded-full bg-primary px-6 py-3 font-bold text-white disabled:opacity-50">{saving?'Menyimpan...':'Simpan konten'}</button></form>
}
