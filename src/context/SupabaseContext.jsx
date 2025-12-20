import { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const SupabaseContext = createContext()

export function SupabaseProvider({ children }) {
    const [supabase, setSupabase] = useState(null)
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        const url = localStorage.getItem('sb_url') || import.meta.env.VITE_SUPABASE_URL
        const key = localStorage.getItem('sb_key') || import.meta.env.VITE_SUPABASE_ANON_KEY

        if (url && key) {
            try {
                const client = createClient(url, key)
                setSupabase(client)
            } catch (e) {
                console.error("Failed to initialize Supabase", e)
            }
        }
        setIsReady(true)
    }, [])

    const updateCredentials = (url, key) => {
        if (!url || !key) return
        localStorage.setItem('sb_url', url)
        localStorage.setItem('sb_key', key)
        try {
            const client = createClient(url, key)
            setSupabase(client)
        } catch (e) {
            alert("Invalid URL or Key format")
        }
    }

    const disconnect = () => {
        localStorage.removeItem('sb_url')
        localStorage.removeItem('sb_key')
        setSupabase(null)
    }

    return (
        <SupabaseContext.Provider value={{ supabase, updateCredentials, disconnect, isReady }}>
            {children}
        </SupabaseContext.Provider>
    )
}

export const useSupabase = () => useContext(SupabaseContext)
