import { NextApiRequest, NextApiResponse } from 'next';
import { MassEmailSender, createCampaign, EmailRecipient } from '../lib/mass-email-sender';
import MarketingCampaignEmail from '../templates/marketing-campaign';
import { createElement } from 'react';

// Tipos para la API
interface SendCampaignRequest {
  campaignType: 'marketing' | 'newsletter' | 'notification';
  subject: string;
  recipients: EmailRecipient[];
  templateData: {
    companyName?: string;
    campaignTitle?: string;
    campaignDescription?: string;
    ctaText?: string;
    ctaUrl?: string;
    logoUrl?: string;
  };
  options?: {
    fromEmail?: string;
    fromName?: string;
    batchSize?: number;
    delayBetweenBatches?: number;
  };
}

interface SendCampaignResponse {
  success: boolean;
  message: string;
  data?: {
    campaignId: string;
    totalSent: number;
    totalFailed: number;
    duration: number;
    failedEmails?: string[];
  };
  error?: string;
}

/**
 * API endpoint para enviar campañas de email masivas
 * 
 * POST /api/send-campaign
 * 
 * Body:
 * {
 *   "campaignType": "marketing",
 *   "subject": "¡Oferta especial para {{firstName}}!",
 *   "recipients": [
 *     {
 *       "email": "usuario@ejemplo.com",
 *       "firstName": "Juan",
 *       "lastName": "Pérez"
 *     }
 *   ],
 *   "templateData": {
 *     "companyName": "Mi Empresa",
 *     "campaignTitle": "Descuento del 50%",
 *     "campaignDescription": "Aprovecha esta oferta limitada",
 *     "ctaText": "Comprar Ahora",
 *     "ctaUrl": "https://miempresa.com/oferta"
 *   },
 *   "options": {
 *     "batchSize": 50,
 *     "delayBetweenBatches": 2000
 *   }
 * }
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SendCampaignResponse>
) {
  // Verificar método HTTP
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Método no permitido. Use POST.'
    });
  }

  // Verificar API key
  const apiKey = req.headers.authorization?.replace('Bearer ', '');
  if (!apiKey || apiKey !== process.env.API_SECRET_KEY) {
    return res.status(401).json({
      success: false,
      message: 'API key inválida o faltante.'
    });
  }

  try {
    const {
      campaignType,
      subject,
      recipients,
      templateData,
      options = {}
    }: SendCampaignRequest = req.body;

    // Validar datos requeridos
    if (!campaignType || !subject || !recipients || !Array.isArray(recipients)) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos: campaignType, subject, recipients'
      });
    }

    if (recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'La lista de destinatarios no puede estar vacía'
      });
    }

    // Validar destinatarios
    const { valid: validRecipients, invalid: invalidEmails } = MassEmailSender.validateRecipients(recipients);
    
    if (invalidEmails.length > 0) {
      console.warn(`⚠️ Emails inválidos encontrados: ${invalidEmails.join(', ')}`);
    }

    if (validRecipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay destinatarios válidos en la lista'
      });
    }

    // Verificar límites
    const maxRecipientsPerCampaign = parseInt(process.env.MAX_RECIPIENTS_PER_CAMPAIGN || '10000');
    if (validRecipients.length > maxRecipientsPerCampaign) {
      return res.status(400).json({
        success: false,
        message: `Demasiados destinatarios. Máximo permitido: ${maxRecipientsPerCampaign}`
      });
    }

    // Seleccionar template según el tipo de campaña
    const template = getTemplate(campaignType, templateData);
    if (!template) {
      return res.status(400).json({
        success: false,
        message: `Tipo de campaña no soportado: ${campaignType}`
      });
    }

    // Crear la campaña
    const campaign = createCampaign(
      subject,
      template,
      validRecipients,
      options
    );

    // Generar ID único para la campaña
    const campaignId = `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`🚀 Iniciando campaña ${campaignId}`);
    console.log(`📧 Destinatarios válidos: ${validRecipients.length}`);
    console.log(`⚠️ Emails inválidos: ${invalidEmails.length}`);

    // Crear instancia del sender
    const sender = new MassEmailSender(
      options.batchSize,
      options.delayBetweenBatches
    );

    // Enviar la campaña
    const result = await sender.sendCampaign(campaign);

    // Obtener emails que fallaron
    const failedEmails = result.results
      .filter(r => !r.success)
      .map(r => r.recipient);

    console.log(`✅ Campaña ${campaignId} completada`);
    console.log(`📊 Enviados: ${result.totalSent}, Fallidos: ${result.totalFailed}`);

    // Respuesta exitosa
    return res.status(200).json({
      success: true,
      message: `Campaña enviada exitosamente. ${result.totalSent} emails enviados, ${result.totalFailed} fallidos.`,
      data: {
        campaignId,
        totalSent: result.totalSent,
        totalFailed: result.totalFailed,
        duration: result.duration,
        ...(failedEmails.length > 0 && { failedEmails })
      }
    });

  } catch (error) {
    console.error('❌ Error en send-campaign:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
}

/**
 * Obtiene el template correspondiente según el tipo de campaña
 */
function getTemplate(campaignType: string, templateData: any) {
  switch (campaignType) {
    case 'marketing':
      return createElement(MarketingCampaignEmail, {
        companyName: templateData.companyName,
        campaignTitle: templateData.campaignTitle,
        campaignDescription: templateData.campaignDescription,
        ctaText: templateData.ctaText,
        ctaUrl: templateData.ctaUrl,
        logoUrl: templateData.logoUrl,
        unsubscribeUrl: templateData.unsubscribeUrl || '#'
      });
    
    case 'newsletter':
      // Aquí puedes agregar más templates
      return createElement(MarketingCampaignEmail, templateData);
    
    case 'notification':
      // Aquí puedes agregar más templates
      return createElement(MarketingCampaignEmail, templateData);
    
    default:
      return null;
  }
}

/**
 * Middleware para validar rate limiting (opcional)
 */
export function validateRateLimit(req: NextApiRequest): boolean {
  // Implementar lógica de rate limiting aquí
  // Por ejemplo, usando Redis o una base de datos
  return true;
}

/**
 * Función para logging de campañas (opcional)
 */
export function logCampaign(campaignData: any, result: any): void {
  // Implementar logging a base de datos o archivo
  console.log('📝 Campaign logged:', {
    timestamp: new Date().toISOString(),
    campaignData,
    result
  });
}