import { Resend } from 'resend';
import { render } from '@react-email/render';
import { ReactElement } from 'react';

// Configuración del cliente Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Interfaces
interface EmailRecipient {
  email: string;
  firstName?: string;
  lastName?: string;
  customData?: Record<string, any>;
}

interface EmailCampaign {
  subject: string;
  fromEmail: string;
  fromName: string;
  template: ReactElement;
  recipients: EmailRecipient[];
  batchSize?: number;
  delayBetweenBatches?: number;
}

interface SendResult {
  success: boolean;
  emailId?: string;
  error?: string;
  recipient: string;
}

interface CampaignResult {
  totalSent: number;
  totalFailed: number;
  results: SendResult[];
  duration: number;
}

// Configuración por defecto
const DEFAULT_BATCH_SIZE = parseInt(process.env.MAX_EMAILS_PER_BATCH || '100');
const DEFAULT_DELAY = parseInt(process.env.DELAY_BETWEEN_BATCHES || '1000');
const MAX_RETRIES = 3;

/**
 * Clase para manejar el envío masivo de correos electrónicos
 */
export class MassEmailSender {
  private batchSize: number;
  private delayBetweenBatches: number;

  constructor(batchSize = DEFAULT_BATCH_SIZE, delayBetweenBatches = DEFAULT_DELAY) {
    this.batchSize = batchSize;
    this.delayBetweenBatches = delayBetweenBatches;
  }

  /**
   * Envía una campaña de email masiva
   */
  async sendCampaign(campaign: EmailCampaign): Promise<CampaignResult> {
    const startTime = Date.now();
    const results: SendResult[] = [];
    let totalSent = 0;
    let totalFailed = 0;

    console.log(`🚀 Iniciando campaña: ${campaign.subject}`);
    console.log(`📧 Total de destinatarios: ${campaign.recipients.length}`);
    console.log(`📦 Tamaño de lote: ${this.batchSize}`);

    // Dividir destinatarios en lotes
    const batches = this.chunkArray(campaign.recipients, this.batchSize);
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`📤 Procesando lote ${i + 1}/${batches.length} (${batch.length} emails)`);

      // Procesar lote actual
      const batchResults = await this.processBatch(batch, campaign);
      results.push(...batchResults);

      // Contar resultados
      const batchSent = batchResults.filter(r => r.success).length;
      const batchFailed = batchResults.filter(r => !r.success).length;
      totalSent += batchSent;
      totalFailed += batchFailed;

      console.log(`✅ Lote ${i + 1} completado: ${batchSent} enviados, ${batchFailed} fallidos`);

      // Esperar antes del siguiente lote (excepto en el último)
      if (i < batches.length - 1) {
        console.log(`⏳ Esperando ${this.delayBetweenBatches}ms antes del siguiente lote...`);
        await this.delay(this.delayBetweenBatches);
      }
    }

    const duration = Date.now() - startTime;
    console.log(`🎉 Campaña completada en ${duration}ms`);
    console.log(`📊 Resumen: ${totalSent} enviados, ${totalFailed} fallidos`);

    return {
      totalSent,
      totalFailed,
      results,
      duration
    };
  }

  /**
   * Procesa un lote de destinatarios
   */
  private async processBatch(recipients: EmailRecipient[], campaign: EmailCampaign): Promise<SendResult[]> {
    const promises = recipients.map(recipient => 
      this.sendSingleEmail(recipient, campaign)
    );

    return Promise.all(promises);
  }

  /**
   * Envía un email individual con reintentos
   */
  private async sendSingleEmail(
    recipient: EmailRecipient, 
    campaign: EmailCampaign,
    retryCount = 0
  ): Promise<SendResult> {
    try {
      // Personalizar el template con datos del destinatario
      const personalizedTemplate = this.personalizeTemplate(campaign.template, recipient);
      
      // Renderizar el template a HTML
      const html = render(personalizedTemplate);

      // Enviar el email
      const result = await resend.emails.send({
        from: `${campaign.fromName} <${campaign.fromEmail}>`,
        to: recipient.email,
        subject: this.personalizeSubject(campaign.subject, recipient),
        html,
      });

      return {
        success: true,
        emailId: result.data?.id,
        recipient: recipient.email
      };

    } catch (error) {
      console.error(`❌ Error enviando a ${recipient.email}:`, error);

      // Reintentar si no hemos alcanzado el máximo
      if (retryCount < MAX_RETRIES) {
        console.log(`🔄 Reintentando envío a ${recipient.email} (intento ${retryCount + 1}/${MAX_RETRIES})`);
        await this.delay(1000 * (retryCount + 1)); // Backoff exponencial
        return this.sendSingleEmail(recipient, campaign, retryCount + 1);
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
        recipient: recipient.email
      };
    }
  }

  /**
   * Personaliza el template con datos del destinatario
   */
  private personalizeTemplate(template: ReactElement, recipient: EmailRecipient): ReactElement {
    // Aquí puedes implementar lógica para personalizar el template
    // Por ejemplo, reemplazar props con datos del destinatario
    const props = {
      ...template.props,
      firstName: recipient.firstName,
      lastName: recipient.lastName,
      ...recipient.customData
    };

    return { ...template, props };
  }

  /**
   * Personaliza el asunto del email
   */
  private personalizeSubject(subject: string, recipient: EmailRecipient): string {
    return subject
      .replace('{{firstName}}', recipient.firstName || '')
      .replace('{{lastName}}', recipient.lastName || '')
      .replace('{{email}}', recipient.email);
  }

  /**
   * Divide un array en chunks del tamaño especificado
   */
  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  /**
   * Función de delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Valida una lista de destinatarios
   */
  static validateRecipients(recipients: EmailRecipient[]): { valid: EmailRecipient[], invalid: string[] } {
    const valid: EmailRecipient[] = [];
    const invalid: string[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    recipients.forEach(recipient => {
      if (emailRegex.test(recipient.email)) {
        valid.push(recipient);
      } else {
        invalid.push(recipient.email);
      }
    });

    return { valid, invalid };
  }
}

// Función de utilidad para crear campañas
export function createCampaign(
  subject: string,
  template: ReactElement,
  recipients: EmailRecipient[],
  options: {
    fromEmail?: string;
    fromName?: string;
    batchSize?: number;
    delayBetweenBatches?: number;
  } = {}
): EmailCampaign {
  return {
    subject,
    template,
    recipients,
    fromEmail: options.fromEmail || process.env.DEFAULT_FROM_EMAIL || 'noreply@example.com',
    fromName: options.fromName || process.env.DEFAULT_FROM_NAME || 'Tu Empresa',
    batchSize: options.batchSize,
    delayBetweenBatches: options.delayBetweenBatches
  };
}

export type { EmailRecipient, EmailCampaign, SendResult, CampaignResult };