import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Contact {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company: string;
  position: string;
  status: string;
  created_at: string;
}

interface Campaign {
  id: string;
  name: string;
  template_id: string;
  status: string;
  sent_count: number;
  delivered_count: number;
  opened_count: number;
  clicked_count: number;
  created_at: string;
}

interface Template {
  id: string;
  name: string;
  subject: string;
  content: string;
  is_active: boolean;
  created_at: string;
}

interface DashboardStats {
  totalContacts: number;
  totalCampaigns: number;
  totalSent: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }

      // Verificar rol de administrador
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        alert('Acceso denegado. Se requieren permisos de administrador.');
        window.location.href = '/';
        return;
      }

      setUser(user);
      loadDashboardData();
    } catch (error) {
      console.error('Error de autenticación:', error);
      window.location.href = '/login';
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      // Cargar estadísticas
      const response = await fetch('/api/admin-dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setContacts(data.contacts || []);
        setCampaigns(data.campaigns || []);
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    }
  };

  const handleSendTestEmail = async (templateId: string) => {
    try {
      const response = await fetch('/api/admin-dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          action: 'send_test_email',
          template_id: templateId,
          test_email: user.email
        })
      });

      if (response.ok) {
        alert('Email de prueba enviado exitosamente');
      } else {
        alert('Error enviando email de prueba');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error enviando email de prueba');
    }
  };

  const handleCreateCampaign = async (campaignData: any) => {
    try {
      const response = await fetch('/api/admin-dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          action: 'create_campaign',
          ...campaignData
        })
      });

      if (response.ok) {
        alert('Campaña creada exitosamente');
        loadDashboardData();
      } else {
        alert('Error creando campaña');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creando campaña');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Dashboard Administrativo MIPIM</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Bienvenido, {user?.email}</span>
              <button
                onClick={() => supabase.auth.signOut()}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Resumen' },
              { id: 'contacts', name: 'Contactos' },
              { id: 'campaigns', name: 'Campañas' },
              { id: 'templates', name: 'Templates' },
              { id: 'analytics', name: 'Analytics' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">C</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Contactos</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalContacts}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">E</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Emails Enviados</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalSent}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">%</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Tasa de Apertura</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.openRate.toFixed(1)}%</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Contactos</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Lista de todos los contactos registrados</p>
            </div>
            <ul className="divide-y divide-gray-200">
              {contacts.map((contact) => (
                <li key={contact.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {contact.first_name.charAt(0)}{contact.last_name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {contact.first_name} {contact.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{contact.email}</div>
                        <div className="text-sm text-gray-500">{contact.company} - {contact.position}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        contact.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {contact.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Templates de Email</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Gestión de plantillas de email</p>
            </div>
            <ul className="divide-y divide-gray-200">
              {templates.map((template) => (
                <li key={template.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{template.name}</div>
                      <div className="text-sm text-gray-500">{template.subject}</div>
                      <div className="text-xs text-gray-400">Creado: {new Date(template.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        template.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {template.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                      <button
                        onClick={() => handleSendTestEmail(template.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium"
                      >
                        Enviar Prueba
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Campañas</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Historial de campañas de email</p>
            </div>
            <ul className="divide-y divide-gray-200">
              {campaigns.map((campaign) => (
                <li key={campaign.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                      <div className="text-sm text-gray-500">
                        Enviados: {campaign.sent_count} | Entregados: {campaign.delivered_count} | 
                        Abiertos: {campaign.opened_count} | Clicks: {campaign.clicked_count}
                      </div>
                      <div className="text-xs text-gray-400">Creado: {new Date(campaign.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        campaign.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        campaign.status === 'sending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {campaign.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && stats && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Métricas de Rendimiento</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.deliveryRate.toFixed(1)}%</div>
                  <div className="text-sm text-gray-500">Tasa de Entrega</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.openRate.toFixed(1)}%</div>
                  <div className="text-sm text-gray-500">Tasa de Apertura</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{stats.clickRate.toFixed(1)}%</div>
                  <div className="text-sm text-gray-500">Tasa de Clicks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.totalCampaigns}</div>
                  <div className="text-sm text-gray-500">Total Campañas</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}