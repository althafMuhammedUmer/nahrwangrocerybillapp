import { useState, useEffect } from 'react'
import { useSupabase } from '../../context/SupabaseContext'
import { Trash2, Plus, Search } from 'lucide-react'

export default function ProductManager() {
    const { supabase } = useSupabase()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')

    // Form State
    const [newProduct, setNewProduct] = useState({ barcode: '', name: '', price: '', variant: '' })

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        setLoading(true)
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
        if (error) console.error(error)
        else setProducts(data)
        setLoading(false)
    }

    const handleAdd = async (e) => {
        e.preventDefault()
        if (!newProduct.barcode || !newProduct.name || !newProduct.price) return

        const { error } = await supabase.from('products').insert([{
            barcode: newProduct.barcode,
            name: newProduct.name,
            price: parseFloat(newProduct.price),
            variant: newProduct.variant // Optional
        }])

        if (error) {
            if (error.code === '23505' || error.message.includes('unique constraint') || error.message.includes('Conflict')) {
                alert('Duplicate Product! A product with this barcode already exists.')
            } else {
                alert('Error adding product: ' + error.message)
            }
        } else {
            setNewProduct({ barcode: '', name: '', price: '', variant: '' })
            fetchProducts()
        }
    }

    const handleDelete = async (id) => {
        console.log("Attempting to delete product:", id)
        if (!confirm('Delete this product?')) {
            console.log("Delete cancelled by user")
            return
        }
        const { data, error } = await supabase.from('products').delete().eq('id', id).select()
        console.log("Delete result:", { data, error })

        if (error) alert('Error deleting: ' + error.message)
        else {
            console.log("Delete successful, refreshing list...")
            fetchProducts()
        }
    }

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.barcode.includes(search) ||
        (p.variant && p.variant.toLowerCase().includes(search.toLowerCase()))
    )

    return (
        <div>
            <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem' }}>
                <h3>Add New Product</h3>
                <form onSubmit={handleAdd} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                    <input
                        placeholder="Barcode"
                        className="input-field"
                        style={{ flex: '1 1 40%' }}
                        value={newProduct.barcode}
                        onChange={e => setNewProduct({ ...newProduct, barcode: e.target.value })}
                    />
                    <input
                        placeholder="Product Name"
                        className="input-field"
                        style={{ flex: '1 1 50%' }}
                        value={newProduct.name}
                        onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                    <input
                        placeholder="Size (e.g 1L)"
                        className="input-field"
                        style={{ flex: '1 1 30%' }}
                        value={newProduct.variant}
                        onChange={e => setNewProduct({ ...newProduct, variant: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="AED"
                        className="input-field"
                        style={{ flex: '1 1 20%' }}
                        value={newProduct.price}
                        onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                    />
                    <button type="submit" className="btn btn-primary" style={{ flex: '1 1 100%' }}>Add Product</button>
                </form>
            </div>

            <div className="glass-panel" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3>Product List ({products.length})</h3>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#aaa' }} />
                        <input
                            placeholder="Search..."
                            className="input-field"
                            style={{ paddingLeft: '2rem' }}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? <p>Loading...</p> : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '400px', overflowY: 'auto' }}>
                        {filtered.map(product => (
                            <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                                <div style={{ overflow: 'hidden', marginRight: '1rem' }}>
                                    <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {product.name} <span style={{ fontSize: '0.8em', color: 'var(--color-accent)' }}>{product.variant}</span>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{product.barcode}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                                    <div style={{ color: 'var(--color-primary)' }}>AED {product.price}</div>
                                    <button onClick={() => handleDelete(product.id)} className="btn" style={{ padding: '0.5rem', color: 'var(--color-danger)' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
