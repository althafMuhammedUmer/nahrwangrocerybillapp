import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminAuth() {
    const [pin, setPin] = useState('')
    const navigate = useNavigate()

    const handleLogin = (e) => {
        e.preventDefault()
        // Simple hardcoded PIN for now
        if (pin === '1234') {
            sessionStorage.setItem('admin_auth', 'true')
            navigate('/admin/dashboard')
        } else {
            alert('Incorrect PIN')
        }
    }

    return (
        <div className="glass-panel" style={{ margin: '20vh auto', maxWidth: '300px', padding: '2rem', textAlign: 'center' }}>
            <h2>Admin Access</h2>
            <form onSubmit={handleLogin} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input
                    type="number"
                    placeholder="Enter PIN"
                    className="input-field"
                    style={{ textAlign: 'center', letterSpacing: '0.5rem' }}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">Unlock</button>
            </form>
        </div>
    )
}
