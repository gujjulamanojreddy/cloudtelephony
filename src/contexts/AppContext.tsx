import React, { createContext, useContext, useState, useEffect } from 'react';
import { ToastProvider } from '../components/ui/Toaster';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string | undefined;
}

// Type definitions for search result items

interface SearchResultItem {
  type: 'order' | 'product';
  id: string;
  title: string;
  subtitle: string;
  route: string;
  status?: string;
  contact?: string;
}

interface AppContextType {
  user: User | null;
  loading: boolean;
  searchQuery: string;
  searchResults: SearchResultItem[];
  isSearching: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setSearchQuery: (query: string) => void;
  performSearch: (query: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

const mapSupabaseUser = (user: SupabaseUser | null): User | null => {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email
  };
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(mapSupabaseUser(session?.user ?? null));
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(mapSupabaseUser(session?.user ?? null));
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Attempt to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      // Store login attempt in history
      try {
        const loginStatus = error ? 'failed' : 'success';
        await supabase.from('login_history').insert({
          user_id: data?.user?.id,
          email: email,
          ip_address: 'Client IP', // In a real app, you'd get this from the server
          user_agent: navigator.userAgent,
          login_status: loginStatus
        });
      } catch (historyError) {
        console.error('Error storing login history:', historyError);
        // Don't throw this error as it's not critical to the login process
      }
      
      if (error) {
        console.error('Auth error:', error);
        throw error;
      }
      
      if (!data?.user) {
        throw new Error('No user data returned');
      }
      
      setUser(mapSupabaseUser(data.user));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Successfully logged out');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
    setUser(null);
  };
  
  // Search functionality
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      type DbOrder = {
        id: string;
        status: string;
        amount: number;
        customer: {
          name: string;
          email: string;
        };
      };

      type DbProduct = {
        id: string;
        name: string;
        salePrice: number;
        category: string;
      };



      // Search in orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select<string, DbOrder>(`
          id, 
          status, 
          amount, 
          customer:customers!inner(
            name,
            email
          )
        `)
        .or(`id.ilike.%${query}%, customers.name.ilike.%${query}%, customers.email.ilike.%${query}%`)
        .limit(5);
      
      if (ordersError) throw ordersError;
      
      // Search in products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select<string, DbProduct>('id, name, salePrice, category')
        .or(`name.ilike.%${query}%, category.ilike.%${query}%`)
        .limit(5);
        
      if (productsError) throw productsError;
      

      
      // Combine results and format for display
      const formattedResults: SearchResultItem[] = [
        ...(orders || []).map(order => ({
          type: 'order' as const,
          id: order.id,
          title: `Order #${order.id}`,
          subtitle: order.customer ? `${order.customer.name} - ₹${order.amount.toLocaleString()}` : `₹${order.amount.toLocaleString()}`,
          status: order.status,
          route: `/orders?id=${order.id}`
        })),
        ...(products || []).map(product => ({
          type: 'product' as const,
          id: product.id,
          title: product.name,
          subtitle: `₹${product.salePrice.toLocaleString()} - ${product.category}`,
          route: `/products?id=${product.id}`
        }))
      ];
      
      setSearchResults(formattedResults);
      
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed');
      setSearchResults([]);
    }
    setIsSearching(false);
  };

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
  );
};