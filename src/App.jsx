import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useSupabase } from './context/SupabaseContext'
import Connect from './pages/Connect'
import POS from './pages/POS'
import AdminAuth from './pages/AdminAuth'
import AdminDashboard from './pages/AdminDashboard'

function PrivateRoute({ children }) {
  const { supabase, isReady } = useSupabase()
  if (!isReady) return <div className="glass-panel" style={{ margin: '2rem', padding: '2rem', textAlign: 'center' }}>Loading App...</div>
  return supabase ? children : <Navigate to="/connect" />
}

export default function App() {
  const { supabase } = useSupabase()

  return (
    <Router>
      <Routes>
        <Route path="/connect" element={!supabase ? <Connect /> : <Navigate to="/" />} />

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
