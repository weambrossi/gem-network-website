import { createClient } from '@supabase/supabase-js'

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? ''
const rawSupabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? ''

const DASHBOARD_URL_PATTERN =
  /^https:\/\/supabase\.com\/dashboard\/project\/([a-z0-9-]+)(?:\/.*)?$/i
const API_URL_PATTERN = /^https:\/\/([a-z0-9-]+)\.supabase\.co\/?$/i

const normalizeSupabaseUrl = (value) => {
  if (!value) {
    return ''
  }

  const apiUrlMatch = value.match(API_URL_PATTERN)

  if (apiUrlMatch) {
    return `https://${apiUrlMatch[1]}.supabase.co`
  }

  const dashboardUrlMatch = value.match(DASHBOARD_URL_PATTERN)

  if (dashboardUrlMatch) {
    return `https://${dashboardUrlMatch[1]}.supabase.co`
  }

  return value
}

const supabaseUrl = normalizeSupabaseUrl(rawSupabaseUrl)
const supabaseAnonKey = rawSupabaseAnonKey

const getSupabaseConfigError = () => {
  if (!rawSupabaseUrl && !supabaseAnonKey) {
    return 'Create a `.env.local` file with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then restart the Vite dev server.'
  }

  if (!rawSupabaseUrl) {
    return 'Add `VITE_SUPABASE_URL` to `.env.local`, then restart the Vite dev server.'
  }

  if (!supabaseAnonKey) {
    return 'Add `VITE_SUPABASE_ANON_KEY` to `.env.local`, then restart the Vite dev server.'
  }

  if (!API_URL_PATTERN.test(supabaseUrl)) {
    return 'Use your Supabase project API URL, like `https://your-project-ref.supabase.co`.'
  }

  if (supabaseAnonKey.startsWith('sb_secret_')) {
    return 'Use your public anon key for `VITE_SUPABASE_ANON_KEY`. Keys starting with `sb_secret_` are secret server keys and cannot be exposed in the browser.'
  }

  return ''
}

export const supabaseConfigError = getSupabaseConfigError()

export const supabase =
  !supabaseConfigError
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null
