import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Mail, Lock, ArrowRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { DemoCredentials } from '../components/common/DemoCredentials';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { login } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-tr from-blue-950 via-blue-900 to-blue-950 p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[800px] h-[800px] bg-blue-500 rounded-full opacity-20 blur-3xl animate-blob" />
          <div className="w-[600px] h-[600px] bg-blue-400 rounded-full opacity-20 blur-3xl animate-blob animation-delay-2000 absolute" />
          <div className="w-[500px] h-[500px] bg-blue-600 rounded-full opacity-20 blur-3xl animate-blob animation-delay-4000 absolute" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-800/10 to-blue-950" />
      </div>      {/* Content */}
      <div className="relative w-full max-w-md mx-auto py-12 z-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center mb-8 scale-110">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative bg-gradient-to-tr from-blue-600 to-blue-500 p-4 rounded-xl shadow-[0_0_40px_rgba(59,130,246,0.3)] transform hover:scale-105 transition duration-300">
                <Store className="h-12 w-12 text-white transform group-hover:rotate-6 transition duration-300" />
              </div>
            </div>
          </div>
          <h2 className="mt-6 text-center text-4xl font-black">
            <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-lg">
              Welcome to Cloud Telephony
            </span>
          </h2>
          <p className="mt-3 text-center text-sm text-blue-200/80">
            Sign in to access your dashboard
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/50 to-blue-600/50 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative bg-white/10 backdrop-blur-xl py-8 px-4 shadow-2xl rounded-2xl sm:px-10 border border-white/20">
              {/* Background spotlight effect */}
              <div className="absolute -inset-[150px] bg-gradient-to-r from-blue-500/20 via-transparent to-transparent rotate-45 translate-y-full group-hover:translate-y-0 transition-all duration-700" />
              
              <div className="relative">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-5">                    <Input
                      label="Email address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      fullWidth
                      leftIcon={
                        <Mail 
                          size={18} 
                          className="text-blue-300 group-hover:text-blue-200 transition-colors duration-200" 
                        />
                      }
                      className="bg-white/10 border-white/20 text-white placeholder:text-blue-200/50 focus:border-blue-400 focus:ring-blue-400/50"
                    />                    <Input
                      label="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      fullWidth
                      leftIcon={
                        <Lock 
                          size={18} 
                          className="text-blue-300 group-hover:text-blue-200 transition-colors duration-200" 
                        />
                      }
                      className="bg-white/10 border-white/20 text-white placeholder:text-blue-200/50 focus:border-blue-400 focus:ring-blue-400/50"
                    />
                  </div>

                  <div>
                    <Button
                      type="submit"
                      fullWidth
                      isLoading={loading}
                      rightIcon={
                        <ArrowRight 
                          size={18} 
                          className="group-hover:translate-x-1 transition-transform duration-200" 
                        />
                      }
                      className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-xl
                        hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent
                        transform hover:scale-[1.02] transition-all duration-200 font-medium group"
                    >
                      <span className="relative z-10">Sign in</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                    </Button>
                  </div>
                </form>

                <div className="mt-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 text-blue-200/60 bg-gradient-to-b from-transparent via-black/5 to-transparent backdrop-blur-sm rounded-full">
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo credentials section */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md text-center">
          <DemoCredentials isOnline={isOnline} />
        </div>

        {/* Network status indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm">
          {isOnline ? (
            <span className="text-green-400">Online</span>
          ) : (
            <span className="text-red-400">Offline</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;