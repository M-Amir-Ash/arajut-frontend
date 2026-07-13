import {useData} from '../context/DataContext'
import arajutLogo from '../../1ecdc0d8-f4a4-4e5e-98a7-55aab2264142.png'

export default function Footer(){
  const{settings}=useData()
  return <footer className="mt-18 bg-ink text-white"><div className="container-page grid gap-8 py-12 md:grid-cols-3"><div><div className="flex items-center gap-3"><img src={settings.logoImage||arajutLogo} alt={`Logo ${settings.brandName}`} className="h-16 w-16 rounded-full object-cover ring-2 ring-white/10"/><p className="font-serif text-3xl font-bold text-[#F3A8B0]">{settings.brandName}</p></div><p className="mt-3 max-w-xs text-sm text-white/75">{settings.footerText}</p></div><div><h3 className="font-bold">Hubungi kami</h3><p className="mt-3 text-sm text-white/75">WhatsApp: {settings.whatsapp}</p><p className="text-sm text-white/75">Email: {settings.email}</p></div><div><h3 className="font-bold">Temukan Arajut</h3><a className="focus-ring mt-3 inline-block rounded text-sm text-[#F3A8B0] hover:text-white" href={settings.instagram} target="_blank" rel="noreferrer">Instagram Arajut ↗</a></div></div><div className="border-t border-white/10 py-5 text-center text-xs text-white/55">© 2026 {settings.brandName}. {settings.tagline}.</div></footer>
}
