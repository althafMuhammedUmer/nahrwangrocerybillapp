import { useState } from 'react'
import { useSupabase } from '../context/SupabaseContext'

export default function Connect() {
    const { updateCredentials } = useSupabase()
    const [url, setUrl] = useState('')
    const [key, setKey] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        updateCredentials(url, key)
    }

    return (
        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '400px', margin: '20vh auto', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '1rem' }}>Connect to Cloud</h2>
            <p style={{ marginBottom: '1.5rem', color: 'var(--color-text-dim)' }}>Enter your Supabase credentials to start.</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                    type="text"
                    placeholder="Project URL (https://...supabase.co)"
                    className="input-field"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Anon API Key"
                    className="input-field"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    required
                />
                <button type="submit" className="btn btn-primary">
                    Connect System
                </button>
            </form>

            <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>
                <p>Don't have a project?</p>
                <a href="https://supabase.com" target="_blank" style={{ color: 'var(--color-primary)' }}>Create Free Account</a>
            </div>
        </div>
    )
}
