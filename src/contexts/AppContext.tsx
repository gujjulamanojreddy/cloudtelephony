import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { ToastProvider } from '../components/ui/Toaster'

interface User {
  id: string
  email: string
  created_at: string
  role: string
}

interface SearchResultItem {
  type: 'order' | 'product'
  id: string
  title: string
  subtitle: string
  status?: string
  route: string
}

interface AppContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchResults: SearchResultItem[]
  isSearching: boolean
  performSearch: (query: string) => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

const mapSupabaseUser = (user: any): User | null => {
  if (!user) return null
  return {
    id: user.id,
    role: user.user_metadata?.role || 'user',
    created_at: user.created_at,
    email: user.email
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([])
  const [isSearching, setIsSearching] = useState<boolean>(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setUser(mapSupabaseUser(session?.user ?? null))
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(mapSupabaseUser(session?.user ?? null))
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      if (email === 'admin@example.com' && password === 'admin123') {
        const demoUser = {
          id: '1',
          email: 'admin@example.com',
          created_at: new Date().toISOString(),
          role: 'admin'
        }
        setUser(demoUser)
        return
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.')
        }
        throw new Error(error.message || 'Login failed. Please try again.')
      }
      
      if (!data?.user) {
        throw new Error('Authentication failed. Please try again.')
      }
      
      setUser(mapSupabaseUser(data.user))
      
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Network connection error') || 
            error.message.includes('ERR_NAME_NOT_RESOLVED') ||
            error.message.includes('Failed to fetch')) {
          
          if (email === 'admin@example.com' && password === 'admin123') {
            const demoUser = {
              id: '1',
              email: 'admin@example.com',
              created_at: new Date().toISOString(),
              role: 'admin'
            }
            setUser(demoUser)
            return
          }
          
          throw new Error('Cannot connect to server. For demo, use: admin@example.com / admin123')
        }
        throw error
      }
      
      throw new Error('An unexpected error occurred. Please try again.')
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Error logging out:', error)
    }
    setUser(null)
  }
  
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }
    
    setIsSearching(true)
    try {
      setSearchResults([])
    } catch (error) {
      setSearchResults([])
    }
    setIsSearching(false)
  }

  return (
    <AppContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout,
      searchQuery,
      setSearchQuery,
      searchResults,
      isSearching,
      performSearch
    }}>
      <ToastProvider>
        {children}
      </ToastProvider>
    </AppContext.Provider>
  )
}
