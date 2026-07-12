import {createContext,useContext,useEffect,useMemo,useState} from 'react'
import {apiRequest} from '../config/api'
import {defaultSettings} from '../services/storage'
const C=createContext(null)
const mapSettings=s=>s?{brandName:s.brand_name,tagline:s.tagline,heroBadge:s.hero_badge,heroHeading:s.hero_heading,heroHighlight:s.hero_highlight,heroDescription:s.hero_description,heroImage:s.hero_image_path,promoTitle:s.promotion_title,promoDescription:s.promotion_description,instagram:s.instagram_url,whatsapp:s.whatsapp_number,email:s.contact_email,footerText:s.footer_text}:defaultSettings
export function DataProvider({children}){const [state,setState]=useState({products:[],categories:[],settings:defaultSettings,loading:true,error:''});const load=async()=>{setState(s=>({...s,loading:true,error:''}));try{const [p,c,s]=await Promise.all([apiRequest('/products'),apiRequest('/categories'),apiRequest('/site-settings')]);setState({products:p.data??[],categories:c.data??[],settings:mapSettings(s.data),loading:false,error:''})}catch(error){setState(s=>({...s,loading:false,error:error.message||'Data toko belum dapat dimuat.'}))}};useEffect(()=>{load()},[]);const value=useMemo(()=>({...state,refresh:load,saveProduct:()=>{},deleteProduct:()=>{},saveCategory:()=>{},deleteCategory:()=>{},saveSettings:()=>{},resetSettings:()=>{}}),[state]);return <C.Provider value={value}>{children}</C.Provider>}
// eslint-disable-next-line react-refresh/only-export-components
export const useData=()=>useContext(C)
