import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface EmailTracking {
  id: string;
  email_id: string;
  recipient_email: string;
  event_type: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained';
  event_data: any;
  timestamp: string;
  campaign_id?: string;
}

interface TrackingStats {
  totalSent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  complained: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
}

interface EmailTrackerProps {
  campaignId?: string;
  emailId?: string;
  showRealTime?: boolean;
}

export default function EmailTracker({ campaignId, emailId, showRealTime = true }: EmailTrackerProps) {
  const [trackingData, setTrackingData] = useState<EmailTracking[]>([]);
  const [stats, setStats] = useState<TrackingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('24h');

  useEffect(() => {
    loadTrackingData();
    
    if (showRealTime) {
      // Configurar actualizaciones en tiempo real
      const interval = setInterval(loadTrackingData, 30000); // Actualizar cada 30 segundos
      return () => clearInterval(interval);
    }
  }, [campaignId, emailId, filter, timeRange]);

  const loadTrackingData = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('email_tracking')
        .select('*')
        .order('timestamp', { ascending: false });

      // Aplicar filtros
      if (campaignId) {
        query = query.eq('campaign_id', campaignId);
      }
      
      if (emailId) {
        query = query.eq('email_id', emailId);
      }
      
      if (filter !== 'all') {
        query = query.eq('event_type', filter);
      }

      // Aplicar rango de tiempo
      const now = new Date();
      let startTime: Date;
      
      switch (timeRange) {
        case '1h':
          startTime = new Date(now.getTime() - 60 * 60 * 1000);
          break;
        case '24h':
          startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      }
      
      query = query.gte('timestamp', startTime.toISOString());

      const { data: trackingData, error } = await query.limit(1000);
      
      if (error) {
        console.error('Error cargando datos de tracking:', error);
        return;
      }

      setTrackingData(trackingData || []);
      calculateStats(trackingData || []);
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: EmailTracking[]) => {
    const stats: TrackingStats = {
      totalSent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      complained: 0,
      deliveryRate: 0,
      openRate: 0,
      clickRate: 0,
      bounceRate: 0
    };

    // Agrupar por email_id para evitar duplicados
    const emailEvents = new Map<string, Set<string>>();
    
    data.forEach(event => {
      if (!emailEvents.has(event.email_id)) {
        emailEvents.set(event.email_id, new Set());
      }
      emailEvents.get(event.email_id)!.add(event.event_type);
    });

    // Calcular estadísticas
    emailEvents.forEach(events => {
      if (events.has('sent')) stats.totalSent++;
      if (events.has('delivered')) stats.delivered++;
      if (events.has('opened')) stats.opened++;
      if (events.has('clicked')) stats.clicked++;
      if (events.has('bounced')) stats.bounced++;
      if (events.has('complained')) stats.complained++;
    });

    // Calcular tasas
    if (stats.totalSent > 0) {
      stats.deliveryRate = (stats.delivered / stats.totalSent) * 100;
      stats.bounceRate = (stats.bounced / stats.totalSent) * 100;
    }
    
    if (stats.delivered > 0) {
      stats.openRate = (stats.opened / stats.delivered) * 100;
    }
    
    if (stats.opened > 0) {
      stats.clickRate = (stats.clicked / stats.opened) * 100;
    }

    setStats(stats);
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'sent':
        return '📤';
      case 'delivered':
        return '✅';
      case 'opened':
        return '👁️';
      case 'clicked':
        return '🖱️';
      case 'bounced':
        return '❌';
      case 'complained':
        return '⚠️';
      default:
        return '📧';
    }
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'opened':
        return 'bg-yellow-100 text-yellow-800';
      case 'clicked':
        return 'bg-purple-100 text-purple-800';
      case 'bounced':
        return 'bg-red-100 text-red-800';
      case 'complained':
        return 'bg-orange-100 text-orange-800';
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
      {/* Controles de filtro */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Evento</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">Todos los eventos</option>
              <option value="sent">Enviados</option>
              <option value="delivered">Entregados</option>
              <option value="opened">Abiertos</option>
              <option value="clicked">Clicks</option>
              <option value="bounced">Rebotados</option>
              <option value="complained">Quejas</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="1h">Última hora</option>
              <option value="24h">Últimas 24 horas</option>
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
            </select>
          </div>
          
          <button
            onClick={loadTrackingData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Actualizar
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="text-2xl mr-3">📤</div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.totalSent}</div>
                <div className="text-sm text-gray-500">Enviados</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="text-2xl mr-3">✅</div>
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.deliveryRate.toFixed(1)}%</div>
                <div className="text-sm text-gray-500">Tasa de Entrega</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="text-2xl mr-3">👁️</div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{stats.openRate.toFixed(1)}%</div>
                <div className="text-sm text-gray-500">Tasa de Apertura</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="text-2xl mr-3">🖱️</div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{stats.clickRate.toFixed(1)}%</div>
                <div className="text-sm text-gray-500">Tasa de Clicks</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de eventos */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Eventos de Email</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {trackingData.length} eventos encontrados
          </p>
        </div>
        
        <div className="overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {trackingData.map((event) => (
              <li key={event.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">{getEventIcon(event.event_type)}</div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {event.recipient_email}
                      </div>
                      <div className="text-sm text-gray-500">
                        Email ID: {event.email_id.substring(0, 8)}...
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(event.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventColor(event.event_type)}`}>
                      {event.event_type.toUpperCase()}
                    </span>
                    
                    {event.campaign_id && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Campaña: {event.campaign_id.substring(0, 8)}...
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Datos adicionales del evento */}
                {event.event_data && Object.keys(event.event_data).length > 0 && (
                  <div className="mt-2 ml-11">
                    <details className="text-xs text-gray-500">
                      <summary className="cursor-pointer hover:text-gray-700">Ver detalles</summary>
                      <pre className="mt-1 bg-gray-50 p-2 rounded text-xs overflow-x-auto">
                        {JSON.stringify(event.event_data, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}
              </li>
            ))}
          </ul>
          
          {trackingData.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-400 text-lg mb-2">📭</div>
              <div className="text-gray-500">No se encontraron eventos para los filtros seleccionados</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Indicador de tiempo real */}
      {showRealTime && (
        <div className="text-center text-sm text-gray-500">
          <div className="inline-flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Actualizando en tiempo real cada 30 segundos
          </div>
        </div>
      )}
    </div>
  );
}