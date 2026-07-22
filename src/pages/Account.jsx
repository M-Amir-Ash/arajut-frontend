import {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import FormField from '../components/FormField'
import {apiRequest} from '../config/api'
import {useAuth} from '../context/AuthContext'

const blankAddress = {
  label: 'Rumah', recipient_name: '', phone: '', province: '', city: '', district: '',
  postal_code: '', address_line: '', notes: '', latitude: null, longitude: null, is_default: true,
}

const tabs = [
  {id: 'profile', label: 'Biodata Diri'},
  {id: 'addresses', label: 'Daftar Alamat'},
  {id: 'payments', label: 'Pembayaran'},
  {id: 'security', label: 'Keamanan'},
]

export default function Account() {
  const {user, updateProfile, logout} = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [profile, setProfile] = useState(user)
  const [addresses, setAddresses] = useState([])
  const [address, setAddress] = useState({...blankAddress, recipient_name: user.name, phone: user.phone || ''})
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [addressError, setAddressError] = useState('')
  const [locating, setLocating] = useState(false)
  const navigate = useNavigate()

  const userCode = `ARJ-${String(user.id).padStart(6, '0')}`
  const initials = user.name.split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]).join('').toUpperCase()

  const loadAddresses = async () => {
    try {
      const response = await apiRequest('/addresses')
      setAddresses(response.data || [])
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  useEffect(() => {
    let active = true
    apiRequest('/addresses')
      .then(response => { if (active) setAddresses(response.data || []) })
      .catch(requestError => { if (active) setError(requestError.message) })
    return () => { active = false }
  }, [])

  const clearNotice = () => { setMessage(''); setError('') }

  const saveProfile = async event => {
    event.preventDefault()
    clearNotice()
    try {
      await updateProfile(profile)
      setMessage('Biodata berhasil diperbarui.')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const saveAddress = async event => {
    event.preventDefault()
    clearNotice()
    setAddressError('')
    const requiredFields = [
      ['label', 'label alamat'], ['recipient_name', 'nama penerima'], ['phone', 'nomor telepon'],
      ['postal_code', 'kode pos'], ['province', 'provinsi'], ['city', 'kota/kabupaten'],
      ['district', 'kecamatan'], ['address_line', 'alamat lengkap'],
    ]
    const missing = requiredFields.filter(([key]) => !String(address[key] || '').trim()).map(([, label]) => label)
    if (missing.length) {
      setAddressError(`Lengkapi ${missing.join(', ')} sebelum menyimpan alamat.`)
      return
    }
    try {
      await apiRequest(`/addresses${address.id ? `/${address.id}` : ''}`, {
        method: address.id ? 'PUT' : 'POST',
        body: JSON.stringify(address),
      })
      setAddress({...blankAddress, recipient_name: user.name, phone: user.phone || ''})
      await loadAddresses()
      setMessage('Alamat pengiriman berhasil disimpan.')
    } catch (requestError) {
      const validationMessages = requestError.errors ? Object.values(requestError.errors).flat().join(' ') : ''
      setAddressError(validationMessages || requestError.message)
    }
  }

  const detectLocation = () => {
    clearNotice()
    setAddressError('')
    if (!navigator.geolocation) {
      setError('Browser tidak mendukung deteksi lokasi.')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(async position => {
      const latitude = position.coords.latitude
      const longitude = position.coords.longitude
      setAddress(current => ({...current, latitude, longitude}))
      try {
        const response = await apiRequest(`/geocode/reverse?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}`)
        const detected = response.data
        setAddress(current => ({
          ...current,
          latitude,
          longitude,
          address_line: detected.address_line || current.address_line,
          province: detected.province || current.province,
          city: detected.city || current.city,
          district: detected.district || current.district,
          postal_code: detected.postal_code || current.postal_code,
        }))
        setMessage('Lokasi berhasil dideteksi dan detail alamat telah diisi otomatis. Periksa kembali sebelum menyimpan.')
      } catch (requestError) {
        setError(`${requestError.message} Koordinat sudah tersimpan; lengkapi alamat secara manual.`)
      } finally {
        setLocating(false)
      }
    }, () => {
      setLocating(false)
      setError('Lokasi tidak dapat dideteksi. Izinkan akses lokasi di browser.')
    }, {enableHighAccuracy: true, timeout: 15000})
  }

  const editAddress = selected => {
    setAddress(selected)
    setActiveTab('addresses')
    clearNotice()
    setAddressError('')
    window.scrollTo({top: 0, behavior: 'smooth'})
  }

  const removeAddress = async id => {
    if (!window.confirm('Hapus alamat ini?')) return
    clearNotice()
    try {
      const response = await apiRequest(`/addresses/${id}`, {method: 'DELETE'})
      setAddresses(response.data || [])
      setMessage('Alamat berhasil dihapus.')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const signOut = async () => {
    await logout()
    navigate('/')
  }

  return <main className="container-page py-10 sm:py-14">
    <div className="mb-7">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Akun Arajut</p>
      <h1 className="mt-2 font-serif text-4xl font-bold sm:text-5xl">Profil saya</h1>
      <p className="mt-2 text-ink/55">Kelola data diri, alamat pengiriman, dan aktivitas belanjamu.</p>
    </div>

    <section className="overflow-hidden rounded-[28px] border border-blush bg-white shadow-[0_18px_50px_rgba(56,47,50,0.07)]">
      <nav className="flex overflow-x-auto border-b border-blush px-3 sm:px-6" aria-label="Menu profil">
        {tabs.map(tab => <button key={tab.id} type="button" onClick={() => {setActiveTab(tab.id); clearNotice()}} className={`relative shrink-0 px-4 py-5 text-sm font-bold sm:px-6 ${activeTab === tab.id ? 'text-primary' : 'text-ink/55 hover:text-ink'}`}>
          {tab.label}
          {activeTab === tab.id && <span className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-primary" />}
        </button>)}
      </nav>

      <div className="p-4 sm:p-7 lg:p-9">
        {(message || error) && <p className={`mb-6 rounded-2xl px-4 py-3 text-sm ${error ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>{error || message}</p>}

        {activeTab === 'profile' && <div className="grid gap-7 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-3xl bg-cream p-6 text-center">
            <div className="mx-auto grid aspect-square w-full max-w-52 place-items-center rounded-[32px] bg-gradient-to-br from-blush via-[#f5b8c0] to-sky shadow-inner">
              <span className="font-serif text-6xl font-bold text-white drop-shadow-sm">{initials || 'A'}</span>
            </div>
            <h2 className="mt-5 text-xl font-extrabold">{user.name}</h2>
            <p className="mt-1 text-sm font-semibold text-primary">{userCode}</p>
            <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-left text-xs leading-5 text-ink/55">Identitas akun digunakan untuk pesanan dan layanan pelanggan Arajut.</p>
          </aside>

          <form onSubmit={saveProfile} className="rounded-3xl border border-blush p-5 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><h2 className="text-2xl font-extrabold">Ubah Biodata Diri</h2><p className="mt-1 text-sm text-ink/50">Pastikan data sesuai dengan penerima pesanan.</p></div>
              <span className="rounded-full bg-blush px-3 py-1.5 text-xs font-bold text-primary">Pelanggan</span>
            </div>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2"><FormField label="Nama lengkap" required value={profile.name || ''} onChange={event => setProfile({...profile, name: event.target.value})} /></div>
              <FormField label="Email" type="email" required value={profile.email || ''} onChange={event => setProfile({...profile, email: event.target.value})} />
              <FormField label="Nomor telepon" value={profile.phone || ''} onChange={event => setProfile({...profile, phone: event.target.value})} />
            </div>
            <button className="mt-7 rounded-full bg-primary px-7 py-3 font-bold text-white hover:bg-[#d97985]">Simpan biodata</button>
          </form>
        </div>}

        {activeTab === 'addresses' && <div className="grid gap-7 xl:grid-cols-[0.9fr_1.1fr]">
          <form onSubmit={saveAddress} noValidate className="rounded-3xl border border-blush p-5 sm:p-7">
            <h2 className="text-2xl font-extrabold">{address.id ? 'Edit alamat' : 'Tambah alamat'}</h2>
            <p className="mt-1 text-sm text-ink/50">Alamat lengkap membantu pengiriman lebih akurat.</p>
            {addressError && <p role="alert" className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700">{addressError}</p>}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <FormField label="Label alamat" required value={address.label} onChange={event => setAddress({...address, label: event.target.value})} />
              <FormField label="Nama penerima" required value={address.recipient_name} onChange={event => setAddress({...address, recipient_name: event.target.value})} />
              <FormField label="Nomor telepon" required value={address.phone} onChange={event => setAddress({...address, phone: event.target.value})} />
              <FormField label="Kode pos" required value={address.postal_code} onChange={event => setAddress({...address, postal_code: event.target.value})} />
              <FormField label="Provinsi" required value={address.province} onChange={event => setAddress({...address, province: event.target.value})} />
              <FormField label="Kota/Kabupaten" required value={address.city} onChange={event => setAddress({...address, city: event.target.value})} />
              <FormField label="Kecamatan" required value={address.district} onChange={event => setAddress({...address, district: event.target.value})} />
              <div className="sm:col-span-2"><FormField label="Alamat lengkap" required value={address.address_line} onChange={event => setAddress({...address, address_line: event.target.value})} /></div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button type="button" onClick={detectLocation} disabled={locating} className="rounded-full border border-primary px-5 py-2.5 text-sm font-bold text-primary hover:bg-blush disabled:opacity-50">{locating ? 'Mendeteksi...' : '⌖ Deteksi lokasi'}</button>
              {address.latitude && <a className="text-sm font-bold text-primary underline" target="_blank" rel="noreferrer" href={`https://www.google.com/maps?q=${address.latitude},${address.longitude}`}>Lihat di Google Maps ↗</a>}
            </div>
            <label className="mt-5 flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={address.is_default} onChange={event => setAddress({...address, is_default: event.target.checked})} /> Jadikan alamat utama</label>
            <div className="mt-6 flex gap-3">
              <button className="rounded-full bg-primary px-6 py-3 font-bold text-white hover:bg-[#d97985]">Simpan alamat</button>
              {address.id && <button type="button" onClick={() => setAddress({...blankAddress, recipient_name: user.name, phone: user.phone || ''})} className="rounded-full border border-ink/15 px-6 py-3 font-bold">Batal</button>}
            </div>
          </form>

          <section>
            <div className="flex items-center justify-between"><div><h2 className="text-2xl font-extrabold">Alamat tersimpan</h2><p className="mt-1 text-sm text-ink/50">{addresses.length} alamat di akunmu</p></div></div>
            <div className="mt-5 space-y-4">
              {addresses.length === 0 && <div className="rounded-3xl border border-dashed border-primary/40 bg-cream p-8 text-center text-ink/55">Belum ada alamat tersimpan.</div>}
              {addresses.map(saved => <article key={saved.id} className={`rounded-3xl border p-5 ${saved.is_default ? 'border-primary bg-blush/30' : 'border-blush bg-white'}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div><div className="flex items-center gap-2"><h3 className="font-extrabold">{saved.label}</h3>{saved.is_default && <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-white">Utama</span>}</div><p className="mt-2 font-semibold">{saved.recipient_name} · {saved.phone}</p></div>
                  <div className="flex gap-3"><button type="button" onClick={() => editAddress(saved)} className="text-sm font-bold text-primary">Edit</button><button type="button" onClick={() => removeAddress(saved.id)} className="text-sm font-bold text-red-600">Hapus</button></div>
                </div>
                <p className="mt-3 text-sm leading-6 text-ink/65">{saved.address_line}, {saved.district}, {saved.city}, {saved.province} {saved.postal_code}</p>
                {saved.latitude && <a className="mt-3 inline-block text-sm font-bold text-primary underline" target="_blank" rel="noreferrer" href={`https://www.google.com/maps?q=${saved.latitude},${saved.longitude}`}>Buka lokasi ↗</a>}
              </article>)}
            </div>
          </section>
        </div>}

        {activeTab === 'payments' && <div className="mx-auto max-w-3xl rounded-3xl border border-blush bg-cream p-7 sm:p-10">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-blush text-2xl">✓</span>
          <h2 className="mt-5 text-2xl font-extrabold">Pesanan & Pembayaran</h2>
          <p className="mt-2 max-w-xl leading-7 text-ink/60">Lihat status pembayaran, sisa tagihan, metode pembayaran, dan perkembangan pengiriman dari satu halaman.</p>
          <Link to="/orders" className="mt-6 inline-block rounded-full bg-primary px-7 py-3 font-bold text-white hover:bg-[#d97985]">Lihat pesanan saya</Link>
        </div>}

        {activeTab === 'security' && <div className="mx-auto max-w-3xl rounded-3xl border border-blush p-7 sm:p-10">
          <h2 className="text-2xl font-extrabold">Keamanan akun</h2>
          <p className="mt-2 leading-7 text-ink/60">Keluar dari akun ini jika kamu menggunakan perangkat bersama atau tidak lagi mengenali sesi ini.</p>
          <div className="mt-6 rounded-2xl bg-cream p-5"><p className="text-sm text-ink/50">Akun aktif</p><p className="mt-1 font-bold">{user.email}</p></div>
          <button type="button" onClick={signOut} className="mt-6 rounded-full border border-red-300 px-7 py-3 font-bold text-red-600 hover:bg-red-50">Keluar dari akun</button>
        </div>}
      </div>
    </section>
  </main>
}
