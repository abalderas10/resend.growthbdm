import { NextApiRequest, NextApiResponse } from 'next';
import { MassEmailSender, createCampaign, EmailRecipient } from '../lib/mass-email-sender';
import { InvitationEmailV2 } from '../apps/invitacionMIPIM';
import { createElement } from 'react';

// Tipos específicos para invitaciones MIPIM
interface MipimInvitationRequest {
  recipients: MipimRecipient[];
  eventDate?: string;
  eventLocation?: string;
  customMessage?: string;
  options?: {
    fromEmail?: string;
    fromName?: string;
    batchSize?: number;
    delayBetweenBatches?: number;
  };
}

interface MipimRecipient extends EmailRecipient {
  magicLinkUrl: string; // URL única para cada invitado
}

interface MipimInvitationResponse {
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
 * API endpoint específico para enviar invitaciones MIPIM
 * 
 * POST /api/send-mipim-invitations
 * 
 * Body:
 * {
 *   "recipients": [
 *     {
 *       "email": "invitado@ejemplo.com",
 *       "firstName": "Juan",
 *       "lastName": "Pérez",
 *       "magicLinkUrl": "https://mipim.growthbdm.com/ticket/abc123"
 *     }
 *   ],
 *   "eventDate": "10 de Septiembre, 2025",
 *   "eventLocation": "Neuchatel, Ciudad de México",
 *   "customMessage": "Esperamos verte en este evento exclusivo",
 *   "options": {
 *     "batchSize": 25,
 *     "delayBetweenBatches": 3000
 *   }
 * }
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MipimInvitationResponse>
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
      recipients,
      eventDate = '10 de Septiembre, 2025',
      eventLocation = 'Neuchatel, Ciudad de México',
      customMessage,
      options = {}
    }: MipimInvitationRequest = req.body;

    // Validar datos requeridos
    if (!recipients || !Array.isArray(recipients)) {
      return res.status(400).json({
        success: false,
        message: 'La lista de destinatarios es requerida y debe ser un array'
      });
    }

    if (recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'La lista de destinatarios no puede estar vacía'
      });
    }

    // Validar que cada destinatario tenga magicLinkUrl
    const recipientsWithoutMagicLink = recipients.filter(r => !r.magicLinkUrl);
    if (recipientsWithoutMagicLink.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Los siguientes destinatarios no tienen magicLinkUrl: ${recipientsWithoutMagicLink.map(r => r.email).join(', ')}`
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
    const maxRecipientsPerCampaign = parseInt(process.env.MAX_RECIPIENTS_PER_CAMPAIGN || '1000');
    if (validRecipients.length > maxRecipientsPerCampaign) {
      return res.status(400).json({
        success: false,
        message: `Demasiados destinatarios. Máximo permitido: ${maxRecipientsPerCampaign}`
      });
    }

    // Crear función de template personalizada para MIPIM
    const createMipimTemplate = (recipient: MipimRecipient) => {
      return createElement(InvitationEmailV2, {
        recipientName: recipient.firstName ? `${recipient.firstName} ${recipient.lastName || ''}`.trim() : undefined,
        recipientEmail: recipient.email,
        magicLinkUrl: recipient.magicLinkUrl,
        eventDate,
        eventLocation,
        customMessage
      });
    };

    // Crear la campaña con subject predeterminado
    const subject = `Invitación exclusiva: Promoción MIPIM 2026 México - ${eventDate}`;
    
    const campaign = createCampaign(
      subject,
      createMipimTemplate,
      validRecipients as MipimRecipient[],
      {
        batchSize: options.batchSize || 25,
        delayBetweenBatches: options.delayBetweenBatches || 3000,
        fromEmail: options.fromEmail || 'mipim@aliest.growthbdm.com',
        fromName: options.fromName || 'GrowthBDM - MIPIM 2026'
      }
    );

    // Generar ID único para la campaña
    const campaignId = `mipim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`🏢 Iniciando campaña MIPIM ${campaignId}`);
    console.log(`📧 Invitaciones a enviar: ${validRecipients.length}`);
    console.log(`📅 Evento: ${eventDate} en ${eventLocation}`);
    console.log(`⚠️ Emails inválidos: ${invalidEmails.length}`);

    // Crear instancia del sender con configuración optimizada para invitaciones
    const sender = new MassEmailSender(
      options.batchSize || 25,
      options.delayBetweenBatches || 3000
    );

    // Enviar la campaña
    const result = await sender.sendCampaign(campaign);

    // Obtener emails que fallaron
    const failedEmails = result.results
      .filter(r => !r.success)
      .map(r => r.recipient);

    console.log(`✅ Campaña MIPIM ${campaignId} completada`);
    console.log(`📊 Invitaciones enviadas: ${result.totalSent}, Fallidas: ${result.totalFailed}`);

    // Respuesta exitosa
    return res.status(200).json({
      success: true,
      message: `Invitaciones MIPIM enviadas exitosamente. ${result.totalSent} invitaciones enviadas, ${result.totalFailed} fallidas.`,
      data: {
        campaignId,
        totalSent: result.totalSent,
        totalFailed: result.totalFailed,
        duration: result.duration,
        ...(failedEmails.length > 0 && { failedEmails })
      }
    });

  } catch (error) {
    console.error('❌ Error en send-mipim-invitations:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
}

/**
 * Función helper para generar magic links únicos
 */
export function generateMagicLink(baseUrl: string, recipientEmail: string, eventId: string = 'mipim2026'): string {
  const token = Buffer.from(`${recipientEmail}:${eventId}:${Date.now()}`).toString('base64url');
  return `${baseUrl}/ticket/${token}`;
}

/**
 * Función helper para validar magic links
 */
export function validateMagicLink(token: string): { valid: boolean; email?: string; eventId?: string } {
  try {
    const decoded = Buffer.from(token, 'base64url').toString();
    const [email, eventId, timestamp] = decoded.split(':');
    
    // Verificar que el token no sea muy antiguo (ej: 30 días)
    const tokenAge = Date.now() - parseInt(timestamp);
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 días en ms
    
    if (tokenAge > maxAge) {
      return { valid: false };
    }
    
    return { valid: true, email, eventId };
  } catch (error) {
    return { valid: false };
  }
}