interface MockUser {
  id: string
  email: string
  created_at: string
  role: string
}

interface AuthState {
  user: MockUser | null
  session: any | null
}

class MockSupabaseAuth {
  private authState: AuthState = { user: null, session: null }
  private callbacks: Array<(session: any) => void> = []

  async signInWithPassword({ email, password }: { email: string; password: string }) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (email === 'admin@example.com' && password === 'admin123') {
      const user: MockUser = {
        id: '1',
        email,
        created_at: new Date().toISOString(),
        role: 'admin'
      }
      
      const session = {
        user,
        access_token: 'mock-token',
        expires_at: Date.now() + 3600000
      }
      
      this.authState = { user, session }
      this.callbacks.forEach(cb => cb(session))
      
      return { data: { user, session }, error: null }
    }
    
    return { 
      data: { user: null, session: null }, 
      error: { message: 'Invalid login credentials' } 
    }
  }

  async signOut() {
    this.authState = { user: null, session: null }
    this.callbacks.forEach(cb => cb(null))
    return { error: null }
  }

  onAuthStateChange(callback: (session: any) => void) {
    this.callbacks.push(callback)
    callback(this.authState.session)
    
    return {
      unsubscribe: () => {
        const index = this.callbacks.indexOf(callback)
        if (index > -1) this.callbacks.splice(index, 1)
      }
    }
  }

  getSession() {
    return Promise.resolve({ data: { session: this.authState.session }, error: null })
  }
}

class MockSupabaseTable {
  constructor(private tableName: string) {}

  insert(data: any) {
    console.log(`Mock insert into ${this.tableName}:`, data)
    return Promise.resolve({ data, error: null })
  }

  select(columns = '*') {
    console.log(`Mock select ${columns} from ${this.tableName}`)
    return {
      eq: () => this,
      then: (resolve: Function) => resolve({ data: [], error: null })
    }
  }
}

class MockSupabaseClient {
  auth = new MockSupabaseAuth()

  from(tableName: string) {
    return new MockSupabaseTable(tableName)
  }
}

export const createMockSupabaseClient = () => new MockSupabaseClient()
