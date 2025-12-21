import { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const SupabaseContext = createContext()

export function SupabaseProvider({ children }) {
    const [supabase, setSupabase] = useState(null)
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        const url = import.meta.env.VITE_SUPABASE_URL
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY

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

    const disconnect = () => {
        // No-op since we depend on Env now.
    }

    return (
        <SupabaseContext.Provider value={{ supabase, disconnect, isReady }}>
            {children}
        </SupabaseContext.Provider>
    )
}

export const useSupabase = () => useContext(SupabaseContext)
