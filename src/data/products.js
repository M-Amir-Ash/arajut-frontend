const images = {
  brooch: 'https://images.unsplash.com/photo-1612902456551-333ac5afa26e?auto=format&fit=crop&w=900&q=80',
  cardigan: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80',
  hat: 'https://images.unsplash.com/photo-1529958030586-3aae4ca485ff?auto=format&fit=crop&w=900&q=80',
  bouquet: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=80',
  pouch: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&q=80',
  blouse: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=80',
  skirt: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=80',
  bag: 'https://images.unsplash.com/photo-1564422167509-1f4b9004397d?auto=format&fit=crop&w=900&q=80',
  keychain: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=900&q=80',
  workshop: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?auto=format&fit=crop&w=900&q=80',
  gift: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80',
  custom: 'https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?auto=format&fit=crop&w=900&q=80',
}
export const fallbackImage = '/arajut-product-placeholder.svg'
export const products = [
  { id:1, slug:'crochet-flower-brooch', name:'Crochet Flower Brooch', category:'Aksesori', description:'Bros bunga rajut mungil yang manis untuk mempercantik hijab, blouse, atau tas favoritmu.', price:35000, stock:18, image:images.brooch, readyStock:true, preorderDuration:'', featured:true },
  { id:2, slug:'handmade-pink-cardigan', name:'Handmade Pink Cardigan', category:'Modest Fashion', description:'Cardigan rajut lembut bernuansa pink, dibuat satu per satu dengan detail penuh kasih.', price:425000, stock:4, image:images.cardigan, readyStock:false, preorderDuration:'14–21 hari', featured:true },
  { id:3, slug:'crochet-bucket-hat', name:'Crochet Bucket Hat', category:'Aksesori', description:'Bucket hat rajut ringan dengan karakter playful untuk melengkapi gaya kasual.', price:165000, stock:7, image:images.hat, readyStock:true, preorderDuration:'', featured:true },
  { id:4, slug:'crochet-flower-bouquet', name:'Crochet Flower Bouquet', category:'Bunga & Buket', description:'Buket bunga rajut yang tidak layu, hadiah berkesan untuk hari yang istimewa.', price:225000, stock:6, image:images.bouquet, readyStock:false, preorderDuration:'7–10 hari', featured:true },
  { id:5, slug:'handmade-mini-pouch', name:'Handmade Mini Pouch', category:'Tas & Pouch', description:'Pouch rajut mini untuk menyimpan koin, earphone, dan benda kecil kesayangan.', price:85000, stock:12, image:images.pouch, readyStock:true, preorderDuration:'', featured:false },
  { id:6, slug:'modest-crochet-blouse', name:'Modest Crochet Blouse', category:'Modest Fashion', description:'Blouse modest dengan sentuhan detail crochet bunga, nyaman dan feminin.', price:385000, stock:3, image:images.blouse, readyStock:false, preorderDuration:'14–21 hari', featured:true },
  { id:7, slug:'crochet-skirt', name:'Crochet Skirt', category:'Modest Fashion', description:'Rok modest beraksen rajut handmade untuk tampilan anggun sehari-hari.', price:345000, stock:5, image:images.skirt, readyStock:false, preorderDuration:'14–21 hari', featured:false },
  { id:8, slug:'lavender-crochet-bag', name:'Lavender Crochet Bag', category:'Tas & Pouch', description:'Tas rajut lavender dengan ruang yang cukup untuk kebutuhan harianmu.', price:245000, stock:8, image:images.bag, readyStock:true, preorderDuration:'', featured:true },
  { id:9, slug:'custom-crochet-keychain', name:'Custom Crochet Keychain', category:'Custom', description:'Gantungan kunci rajut personal dengan pilihan warna dan bentuk sesuai keinginan.', price:55000, stock:20, image:images.keychain, readyStock:false, preorderDuration:'5–7 hari', featured:false },
  { id:10, slug:'crochet-workshop-package', name:'Crochet Workshop Package', category:'Workshop', description:'Paket belajar merajut untuk pemula lengkap dengan bahan, alat, dan panduan.', price:275000, stock:10, image:images.workshop, readyStock:true, preorderDuration:'', featured:false },
  { id:11, slug:'handmade-gift-set', name:'Handmade Gift Set', category:'Gift', description:'Paket hadiah hangat berisi pilihan karya rajut Arajut dalam kemasan cantik.', price:315000, stock:5, image:images.gift, readyStock:true, preorderDuration:'', featured:true },
  { id:12, slug:'custom-crochet-order', name:'Custom Crochet Order', category:'Custom', description:'Wujudkan ide rajutanmu bersama Arajut. Harga awal menyesuaikan ukuran dan tingkat detail.', price:150000, stock:99, image:images.custom, readyStock:false, preorderDuration:'14–30 hari', featured:false },
]
export const categories = [
  { name:'Modest Fashion', icon:'✿', color:'bg-blush' }, { name:'Bunga & Buket', icon:'❀', color:'bg-cream' },
  { name:'Tas & Pouch', icon:'♡', color:'bg-sky' }, { name:'Aksesori', icon:'✦', color:'bg-[#F5E6D3]' },
  { name:'Custom', icon:'⌁', color:'bg-[#E9E2F4]' }, { name:'Workshop', icon:'♢', color:'bg-[#E3F0E4]' },
]
