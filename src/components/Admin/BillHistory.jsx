import { useState, useEffect, useRef } from 'react'
import { useSupabase } from '../../context/SupabaseContext'
import { ReceiptTemplate } from '../Receipt/ReceiptTemplate'
import { Printer, ChevronDown, ChevronRight } from 'lucide-react'
import '../../print.css'

export default function BillHistory() {
    const { supabase } = useSupabase()
    const [bills, setBills] = useState([])
    const [loading, setLoading] = useState(false)
    const [expanded, setExpanded] = useState(null)
    const [billItems, setBillItems] = useState({}) // Cache items by bill_id

    // For Reprint
    const [printData, setPrintData] = useState(null)

    useEffect(() => {
        fetchBills()
    }, [])

    const fetchBills = async () => {
        setLoading(true)
        const { data } = await supabase.from('bills').select('*').order('created_at', { ascending: false }).limit(50)
        if (data) setBills(data)
        setLoading(false)
    }

    const toggleExpand = async (billId) => {
        if (expanded === billId) {
            setExpanded(null)
            return
        }
        setExpanded(billId)
        if (!billItems[billId]) {
            const { data } = await supabase.from('bill_items').select('*').eq('bill_id', billId)
            if (data) {
                setBillItems(prev => ({ ...prev, [billId]: data }))
            }
        }
    }

    const handleReprint = (bill) => {
        const items = billItems[bill.id] || []
        if (items.length === 0) {
            alert("Please expand the bill first to load items before printing.")
            return
        }

        // Transform items to cart format for receipt
        const formattedCart = items.map(i => ({
            name: i.product_name,
            quantity: i.quantity,
            price: i.price_at_sale
        }))

        setPrintData({
            cart: formattedCart,
            total: bill.total_amount,
            vat: bill.vat_amount,
            date: new Date(bill.created_at).toLocaleString(),
            invoiceId: bill.id
        })

        // Trigger print after render
        setTimeout(() => window.print(), 100)
    }

    return (
        <div>
            <div className="glass-panel" style={{ padding: '1rem' }}>
                <h3>Recent Transactions</h3>
                {loading && <p>Loading...</p>}

                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {bills.map(bill => (
                        <div key={bill.id} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', overflow: 'hidden' }}>
                            <div
                                style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                                onClick={() => toggleExpand(bill.id)}
                            >
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    {expanded === bill.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>Bill #{bill.id}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{new Date(bill.created_at).toLocaleString()}</div>
                                    </div>
                                </div>
                                <div style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>AED {bill.total_amount.toFixed(2)}</div>
                            </div>

                            {expanded === bill.id && (
                                <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
                                    <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {(billItems[bill.id] || []).map(item => (
                                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.25rem' }}>
                                                <div style={{ flex: 1, paddingRight: '0.5rem' }}>
                                                    <div style={{ color: 'white' }}>{item.product_name}</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{item.quantity} x {item.price_at_sale}</div>
                                                </div>
                                                <div style={{ fontWeight: 'bold' }}>{item.total}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={() => handleReprint(bill)} className="btn btn-secondary" style={{ width: '100%', gap: '0.5rem' }}>
                                        <Printer size={16} /> Reprint Receipt
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Hidden Reprint Template */}
            {printData && (
                <div className="printable-area">
                    <ReceiptTemplate
                        cart={printData.cart}
                        total={printData.total}
                        vat={printData.vat}
                        date={printData.date}
                        invoiceId={printData.invoiceId}
                    />
                </div>
            )}
        </div>
    )
}
