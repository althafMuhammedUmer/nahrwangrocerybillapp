import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useSupabase } from './context/SupabaseContext'

import POS from './pages/POS'
import AdminAuth from './pages/AdminAuth'
import AdminDashboard from './pages/AdminDashboard'

function PrivateRoute({ children }) {
  const { supabase, isReady } = useSupabase()
  if (!isReady) return <div className="glass-panel" style={{ margin: '2rem', padding: '2rem', textAlign: 'center' }}>Loading App...</div>

  if (!supabase) {
    return (
      <div className="glass-panel" style={{ margin: '2rem', padding: '2rem', textAlign: 'center', color: 'var(--color-danger)' }}>
        <h3>Database Connection Failed</h3>
        <p>Please check your .env file configuration.</p>
        <p style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '1rem' }}>VITE_SUPABASE_URL<br />VITE_SUPABASE_ANON_KEY</p>
      </div>
    )
  }
  return children
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <PrivateRoute><POS /></PrivateRoute>
        } />

        <Route path="/admin" element={
          <PrivateRoute><AdminAuth /></PrivateRoute>
        } />

        <Route path="/admin/dashboard" element={
          <PrivateRoute><AdminDashboard /></PrivateRoute>
        } />
      </Routes>
    </Router>
  )
}
