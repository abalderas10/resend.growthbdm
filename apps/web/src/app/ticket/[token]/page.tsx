'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import QRCode from 'qrcode';

interface TicketData {
  email: string;
  eventId: string;
  timestamp: number;
  valid: boolean;
  name?: string;
  company?: string;
}

export default function TicketPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const token = params.token as string;
  const cleanView = searchParams.get('clean') === 'true';
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    cargo: '',
    empresa: '',
    telefono: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    if (token) {
      validateToken(token);
    }
  }, [token]);

  const validateToken = async (tokenToValidate: string) => {
    try {
      // Decodificar el token (compatible con navegador)
      const base64 = tokenToValidate.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = atob(base64);
      
      const [email, eventId, timestamp, name = '', company = ''] = decoded.split(':');
      
      // Verificar que el token no sea muy antiguo (30 días)
      const tokenAge = Date.now() - parseInt(timestamp);
      const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 días en ms
      
      if (tokenAge > maxAge) {
        setError('Este enlace ha expirado. Por favor, solicita una nueva invitación.');
        setLoading(false);
        return;
      }
      
      // Llamar al API para registrar la confirmación
      const response = await fetch('/api/confirm-attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          eventId,
          token: tokenToValidate,
          name,
          company
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Error al validar el token');
        setLoading(false);
        return;
      }
      
      const successData = await response.json();
      
      setTicketData({
        email,
        eventId,
        timestamp: parseInt(timestamp),
        valid: true,
        name,
        company
      });
      
    } catch (err) {
      setError('Token inválido. Por favor, verifica el enlace.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validando tu invitación...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Error de Validación</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <a 
              href="mailto:networking@growthbdm.com" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Contactar Soporte
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!ticketData) {
    return null;
  }

  const qrData = `MIPIM2026-${ticketData.email}-${ticketData.timestamp}`;

  // Vista limpia solo del boleto
  if (cleanView) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Solo el Ticket */}
          <div className="bg-white rounded-lg shadow-xl overflow-hidden border">
            {/* Ticket Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1">MIPIM 2026 M&eacute;xico</h2>
                  <p className="text-blue-100">La Feria Inmobiliaria más Grande del Mundo</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-100">Boleto Digital</p>
                  <p className="text-lg font-semibold">#{ticketData.timestamp.toString().slice(-6)}</p>
                </div>
              </div>
            </div>

            {/* Ticket Body */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Event Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalles del Evento</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Fecha</p>
                        <p className="font-medium text-gray-900">15-17 Octubre 2026</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Ubicación</p>
                        <p className="font-medium text-gray-900">Centro Citibanamex, Ciudad de México</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Horario</p>
                        <p className="font-medium text-gray-900">9:00 AM - 6:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guest Info and QR */}
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Invitado</h3>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="font-medium text-gray-900">{ticketData.name || ticketData.email}</p>
                    {ticketData.company && (
                      <p className="text-sm text-gray-600 mt-1">{ticketData.company}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">ID: {ticketData.eventId}</p>
                  </div>
                  
                  {/* QR Code */}
                  <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="w-32 h-32 mx-auto mb-2 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-500">QR Code</span>
                    </div>
                    <p className="text-xs text-gray-500">Código de acceso</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <Image
              src="https://mpeimoornrbahdpszhor.supabase.co/storage/v1/object/public/email-images/logos/aliestGrowth.png"
              alt="Aliest Growth"
              width={200}
              height={60}
              className="mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Confirmación Exitosa!</h1>
            <p className="text-gray-600">Tu asistencia a MIPIM 2026 México ha sido confirmada</p>
          </div>
        </div>

        {/* Ticket */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Ticket Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">MIPIM 2026 M&eacute;xico</h2>
                <p className="text-blue-100">La Feria Inmobiliaria más Grande del Mundo</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-100">Boleto Digital</p>
                <p className="text-lg font-semibold">#{ticketData.timestamp.toString().slice(-6)}</p>
              </div>
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Event Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalles del Evento</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Fecha</p>
                      <p className="font-medium text-gray-900">10 de Septiembre, 2025</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Hora</p>
                      <p className="font-medium text-gray-900">8:30 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Ubicación</p>
                      <p className="font-medium text-gray-900">Neuchatel, Ciudad de México</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Invitado</p>
                      <p className="font-medium text-gray-900">{ticketData.name || ticketData.email}</p>
                      {ticketData.company && (
                        <p className="text-sm text-gray-500">{ticketData.company}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Código QR de Acceso</h3>
                <div className="bg-gray-50 p-4 rounded-lg inline-block">
                  <QRCodeSVG 
                    value={qrData}
                    size={150}
                    level="M"
                    includeMargin={true}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">Presenta este código en el evento</p>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Instrucciones Importantes:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Guarda este boleto en tu dispositivo móvil</li>
                <li>• Llega 30 minutos antes del evento para el registro</li>
                <li>• Presenta una identificación oficial junto con este boleto</li>
                <li>• El código QR es único e intransferible</li>
              </ul>
            </div>

            {/* Additional Information Form */}
            <div className="mt-8 p-6 bg-white border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-4">Completa tu información</h4>
              {!formSubmitted ? (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  // TODO: Implementar guardado de datos
                  setFormSubmitted(true);
                }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre completo *
                      </label>
                      <input
                        type="text"
                        id="nombre"
                        required
                        value={formData.nombre}
                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tu nombre completo"
                      />
                    </div>
                    <div>
                      <label htmlFor="cargo" className="block text-sm font-medium text-gray-700 mb-1">
                        Cargo *
                      </label>
                      <input
                        type="text"
                        id="cargo"
                        required
                        value={formData.cargo}
                        onChange={(e) => setFormData({...formData, cargo: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tu cargo o posición"
                      />
                    </div>
                    <div>
                      <label htmlFor="empresa" className="block text-sm font-medium text-gray-700 mb-1">
                        Empresa *
                      </label>
                      <input
                        type="text"
                        id="empresa"
                        required
                        value={formData.empresa}
                        onChange={(e) => setFormData({...formData, empresa: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nombre de tu empresa"
                      />
                    </div>
                    <div>
                      <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        id="telefono"
                        required
                        value={formData.telefono}
                        onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tu número de teléfono"
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      Guardar información
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-green-700 font-medium">¡Información guardada exitosamente!</p>
                  <p className="text-gray-600 text-sm mt-1">Gracias por completar tus datos.</p>
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 mb-2">¿Tienes preguntas?</p>
              <a 
                href="mailto:networking@growthbdm.com" 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                networking@growthbdm.com
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Powered by <span className="font-semibold">Aliest Growth</span>
          </p>
        </div>
      </div>
    </div>
  );
}