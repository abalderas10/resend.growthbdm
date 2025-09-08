import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive';
  secret: string;
  created_at: string;
  last_delivery?: string;
  delivery_count: number;
  failure_count: number;
}

interface WebhookDelivery {
  id: string;
  webhook_id: string;
  event_type: string;
  status: 'success' | 'failed' | 'pending';
  response_code?: number;
  response_body?: string;
  attempt_count: number;
  created_at: string;
  delivered_at?: string;
}

export default function WebhookConfig() {
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('endpoints');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newWebhook, setNewWebhook] = useState({
    url: '',
    events: [] as string[],
    secret: ''
  });

  const availableEvents = [
    'email.sent',
    'email.delivered',
    'email.delivery_delayed',
    'email.complained',
    'email.bounced',
    'email.opened',
    'email.clicked'
  ];

  useEffect(() => {
    loadWebhookData();
  }, []);

  const loadWebhookData = async () => {
    try {
      setLoading(true);
      
      // Cargar endpoints de webhook (simulado - en producción vendría de Resend API)
      const mockWebhooks: WebhookEndpoint[] = [
        {
          id: 'wh_1',
          url: `${process.env.NEXT_PUBLIC_APP_URL}/api/email-tracking`,
          events: ['email.sent', 'email.delivered', 'email.opened', 'email.clicked'],
          status: 'active',
          secret: process.env.RESEND_WEBHOOK_SECRET || 'webhook_secret',
          created_at: new Date().toISOString(),
          delivery_count: 156,
          failure_count: 2
        }
      ];
      
      setWebhooks(mockWebhooks);
      
      // Cargar entregas recientes
      const { data: deliveryData } = await supabase
        .from('webhook_deliveries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      setDeliveries(deliveryData || []);
      
    } catch (error) {
      console.error('Error cargando datos de webhook:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWebhook = async () => {
    try {
      // En producción, esto haría una llamada a la API de Resend
      const response = await fetch('/api/webhooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          action: 'create_webhook',
          ...newWebhook
        })
      });
      
      if (response.ok) {
        alert('Webhook creado exitosamente');
        setShowCreateForm(false);
        setNewWebhook({ url: '', events: [], secret: '' });
        loadWebhookData();
      } else {
        alert('Error creando webhook');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creando webhook');
    }
  };

  const handleToggleWebhook = async (webhookId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      // En producción, esto haría una llamada a la API de Resend
      const response = await fetch('/api/webhooks', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          action: 'toggle_webhook',
          webhook_id: webhookId,
          status: newStatus
        })
      });
      
      if (response.ok) {
        alert(`Webhook ${newStatus === 'active' ? 'activado' : 'desactivado'} exitosamente`);
        loadWebhookData();
      } else {
        alert('Error actualizando webhook');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error actualizando webhook');
    }
  };

  const handleTestWebhook = async (webhookId: string) => {
    try {
      const response = await fetch('/api/webhooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          action: 'test_webhook',
          webhook_id: webhookId
        })
      });
      
      if (response.ok) {
        alert('Evento de prueba enviado exitosamente');
        loadWebhookData();
      } else {
        alert('Error enviando evento de prueba');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error enviando evento de prueba');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'inactive':
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Configuración de Webhooks</h2>
            <p className="text-sm text-gray-500 mt-1">
              Gestiona los endpoints de webhook para recibir eventos de email en tiempo real
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Crear Webhook
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'endpoints', name: 'Endpoints' },
            { id: 'deliveries', name: 'Entregas' },
            { id: 'settings', name: 'Configuración' }
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

      {/* Create Webhook Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Crear Nuevo Webhook</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL del Endpoint</label>
                  <input
                    type="url"
                    value={newWebhook.url}
                    onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="https://tu-dominio.com/webhook"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Eventos</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {availableEvents.map((event) => (
                      <label key={event} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newWebhook.events.includes(event)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewWebhook({
                                ...newWebhook,
                                events: [...newWebhook.events, event]
                              });
                            } else {
                              setNewWebhook({
                                ...newWebhook,
                                events: newWebhook.events.filter(e => e !== event)
                              });
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{event}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Secret (opcional)</label>
                  <input
                    type="text"
                    value={newWebhook.secret}
                    onChange={(e) => setNewWebhook({ ...newWebhook, secret: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="webhook_secret_key"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateWebhook}
                  disabled={!newWebhook.url || newWebhook.events.length === 0}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Crear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Endpoints Tab */}
      {activeTab === 'endpoints' && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Endpoints de Webhook</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {webhooks.length} endpoint(s) configurado(s)
            </p>
          </div>
          
          <ul className="divide-y divide-gray-200">
            {webhooks.map((webhook) => (
              <li key={webhook.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{webhook.url}</div>
                    <div className="text-sm text-gray-500">
                      Eventos: {webhook.events.join(', ')}
                    </div>
                    <div className="text-xs text-gray-400">
                      Entregas: {webhook.delivery_count} | Fallos: {webhook.failure_count}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(webhook.status)}`}>
                      {webhook.status.toUpperCase()}
                    </span>
                    
                    <button
                      onClick={() => handleTestWebhook(webhook.id)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs font-medium"
                    >
                      Probar
                    </button>
                    
                    <button
                      onClick={() => handleToggleWebhook(webhook.id, webhook.status)}
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        webhook.status === 'active'
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {webhook.status === 'active' ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
          {webhooks.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 text-lg mb-2">🔗</div>
              <div className="text-gray-500">No hay webhooks configurados</div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Crear tu primer webhook
              </button>
            </div>
          )}
        </div>
      )}

      {/* Deliveries Tab */}
      {activeTab === 'deliveries' && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Entregas de Webhook</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Historial de entregas recientes
            </p>
          </div>
          
          <ul className="divide-y divide-gray-200">
            {deliveries.map((delivery) => (
              <li key={delivery.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{delivery.event_type}</div>
                    <div className="text-sm text-gray-500">
                      Webhook ID: {delivery.webhook_id}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(delivery.created_at).toLocaleString()}
                      {delivery.delivered_at && (
                        <span> • Entregado: {new Date(delivery.delivered_at).toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                      {delivery.status.toUpperCase()}
                    </span>
                    
                    {delivery.response_code && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {delivery.response_code}
                      </span>
                    )}
                    
                    <span className="text-xs text-gray-500">
                      Intento {delivery.attempt_count}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
          {deliveries.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 text-lg mb-2">📦</div>
              <div className="text-gray-500">No hay entregas registradas</div>
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración Global</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">URL Base de la Aplicación</h4>
              <input
                type="url"
                value={process.env.NEXT_PUBLIC_APP_URL || ''}
                readOnly
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                Esta URL se usa como base para los endpoints de webhook
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Secret por Defecto</h4>
              <input
                type="password"
                value={process.env.RESEND_WEBHOOK_SECRET || ''}
                readOnly
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                Secret usado para verificar la autenticidad de los webhooks
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Endpoint de Tracking</h4>
              <code className="text-sm text-blue-700">
                {process.env.NEXT_PUBLIC_APP_URL}/api/email-tracking
              </code>
              <p className="text-xs text-blue-600 mt-1">
                Configura este endpoint en tu cuenta de Resend para recibir eventos de email
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}