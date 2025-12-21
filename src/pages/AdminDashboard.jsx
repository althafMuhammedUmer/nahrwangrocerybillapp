import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSupabase } from '../context/SupabaseContext'
import ProductManager from '../components/Admin/ProductManager'
import BillHistory from '../components/Admin/BillHistory'

export default function AdminDashboard() {
    const { disconnect } = useSupabase()
    const navigate = useNavigate()
    const [tab, setTab] = useState('products')

    const handleLogout = () => {
        sessionStorage.removeItem('admin_auth')
        disconnect()
        navigate('/')
    }

    return (
        <div style={{ padding: '0.75rem', paddingBottom: '5rem', width: '100%', overflowX: 'hidden' }}>
            <header style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '1rem', margin: 0 }}>Admin Dashboard</h1>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>Manage Store</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link to="/" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>POS</Link>
                    <button onClick={handleLogout} className="btn btn-secondary" style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Exit</button>
                </div>
            </header>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
                <button onClick={() => setTab('overview')} className={`btn ${tab === 'overview' ? 'btn-primary' : 'btn-secondary'}`} style={{ whiteSpace: 'nowrap' }}>Overview</button>
                <button onClick={() => setTab('products')} className={`btn ${tab === 'products' ? 'btn-primary' : 'btn-secondary'}`} style={{ whiteSpace: 'nowrap' }}>Products</button>
                <button onClick={() => setTab('history')} className={`btn ${tab === 'history' ? 'btn-primary' : 'btn-secondary'}`} style={{ whiteSpace: 'nowrap' }}>Bill History</button>
            </div>

            {tab === 'products' && <ProductManager />}
            {tab === 'overview' && <div className="glass-panel" style={{ padding: '2rem' }}>Analytics coming soon...</div>}
            {tab === 'history' && <BillHistory />}
        </div>
    )
}
