import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    // We can let this slide for now or log a warning.
    // Ideally, the app prompts the user if missing.
    console.warn('Supabase credentials missing! Check .env or Admin Setup.')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
