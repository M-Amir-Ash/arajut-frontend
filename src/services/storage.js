import { products as defaultProducts, categories as defaultCategories } from '../data/products'

const KEY = 'arajut-demo-v2'
export const defaultSettings = { brandName:'Arajut', tagline:'Handmade with Love', heroBadge:'Karya lokal, dibuat dengan hati', heroHeading:'Handmade', heroHighlight:'with Love', heroDescription:'Temukan rajutan manis untuk melengkapi harimu—dari aksesori, modest fashion, sampai hadiah custom yang personal.', heroImage:'', promoTitle:'Punya ide rajutan sendiri?', promoDescription:'Pilih warna, bentuk, dan detail yang kamu suka. Kami akan merajutnya khusus untukmu.', instagram:'https://www.instagram.com/arajut_/', whatsapp:'+62 812-3456-7890', email:'hello@arajut.id', footerText:'Karya rajut handmade yang dibuat perlahan, hangat, dan penuh cinta.' }
const seededCategories = defaultCategories.map((c,i)=>({id:i+1,name:c.name,slug:c.name.toLowerCase().replace(/&/g,'dan').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''),description:'Koleksi '+c.name,icon:c.icon,color:c.color,sortOrder:i+1,active:true}))
const seed = {version:2,products:defaultProducts.map(p=>({...p,shortDescription:p.description,fullDescription:p.description,additionalImages:[],active:true})),categories:seededCategories,settings:defaultSettings,customers:[]}
export function loadStore(){try{const value=JSON.parse(localStorage.getItem(KEY));if(value?.version===2)return value}catch{/* use seed */}localStorage.setItem(KEY,JSON.stringify(seed));return structuredClone(seed)}
export function saveStore(value){localStorage.setItem(KEY,JSON.stringify(value))}
export function resetStore(){localStorage.removeItem(KEY);return loadStore()}
export const storageKey=KEY
