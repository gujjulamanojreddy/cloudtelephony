import { AlertCircle, Wifi, WifiOff } from 'lucide-react'

interface DemoCredentialsProps {
  isOnline: boolean
}

export function DemoCredentials({ isOnline }: DemoCredentialsProps) {
  return (
    <div className="mt-4 p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        {isOnline ? (
          <Wifi className="h-4 w-4 text-green-400" />
        ) : (
          <WifiOff className="h-4 w-4 text-red-400" />
        )}
        <span className="text-sm font-medium text-white">
          {isOnline ? 'Online Mode' : 'Offline Demo Mode'}
        </span>
      </div>
      
      <div className="flex items-start gap-2">
        <AlertCircle className="h-4 w-4 text-blue-400 mt-0.5" />
        <div className="text-sm text-blue-100">
          <p className="font-medium mb-1">Demo Credentials:</p>
          <p>Email: <code className="bg-black/20 px-1 rounded text-blue-200">admin@example.com</code></p>
          <p>Password: <code className="bg-black/20 px-1 rounded text-blue-200">admin123</code></p>
          {!isOnline && (
            <p className="mt-2 text-xs text-blue-300">
              Server connection failed. Using offline mode for demonstration.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
