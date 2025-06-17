import { 
  createBrowserRouter,
  RouterProvider,
  Navigate
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useApp } from './contexts/AppContext';
import { ConnectionStatus } from './components/common/ConnectionStatus';
import AppLayout from './layouts/AppLayout';
import Login from './pages/Login';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useApp();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    )
  },
  {
    path: '*',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    )
  }
]);

function App() {
  return (
    <AppProvider>
      <ConnectionStatus />
      <RouterProvider router={router} />
      <Toaster 
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </AppProvider>
  );
}

export default App;