'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import * as XLSX from 'xlsx'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

// Product type categories
const SEALED_TYPES = ['Booster Box', 'Booster Pack', 'ETB', 'Collection Box', 'Special Box', 'Tin', 'Bundle']
const SLAB_TYPES = ['Slab']
const SINGLE_TYPES = ['Single Card', 'Other']

const Icons = {
  Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Edit: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
  X: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  Cart: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>,
  PlusCircle: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>,
  Download: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
  Upload: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>,
  History: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
  Alert: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
  Undo: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>,
  Loader: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>,
  Package: () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>,
  FileSpreadsheet: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="8" y1="13" x2="16" y2="13"></line><line x1="8" y1="17" x2="16" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
  Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
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
  const [showImportModal, setShowImportModal] = useState(false)
  const [importData, setImportData] = useState([])
  const [importPreview, setImportPreview] = useState([])
  const [importMapping, setImportMapping] = useState({})
  const [importStep, setImportStep] = useState(1)
  const [importError, setImportError] = useState('')
  const [importProgress, setImportProgress] = useState(0)
  const [excelHeaders, setExcelHeaders] = useState([])
  const fileInputRef = useRef(null)

  const requiredFields = [
    { key: 'name', label: 'Product Name', required: true },
    { key: 'set', label: 'Set', required: true },
    { key: 'productType', label: 'Product Type', required: false },
    { key: 'language', label: 'Language', required: false },
    { key: 'condition', label: 'Condition', required: false },
    { key: 'grade', label: 'Grade', required: false },
    { key: 'quantity', label: 'Quantity', required: false },
    { key: 'purchasePrice', label: 'Purchase Price', required: true },
    { key: 'currentValue', label: 'Current Value', required: true },
  ]

  useEffect(() => {
    loadData()
    const prodSub = supabase.channel('products-ch').on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => loadProducts()).subscribe()
    const salesSub = supabase.channel('sales-ch').on('postgres_changes', { event: '*', schema: 'public', table: 'sales' }, () => loadSales()).subscribe()
    return () => { supabase.removeChannel(prodSub); supabase.removeChannel(salesSub) }
  }, [])

  const loadData = async () => { setLoading(true); await Promise.all([loadProducts(), loadSales()]); setLoading(false) }
  const loadProducts = async () => { const { data } = await supabase.from('products').select('*').order('date_added', { ascending: false }); if (data) setProducts(data.map(p => ({ id: p.id, name: p.name, set: p.set_name, productType: p.product_type, language: p.language, condition: p.condition, grade: p.grade || '', quantity: p.quantity, purchasePrice: parseFloat(p.purchase_price), currentValue: parseFloat(p.current_value), dateAdded: p.date_added }))) }
  const loadSales = async () => { const { data } = await supabase.from('sales').select('*').order('sale_date', { ascending: false }); if (data) setSales(data.map(s => ({ id: s.id, productName: s.product_name, set: s.set_name, productType: s.product_type, language: s.language, condition: s.condition, grade: s.grade || '', quantity: s.quantity, purchasePrice: parseFloat(s.purchase_price), salePrice: parseFloat(s.sale_price), profitLoss: parseFloat(s.profit_loss), date: s.sale_date }))) }

  const handleSubmit = async () => {
    if (!formData.name || !formData.set || !formData.purchasePrice || !formData.currentValue) return
    setSyncing(true)
    const qty = parseInt(formData.quantity), price = parseFloat(formData.purchasePrice), value = parseFloat(formData.currentValue)
    if (editingProduct) {
      await supabase.from('products').update({ name: formData.name, set_name: formData.set, product_type: formData.productType, language: formData.language, condition: formData.condition, grade: formData.grade, quantity: qty, purchase_price: price, current_value: value, updated_at: new Date().toISOString() }).eq('id', editingProduct.id)
    } else {
      const existing = products.find(p => p.name.toLowerCase() === formData.name.toLowerCase() && p.set.toLowerCase() === formData.set.toLowerCase() && p.productType === formData.productType && p.language === formData.language && p.condition === formData.condition && p.grade === formData.grade)
      if (existing) { const totalQty = existing.quantity + qty, avgCost = ((existing.purchasePrice * existing.quantity) + (price * qty)) / totalQty; await supabase.from('products').update({ quantity: totalQty, purchase_price: Math.round(avgCost * 100) / 100, current_value: value, updated_at: new Date().toISOString() }).eq('id', existing.id) }
      else { await supabase.from('products').insert({ name: formData.name, set_name: formData.set, product_type: formData.productType, language: formData.language, condition: formData.condition, grade: formData.grade, quantity: qty, purchase_price: price, current_value: value }) }
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
    if (existing) { const totalQty = existing.quantity + sale.quantity, avgCost = ((existing.purchasePrice * existing.quantity) + (sale.purchasePrice * sale.quantity)) / totalQty; await supabase.from('products').update({ quantity: totalQty, purchase_price: Math.round(avgCost * 100) / 100, updated_at: new Date().toISOString() }).eq('id', existing.id) }
    else { await supabase.from('products').insert({ name: sale.productName, set_name: sale.set, product_type: sale.productType || 'Single Card', language: sale.language || 'English', condition: sale.condition, grade: sale.grade || '', quantity: sale.quantity, purchase_price: sale.purchasePrice, current_value: sale.salePrice }) }
    await supabase.from('sales').delete().eq('id', sale.id); await loadData(); setSyncing(false); setUndoSaleConfirmId(null)
  }

  const handleAddStock = async () => {
    if (!addStockProduct || !addStockData.purchasePrice || addStockData.quantity < 1) return
    setSyncing(true)
    const qty = parseInt(addStockData.quantity), price = parseFloat(addStockData.purchasePrice), totalQty = addStockProduct.quantity + qty, avgCost = ((addStockProduct.purchasePrice * addStockProduct.quantity) + (price * qty)) / totalQty
    await supabase.from('products').update({ quantity: totalQty, purchase_price: Math.round(avgCost * 100) / 100, updated_at: new Date().toISOString() }).eq('id', addStockProduct.id)
    await loadProducts(); setSyncing(false); setShowAddStock(false); setAddStockProduct(null); setAddStockData({ quantity: 1, purchasePrice: '' }); setAddStockUsd('')
  }

  const handleEdit = (p) => { setEditingProduct(p); setFormData({ name: p.name, set: p.set, productType: p.productType || 'Single Card', language: p.language || 'English', condition: p.condition, grade: p.grade || '', quantity: p.quantity, purchasePrice: p.purchasePrice, currentValue: p.currentValue }); setShowAddForm(true) }
  const openSellForm = (p) => { setSellingProduct(p); setSellData({ quantity: 1, salePrice: p.currentValue.toString() }); setShowSellForm(true) }
  const openAddStock = (p) => { setAddStockProduct(p); setAddStockData({ quantity: 1, purchasePrice: '' }); setAddStockUsd(''); setShowAddStock(true) }
  const resetForm = () => { setFormData({ name: '', set: '', productType: 'Single Card', language: 'English', condition: 'NM', grade: '', quantity: 1, purchasePrice: '', currentValue: '' }); setShowAddForm(false); setEditingProduct(null); setUsdInput('') }

  // Excel Import Functions
  const handleFileUpload = (e) => {
    const file = e.target.files[0]; if (!file) return; setImportError('')
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result), workbook = XLSX.read(data, { type: 'array' }), sheetName = workbook.SheetNames[0], worksheet = workbook.Sheets[sheetName], jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        if (jsonData.length < 2) { setImportError('Excel file must have at least a header row and one data row'); return }
        const headers = jsonData[0].map(h => String(h || '').trim()), rows = jsonData.slice(1).filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''))
        setExcelHeaders(headers); setImportData(rows)
        const autoMapping = {}
        headers.forEach((header, index) => {
          const h = header.toLowerCase()
          if ((h.includes('name') || h.includes('product') || h.includes('card')) && !autoMapping.name) autoMapping.name = index
          if ((h.includes('set') || h.includes('expansion')) && !autoMapping.set) autoMapping.set = index
          if (h.includes('type') && !autoMapping.productType) autoMapping.productType = index
          if (h.includes('lang') && !autoMapping.language) autoMapping.language = index
          if ((h.includes('cond') || h.includes('quality')) && !autoMapping.condition) autoMapping.condition = index
          if ((h.includes('grade') || h.includes('psa') || h.includes('cgc') || h.includes('bgs')) && !autoMapping.grade) autoMapping.grade = index
          if ((h.includes('qty') || h.includes('quantity') || h.includes('count')) && !autoMapping.quantity) autoMapping.quantity = index
          if ((h.includes('cost') || h.includes('purchase') || h.includes('paid') || h.includes('buy')) && !autoMapping.purchasePrice) autoMapping.purchasePrice = index
          if ((h.includes('value') || h.includes('price') || h.includes('worth') || h.includes('current') || h.includes('market')) && !autoMapping.currentValue) autoMapping.currentValue = index
        })
        setImportMapping(autoMapping); setImportStep(2)
      } catch (err) { setImportError('Failed to parse Excel file: ' + err.message) }
    }
    reader.onerror = () => { setImportError('Failed to read file') }
    reader.readAsArrayBuffer(file)
  }

  const generatePreview = () => {
    const preview = importData.slice(0, 10).map(row => ({
      name: importMapping.name !== undefined ? String(row[importMapping.name] || '') : '',
      set: importMapping.set !== undefined ? String(row[importMapping.set] || '') : '',
      productType: importMapping.productType !== undefined ? String(row[importMapping.productType] || 'Single Card') : 'Single Card',
      language: importMapping.language !== undefined ? String(row[importMapping.language] || 'English') : 'English',
      condition: importMapping.condition !== undefined ? String(row[importMapping.condition] || 'NM') : 'NM',
      grade: importMapping.grade !== undefined ? String(row[importMapping.grade] || '') : '',
      quantity: importMapping.quantity !== undefined ? parseInt(row[importMapping.quantity]) || 1 : 1,
      purchasePrice: importMapping.purchasePrice !== undefined ? parseFloat(row[importMapping.purchasePrice]) || 0 : 0,
      currentValue: importMapping.currentValue !== undefined ? parseFloat(row[importMapping.currentValue]) || 0 : 0,
    }))
    setImportPreview(preview); setImportStep(3)
  }

  const validateMapping = () => ['name', 'set', 'purchasePrice', 'currentValue'].filter(field => importMapping[field] === undefined)
  const normalizeType = (t) => { const validTypes = ['Single Card', 'Slab', 'Booster Box', 'Booster Pack', 'ETB', 'Collection Box', 'Special Box', 'Tin', 'Bundle', 'Other']; if (validTypes.includes(t)) return t; const tl = t.toLowerCase(); if (tl.includes('slab')) return 'Slab'; if (tl.includes('booster') && tl.includes('box')) return 'Booster Box'; if (tl.includes('booster') || tl.includes('pack')) return 'Booster Pack'; if (tl.includes('etb') || tl.includes('elite')) return 'ETB'; if (tl.includes('collection')) return 'Collection Box'; if (tl.includes('special')) return 'Special Box'; if (tl.includes('tin')) return 'Tin'; if (tl.includes('bundle')) return 'Bundle'; return 'Single Card' }
  const normalizeLang = (l) => { const validLangs = ['English', 'Japanese', 'Korean', 'Chinese (Traditional)', 'Chinese (Simplified)']; if (validLangs.includes(l)) return l; const ll = l.toLowerCase(); if (ll.includes('jap') || ll === 'jp' || ll === 'jpn') return 'Japanese'; if (ll.includes('kor') || ll === 'kr') return 'Korean'; if (ll.includes('chinese') && ll.includes('trad')) return 'Chinese (Traditional)'; if (ll.includes('chinese') || ll === 'cn' || ll === 'chs') return 'Chinese (Simplified)'; return 'English' }
  const normalizeCond = (c) => { const validConds = ['NM', 'LP', 'MP', 'HP', 'DMG']; const cu = c.toUpperCase(); if (validConds.includes(cu)) return cu; const cl = c.toLowerCase(); if (cl.includes('near') || cl === 'mint') return 'NM'; if (cl.includes('light')) return 'LP'; if (cl.includes('moderate')) return 'MP'; if (cl.includes('heavy')) return 'HP'; if (cl.includes('damage')) return 'DMG'; return 'NM' }

  const handleImport = async () => {
    setImportStep(4); setImportProgress(0); setSyncing(true)
    const validRows = importData.filter(row => { const name = importMapping.name !== undefined ? String(row[importMapping.name] || '') : ''; const set = importMapping.set !== undefined ? String(row[importMapping.set] || '') : ''; const price = importMapping.purchasePrice !== undefined ? parseFloat(row[importMapping.purchasePrice]) : 0; const value = importMapping.currentValue !== undefined ? parseFloat(row[importMapping.currentValue]) : 0; return name && set && !isNaN(price) && !isNaN(value) })
    let imported = 0, errors = 0
    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i]
      try {
        const name = String(row[importMapping.name] || '').trim(), set = String(row[importMapping.set] || '').trim()
        let productType = normalizeType(importMapping.productType !== undefined ? String(row[importMapping.productType] || 'Single Card').trim() : 'Single Card')
        let language = normalizeLang(importMapping.language !== undefined ? String(row[importMapping.language] || 'English').trim() : 'English')
        let condition = normalizeCond(importMapping.condition !== undefined ? String(row[importMapping.condition] || 'NM').trim() : 'NM')
        const grade = importMapping.grade !== undefined ? String(row[importMapping.grade] || '').trim() : '', quantity = importMapping.quantity !== undefined ? parseInt(row[importMapping.quantity]) || 1 : 1, purchasePrice = parseFloat(row[importMapping.purchasePrice]) || 0, currentValue = parseFloat(row[importMapping.currentValue]) || 0
        const existing = products.find(p => p.name.toLowerCase() === name.toLowerCase() && p.set.toLowerCase() === set.toLowerCase() && p.productType === productType && p.language === language && p.condition === condition && p.grade === grade)
        if (existing) { const totalQty = existing.quantity + quantity, avgCost = ((existing.purchasePrice * existing.quantity) + (purchasePrice * quantity)) / totalQty; await supabase.from('products').update({ quantity: totalQty, purchase_price: Math.round(avgCost * 100) / 100, current_value: currentValue, updated_at: new Date().toISOString() }).eq('id', existing.id) }
        else { await supabase.from('products').insert({ name, set_name: set, product_type: productType, language, condition, grade, quantity, purchase_price: purchasePrice, current_value: currentValue }) }
        imported++
      } catch (err) { console.error('Error importing row:', err); errors++ }
      setImportProgress(Math.round(((i + 1) / validRows.length) * 100))
    }
    await loadProducts(); setSyncing(false); setImportError(errors > 0 ? `Imported ${imported} items with ${errors} errors` : `Successfully imported ${imported} items!`); setTimeout(() => resetImport(), 2000)
  }

  const resetImport = () => { setShowImportModal(false); setImportData([]); setImportPreview([]); setImportMapping({}); setImportStep(1); setImportError(''); setImportProgress(0); setExcelHeaders([]); if (fileInputRef.current) fileInputRef.current.value = '' }
  const exportToCSV = (type) => { let csv = '', filename = ''; if (type === 'inventory') { csv = 'Name,Set,Type,Language,Condition,Grade,Quantity,Purchase Price,Current Value,P/L\n'; products.forEach(p => { csv += `"${p.name}","${p.set}","${p.productType}","${p.language}","${p.condition}","${p.grade}",${p.quantity},${p.purchasePrice.toFixed(2)},${p.currentValue.toFixed(2)},${((p.currentValue - p.purchasePrice) * p.quantity).toFixed(2)}\n` }); filename = `SCS_Inventory_${new Date().toISOString().split('T')[0]}.csv` } else { csv = 'Date,Product,Set,Type,Language,Condition,Grade,Qty,Purchase,Sale,P/L\n'; sales.forEach(s => { csv += `"${new Date(s.date).toLocaleDateString()}","${s.productName}","${s.set}","${s.productType}","${s.language}","${s.condition}","${s.grade}",${s.quantity},${s.purchasePrice.toFixed(2)},${s.salePrice.toFixed(2)},${s.profitLoss.toFixed(2)}\n` }); filename = `SCS_Sales_${new Date().toISOString().split('T')[0]}.csv` }; const blob = new Blob([csv], { type: 'text/csv' }), url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url) }
  const downloadTemplate = () => { const template = 'Name,Set,Type,Language,Condition,Grade,Quantity,Purchase Price,Current Value\nCharizard VMAX,Champions Path,Single Card,English,NM,,2,150.00,200.00\nPikachu V,Vivid Voltage,Slab,Japanese,NM,PSA 10,1,50.00,75.00\nBooster Box,Scarlet & Violet,Booster Box,English,NM,,1,140.00,160.00'; const blob = new Blob([template], { type: 'text/csv' }), url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = 'SCS_Import_Template.csv'; a.click(); URL.revokeObjectURL(url) }

  // Filter products by category and search
  const filterBySearch = (items) => items.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.set.toLowerCase().includes(searchTerm.toLowerCase()))
  const singlesProducts = filterBySearch(products.filter(p => SINGLE_TYPES.includes(p.productType || 'Single Card')))
  const sealedProducts = filterBySearch(products.filter(p => SEALED_TYPES.includes(p.productType)))
  const slabsProducts = filterBySearch(products.filter(p => SLAB_TYPES.includes(p.productType)))

  // Stats calculations
  const calcStats = (items) => ({ count: items.reduce((s, p) => s + p.quantity, 0), value: items.reduce((s, p) => s + (p.currentValue * p.quantity), 0), cost: items.reduce((s, p) => s + (p.purchasePrice * p.quantity), 0) })
  const singlesStats = calcStats(singlesProducts), sealedStats = calcStats(sealedProducts), slabsStats = calcStats(slabsProducts)
  const totalValue = singlesStats.value + sealedStats.value + slabsStats.value
  const totalCost = singlesStats.cost + sealedStats.cost + slabsStats.cost
  const unrealizedPL = totalValue - totalCost
  const totalItems = singlesStats.count + sealedStats.count + slabsStats.count
  const realizedPL = sales.reduce((s, sale) => s + sale.profitLoss, 0)

  if (loading) return <div style={{ minHeight: '100vh', backgroundColor: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.Loader /><p style={{ color: '#9ca3af', marginLeft: '8px' }}>Loading...</p></div>

  // Reusable Product Card Component
  const ProductCard = ({ p }) => {
    const pl = (p.currentValue - p.purchasePrice) * p.quantity
    const isLow = p.quantity <= lowStockThreshold
    return (
      <div style={{ backgroundColor: isLow ? 'rgba(217, 119, 6, 0.15)' : '#1f2937', borderRadius: '8px', padding: '10px', marginBottom: '8px', border: '1px solid #374151' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#fb923c', fontWeight: '500', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
            <div style={{ color: '#9ca3af', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.set}</div>
          </div>
          <div style={{ display: 'flex', gap: '2px', marginLeft: '8px' }}>
            <button onClick={() => openAddStock(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#60a5fa', padding: '2px' }} title="Add Stock"><Icons.PlusCircle /></button>
            <button onClick={() => openSellForm(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4ade80', padding: '2px' }} title="Sell"><Icons.Cart /></button>
            <button onClick={() => handleEdit(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fb923c', padding: '2px' }} title="Edit"><Icons.Edit /></button>
            {deleteConfirmId === p.id ? (
              <><button onClick={() => handleDelete(p.id)} style={{ padding: '1px 4px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '10px' }}>Y</button><button onClick={() => setDeleteConfirmId(null)} style={{ padding: '1px 4px', backgroundColor: '#4b5563', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '10px' }}>N</button></>
            ) : (
              <button onClick={() => setDeleteConfirmId(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', padding: '2px' }} title="Delete"><Icons.Trash /></button>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9ca3af' }}>
          <span>{p.condition}{p.grade && <span style={{ color: '#fbbf24', marginLeft: '2px' }}>{p.grade}</span>}</span>
          <span>{(p.language || 'EN').substring(0, 3)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #374151' }}>
          <div style={{ fontSize: '11px' }}>
            <span style={{ color: '#6b7280' }}>Qty: </span><span style={{ color: isLow ? '#fbbf24' : '#d1d5db' }}>{isLow && '⚠ '}{p.quantity}</span>
          </div>
          <div style={{ fontSize: '11px' }}>
            <span style={{ color: '#6b7280' }}>Cost: </span><span style={{ color: '#d1d5db' }}>${p.purchasePrice.toFixed(2)}</span>
          </div>
          <div style={{ fontSize: '11px' }}>
            <span style={{ color: '#6b7280' }}>Val: </span><span style={{ color: '#d1d5db' }}>${p.currentValue.toFixed(2)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: pl >= 0 ? '#4ade80' : '#f87171' }}>P/L: ${pl.toFixed(2)}</span>
        </div>
      </div>
    )
  }

  // Section Component for each category
  const CategorySection = ({ title, items, stats, color, emptyText }) => (
    <div style={{ flex: 1, minWidth: '280px', backgroundColor: '#111827', borderRadius: '8px', border: '1px solid #374151', overflow: 'hidden' }}>
      <div style={{ padding: '12px', borderBottom: '1px solid #374151', backgroundColor: '#0d1117' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color }}>{title}</h2>
          <span style={{ fontSize: '12px', color: '#9ca3af' }}>{stats.count} items</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px' }}>
          <div><span style={{ color: '#6b7280' }}>Value: </span><span style={{ color: '#4ade80' }}>${stats.value.toFixed(2)}</span></div>
          <div><span style={{ color: '#6b7280' }}>Cost: </span><span style={{ color: '#d1d5db' }}>${stats.cost.toFixed(2)}</span></div>
          <div><span style={{ color: '#6b7280' }}>P/L: </span><span style={{ color: (stats.value - stats.cost) >= 0 ? '#4ade80' : '#f87171' }}>${(stats.value - stats.cost).toFixed(2)}</span></div>
        </div>
      </div>
      <div style={{ padding: '8px', maxHeight: '60vh', overflowY: 'auto' }}>
        {items.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}><Icons.Package /><p style={{ marginTop: '8px', fontSize: '12px' }}>{emptyText}</p></div>
        ) : (
          items.map(p => <ProductCard key={p.id} p={p} />)
        )}
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111827', padding: '12px', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fb923c', margin: 0 }}>Secret Card Society</h1>
            <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Inventory Management {syncing && '• Syncing...'}</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => setShowImportModal(true)} style={{ padding: '6px 12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Upload /> Import</button>
            <button onClick={() => setShowDashboard(true)} style={{ padding: '6px 12px', backgroundColor: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>📊 Analytics</button>
            <button onClick={() => setShowSalesHistory(true)} style={{ padding: '6px 12px', backgroundColor: '#374151', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.History /> Sales</button>
            <button onClick={() => exportToCSV('inventory')} style={{ padding: '6px 12px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Download /> Export</button>
          </div>
        </div>

        {/* Summary Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px', marginBottom: '16px' }}>
          <div style={{ backgroundColor: '#1f2937', borderRadius: '8px', padding: '12px', border: '1px solid #374151' }}><p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>Total Items</p><p style={{ fontSize: '18px', fontWeight: 'bold', color: '#fb923c', margin: 0 }}>{totalItems}</p></div>
          <div style={{ backgroundColor: '#1f2937', borderRadius: '8px', padding: '12px', border: '1px solid #374151' }}><p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>Total Value</p><p style={{ fontSize: '18px', fontWeight: 'bold', color: '#fb923c', margin: 0 }}>${totalValue.toFixed(2)}</p></div>
          <div style={{ backgroundColor: '#1f2937', borderRadius: '8px', padding: '12px', border: '1px solid #374151' }}><p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>Total Cost</p><p style={{ fontSize: '18px', fontWeight: 'bold', color: '#d1d5db', margin: 0 }}>${totalCost.toFixed(2)}</p></div>
          <div style={{ backgroundColor: '#1f2937', borderRadius: '8px', padding: '12px', border: '1px solid #374151' }}><p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>Unrealized P/L</p><p style={{ fontSize: '18px', fontWeight: 'bold', color: unrealizedPL >= 0 ? '#4ade80' : '#f87171', margin: 0 }}>${unrealizedPL.toFixed(2)}</p></div>
          <div style={{ backgroundColor: '#1f2937', borderRadius: '8px', padding: '12px', border: '1px solid #374151' }}><p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>Realized P/L</p><p style={{ fontSize: '18px', fontWeight: 'bold', color: realizedPL >= 0 ? '#4ade80' : '#f87171', margin: 0 }}>${realizedPL.toFixed(2)}</p></div>
        </div>

        {/* Search & Add */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}><Icons.Search /></span>
            <input type="text" placeholder="Search all categories..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '10px 10px 10px 36px', backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <button onClick={() => setShowAddForm(true)} style={{ padding: '10px 16px', backgroundColor: '#ea580c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}><Icons.Plus /> Add Product</button>
        </div>

        {/* Three Column Layout */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <CategorySection title="🃏 Singles" items={singlesProducts} stats={singlesStats} color="#60a5fa" emptyText="No singles yet" />
          <CategorySection title="📦 Sealed" items={sealedProducts} stats={sealedStats} color="#f472b6" emptyText="No sealed products" />
          <CategorySection title="⭐ Slabs" items={slabsProducts} stats={slabsStats} color="#fbbf24" emptyText="No slabs yet" />
        </div>

        {/* Excel Import Modal */}
        {showImportModal && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }}>
            <div style={{ backgroundColor: '#1f2937', borderRadius: '8px', padding: '16px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflow: 'auto', border: '1px solid #374151' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ color: '#2563eb', fontSize: '18px', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><Icons.FileSpreadsheet /> Import from Excel</h2>
                <button onClick={resetImport} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><Icons.X /></button>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>{['Upload', 'Map', 'Preview', 'Import'].map((step, i) => <div key={step} style={{ flex: 1, textAlign: 'center' }}><div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: importStep > i + 1 ? '#16a34a' : importStep === i + 1 ? '#2563eb' : '#374151', color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', marginBottom: '4px' }}>{importStep > i + 1 ? <Icons.Check /> : i + 1}</div><div style={{ fontSize: '10px', color: importStep === i + 1 ? '#60a5fa' : '#6b7280' }}>{step}</div></div>)}</div>
              {importError && <div style={{ padding: '12px', marginBottom: '16px', borderRadius: '8px', backgroundColor: importError.includes('Successfully') ? 'rgba(22, 163, 74, 0.2)' : 'rgba(220, 38, 38, 0.2)', border: `1px solid ${importError.includes('Successfully') ? '#16a34a' : '#dc2626'}`, color: importError.includes('Successfully') ? '#4ade80' : '#f87171', fontSize: '13px' }}>{importError}</div>}
              {importStep === 1 && <div><div style={{ border: '2px dashed #374151', borderRadius: '8px', padding: '32px', textAlign: 'center', cursor: 'pointer', marginBottom: '16px', backgroundColor: '#111827' }} onClick={() => fileInputRef.current?.click()}><Icons.Upload /><p style={{ color: '#9ca3af', margin: '8px 0 4px' }}>Click to upload Excel file</p><p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>Supports .xlsx, .xls, .csv</p><input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} style={{ display: 'none' }} /></div><button onClick={downloadTemplate} style={{ width: '100%', padding: '10px', backgroundColor: '#374151', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Icons.Download /> Download Template</button></div>}
              {importStep === 2 && <div><p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '16px' }}>Map your Excel columns. Found {importData.length} rows.</p><div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>{requiredFields.map(field => <div key={field.key} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><div style={{ width: '110px', fontSize: '12px', color: field.required ? '#fb923c' : '#9ca3af' }}>{field.label}{field.required && ' *'}</div><select value={importMapping[field.key] ?? ''} onChange={(e) => setImportMapping({ ...importMapping, [field.key]: e.target.value === '' ? undefined : parseInt(e.target.value) })} style={{ flex: 1, padding: '8px', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '6px', color: 'white', fontSize: '12px' }}><option value="">-- Select --</option>{excelHeaders.map((h, i) => <option key={i} value={i}>{h || `Col ${i + 1}`}</option>)}</select></div>)}</div><div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}><button onClick={() => setImportStep(1)} style={{ flex: 1, padding: '10px', backgroundColor: '#374151', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Back</button><button onClick={() => { const m = validateMapping(); if (m.length) setImportError(`Map required: ${m.join(', ')}`); else { setImportError(''); generatePreview() } }} style={{ flex: 1, padding: '10px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Preview</button></div></div>}
              {importStep === 3 && <div><p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '12px' }}>Preview ({importPreview.length} of {importData.length})</p><div style={{ overflowX: 'auto', marginBottom: '12px' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}><thead><tr style={{ backgroundColor: '#111827' }}><th style={{ padding: '6px', textAlign: 'left', color: '#9ca3af', borderBottom: '1px solid #374151' }}>Name</th><th style={{ padding: '6px', textAlign: 'left', color: '#9ca3af', borderBottom: '1px solid #374151' }}>Set</th><th style={{ padding: '6px', textAlign: 'left', color: '#9ca3af', borderBottom: '1px solid #374151' }}>Type</th><th style={{ padding: '6px', textAlign: 'left', color: '#9ca3af', borderBottom: '1px solid #374151' }}>Qty</th><th style={{ padding: '6px', textAlign: 'left', color: '#9ca3af', borderBottom: '1px solid #374151' }}>Cost</th><th style={{ padding: '6px', textAlign: 'left', color: '#9ca3af', borderBottom: '1px solid #374151' }}>Value</th></tr></thead><tbody>{importPreview.map((item, i) => <tr key={i}><td style={{ padding: '6px', color: '#fb923c', borderBottom: '1px solid #374151' }}>{item.name}</td><td style={{ padding: '6px', color: '#d1d5db', borderBottom: '1px solid #374151' }}>{item.set}</td><td style={{ padding: '6px', color: '#d1d5db', borderBottom: '1px solid #374151' }}>{item.productType}</td><td style={{ padding: '6px', color: '#d1d5db', borderBottom: '1px solid #374151' }}>{item.quantity}</td><td style={{ padding: '6px', color: '#d1d5db', borderBottom: '1px solid #374151' }}>${item.purchasePrice.toFixed(2)}</td><td style={{ padding: '6px', color: '#d1d5db', borderBottom: '1px solid #374151' }}>${item.currentValue.toFixed(2)}</td></tr>)}</tbody></table></div><div style={{ display: 'flex', gap: '8px' }}><button onClick={() => setImportStep(2)} style={{ flex: 1, padding: '10px', backgroundColor: '#374151', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Back</button><button onClick={handleImport} style={{ flex: 1, padding: '10px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Import {importData.length}</button></div></div>}
              {importStep === 4 && <div style={{ textAlign: 'center', padding: '32px' }}><Icons.Loader /><p style={{ color: '#9ca3af', margin: '16px 0 8px' }}>Importing...</p><div style={{ width: '100%', height: '8px', backgroundColor: '#374151', borderRadius: '4px', overflow: 'hidden' }}><div style={{ width: `${importProgress}%`, height: '100%', backgroundColor: '#2563eb', transition: 'width 0.3s' }}></div></div><p style={{ color: '#6b7280', fontSize: '12px', marginTop: '8px' }}>{importProgress}%</p></div>}
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showAddForm && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }}>
            <div style={{ backgroundColor: '#1f2937', borderRadius: '8px', padding: '16px', width: '100%', maxWidth: '400px', maxHeight: '90vh', overflow: 'auto', border: '1px solid #374151' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}><h2 style={{ color: '#fb923c', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{editingProduct ? 'Edit' : 'Add'} Product</h2><button onClick={resetForm} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><Icons.X /></button></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div><label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Product Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Charizard VMAX" style={{ width: '100%', padding: '8px', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '6px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} /></div>
                <div><label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Set *</label><input type="text" value={formData.set} onChange={(e) => setFormData({ ...formData, set: e.target.value })} placeholder="e.g., Champion's Path" style={{ width: '100%', padding: '8px', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '6px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div><label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Type</label><select value={formData.productType} onChange={(e) => setFormData({ ...formData, productType: e.target.value })} style={{ width: '100%', padding: '8px', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '6px', color: 'white', fontSize: '14px' }}><option>Single Card</option><option>Slab</option><option>Booster Box</option><option>Booster Pack</option><option>ETB</option><option>Collection Box</option><option>Special Box</option><option>Tin</option><option>Bundle</option><option>Other</option></select></div>
                  <div><label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Language</label><select value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value })} style={{ width: '100%', padding: '8px', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '6px', color: 'white', fontSize: '14px' }}><option>English</option><option>Japanese</option><option>Korean</option><option>Chinese (Traditional)</option><option>Chinese (Simplified)</option></select></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div><label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Condition</label><select value={formData.condition} onChange={(e) => setFormData({ ...formData, condition: e.target.value })} style={{ width: '100%', padding: '8px', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '6px', color: 'white', fontSize: '14px' }}><option value="NM">Near Mint</option><option value="LP">Lightly Played</option><option value="MP">Moderately Played</option><option value="HP">Heavily Played</option><option value="DMG">Damaged</option></select></div>
                  <div><label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Grade</label><input type="text" value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value })} placeholder="e.g., PSA 10" style={{ width: '100%', padding: '8px', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '6px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <div><label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Qty</label><input type="number" min="1" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} style={{ width: '100%', padding: '8px', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '6px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} /></div>
                  <div><label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Cost SGD *</label><input type="number" step="0.01" value={formData.purchasePrice} onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })} placeholder="0.00" style={{ width: '100%', padding: '8px', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '6px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} /></div>
                  <div><label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Value SGD *</label><input type="number" step="0.01" value={formData.currentValue} onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })} placeholder="0.00" style={{ width: '100%', padding: '8px', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '6px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} /></div>
                </div>
                <div style={{ padding: '12px', backgroundColor: '#374151', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}><span style={{ fontSize: '12px', color: '#9ca3af' }}>USD → SGD</span><div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ fontSize: '11px', color: '#6b7280' }}>Rate:</span><input type="number" step="0.01" value={exchangeRate} onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 1.35)} style={{ width: '50px', padding: '4px', backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '4px', color: 'white', fontSize: '11px' }} /></div></div>
                  <div style={{ display: 'flex', gap: '8px' }}><input type="number" step="0.01" value={usdInput} onChange={(e) => setUsdInput(e.target.value)} placeholder="USD" style={{ flex: 1, padding: '8px', backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '6px', color: 'white', fontSize: '14px' }} /><button onClick={() => usdInput && setFormData({ ...formData, purchasePrice: (parseFloat(usdInput) * exchangeRate).toFixed(2) })} style={{ padding: '8px', backgroundColor: '#ea580c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>→Cost</button><button onClick={() => usdInput && setFormData({ ...formData, currentValue: (parseFloat(usdInput) * exchangeRate).toFixed(2) })} style={{ padding: '8px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>→Val</button></div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}><button onClick={resetForm} style={{ flex: 1, padding: '10px', backgroundColor: '#374151', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>Cancel</button><button onClick={handleSubmit} disabled={syncing} style={{ flex: 1, padding: '10px', backgroundColor: '#ea580c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', opacity: syncing ? 0.5 : 1 }}>{syncing ? 'Saving...' : (editingProduct ? 'Update' : 'Add')}</button></div>
              </div>
            </div>
          </div>
        )}

        {/* Sell Modal */}
        {showSellForm && sellingProduct && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }}>
            <div style={{ backgroundColor: '#1f2937', borderRadius: '8px', padding: '16px', width: '100%', maxWidth: '360px', border: '1px solid #374151' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ color: '#4ade80', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Sell Product</h2>
                <button onClick={() => { setShowSellForm(false); setSellingProduct(null) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><Icons.X /></button>
              </div>
              <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#111827', borderRadius: '8px' }}>
                <div style={{ color: '#fb923c', fontWeight: 'bold', marginBottom: '4px' }}>{sellingProduct.name}</div>
                <div style={{ color: '#9ca3af', fontSize: '12px' }}>{sellingProduct.set} • {sellingProduct.condition}{sellingProduct.grade && ` • ${sellingProduct.grade}`}</div>
                <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>Available: {sellingProduct.quantity} • Cost: ${sellingProduct.purchasePrice.toFixed(2)}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Quantity</label>
                    <input type="number" min="1" max={sellingProduct.quantity} value={sellData.quantity} onChange={(e) => setSellData({ ...sellData, quantity: Math.min(parseInt(e.target.value) || 1, sellingProduct.quantity) })} style={{ width: '100%', padding: '8px', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '6px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Sale Price (SGD)</label>
                    <input type="number" step="0.01" value={sellData.salePrice} onChange={(e) => setSellData({ ...sellData, salePrice: e.target.value })} placeholder="0.00" style={{ width: '100%', padding: '8px', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '6px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                </div>
                {sellData.salePrice && (
                  <div style={{ padding: '12px', backgroundColor: '#111827', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Profit/Loss</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: (parseFloat(sellData.salePrice) - sellingProduct.purchasePrice) * sellData.quantity >= 0 ? '#4ade80' : '#f87171' }}>
                      {(parseFloat(sellData.salePrice) - sellingProduct.purchasePrice) * sellData.quantity >= 0 ? '+' : ''}${((parseFloat(sellData.salePrice) - sellingProduct.purchasePrice) * sellData.quantity).toFixed(2)}
                    </div>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => { setShowSellForm(false); setSellingProduct(null) }} style={{ flex: 1, padding: '10px', backgroundColor: '#374151', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
                  <button onClick={handleSell} disabled={syncing || !sellData.salePrice} style={{ flex: 1, padding: '10px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', opacity: (syncing || !sellData.salePrice) ? 0.5 : 1 }}>{syncing ? 'Selling...' : 'Confirm Sale'}</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Stock Modal */}
        {showAddStock && addStockProduct && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 }}>
            <div style={{ backgroundColor: '#1f2937', borderRadius: '8px', padding: '16px', width: '100%', maxWidth: '360px', border: '1px solid #374151' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ color: '#60a5fa', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>Add Stock</h2>
                <button onClick={() => { setShowAddStock(false); setAddStockProduct(null) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><Icons.X /></button>
              </div>
              <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#111827', borderRadius: '8px' }}>
                <div style={{ color: '#fb923c', fontWeight: 'bold', marginBottom: '4px' }}>{addStockProduct.name}</div>
                <div style={{ color: '#9ca3af', fontSize: '12px' }}>{addStockProduct.set} • {addStockProduct.condition}{addStockProduct.grade && ` • ${addStockProduct.grade}`}</div>
                <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>Current: {addStockProduct.quantity} units • Avg Cost: ${addStockProduct.purchasePrice.toFixed(2)}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Quantity</label>
                    <input type="number" min="1" value={addStockData.quantity} onChange={(e) => setAddStockData({ ...addStockData, quantity: parseInt(e.target.value) || 1 })} style={{ width: '100%', padding: '8px', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '6px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Cost (SGD)</label>
                    <input type="number" step="0.01" value={addStockData.purchasePrice} onChange={(e) => setAddStockData({ ...addStockData, purchasePrice: e.target.value })} placeholder="0.00" style={{ width: '100%', padding: '8px', backgroundColor: '#374151', border: '1px solid #4b5563', borderRadius: '6px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <div style={{ padding: '12px', backgroundColor: '#374151', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>USD → SGD</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '11px', color: '#6b7280' }}>Rate:</span>
                      <input type="number" step="0.01" value={exchangeRate} onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 1.35)} style={{ width: '50px', padding: '4px', backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '4px', color: 'white', fontSize: '11px' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="number" step="0.01" value={addStockUsd} onChange={(e) => setAddStockUsd(e.target.value)} placeholder="USD" style={{ flex: 1, padding: '8px', backgroundColor: '#1f2937', border: '1px solid #4b5563', borderRadius: '6px', color: 'white', fontSize: '14px' }} />
                    <button onClick={() => addStockUsd && setAddStockData({ ...addStockData, purchasePrice: (parseFloat(addStockUsd) * exchangeRate).toFixed(2) })} style={{ padding: '8px 12px', backgroundColor: '#ea580c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>Convert</button>
                  </div>
                </div>
                {addStockData.purchasePrice && (
                  <div style={{ padding: '12px', backgroundColor: '#111827', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>New Average Cost</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#60a5fa' }}>
                      ${(((addStockProduct.purchasePrice * addStockProduct.quantity) + (parseFloat(addStockData.purchasePrice) * addStockData.quantity)) / (addStockProduct.quantity + addStockData.quantity)).toFixed(2)}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>Total: {addStockProduct.quantity + addStockData.quantity} units</div>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => { setShowAddStock(false); setAddStockProduct(null) }} style={{ flex: 1, padding: '10px', backgroundColor: '#374151', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
                  <button onClick={handleAddStock} disabled={syncing || !addStockData.purchasePrice} style={{ flex: 1, padding: '10px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', opacity: (syncing || !addStockData.purchasePrice) ? 0.5 : 1 }}>{syncing ? 'Adding...' : 'Add Stock'}</button>
                </div>
              </div>
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div style={{ backgroundColor: '#111827', padding: '16px', borderRadius: '8px' }}>
                  <h3 style={{ color: '#d1d5db', fontSize: '14px', margin: '0 0 12px' }}>By Category</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}><span style={{ color: '#60a5fa', fontSize: '13px' }}>🃏 Singles</span><span style={{ color: '#d1d5db', fontSize: '12px' }}>{singlesStats.count} items • ${singlesStats.value.toFixed(2)}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}><span style={{ color: '#f472b6', fontSize: '13px' }}>📦 Sealed</span><span style={{ color: '#d1d5db', fontSize: '12px' }}>{sealedStats.count} items • ${sealedStats.value.toFixed(2)}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ color: '#fbbf24', fontSize: '13px' }}>⭐ Slabs</span><span style={{ color: '#d1d5db', fontSize: '12px' }}>{slabsStats.count} items • ${slabsStats.value.toFixed(2)}</span></div>
                </div>
                <div style={{ backgroundColor: '#111827', padding: '16px', borderRadius: '8px' }}>
                  <h3 style={{ color: '#d1d5db', fontSize: '14px', margin: '0 0 12px' }}>Top 5 by Value</h3>
                  {[...products].sort((a, b) => (b.currentValue * b.quantity) - (a.currentValue * a.quantity)).slice(0, 5).map((p, i) => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '12px' }}>
                      <span style={{ color: '#9ca3af' }}>#{i + 1} <span style={{ color: '#fb923c' }}>{p.name}</span></span>
                      <span style={{ color: '#4ade80' }}>${(p.currentValue * p.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
