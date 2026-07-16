import { useState } from 'react'
import { fallbackImage } from '../data/products'
export default function ImageWithFallback({ src, alt, className, loading='lazy', fetchPriority }) {
  const [failedSrc,setFailedSrc]=useState('')
  return <img src={failedSrc === src ? fallbackImage : src} onError={()=>setFailedSrc(src)} alt={alt} className={className} loading={loading} fetchPriority={fetchPriority} />
}
