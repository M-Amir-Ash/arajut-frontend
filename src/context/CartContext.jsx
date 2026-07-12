import { createContext, useContext, useEffect, useMemo, useState } from 'react'
const CartContext = createContext(null)
const readCart = () => { try { return JSON.parse(localStorage.getItem('arajut-cart')) || [] } catch { return [] } }
export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart)
  useEffect(() => localStorage.setItem('arajut-cart', JSON.stringify(items)), [items])
  const addItem = (product, quantity = 1) => setItems(old => { const found = old.find(i => i.id === product.id); return found ? old.map(i => i.id === product.id ? {...i, quantity: Math.min(i.quantity + quantity, product.stock)} : i) : [...old, {...product, quantity: Math.min(quantity, product.stock)}] })
  const updateQuantity = (id, quantity) => setItems(old => old.map(i => i.id === id ? {...i, quantity: Math.max(1, Math.min(quantity, i.stock))} : i))
  const removeItem = id => setItems(old => old.filter(i => i.id !== id))
  const value = useMemo(() => ({ items, addItem, updateQuantity, removeItem, count: items.reduce((n,i)=>n+i.quantity,0), total: items.reduce((n,i)=>n+i.price*i.quantity,0) }), [items])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext)
