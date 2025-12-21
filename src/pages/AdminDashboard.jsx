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
        <div style={{ padding: '1rem', paddingBottom: '5rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>Manage Store</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link to="/" className="btn btn-secondary">POS</Link>
                    <button onClick={handleLogout} className="btn btn-secondary" style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>Exit</button>
                </div>
            </header>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', overflowX: 'auto' }}>
                <button onClick={() => setTab('overview')} className={`btn ${tab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}>Overview</button>
                <button onClick={() => setTab('products')} className={`btn ${tab === 'products' ? 'btn-primary' : 'btn-secondary'}`}>Products</button>
                <button onClick={() => setTab('history')} className={`btn ${tab === 'history' ? 'btn-primary' : 'btn-secondary'}`}>Bill History</button>
            </div>

            {tab === 'products' && <ProductManager />}
            {tab === 'overview' && <div className="glass-panel" style={{ padding: '2rem' }}>Analytics coming soon...</div>}
            {tab === 'history' && <BillHistory />}
        </div>
    )
}
