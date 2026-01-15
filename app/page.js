'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

const Icons = {
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Edit: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
  X: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  Cart: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>,
  PlusCircle: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>,
  Download: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
  History: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
  Alert: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
  Undo: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>,
  Filter: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>,
  Loader: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>,
  Package: () => <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>,
}

export default function SecretCardSociety() {
  const [products, setProducts] = useState([])
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [showSellForm, setShowSellForm] = useState(false)
  const [showSalesHistory, setShowSalesHistory] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [sellingProduct, setSellingProduct] = useState(null)
  const [formData, setFormData] = useState({ name: '', set: '', productType: 'Single Card', language: 'English', condition: 'NM', grade: '', quantity: 1, purchasePrice: '', currentValue: '' })
  const [sellData, setSellData] = useState({ quantity: 1, salePrice: '' })
  const [exchangeRate, setExchangeRate] = useState(1.35)
  const [usdInput, setUsdInput] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [showAddStock, setShowAddStock] = useState(false)
  const [addStockProduct, setAddStockProduct] = useState(null)
  const [addStockData, setAddStockData] = useState({ quantity: 1, purchasePrice: '' })
  const [addStockUsd, setAddStockUsd] = useState('')
  const [deleteSaleConfirmId, setDeleteSaleConfirmId] = useState(null)
  const [undoSaleConfirmId, setUndoSaleConfirmId] = useState(null)
  const [lowStockThreshold, setLowStockThreshold] = useState(3)
  const [filters, setFilters] = useState({ productType: '', language: '', condition: '', showLowStock: false })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadData()
    const prodSub = supabase.channel('products-ch').on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => loadProducts()).subscribe()
    const salesSub = supabase.channel('sales-ch').on('postgres_changes', { event: '*', schema: 'public', table: 'sales' }, () => loadSales()).subscribe()
    return () => { supabase.removeChannel(prodSub); supabase.removeChannel(salesSub) }
  }, [])

  const loadData = async () => { setLoading(true); await Promise.all([loadProducts(), loadSales()]); setLoading(false) }

  const loadProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('date_added', { ascending: false })
    if (data) setProducts(data.map(p => ({ id: p.id, name: p.name, set: p.set_name, productType: p.product_type, language: p.language, condition: p.condition, grade: p.grade || '', quantity: p.quantity, purchasePrice: parseFloat(p.purchase_price), currentValue: parseFloat(p.current_value), dateAdded: p.date_added })))
  }

  const loadSales = async () => {
    const { data } = await supabase.from('sales').select('*').order('sale_date', { ascending: false })
    if (data) setSales(data.map(s => ({ id: s.id, productName: s.product_name, set: s.set_name, productType: s.product_type, language: s.language, condition: s.condition, grade: s.grade || '', quantity: s.quantity, purchasePrice: parseFloat(s.purchase_price), salePrice: parseFloat(s.sale_price), profitLoss: parseFloat(s.profit_loss), date: s.sale_date })))
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.set || !formData.purchasePrice || !formData.currentValue) return
    setSyncing(true)
    const qty = parseInt(formData.quantity), price = parseFloat(formData.purchasePrice), value = parseFloat(formData.currentValue)
    if (editingProduct) {
      await supabase.from('products').update({ name: formData.name, set_name: formData.set, product_type: formData.productType, language: formData.language, condition: formData.condition, grade: formData.grade, quantity: qty, purchase_price: price, current_value: value, updated_at: new Date().toISOString() }).eq('id', editingProduct.id)
    } else {
      const existing = products.find(p => p.name.toLowerCase() === formData.name.toLowerCase() && p.set.toLowerCase() === formData.set.toLowerCase() && p.productType === formData.productType && p.language === formData.language && p.condition === formData.condition && p.grade === formData.grade)
      if (existing) {
        const totalQty = existing.quantity + qty, avgCost = ((existing.purchasePrice * existing.quantity) + (price * qty)) / totalQty
        await supabase.from('products').update({ quantity: totalQty, purchase_price: Math.round(avgCost * 100) / 100, current_value: value, updated_at: new Date().toISOString() }).eq('id', existing.id)
      } else {
        await supabase.from('products').insert({ name: formData.name, set_name: formData.set, product_type: formData.productType, language: formData.language, condition: formData.condition, grade: formData.grade, quantity: qty, purchase_price: price, current_value: value })
      }
    }
    await loadProducts(); setSyncing(false); resetForm()
  }

  const handleSell = async () => {
    if (!sellingProduct || !sellData.salePrice || sellData.quantity < 1) return
    setSyncing(true)
    const qty = parseInt(sellData.quantity), price = parseFloat(sellData.salePrice), pl = (price - sellingProduct.purchasePrice) * qty
    await supabase.from('sales').insert({ product_name: sellingProduct.name, set_name: sellingProduct.set, product_type: sellingProduct.productType, language: sellingProduct.language, condition: sellingProduct.condition, grade: sellingProduct.grade, quantity: qty, purchase_price: sellingProduct.purchasePrice, sale_price: price, profit_loss: pl })
    if (qty >= sellingProduct.quantity) await supabase.from('products').delete().eq('id', sellingProduct.id)
    else await supabase.from('products').update({ quantity: sellingProduct.quantity - qty, updated_at: new Date().toISOString() }).eq('id', sellingProduct.id)
    await loadData(); setSyncing(false); setShowSellForm(false); setSellingProduct(null); setSellData({ quantity: 1, salePrice: '' })
  }

  const handleDelete = async (id) => { setSyncing(true); await supabase.from('products').delete().eq('id', id); await loadProducts(); setSyncing(false); setDeleteConfirmId(null) }
  const handleDeleteSale = async (id) => { setSyncing(true); await supabase.from('sales').delete().eq('id', id); await loadSales(); setSyncing(false); setDeleteSaleConfirmId(null) }

  const handleUndoSale = async (sale) => {
    setSyncing(true)
    const existing = products.find(p => p.name.toLowerCase() === sale.productName.toLowerCase() && p.set.toLowerCase() === sale.set.toLowerCase() && p.productType === (sale.productType || 'Single Card') && p.language === (sale.language || 'English') && p.condition === sale.condition && p.grade === (sale.grade || ''))
    if (existing) {
      const totalQty = existing.quantity + sale.quantity, avgCost = ((existing.purchasePrice * existing.quantity) + (sale.purchasePrice * sale.quantity)) / totalQty
      await supabase.from('products').update({ quantity: totalQty, purchase_price: Math.round(avgCost * 100) / 100, updated_at: new Date().toISOString() }).eq('id', existing.id)
    } else {
      await supabase.from('products').insert({ name: sale.productName, set_name: sale.set, product_type: sale.productType || 'Single Card', language: sale.language || 'English', condition: sale.condition, grade: sale.grade || '', quantity: sale.quantity, purchase_price: sale.purchasePrice, current_value: sale.salePrice })
    }
    await supabase.from('sales').delete().eq('id', sale.id)
    await loadData(); setSyncing(false); setUndoSaleConfirmId(null)
  }

  const handleAddStock = async () => {
    if (!addStockProduct || !addStockData.purchasePrice || addStockData.quantity < 1) return
    setSyncing(true)
    const qty = parseInt(addStockData.quantity), price = parseFloat(addStockData.purchasePrice)
    const totalQty = addStockProduct.quantity + qty, avgCost = ((addStockProduct.purchasePrice * addStockProduct.quantity) + (price * qty)) / totalQty
    await supabase.from('products').update({ quantity: totalQty, purchase_price: Math.round(avgCost * 100) / 100, updated_at: new Date().toISOString() }).eq('id', addStockProduct.id)
    await loadProducts(); setSyncing(false); setShowAddStock(false); setAddStockProduct(null); setAddStockData({ quantity: 1, purchasePrice: '' }); setAddStockUsd('')
  }

  const handleEdit = (p) => { setEditingProduct(p); setFormData({ name: p.name, set: p.set, productType: p.productType || 'Single Card', language: p.language || 'English', condition: p.condition, grade: p.grade || '', quantity: p.quantity, purchasePrice: p.purchasePrice, currentValue: p.currentValue }); setShowAddForm(true) }
  const openSellForm = (p) => { setSellingProduct(p); setSellData({ quantity: 1, salePrice: p.currentValue.toString() }); setShowSellForm(true) }
  const openAddStock = (p) => { setAddStockProduct(p); setAddStockData({ quantity: 1, purchasePrice: '' }); setAddStockUsd(''); setShowAddStock(true) }
  const resetForm = () => { setFormData({ name: '', set: '', productType: 'Single Card', language: 'English', condition: 'NM', grade: '', quantity: 1, purchasePrice: '', currentValue: '' }); setShowAddForm(false); setEditingProduct(null); setUsdInput('') }

  const exportToCSV = (type) => {
    let csv = '', filename = ''
    if (type === 'inventory') {
      csv = 'Name,Set,Type,Language,Condition,Grade,Quantity,Purchase Price,Current Value,P/L\n'
      products.forEach(p => { csv += `"${p.name}","${p.set}","${p.productType}","${p.language}","${p.condition}","${p.grade}",${p.quantity},${p.purchasePrice.toFixed(2)},${p.currentValue.toFixed(2)},${((p.currentValue - p.purchasePrice) * p.quantity).toFixed(2)}\n` })
      filename = `SCS_Inventory_${new Date().toISOString().split('T')[0]}.csv`
    } else {
      csv = 'Date,Product,Set,Type,Language,Condition,Grade,Qty,Purchase,Sale,P/L\n'
      sales.forEach(s => { csv += `"${new Date(s.date).toLocaleDateString()}","${s.productName}","${s.set}","${s.productType}","${s.language}","${s.condition}","${s.grade}",${s.quantity},${s.purchasePrice.toFixed(2)},${s.salePrice.toFixed(2)},${s.profitLoss.toFixed(2)}\n` })
      filename = `SCS_Sales_${new Date().toISOString().split('T')[0]}.csv`
    }
    const blob = new Blob([csv], { type: 'text/csv' }), url = URL.createObjectURL(blob), a = document.createElement('a')
    a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url)
  }

  const filteredProducts = products.filter(p => {
    const search = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.set.toLowerCase().includes(searchTerm.toLowerCase())
    const type = !filters.productType || p.productType === filters.productType
    const lang = !filters.language || p.language === filters.language
    const cond = !filters.condition || p.condition === filters.condition
    const low = !filters.showLowStock || p.quantity <= lowStockThreshold
    return search && type && lang && cond && low
  })

  const lowStockProducts = products.filter(p => p.quantity <= lowStockThreshold)
  const totalValue = products.reduce((s, p) => s + (p.currentValue * p.quantity), 0)
  const totalCost = products.reduce((s, p) => s + (p.purchasePrice * p.quantity), 0)
  const unrealizedPL = totalValue - totalCost
  const totalItems = products.reduce((s, p) => s + p.quantity, 0)
  const realizedPL = sales.reduce((s, sale) => s + sale.profitLoss, 0)

  // Analytics data
  const salesByMonth = sales.reduce((acc, sale) => {
    const month = new Date(sale.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    acc[month] = (acc[month] || 0) + sale.profitLoss
    return acc
  }, {})
  const salesChartData = Object.entries(salesByMonth).map(([month, profit]) => ({ month, profit: Math.round(profit * 100) / 100 })).slice(-6)
  const typeDistribution = products.reduce((acc, p) => { acc[p.productType || 'Single Card'] = (acc[p.productType || 'Single Card'] || 0) + p.quantity; return acc }, {})
  const topProducts = [...products].sort((a, b) => (b.currentValue * b.quantity) - (a.currentValue * a.quantity)).slice(0, 5)
  const avgSaleValue = sales.length > 0 ? sales.reduce((s, sale) => s + sale.salePrice * sale.quantity, 0) / sales.length : 0

  if (loading) return <div style={{ minHeight: '100vh', backgroundColor: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.Loader /><p style={{ color: '#9ca3af', marginLeft: '8px' }}>Loading...</p></div>

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111827', padding: '12px', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fb923c', margin: 0 }}>Secret Card Society</h1>
            <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Inventory Management {syncing && '• Syncing...'}</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setShowDashboard(true)} style={{ padding: '6px 12px', backgroundColor: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>📊 Analytics</button>
            <button onClick={() => exportToCSV('inventory')} style={{ padding: '6px 12px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Download /> Export</button>
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'rgba(217, 119, 6, 0.2)', border: '1px solid #d97706', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}><Icons.Alert /> Low Stock ({lowStockProducts.length})</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>{lowStockProducts.slice(0, 5).map(p => <span key={p.id} style={{ padding: '2px 8px', backgroundColor: 'rgba(217, 119, 6, 0.3)', color: '#fcd34d', borderRadius: '4px', fontSize: '11px' }}>{p.name} ({p.quantity})</span>)}</div>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px', marginBottom: '16px' }}>
          <div style={{ backgroundColor: '#1f2937', borderRadius: '8px', padding: '12px', border: '1px solid #374151' }}><p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>Items</p><p style={{ fontSize: '18px', fontWeight: 'bold', color: '#fb923c', margin: 0 }}>{totalItems}</p></div>
          <div style={{ backgroundColor: '#1f2937', borderRadius: '8px', padding: '12px', border: '1px solid #374151' }}><p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>Value</p><p style={{ fontSize: '18px', fontWeight: 'bold', color: '#fb923c', margin: 0 }}>${totalValue.toFixed(2)}</p></div>
          <div style={{ backgroundColor: '#1f2937', borderRadius: '8px', padding: '12px', border: '1px solid #374151' }}><p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>Cost</p><p style={{ fontSize: '18px', fontWeight: 'bold', color: '#d1d5db', margin: 0 }}>${totalCost.toFixed(2)}</p></div>
          <div style={{ backgroundColor: '#1f2937', borderRadius: '8px', padding: '12px', border: '1px solid #374151' }}><p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>Unrealized</p><p style={{ fontSize: '18px', fontWeight: 'bold', color: unrealizedPL >= 0 ? '#4ade80' : '#f87171', margin: 0 }}>${unrealizedPL.toFixed(2)}</p></div>
          <div style={{ backgroundColor: '#1f2937', borderRadius: '8px', padding: '12px', border: '1px solid #374151' }}><p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>Realized</p><p style={{ fontSize: '18px', fontWeight: 'bold', color: realizedPL >= 0 ? '#4ade80' : '#f87171', margin: 0 }}>${realizedPL.toFixed(2)}</p></div>
        </div>

        {/* Search & Actions */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '150px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}><Icons.Search /></span>
            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '8px 8px 8px 36px', backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} style={{ padding: '8px 12px', backgroundColor: showFilters ? '#ea580c' : '#374151', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Filter /> Filters</button>
          <button onClick={() => setShowSalesHistory(true)} style={{ padding: '8px 12px', backgroundColor: '#374151', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.History /> Sales</button>
          <button onClick={() => setShowAddForm(true)} style={{ padding: '8px 12px', backgroundColor: '#ea580c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Plus /> Add</button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
              <div><label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Type</label><select value={filters.productType} onChange={(e) => setFilters({ ...filters, productType: e.target.value })} style={{ width: '100%', padding: '6px', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '6px', color: 'white', fontSize: '12px' }}><option value="">All</option><option>Single Card</option><option>Slab</option><option>Booster Box</option><option>Booster Pack</option><option>ETB</option><option>Collection Box</option><option>Tin</option><option>Bundle</option><option>Other</option></select></div>
              <div><label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Language</label><select value={filters.language} onChange={(e) => setFilters({ ...filters, language: e.target.value })} style={{ width: '100%', padding: '6px', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '6px', color: 'white', fontSize: '12px' }}><option value="">All</option><option>English</option><option>Japanese</option><option>Korean</option><option>Chinese (Traditional)</option><option>Chinese (Simplified)</option></select></div>
              <div><label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Condition</label><select value={filters.condition} onChange={(e) => setFilters({ ...filters, condition: e.target.value })} style={{ width: '100%', padding: '6px', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '6px', color: 'white', fontSize: '12px' }}><option value="">All</option><option value="NM">NM</option><option value="LP">LP</option><option value="MP">MP</option><option value="HP">HP</option><option value="DMG">DMG</option></select></div>
              <div><label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Low Stock ≤</label><input type="number" min="1" value={lowStockThreshold} onChange={(e) => setLowStockThreshold(parseInt(e.target.value) || 3)} style={{ width: '100%', padding: '6px', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '6px', color: 'white', fontSize: '12px', boxSizing: 'border-box' }} /></div>
              <div style={{ display: 'flex', alignItems: 'end' }}><label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: '#fbbf24', fontSize: '12px' }}><input type="checkbox" checked={filters.showLowStock} onChange={(e) => setFilters({ ...filters, showLowStock: e.target.checked })} /> Low Stock Only</label></div>
            </div>
            <button onClick={() => setFilters({ productType: '', language: '', condition: '', showLowStock: false })} style={{ marginTop: '8px', background: 'none', border: 'none', color: '#9ca3af', fontSize: '11px', cursor: 'pointer' }}>Clear filters</button>
          </div>
        )}

        {/* Products Table */}
        <div style={{ backgroundColor: '#1f2937', borderRadius: '8px', border: '1px solid #374151', overflow: 'hidden' }}>
          {filteredProducts.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}><Icons.Package /><p style={{ marginTop: '8px' }}>No products</p><p style={{ fontSize: '12px' }}>{products.length > 0 ? 'Adjust filters' : 'Add your first product'}</p></div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#111827' }}>
                    <th style={{ padding: '10px', textAlign: 'left', fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', borderBottom: '1px solid #374151' }}>Product</th>
                    <th style={{ padding: '10px', textAlign: 'left', fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', borderBottom: '1px solid #374151' }}>Type</th>
                    <th style={{ padding: '10px', textAlign: 'left', fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', borderBottom: '1px solid #374151' }}>Lang</th>
                    <th style={{ padding: '10px', textAlign: 'left', fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', borderBottom: '1px solid #374151' }}>Cond</th>
                    <th style={{ padding: '10px', textAlign: 'left', fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', borderBottom: '1px solid #374151' }}>Qty</th>
                    <th style={{ padding: '10px', textAlign: 'left', fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', borderBottom: '1px solid #374151' }}>Cost</th>
                    <th style={{ padding: '10px', textAlign: 'left', fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', borderBottom: '1px solid #374151' }}>Value</th>
                    <th style={{ padding: '10px', textAlign: 'left', fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', borderBottom: '1px solid #374151' }}>P/L</th>
                    <th style={{ padding: '10px', textAlign: 'right', fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', borderBottom: '1px solid #374151' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => {
                    const pl = (p.currentValue - p.purchasePrice) * p.quantity
                    const isLow = p.quantity <= lowStockThreshold
                    return (
                      <tr key={p.id} style={{ backgroundColor: isLow ? 'rgba(217, 119, 6, 0.1)' : 'transparent' }}>
                        <td style={{ padding: '10px', borderBottom: '1px solid #374151' }}><div style={{ color: '#fb923c', fontWeight: '500', fontSize: '13px' }}>{p.name}</div><div style={{ color: '#9ca3af', fontSize: '11px' }}>{p.set}</div></td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #374151', color: '#d1d5db', fontSize: '12px' }}>{p.productType}</td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #374151', color: '#d1d5db', fontSize: '12px' }}>{(p.language || 'EN').substring(0, 3)}</td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #374151', color: '#d1d5db', fontSize: '12px' }}>{p.condition}{p.grade && <span style={{ color: '#fbbf24', marginLeft: '4px' }}>{p.grade}</span>}</td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #374151', color: '#d1d5db', fontSize: '13px' }}>{isLow && <span style={{ color: '#fbbf24' }}>⚠ </span>}{p.quantity}</td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #374151', color: '#d1d5db', fontSize: '13px' }}>${p.purchasePrice.toFixed(2)}</td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #374151', color: '#d1d5db', fontSize: '13px' }}>${p.currentValue.toFixed(2)}</td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #374151', fontWeight: '500', fontSize: '13px', color: pl >= 0 ? '#4ade80' : '#f87171' }}>${pl.toFixed(2)}</td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #374151', textAlign: 'right' }}>
                          {deleteConfirmId === p.id ? (
                            <><button onClick={() => handleDelete(p.id)} style={{ padding: '2px 8px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', marginRight: '4px' }}>Y</button><button onClick={() => setDeleteConfirmId(null)} style={{ padding: '2px 8px', backgroundColor: '#4b5563', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>N</button></>
                          ) : (
                            <><button onClick={() => openAddStock(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#60a5fa', padding: '4px' }} title="Add Stock"><Icons.PlusCircle /></button><button onClick={() => openSellForm(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4ade80', padding: '4px' }} title="Sell"><Icons.Cart /></button><button onClick={() => handleEdit(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fb923c', padding: '4px' }} title="Edit"><Icons.Edit /></button><button onClick={() => setDeleteConfirmId(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', padding: '4px' }} title="Delete"><Icons.Trash /></button></>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {showAddForm && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }}>
            <div style={{ backgroundColor: '#1f2937', borderRadius: '8px', padding: '16px', width: '100%', maxWidth: '400px', maxHeight: '90vh', overflow: 'auto', border: '1px solid #374151' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ color: '#fb923c', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{editingProduct ? 'Edit' : 'Add'} Product</h2>
                <button onClick={resetForm} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><Icons.X /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div><label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Product Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Charizard VMAX" style={{ width: '100%', padding: '8px', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '6px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} /></div>
                <div><label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Set</label><input type="text" value={formData.set} onChange={(e) => setFormData({ ...formData, set: e.target.value })} placeholder="e.g., Champion's Path" style={{ width: '100%', padding: '8px', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '6px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div><label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Type</label><select value={formData.productType} onChange={(e) => setFormData({ ...formData, productType: e.target.value })} style={{ width: '100%', padding: '8px', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '6px', color: 'white', fontSize: '14px' }}><option>Single Card</option><option>Slab</option><option>Booster Box</option><option>Booster Pack</option><option>ETB</option><option>Collection Box</option><option>Tin</option><option>Bundle</option><option>Other</option></select></div>
                  <div><label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Language</label><select value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value })} style={{ width: '100%', padding: '8px', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '6px', color: 'white', fontSize: '14px' }}><option>English</option><option>Japanese</option><option>Korean</option><option>Chinese (Traditional)</option><option>Chinese (Simplified)</option></select></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div><label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Condition</label><select value={formData.condition} onChange={(e) => setFormData({ ...formData, condition: e.target.value })} style={{ width: '100%', padding: '8px', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '6px', color: 'white', fontSize: '14px' }}><option value="NM">Near Mint</option><option value="LP">Lightly Played</option><option value="MP">Moderately Played</option><option value="HP">Heavily Played</option><option value="DMG">Damaged</option></select></div>
                  <div><label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Grade</label><input type="text" value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value })} placeholder="e.g., PSA 10" style={{ width: '100%', padding: '8px', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '6px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <div><label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Qty</label><input type="number" min="1" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} style={{ width: '100%', padding: '8px', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '6px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} /></div>
                  <div><label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Cost SGD</label><input type="number" step="0.01" value={formData.purchasePrice} onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })} placeholder="0.00" style={{ width: '100%', padding: '8px', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '6px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} /></div>
                  <div><label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Value SGD</label><input type="number" step="0.01" value={formData.currentValue} onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })} placeholder="0.00" style={{ width: '100%', padding: '8px', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '6px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} /></div>
                </div>
                <div style={{ padding: '12px', backgroundColor: '#374151', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}><span style={{ fontSize: '12px', color: '#9ca3af' }}>USD → SGD</span><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ fontSize: '11px', color: '#6b7280' }}>Rate:</span><input type="number" step="0.01" value={exchangeRate} onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 1.35)} style={{ width: '50px', padding: '4px', backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '4px', color: 'white', fontSize: '11px' }} /></div></div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="number" step="0.01" value={usdInput} onChange={(e) => setUsdInput(e.target.value)} placeholder="USD" style={{ flex: 1, padding: '8px', backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '6px', color: 'white', fontSize: '14px' }} />
                    <button onClick={() => usdInput && setFormData({ ...formData, purchasePrice: (parseFloat(usdInput) * exchangeRate).toFixed(2) })} style={{ padding: '8px', backgroundColor: '#ea580c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>→Cost</button>
                    <button onClick={() => usdInput && setFormData({ ...formData, currentValue: (parseFloat(usdInput) * exchangeRate).toFixed(2) })} style={{ padding: '8px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>→Value</button>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={resetForm} style={{ flex: 1, padding: '10px', backgroundColor: '#374151', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
                  <button onClick={handleSubmit} disabled={syncing} style={{ flex: 1, padding: '10px', backgroundColor: '#ea580c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', opacity: syncing ? 0.5 : 1 }}>{syncing ? 'Saving...' : (editingProduct ? 'Update' : 'Add')}</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sell Modal */}
        {showSellForm && sellingProduct && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }}>
            <div style={{ backgroundColor: '#1f2937', borderRadius: '8px', padding: '16px', width: '100%', maxWidth: '350px', border: '1px solid #374151' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ color: '#4ade80', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Record Sale</h2>
                <button onClick={() => { setShowSellForm(false); setSellingProduct(null) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><Icons.X /></button>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#374151', borderRadius: '8px', marginBottom: '12px' }}>
                <p style={{ color: '#fb923c', fontWeight: '500', margin: 0 }}>{sellingProduct.name}</p>
                <p style={{ color: '#9ca3af', fontSize: '12px', margin: '4px 0 0' }}>{sellingProduct.set} • {sellingProduct.quantity}x @ ${sellingProduct.purchasePrice.toFixed(2)}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div><label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Quantity</label><input type="number" min="1" max={sellingProduct.quantity} value={sellData.quantity} onChange={(e) => setSellData({ ...sellData, quantity: Math.min(parseInt(e.target.value) || 1, sellingProduct.quantity) })} style={{ width: '100%', padding: '8px', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '6px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} /></div>
                <div><label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Sale Price SGD</label><input type="number" step="0.01" value={sellData.salePrice} onChange={(e) => setSellData({ ...sellData, salePrice: e.target.value })} style={{ width: '100%', padding: '8px', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '6px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} /></div>
                {sellData.salePrice && (
                  <div style={{ padding: '12px', backgroundColor: '#374151', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d1d5db', fontSize: '13px' }}><span>Revenue:</span><span>${(parseFloat(sellData.salePrice) * parseInt(sellData.quantity)).toFixed(2)}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d1d5db', fontSize: '13px' }}><span>Cost:</span><span>${(sellingProduct.purchasePrice * parseInt(sellData.quantity)).toFixed(2)}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '13px', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #4b5563', color: (parseFloat(sellData.salePrice) - sellingProduct.purchasePrice) >= 0 ? '#4ade80' : '#f87171' }}><span>P/L:</span><span>${((parseFloat(sellData.salePrice) - sellingProduct.purchasePrice) * parseInt(sellData.quantity)).toFixed(2)}</span></div>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => { setShowSellForm(false); setSellingProduct(null) }} style={{ flex: 1, padding: '10px', backgroundColor: '#374151', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
                  <button onClick={handleSell} disabled={syncing} style={{ flex: 1, padding: '10px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', opacity: syncing ? 0.5 : 1 }}>{syncing ? 'Saving...' : 'Confirm'}</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Stock Modal */}
        {showAddStock && addStockProduct && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }}>
            <div style={{ backgroundColor: '#1f2937', borderRadius: '8px', padding: '16px', width: '100%', maxWidth: '350px', border: '1px solid #374151' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ color: '#60a5fa', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Add Stock</h2>
                <button onClick={() => { setShowAddStock(false); setAddStockProduct(null) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><Icons.X /></button>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#374151', borderRadius: '8px', marginBottom: '12px' }}>
                <p style={{ color: '#fb923c', fontWeight: '500', margin: 0 }}>{addStockProduct.name}</p>
                <p style={{ color: '#9ca3af', fontSize: '12px', margin: '4px 0 0' }}>Current: {addStockProduct.quantity}x @ ${addStockProduct.purchasePrice.toFixed(2)} avg</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div><label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Add Qty</label><input type="number" min="1" value={addStockData.quantity} onChange={(e) => setAddStockData({ ...addStockData, quantity: parseInt(e.target.value) || 1 })} style={{ width: '100%', padding: '8px', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '6px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} /></div>
                  <div><label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Price SGD</label><input type="number" step="0.01" value={addStockData.purchasePrice} onChange={(e) => setAddStockData({ ...addStockData, purchasePrice: e.target.value })} placeholder="0.00" style={{ width: '100%', padding: '8px', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '6px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} /></div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="number" step="0.01" value={addStockUsd} onChange={(e) => setAddStockUsd(e.target.value)} placeholder="USD" style={{ flex: 1, padding: '8px', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '6px', color: 'white', fontSize: '14px' }} />
                  <button onClick={() => addStockUsd && setAddStockData({ ...addStockData, purchasePrice: (parseFloat(addStockUsd) * exchangeRate).toFixed(2) })} style={{ padding: '8px 12px', backgroundColor: '#60a5fa', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>Convert</button>
                </div>
                {addStockData.purchasePrice && (
                  <div style={{ padding: '12px', backgroundColor: '#374151', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d1d5db', fontSize: '13px' }}><span>New Total Qty:</span><span>{addStockProduct.quantity + parseInt(addStockData.quantity)}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#d1d5db', fontSize: '13px' }}><span>New Avg Cost:</span><span>${(((addStockProduct.purchasePrice * addStockProduct.quantity) + (parseFloat(addStockData.purchasePrice) * parseInt(addStockData.quantity))) / (addStockProduct.quantity + parseInt(addStockData.quantity))).toFixed(2)}</span></div>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => { setShowAddStock(false); setAddStockProduct(null) }} style={{ flex: 1, padding: '10px', backgroundColor: '#374151', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
                  <button onClick={handleAddStock} disabled={syncing} style={{ flex: 1, padding: '10px', backgroundColor: '#60a5fa', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', opacity: syncing ? 0.5 : 1 }}>{syncing ? 'Saving...' : 'Add Stock'}</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sales History Modal */}
        {showSalesHistory && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }}>
            <div style={{ backgroundColor: '#1f2937', borderRadius: '8px', padding: '16px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflow: 'auto', border: '1px solid #374151' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ color: '#fb923c', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Sales History</h2>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button onClick={() => exportToCSV('sales')} style={{ padding: '6px 12px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Download /> Export</button>
                  <button onClick={() => setShowSalesHistory(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><Icons.X /></button>
                </div>
              </div>
              
              {/* Sales Summary */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
                <div style={{ backgroundColor: '#374151', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                  <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>Total Sales</p>
                  <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#60a5fa', margin: 0 }}>{sales.length}</p>
                </div>
                <div style={{ backgroundColor: '#374151', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                  <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>Revenue</p>
                  <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#fbbf24', margin: 0 }}>${sales.reduce((s, sale) => s + sale.salePrice * sale.quantity, 0).toFixed(2)}</p>
                </div>
                <div style={{ backgroundColor: '#374151', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                  <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>Profit</p>
                  <p style={{ fontSize: '18px', fontWeight: 'bold', color: realizedPL >= 0 ? '#4ade80' : '#f87171', margin: 0 }}>${realizedPL.toFixed(2)}</p>
                </div>
              </div>

              {sales.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                  <Icons.History />
                  <p style={{ marginTop: '8px' }}>No sales recorded yet</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {sales.map((sale) => (
                    <div key={sale.id} style={{ backgroundColor: '#374151', borderRadius: '8px', padding: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                        <div>
                          <p style={{ color: '#fb923c', fontWeight: '500', margin: 0, fontSize: '14px' }}>{sale.productName}</p>
                          <p style={{ color: '#9ca3af', fontSize: '11px', margin: '2px 0 0' }}>{sale.set} • {sale.productType} • {sale.language} • {sale.condition}{sale.grade && ` • ${sale.grade}`}</p>
                        </div>
                        <span style={{ color: '#6b7280', fontSize: '11px' }}>{new Date(sale.date).toLocaleDateString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
                          <span style={{ color: '#9ca3af' }}>Qty: <span style={{ color: '#d1d5db' }}>{sale.quantity}</span></span>
                          <span style={{ color: '#9ca3af' }}>Cost: <span style={{ color: '#d1d5db' }}>${sale.purchasePrice.toFixed(2)}</span></span>
                          <span style={{ color: '#9ca3af' }}>Sale: <span style={{ color: '#d1d5db' }}>${sale.salePrice.toFixed(2)}</span></span>
                          <span style={{ color: sale.profitLoss >= 0 ? '#4ade80' : '#f87171', fontWeight: '500' }}>P/L: ${sale.profitLoss.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {undoSaleConfirmId === sale.id ? (
                            <>
                              <button onClick={() => handleUndoSale(sale)} style={{ padding: '2px 8px', backgroundColor: '#eab308', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>Y</button>
                              <button onClick={() => setUndoSaleConfirmId(null)} style={{ padding: '2px 8px', backgroundColor: '#4b5563', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>N</button>
                            </>
                          ) : deleteSaleConfirmId === sale.id ? (
                            <>
                              <button onClick={() => handleDeleteSale(sale.id)} style={{ padding: '2px 8px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>Y</button>
                              <button onClick={() => setDeleteSaleConfirmId(null)} style={{ padding: '2px 8px', backgroundColor: '#4b5563', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>N</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => setUndoSaleConfirmId(sale.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#eab308', padding: '4px' }} title="Undo Sale"><Icons.Undo /></button>
                              <button onClick={() => setDeleteSaleConfirmId(sale.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', padding: '4px' }} title="Delete"><Icons.Trash /></button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Dashboard Modal */}
        {showDashboard && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }}>
            <div style={{ backgroundColor: '#1f2937', borderRadius: '8px', padding: '16px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflow: 'auto', border: '1px solid #374151' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ color: '#7c3aed', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>📊 Analytics Dashboard</h2>
                <button onClick={() => setShowDashboard(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><Icons.X /></button>
              </div>
              
              {/* Summary Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '16px' }}>
                <div style={{ backgroundColor: '#374151', borderRadius: '8px', padding: '12px' }}>
                  <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>Total Sales</p>
                  <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#4ade80', margin: 0 }}>{sales.length}</p>
                </div>
                <div style={{ backgroundColor: '#374151', borderRadius: '8px', padding: '12px' }}>
                  <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>Avg Sale Value</p>
                  <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#60a5fa', margin: 0 }}>${avgSaleValue.toFixed(2)}</p>
                </div>
                <div style={{ backgroundColor: '#374151', borderRadius: '8px', padding: '12px' }}>
                  <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>Total Revenue</p>
                  <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#fbbf24', margin: 0 }}>${sales.reduce((s, sale) => s + sale.salePrice * sale.quantity, 0).toFixed(2)}</p>
                </div>
                <div style={{ backgroundColor: '#374151', borderRadius: '8px', padding: '12px' }}>
                  <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>Total Profit</p>
                  <p style={{ fontSize: '20px', fontWeight: 'bold', color: realizedPL >= 0 ? '#4ade80' : '#f87171', margin: 0 }}>${realizedPL.toFixed(2)}</p>
                </div>
              </div>

              {/* Profit by Month */}
              <div style={{ backgroundColor: '#374151', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', color: '#d1d5db', margin: '0 0 12px 0' }}>Profit by Month</h3>
                {salesChartData.length > 0 ? (
                  <div style={{ display: 'flex', alignItems: 'end', gap: '8px', height: '120px' }}>
                    {salesChartData.map((d, i) => {
                      const maxProfit = Math.max(...salesChartData.map(x => Math.abs(x.profit)), 1)
                      const height = Math.abs(d.profit) / maxProfit * 100
                      return (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ fontSize: '10px', color: d.profit >= 0 ? '#4ade80' : '#f87171', marginBottom: '4px' }}>${d.profit}</span>
                          <div style={{ width: '100%', height: `${height}px`, backgroundColor: d.profit >= 0 ? '#4ade80' : '#f87171', borderRadius: '4px 4px 0 0', minHeight: '4px' }}></div>
                          <span style={{ fontSize: '10px', color: '#9ca3af', marginTop: '4px' }}>{d.month}</span>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p style={{ color: '#6b7280', fontSize: '12px', textAlign: 'center' }}>No sales data yet</p>
                )}
              </div>

              {/* Inventory by Type */}
              <div style={{ backgroundColor: '#374151', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', color: '#d1d5db', margin: '0 0 12px 0' }}>Inventory by Type</h3>
                {totalItems > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {Object.entries(typeDistribution).sort((a, b) => b[1] - a[1]).map(([type, count]) => {
                      const percentage = (count / totalItems) * 100
                      return (
                        <div key={type}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                            <span style={{ color: '#d1d5db' }}>{type}</span>
                            <span style={{ color: '#9ca3af' }}>{count} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div style={{ height: '8px', backgroundColor: '#1f2937', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${percentage}%`, backgroundColor: '#7c3aed', borderRadius: '4px' }}></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p style={{ color: '#6b7280', fontSize: '12px', textAlign: 'center' }}>No inventory data</p>
                )}
              </div>

              {/* Top Products by Value */}
              <div style={{ backgroundColor: '#374151', borderRadius: '8px', padding: '12px' }}>
                <h3 style={{ fontSize: '14px', color: '#d1d5db', margin: '0 0 12px 0' }}>Top Products by Value</h3>
                {topProducts.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {topProducts.map((p, i) => (
                      <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: '#1f2937', borderRadius: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ width: '20px', height: '20px', backgroundColor: '#7c3aed', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: 'white' }}>{i + 1}</span>
                          <div>
                            <p style={{ color: '#fb923c', fontSize: '12px', margin: 0, fontWeight: '500' }}>{p.name}</p>
                            <p style={{ color: '#6b7280', fontSize: '10px', margin: 0 }}>{p.set} • {p.quantity}x</p>
                          </div>
                        </div>
                        <span style={{ color: '#4ade80', fontSize: '13px', fontWeight: '500' }}>${(p.currentValue * p.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#6b7280', fontSize: '12px', textAlign: 'center' }}>No products yet</p>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
