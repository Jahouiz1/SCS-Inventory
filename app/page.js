'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

// Icons as simple SVG components
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
  const [showDashboard, setShowDashboard] = useState(false)

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

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-center"><Icons.Loader /><p className="text-gray-400 mt-2">Loading...</p></div></div>

  return (
    <div className="min-h-screen bg-gray-900 p-3 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div><h1 className="text-xl font-bold text-orange-400">Secret Card Society</h1><p className="text-gray-400 text-xs">Inventory Management {syncing && '• Syncing...'}</p></div>
          <div className="flex gap-2 mt-2 md:mt-0">
            <button onClick={() => exportToCSV('inventory')} className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 text-xs"><Icons.Download /> Export</button>
          </div>
        </div>

        {lowStockProducts.length > 0 && (
          <div className="mb-4 p-3 bg-amber-900/30 border border-amber-600 rounded-lg">
            <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-1"><Icons.Alert /> Low Stock ({lowStockProducts.length})</div>
            <div className="flex flex-wrap gap-2">{lowStockProducts.slice(0, 5).map(p => <span key={p.id} className="text-xs bg-amber-900/50 text-amber-300 px-2 py-1 rounded">{p.name} ({p.quantity})</span>)}</div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700"><p className="text-xs text-gray-400">Items</p><p className="text-lg font-bold text-orange-400">{totalItems}</p></div>
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700"><p className="text-xs text-gray-400">Value</p><p className="text-lg font-bold text-orange-400">${totalValue.toFixed(2)}</p></div>
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700"><p className="text-xs text-gray-400">Cost</p><p className="text-lg font-bold text-gray-300">${totalCost.toFixed(2)}</p></div>
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700"><p className="text-xs text-gray-400">Unrealized</p><p className={`text-lg font-bold ${unrealizedPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>${unrealizedPL.toFixed(2)}</p></div>
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700"><p className="text-xs text-gray-400">Realized</p><p className={`text-lg font-bold ${realizedPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>${realizedPL.toFixed(2)}</p></div>
        </div>

        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"><Icons.Search /></span>
            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 rounded-lg text-sm" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm ${showFilters ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-200'}`}><Icons.Filter /> Filters</button>
          <button onClick={() => setShowSalesHistory(true)} className="flex items-center justify-center gap-1 bg-gray-700 text-gray-200 px-3 py-2 rounded-lg text-sm"><Icons.History /> Sales</button>
          <button onClick={() => setShowAddForm(true)} className="flex items-center justify-center gap-1 bg-orange-600 text-white px-3 py-2 rounded-lg text-sm"><Icons.Plus /> Add</button>
        </div>

        {showFilters && (
          <div className="mb-4 p-3 bg-gray-800 border border-gray-700 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div><label className="block text-xs text-gray-400 mb-1">Type</label><select value={filters.productType} onChange={(e) => setFilters({ ...filters, productType: e.target.value })} className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 text-gray-100 rounded text-sm"><option value="">All</option><option>Single Card</option><option>Slab</option><option>Booster Box</option><option>Booster Pack</option><option>ETB</option><option>Collection Box</option><option>Tin</option><option>Bundle</option><option>Other</option></select></div>
              <div><label className="block text-xs text-gray-400 mb-1">Language</label><select value={filters.language} onChange={(e) => setFilters({ ...filters, language: e.target.value })} className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 text-gray-100 rounded text-sm"><option value="">All</option><option>English</option><option>Japanese</option><option>Korean</option><option>Chinese (Traditional)</option><option>Chinese (Simplified)</option></select></div>
              <div><label className="block text-xs text-gray-400 mb-1">Condition</label><select value={filters.condition} onChange={(e) => setFilters({ ...filters, condition: e.target.value })} className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 text-gray-100 rounded text-sm"><option value="">All</option><option value="NM">NM</option><option value="LP">LP</option><option value="MP">MP</option><option value="HP">HP</option><option value="DMG">DMG</option></select></div>
              <div><label className="block text-xs text-gray-400 mb-1">Low Stock ≤</label><input type="number" min="1" value={lowStockThreshold} onChange={(e) => setLowStockThreshold(parseInt(e.target.value) || 3)} className="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 text-gray-100 rounded text-sm" /></div>
              <div className="flex items-end"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={filters.showLowStock} onChange={(e) => setFilters({ ...filters, showLowStock: e.target.checked })} className="w-4 h-4 rounded" /><span className="text-sm text-amber-400">Low Stock Only</span></label></div>
            </div>
            <button onClick={() => setFilters({ productType: '', language: '', condition: '', showLowStock: false })} className="mt-2 text-xs text-gray-400 hover:text-gray-200">Clear</button>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
          {filteredProducts.length === 0 ? (
            <div className="p-8 text-center text-gray-400"><Icons.Package /><p className="font-medium mt-2">No products</p><p className="text-xs">{products.length > 0 ? 'Adjust filters' : 'Add your first product'}</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900 border-b border-gray-700">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Product</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Type</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Lang</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Cond</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Qty</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Cost</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Value</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">P/L</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredProducts.map((p) => {
                    const pl = (p.currentValue - p.purchasePrice) * p.quantity
                    const isLow = p.quantity <= lowStockThreshold
                    return (
                      <tr key={p.id} className={isLow ? 'bg-amber-900/10' : ''}>
                        <td className="px-3 py-2"><div className="text-sm font-medium text-orange-400">{p.name}</div><div className="text-xs text-gray-400">{p.set}</div></td>
                        <td className="px-3 py-2 text-xs text-gray-300">{p.productType}</td>
                        <td className="px-3 py-2 text-xs text-gray-300">{(p.language || 'EN').substring(0, 3)}</td>
                        <td className="px-3 py-2 text-xs text-gray-300">{p.condition}{p.grade && <span className="ml-1 text-amber-400">{p.grade}</span>}</td>
                        <td className="px-3 py-2 text-sm text-gray-300">{isLow && <span className="text-amber-400 mr-1">⚠</span>}{p.quantity}</td>
                        <td className="px-3 py-2 text-sm text-gray-300">${p.purchasePrice.toFixed(2)}</td>
                        <td className="px-3 py-2 text-sm text-gray-300">${p.currentValue.toFixed(2)}</td>
                        <td className="px-3 py-2"><span className={`text-sm font-medium ${pl >= 0 ? 'text-green-400' : 'text-red-400'}`}>${pl.toFixed(2)}</span></td>
                        <td className="px-3 py-2 text-right">
                          {deleteConfirmId === p.id ? (
                            <><button onClick={() => handleDelete(p.id)} className="px-2 py-0.5 bg-red-600 text-white rounded text-xs mr-1">Y</button><button onClick={() => setDeleteConfirmId(null)} className="px-2 py-0.5 bg-gray-600 text-white rounded text-xs">N</button></>
                          ) : (
                            <><button onClick={() => openAddStock(p)} className="text-blue-400 hover:text-blue-300 mr-1"><Icons.PlusCircle /></button><button onClick={() => openSellForm(p)} className="text-green-400 hover:text-green-300 mr-1"><Icons.Cart /></button><button onClick={() => handleEdit(p)} className="text-orange-400 hover:text-orange-300 mr-1"><Icons.Edit /></button><button onClick={() => setDeleteConfirmId(p.id)} className="text-red-400 hover:text-red-300"><Icons.Trash /></button></>
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

        {showAddForm && (
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg max-w-md w-full border border-gray-700 max-h-[90vh] overflow-y-auto">
              <div className="p-4">
                <div className="flex justify-between mb-3"><h2 className="text-lg font-bold text-orange-400">{editingProduct ? 'Edit' : 'Add'} Product</h2><button onClick={resetForm} className="text-gray-400 hover:text-white"><Icons.X /></button></div>
                <div className="space-y-3">
                  <input type="text" placeholder="Product Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg text-sm" />
                  <input type="text" placeholder="Set" value={formData.set} onChange={(e) => setFormData({ ...formData, set: e.target.value })} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg text-sm" />
                  <div className="grid grid-cols-2 gap-2">
                    <select value={formData.productType} onChange={(e) => setFormData({ ...formData, productType: e.target.value })} className="px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg text-sm"><option>Single Card</option><option>Slab</option><option>Booster Box</option><option>Booster Pack</option><option>ETB</option><option>Collection Box</option><option>Tin</option><option>Bundle</option><option>Other</option></select>
                    <select value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value })} className="px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg text-sm"><option>English</option><option>Japanese</option><option>Korean</option><option>Chinese (Traditional)</option><option>Chinese (Simplified)</option></select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <select value={formData.condition} onChange={(e) => setFormData({ ...formData, condition: e.target.value })} className="px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg text-sm"><option value="NM">Near Mint</option><option value="LP">Lightly Played</option><option value="MP">Moderately Played</option><option value="HP">Heavily Played</option><option value="DMG">Damaged</option></select>
                    <input type="text" placeholder="Grade (PSA 10)" value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value })} className="px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg text-sm" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input type="number" placeholder="Qty" min="1" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} className="px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg text-sm" />
                    <input type="number" placeholder="Cost SGD" step="0.01" value={formData.purchasePrice} onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })} className="px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg text-sm" />
                    <input type="number" placeholder="Value SGD" step="0.01" value={formData.currentValue} onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })} className="px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg text-sm" />
                  </div>
                  <div className="p-2 bg-gray-700 rounded-lg">
                    <div className="flex gap-2 items-center mb-2"><span className="text-xs text-gray-400">USD→SGD:</span><input type="number" step="0.01" value={exchangeRate} onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 1.35)} className="w-16 px-2 py-1 bg-gray-600 border border-gray-500 text-white rounded text-xs" /></div>
                    <div className="flex gap-2">
                      <input type="number" placeholder="USD" value={usdInput} onChange={(e) => setUsdInput(e.target.value)} className="flex-1 px-2 py-1.5 bg-gray-600 border border-gray-500 text-white rounded text-sm" />
                      <button onClick={() => usdInput && setFormData({ ...formData, purchasePrice: (parseFloat(usdInput) * exchangeRate).toFixed(2) })} className="px-2 py-1 bg-orange-600 text-white rounded text-xs">→Cost</button>
                      <button onClick={() => usdInput && setFormData({ ...formData, currentValue: (parseFloat(usdInput) * exchangeRate).toFixed(2) })} className="px-2 py-1 bg-amber-600 text-white rounded text-xs">→Value</button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={resetForm} className="flex-1 py-2 border border-gray-600 text-gray-300 rounded-lg text-sm">Cancel</button>
                    <button onClick={handleSubmit} disabled={syncing} className="flex-1 py-2 bg-orange-600 text-white rounded-lg text-sm disabled:opacity-50">{syncing ? 'Saving...' : (editingProduct ? 'Update' : 'Add')}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showSellForm && sellingProduct && (
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg max-w-sm w-full border border-gray-700">
              <div className="p-4">
                <div className="flex justify-between mb-3"><h2 className="text-lg font-bold text-green-400">Record Sale</h2><button onClick={() => { setShowSellForm(false); setSellingProduct(null) }} className="text-gray-400 hover:text-white"><Icons.X /></button></div>
                <div className="mb-3 p-3 bg-gray-700 rounded-lg"><p className="text-orange-400 font-medium">{sellingProduct.name}</p><p className="text-gray-400 text-xs">{sellingProduct.set} • {sellingProduct.quantity}x @ ${sellingProduct.purchasePrice.toFixed(2)}</p></div>
                <div className="space-y-3">
                  <input type="number" min="1" max={sellingProduct.quantity} value={sellData.quantity} onChange={(e) => setSellData({ ...sellData, quantity: Math.min(parseInt(e.target.value) || 1, sellingProduct.quantity) })} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg text-sm" placeholder="Quantity" />
                  <input type="number" step="0.01" value={sellData.salePrice} onChange={(e) => setSellData({ ...sellData, salePrice: e.target.value })} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg text-sm" placeholder="Sale Price SGD" />
                  {sellData.salePrice && (
                    <div className="p-2 bg-gray-700 rounded text-sm">
                      <div className="flex justify-between text-gray-300"><span>Revenue:</span><span>${(parseFloat(sellData.salePrice) * parseInt(sellData.quantity)).toFixed(2)}</span></div>
                      <div className="flex justify-between text-gray-300"><span>Cost:</span><span>${(sellingProduct.purchasePrice * parseInt(sellData.quantity)).toFixed(2)}</span></div>
                      <div className={`flex justify-between font-bold ${(parseFloat(sellData.salePrice) - sellingProduct.purchasePrice) >= 0 ? 'text-green-400' : 'text-red-400'}`}><span>P/L:</span><span>${((parseFloat(sellData.salePrice) - sellingProduct.purchasePrice) * parseInt(sellData.quantity)).toFixed(2)}</span></div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button onClick={() => { setShowSellForm(false); setSellingProduct(null) }} className="flex-1 py-2 border border-gray-600 text-gray-300 rounded-lg text-sm">Cancel</button>
                    <button onClick={handleSell} disabled={syncing} className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm disabled:opacity-50">{syncing ? 'Saving...' : 'Confirm'}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showAddStock && addStockProduct && (
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg max-w-sm w-full border border-gray-700">
              <div className="p-4">
                <div className="flex justify-between mb-3"><h2 className="text-lg font-bold text-blue-400">Add Stock</h2><button onClick={() => { setShowAddStock(false); setAddStockProduct(null) }} className="text-gray-400 hover:text-white"><Icons.X /></button></div>
                <div className="mb-3 p-3 bg-gray-700 rounded-lg"><p className="text-orange-400 font-medium">{addStockProduct.name}</p><p className="text-gray-400 text-xs">Current: {addStockProduct.quantity}x @ ${addStockProduct.purchasePrice.toFixed(2)} avg</p></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" min="1" value={addStockData.quantity} onChange={(e) => setAddStockData({ ...addStockData, quantity: parseInt(e.target.value) || 1 })} className="px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg text-sm" placeholder="Qty" />
                    <input type="number" step="0.01" value={addStockData.purchasePrice} onChange={(e) => setAddStockData({ ...addStockData, purchasePrice: e.target.value })} className="px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg text-sm" placeholder="Price SGD" />
                  </div>
                  <div className="flex gap-2">
                    <input type="number" placeholder="USD" value={addStockUsd} onChange={(e) => setAddStockUsd(e.target.value)} className="flex-1 px-2 py-1.5 bg-gray-600 border border-gray-500 text-white rounded text-sm" />
                    <button onClick={() => addStockUsd && setAddStockData({ ...addStockData, purchasePrice: (parseFloat(addStockUsd) * exchangeRate).toFixed(2) })} className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs">Convert</button>
                  </div>
                  {addStockData.purchasePrice && (
                    <div className="p-2 bg-gray-900 rounded text-sm">
                      <div className="flex justify-between text-gray-300"><span>New Qty:</span><span>{addStockProduct.quantity + parseInt(addStockData.quantity || 0)}</span></div>
                      <div className="flex justify-between text-gray-300"><span>New Avg:</span><span>${(((addStockProduct.purchasePrice * addStockProduct.quantity) + (parseFloat(addStockData.purchasePrice || 0) * parseInt(addStockData.quantity || 0))) / (addStockProduct.quantity + parseInt(addStockData.quantity || 0))).toFixed(2)}</span></div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button onClick={() => { setShowAddStock(false); setAddStockProduct(null) }} className="flex-1 py-2 border border-gray-600 text-gray-300 rounded-lg text-sm">Cancel</button>
                    <button onClick={handleAddStock} disabled={syncing} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50">{syncing ? 'Saving...' : 'Add'}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showSalesHistory && (
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] border border-gray-700 flex flex-col">
              <div className="p-4 border-b border-gray-700 flex justify-between">
                <h2 className="text-lg font-bold text-orange-400">Sales History</h2>
                <div className="flex gap-2">
                  <button onClick={() => exportToCSV('sales')} className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded text-xs"><Icons.Download /> Export</button>
                  <button onClick={() => setShowSalesHistory(false)} className="text-gray-400 hover:text-white"><Icons.X /></button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {sales.length === 0 ? (
                  <div className="text-center text-gray-400 py-8"><Icons.Cart /><p className="mt-2">No sales yet</p></div>
                ) : (
                  <div className="space-y-2">
                    {sales.map((s) => (
                      <div key={s.id} className="p-3 bg-gray-700 rounded-lg">
                        <div className="flex justify-between">
                          <div><p className="text-orange-400 font-medium text-sm">{s.productName}</p><p className="text-gray-400 text-xs">{s.set} • Qty: {s.quantity} @ ${s.salePrice.toFixed(2)}</p></div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold ${s.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>{s.profitLoss >= 0 ? '+' : ''}${s.profitLoss.toFixed(2)}</span>
                            {undoSaleConfirmId === s.id ? (
                              <><button onClick={() => handleUndoSale(s)} className="px-2 py-0.5 bg-amber-600 text-white rounded text-xs">Y</button><button onClick={() => setUndoSaleConfirmId(null)} className="px-2 py-0.5 bg-gray-600 text-white rounded text-xs">N</button></>
                            ) : deleteSaleConfirmId === s.id ? (
                              <><button onClick={() => handleDeleteSale(s.id)} className="px-2 py-0.5 bg-red-600 text-white rounded text-xs">Y</button><button onClick={() => setDeleteSaleConfirmId(null)} className="px-2 py-0.5 bg-gray-600 text-white rounded text-xs">N</button></>
                            ) : (
                              <><button onClick={() => setUndoSaleConfirmId(s.id)} className="text-amber-400 hover:text-amber-300"><Icons.Undo /></button><button onClick={() => setDeleteSaleConfirmId(s.id)} className="text-red-400 hover:text-red-300"><Icons.Trash /></button></>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{new Date(s.date).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-3 border-t border-gray-700 bg-gray-900">
                <div className="flex justify-between"><span className="text-gray-400">Total Realized P/L:</span><span className={`text-lg font-bold ${realizedPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>${realizedPL.toFixed(2)}</span></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
