import { useState } from 'react'
import { fallbackImage } from '../data/products'
export default function ImageWithFallback({ src, alt, className }) { const [failed,setFailed]=useState(false); return <img src={failed ? fallbackImage : src} onError={()=>setFailed(true)} alt={alt} className={className} loading="lazy" /> }
