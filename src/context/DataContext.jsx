/* eslint-disable react-hooks/exhaustive-deps */
import {createContext,useContext,useEffect,useMemo,useState} from 'react'
import {apiRequest} from '../config/api'
import {defaultSettings} from '../services/storage'

const C=createContext(null)
const mapSettings=s=>s?{brandName:s.brand_name,tagline:s.tagline,logoImage:s.logo_path||'',heroBadge:s.hero_badge,heroHeading:s.hero_heading,heroHighlight:s.hero_highlight,heroDescription:s.hero_description,heroImage:s.hero_image_path||'',promoTitle:s.promotion_title,promoDescription:s.promotion_description,instagram:s.instagram_url,whatsapp:s.whatsapp_number,email:s.contact_email,footerText:s.footer_text}:defaultSettings

export function DataProvider({children}){
  const[state,setState]=useState({products:[],categories:[],settings:defaultSettings,loading:true,error:''})

  const load=async()=>{
    setState(s=>({...s,loading:true,error:''}))
    const[p,c,s]=await Promise.allSettled([
      apiRequest('/products'),
      apiRequest('/categories'),
      apiRequest('/site-settings'),
    ])
    setState(current=>({
      products:p.status==='fulfilled'?(p.value.data??[]):current.products,
      categories:c.status==='fulfilled'?(c.value.data??[]):current.categories,
      settings:s.status==='fulfilled'?mapSettings(s.value.data):current.settings,
      loading:false,
      error:[p,c,s].filter(result=>result.status==='rejected').map(result=>result.reason?.message).filter(Boolean).join(' '),
    }))
  }

  useEffect(()=>{const timer=window.setTimeout(load,0);return()=>window.clearTimeout(timer)},[])

  const saveProduct=async p=>{const category=state.categories.find(c=>c.name===p.category);const body={name:p.name,slug:p.slug,category_id:category?.id,short_description:p.shortDescription||p.description,description:p.fullDescription||p.description,price:Number(p.price),stock:Number(p.stock),availability_type:p.readyStock?'ready_stock':'preorder',preorder_duration:p.readyStock?null:p.preorderDuration,is_featured:!!p.featured,is_active:p.active!==false};await apiRequest(`/admin/products${p.id?`/${p.id}`:''}`,{method:p.id?'PUT':'POST',body:JSON.stringify(body)});await load()}
  const deleteProduct=async id=>{await apiRequest(`/admin/products/${id}`,{method:'DELETE'});setState(current=>({...current,products:current.products.filter(product=>product.id!==id)}));await load()}
  const saveCategory=async c=>{const body={name:c.name,slug:c.slug,description:c.description,icon:c.icon,background_color:c.color,sort_order:Number(c.sortOrder),is_active:c.active!==false};await apiRequest(`/admin/categories${c.id?`/${c.id}`:''}`,{method:c.id?'PUT':'POST',body:JSON.stringify(body)});await load()}
  const deleteCategory=async id=>{await apiRequest(`/admin/categories/${id}`,{method:'DELETE'});setState(current=>({...current,categories:current.categories.filter(category=>category.id!==id)}));await load()}
  const saveSettings=async s=>{await apiRequest('/admin/site-settings',{method:'PUT',body:JSON.stringify({brand_name:s.brandName,tagline:s.tagline,hero_badge:s.heroBadge,hero_heading:s.heroHeading,hero_highlight:s.heroHighlight,hero_description:s.heroDescription,hero_image_path:s.heroImage||null,promotion_title:s.promoTitle,promotion_description:s.promoDescription,instagram_url:s.instagram,whatsapp_number:s.whatsapp,contact_email:s.email,footer_text:s.footerText})});await load()}
  const value=useMemo(()=>({...state,refresh:load,saveProduct,deleteProduct,saveCategory,deleteCategory,saveSettings,resetSettings:()=>{}}),[state])
  return <C.Provider value={value}>{children}</C.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useData=()=>useContext(C)
