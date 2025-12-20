import { useState, useEffect, useRef } from 'react'
import { useSupabase } from '../context/SupabaseContext'
import { ReceiptTemplate } from '../components/Receipt/ReceiptTemplate'
// Native window.print used instead.

import { Trash2, Search, Printer, Menu, History } from 'lucide-react'
import { Link } from 'react-router-dom'
import '../print.css'

export default function POS() {
    const { supabase } = useSupabase()
    const [cart, setCart] = useState([])
    const [barcode, setBarcode] = useState('')
    const [products, setProducts] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)

    // Print Ref
    const receiptRef = useRef()

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        setLoading(true)
        const { data } = await supabase.from('products').select('*')
        if (data) setProducts(data)
        setLoading(false)
    }

    const addToCart = (product) => {
        const existing = cart.find(item => item.id === product.id)
        if (existing) {
            setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
        } else {
            setCart([...cart, { ...product, quantity: 1 }])
        }
    }

    const handleBarcodeHelper = (code) => {
        const product = products.find(p => p.barcode === code)
        if (product) {
            addToCart(product)
            setBarcode('')
            return true
        }
        return false
    }

    const handleBarcodeSubmit = (e) => {
        e.preventDefault()
        if (!handleBarcodeHelper(barcode)) {
            alert('Product not found!')
        }
    }

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id))
    }

    const adjustQty = (id, delta) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const newQty = item.quantity + delta
                return newQty > 0 ? { ...item, quantity: newQty } : item
            }
            return item
        }))
    }

    // Calculations
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const vat = total * (5 / 105) // Tax Inclusive logic: Price includes 5%. So VAT is 5/105 of Price.

    const handleCheckout = async () => {
        if (cart.length === 0) return

        // Save to DB
        const { data: bill, error } = await supabase.from('bills').insert([{
            total_amount: total,
            vat_amount: vat,
            payment_method: 'cash' // Default for now
        }]).select().single()

        if (error) {
            alert('Error saving bill: ' + error.message)
            return
        }

        // Save Items
        const items = cart.map(item => ({
            bill_id: bill.id,
            product_name: item.name + (item.variant ? ` (${item.variant})` : ''),
            quantity: item.quantity,
            price_at_sale: item.price,
            total: item.price * item.quantity
        }))

        await supabase.from('bill_items').insert(items)

        // Print
        // We set the print state triggers if needed, but here we just call print
        setTimeout(() => {
            window.print()
            setCart([])
        }, 500) // Increased delay slightly to allow DOM to settle
    }

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <header className="glass-panel" style={{ padding: '0.75rem', display: 'flex', justifyContent: 'space-between', borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0 }}>
                <div style={{ fontWeight: 'bold' }}>Nahrawan Grocery POS</div>
                <Link to="/admin" style={{ color: 'white' }}><Menu /></Link>
            </header>

            {/* Main Grid */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 350px', overflow: 'hidden' }}>

                {/* Left: Product Selection */}
                <div style={{ padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <form onSubmit={handleBarcodeSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            autoFocus
                            placeholder="Scan Barcode..."
                            className="input-field"
                            value={barcode}
                            onChange={e => setBarcode(e.target.value)}
                        />
                        <input
                            placeholder="Search Name..."
                            className="input-field"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </form>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
                        {filteredProducts.map(product => (
                            <button
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className="glass-panel"
                                style={{ padding: '1rem', textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '100px', border: '1px solid rgba(255,255,255,0.1)' }}
                            >
                                <div style={{ fontWeight: '600' }}>
                                    {product.name}
                                    {product.variant && <span style={{ display: 'block', fontSize: '0.8em', color: 'var(--color-accent)', fontWeight: 'normal' }}>{product.variant}</span>}
                                </div>
                                <div style={{ color: 'var(--color-primary)', marginTop: '0.5rem' }}>AED {product.price}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Cart */}
                <div className="glass-panel" style={{ margin: '1rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', fontWeight: 'bold' }}>Current Bill</div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                        {cart.map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', alignItems: 'center' }}>
                                <div style={{ flex: 1 }}>
                                    <div>{item.name} <span style={{ fontSize: '0.8em', color: 'var(--color-accent)' }}>{item.variant}</span></div>
                                    <div style={{ fontSize: '0.8rem', color: '#aaa' }}>AED {item.price} x {item.quantity}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ fontWeight: 'bold' }}>{(item.price * item.quantity).toFixed(2)}</div>
                                    <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>Subtotal (Ex. VAT)</span>
                            <span>{(total - vat).toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#aaa' }}>
                            <span>VAT (5%)</span>
                            <span>{vat.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                            <span>Total</span>
                            <span>AED {total.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                            disabled={cart.length === 0}
                        >
                            Checkout & Print
                        </button>
                    </div>
                </div>
            </div>

            {/* Hidden Receipt - Visible only on Print */}
            <div className="printable-area">
                <ReceiptTemplate
                    ref={receiptRef}
                    cart={cart}
                    total={total}
                    vat={vat}
                    date={new Date().toLocaleString()}
                    invoiceId="PENDING"
                />
            </div>
        </div>
    )
}
