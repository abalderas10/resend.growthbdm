import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import AdminDashboard from '../components/AdminDashboard';
import EmailTracker from '../components/EmailTracker';
import WebhookConfig from '../components/WebhookConfig';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface User {
  id: string;
  email: string;
  role: string;
  full_name?: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      // Obtener información del usuario y su rol
      const { data: userData, error } = await supabase
        .from('users')
        .select('id, email, role, full_name')
        .eq('id', session.user.id)
        .single();

      if (error || !userData) {
        console.error('Error obteniendo datos del usuario:', error);
        router.push('/login');
        return;
      }

      // Verificar que el usuario tenga permisos de administrador
      if (userData.role !== 'admin' && userData.role !== 'super_admin') {
        alert('No tienes permisos para acceder al dashboard administrativo');
        router.push('/');
        return;
      }

      setUser(userData);
    } catch (error) {
      console.error('Error en autenticación:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error cerrando sesión:', error);
    }
  };

  const navigationItems = [
    {
      id: 'overview',
      name: 'Resumen',
      icon: '📊',
      description: 'Vista general del sistema'
    },
    {
      id: 'campaigns',
      name: 'Campañas',
      icon: '📧',
      description: 'Gestión de campañas de email'
    },
    {
      id: 'tracking',
      name: 'Tracking',
      icon: '📈',
      description: 'Seguimiento de emails'
    },
    {
      id: 'webhooks',
      name: 'Webhooks',
      icon: '🔗',
      description: 'Configuración de webhooks'
    },
    {
      id: 'templates',
      name: 'Templates',
      icon: '📝',
      description: 'Gestión de plantillas'
    },
    {
      id: 'contacts',
      name: 'Contactos',
      icon: '👥',
      description: 'Base de datos de contactos'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
      case 'campaigns':
      case 'templates':
      case 'contacts':
        return <AdminDashboard />;
      case 'tracking':
        return <EmailTracker />;
      case 'webhooks':
        return <WebhookConfig />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={() => setSidebarOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="sr-only">Cerrar sidebar</span>
                <span className="text-white text-xl">×</span>
              </button>
            </div>
            <SidebarContent 
              navigationItems={navigationItems} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
              user={user}
              onSignOut={handleSignOut}
            />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <SidebarContent 
          navigationItems={navigationItems} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          user={user}
          onSignOut={handleSignOut}
        />
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top bar */}
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-50">
          <button
            onClick={() => setSidebarOpen(true)}
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            <span className="sr-only">Abrir sidebar</span>
            <span className="text-xl">☰</span>
          </button>
        </div>

        {/* Page header */}
        <div className="bg-white shadow">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {navigationItems.find(item => item.id === activeTab)?.name || 'Dashboard'}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {navigationItems.find(item => item.id === activeTab)?.description}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500">
                    Bienvenido, {user.full_name || user.email}
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user.role.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Componente del sidebar
function SidebarContent({ 
  navigationItems, 
  activeTab, 
  setActiveTab, 
  user, 
  onSignOut 
}: {
  navigationItems: any[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User;
  onSignOut: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
      {/* Logo/Header */}
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="text-xl font-bold text-gray-900">MIPIM Dashboard</div>
        </div>
        
        {/* Navigation */}
        <nav className="mt-8 flex-1 px-2 space-y-1">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`${
                activeTab === item.id
                  ? 'bg-blue-100 text-blue-900 border-r-2 border-blue-500'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left transition-colors duration-150`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>
      </div>
      
      {/* User info and sign out */}
      <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
        <div className="flex-shrink-0 w-full group block">
          <div className="flex items-center">
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {user.full_name || user.email}
              </p>
              <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                {user.role.replace('_', ' ')}
              </p>
            </div>
            <button
              onClick={onSignOut}
              className="ml-3 bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              title="Cerrar sesión"
            >
              <span className="sr-only">Cerrar sesión</span>
              <span className="text-lg">🚪</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}