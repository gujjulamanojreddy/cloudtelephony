import { createClient } from '@supabase/supabase-js'
import { createMockSupabaseClient } from './mock-supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim().replace(/^"|"$/g, '')
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim().replace(/^"|"$/g, '')
const useMockAuth = import.meta.env.VITE_MOCK_AUTH === 'true'
const enableOfflineMode = import.meta.env.VITE_ENABLE_OFFLINE_MODE === 'true'

if (!supabaseUrl && !useMockAuth) throw new Error('Missing environment variable: VITE_SUPABASE_URL')
if (!supabaseAnonKey && !useMockAuth) throw new Error('Missing environment variable: VITE_SUPABASE_ANON_KEY')

console.log('Initializing Supabase with URL:', supabaseUrl)
console.log('Mock auth enabled:', useMockAuth)
console.log('Offline mode enabled:', enableOfflineMode)

let connectionFailed = false

const customFetch = async (input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> => {
  const url = input.toString()
  console.log('Supabase fetch:', url)
  
  if (connectionFailed && enableOfflineMode) {
    throw new Error('Offline mode: Connection failed')
  }
  
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)
  
  try {
    const response = await fetch(input, {
      ...init,
      signal: controller.signal,
      headers: {
        ...init.headers,
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
    
    clearTimeout(timeoutId)
    connectionFailed = false
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    console.error('Fetch error for URL:', url, error)
    connectionFailed = true
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your internet connection.')
      }
      if (error.message.includes('Failed to fetch') || 
          error.message.includes('ERR_NAME_NOT_RESOLVED') ||
          error.message.includes('ERR_NETWORK')) {
        if (enableOfflineMode) {
          throw new Error('Network connection error. Switching to offline mode.')
        }
        throw new Error('Network connection error. Please check your internet connection and DNS settings.')
      }
    }
    
    throw error
  }
}

const createSupabaseClient = () => {
  if (useMockAuth || connectionFailed) {
    console.log('Using mock Supabase client')
    return createMockSupabaseClient() as any
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: customFetch
    },
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    db: {
      schema: 'public'
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  })
}

export const supabase = createSupabaseClient()

export const switchToOfflineMode = () => {
  connectionFailed = true
  console.log('Switched to offline mode')
}