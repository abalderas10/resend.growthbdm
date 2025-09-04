/**
 * Ejemplo de uso del sistema de envío masivo de correos
 * 
 * Este archivo muestra cómo usar el sistema de envío masivo
 * para diferentes tipos de campañas de email.
 */

import { MassEmailSender, createCampaign, EmailRecipient } from '../lib/mass-email-sender';
import MarketingCampaignEmail from '../templates/marketing-campaign';
import { createElement } from 'react';

// Ejemplo 1: Campaña de marketing básica
export async function sendMarketingCampaign() {
  // Lista de destinatarios
  const recipients: EmailRecipient[] = [
    {
      email: 'juan@ejemplo.com',
      firstName: 'Juan',
      lastName: 'Pérez',
      customData: {
        segment: 'premium',
        lastPurchase: '2024-01-15'
      }
    },
    {
      email: 'maria@ejemplo.com',
      firstName: 'María',
      lastName: 'González',
      customData: {
        segment: 'regular',
        lastPurchase: '2023-12-20'
      }
    },
    {
      email: 'carlos@ejemplo.com',
      firstName: 'Carlos',
      lastName: 'Rodríguez'
    }
  ];

  // Crear el template personalizado
  const template = createElement(MarketingCampaignEmail, {
    companyName: 'Mi Empresa Tech',
    campaignTitle: 'Descuento Especial del 30%',
    campaignDescription: 'Aprovecha esta oferta exclusiva en todos nuestros productos tecnológicos. Válida hasta fin de mes.',
    ctaText: 'Ver Ofertas',
    ctaUrl: 'https://miempresa.com/ofertas-especiales',
    logoUrl: 'https://miempresa.com/logo.png',
    unsubscribeUrl: 'https://miempresa.com/unsubscribe'
  });

  // Crear la campaña
  const campaign = createCampaign(
    'Oferta Especial para {{firstName}} - 30% de Descuento',
    template,
    recipients,
    {
      fromEmail: 'ofertas@miempresa.com',
      fromName: 'Equipo de Ofertas - Mi Empresa',
      batchSize: 50,
      delayBetweenBatches: 2000
    }
  );

  // Enviar la campaña
  const sender = new MassEmailSender();
  const result = await sender.sendCampaign(campaign);

  console.log('Resultado de la campaña:', result);
  return result;
}

// Ejemplo 2: Campaña con validación de destinatarios
export async function sendValidatedCampaign() {
  const recipients: EmailRecipient[] = [
    { email: 'valido@ejemplo.com', firstName: 'Usuario', lastName: 'Válido' },
    { email: 'email-invalido', firstName: 'Usuario', lastName: 'Inválido' },
    { email: 'otro@ejemplo.com', firstName: 'Otro', lastName: 'Usuario' }
  ];

  // Validar destinatarios antes de enviar
  const { valid, invalid } = MassEmailSender.validateRecipients(recipients);
  
  console.log(`Destinatarios válidos: ${valid.length}`);
  console.log(`Destinatarios inválidos: ${invalid.length}`);
  
  if (invalid.length > 0) {
    console.warn('Emails inválidos encontrados:', invalid);
  }

  if (valid.length === 0) {
    throw new Error('No hay destinatarios válidos');
  }

  // Continuar solo con destinatarios válidos
  const template = createElement(MarketingCampaignEmail, {
    companyName: 'Mi Empresa',
    campaignTitle: 'Newsletter Semanal',
    campaignDescription: 'Las últimas noticias y actualizaciones de nuestra empresa.',
    ctaText: 'Leer Más',
    ctaUrl: 'https://miempresa.com/blog'
  });

  const campaign = createCampaign(
    'Newsletter Semanal - {{firstName}}',
    template,
    valid
  );

  const sender = new MassEmailSender(25, 1500); // Lotes más pequeños
  return await sender.sendCampaign(campaign);
}

// Ejemplo 3: Campaña con manejo de errores
export async function sendCampaignWithErrorHandling() {
  try {
    const recipients: EmailRecipient[] = [
      { email: 'test1@ejemplo.com', firstName: 'Test', lastName: 'User1' },
      { email: 'test2@ejemplo.com', firstName: 'Test', lastName: 'User2' }
    ];

    const template = createElement(MarketingCampaignEmail, {
      companyName: 'Test Company',
      campaignTitle: 'Test Campaign',
      campaignDescription: 'Esta es una campaña de prueba.',
      ctaText: 'Test Button',
      ctaUrl: 'https://test.com'
    });

    const campaign = createCampaign(
      'Test Campaign for {{firstName}}',
      template,
      recipients
    );

    const sender = new MassEmailSender();
    const result = await sender.sendCampaign(campaign);

    // Analizar resultados
    const failedEmails = result.results
      .filter(r => !r.success)
      .map(r => ({ email: r.recipient, error: r.error }));

    if (failedEmails.length > 0) {
      console.error('Emails que fallaron:', failedEmails);
      // Aquí podrías implementar lógica para reenviar o notificar
    }

    return {
      success: result.totalFailed === 0,
      totalSent: result.totalSent,
      totalFailed: result.totalFailed,
      failedEmails
    };

  } catch (error) {
    console.error('Error en la campaña:', error);
    throw error;
  }
}

// Ejemplo 4: Campaña programada (usando cron o scheduler)
export async function scheduleWeeklyNewsletter() {
  // Este ejemplo muestra cómo podrías estructurar una campaña programada
  
  // Obtener destinatarios de base de datos (ejemplo)
  const recipients = await getSubscribersFromDatabase();
  
  // Filtrar solo suscriptores activos
  const activeSubscribers = recipients.filter(r => r.customData?.isActive === true);
  
  const template = createElement(MarketingCampaignEmail, {
    companyName: 'Mi Newsletter',
    campaignTitle: 'Newsletter Semanal',
    campaignDescription: 'Contenido destacado de esta semana.',
    ctaText: 'Leer Newsletter Completo',
    ctaUrl: 'https://minewsletter.com/weekly'
  });

  const campaign = createCampaign(
    'Newsletter Semanal - Semana del ' + new Date().toLocaleDateString(),
    template,
    activeSubscribers,
    {
      fromEmail: 'newsletter@minewsletter.com',
      fromName: 'Mi Newsletter',
      batchSize: 100,
      delayBetweenBatches: 3000
    }
  );

  const sender = new MassEmailSender();
  return await sender.sendCampaign(campaign);
}

// Función simulada para obtener suscriptores de base de datos
async function getSubscribersFromDatabase(): Promise<EmailRecipient[]> {
  // En una implementación real, esto consultaría tu base de datos
  return [
    {
      email: 'suscriptor1@ejemplo.com',
      firstName: 'Ana',
      lastName: 'López',
      customData: {
        isActive: true,
        subscriptionDate: '2024-01-01',
        preferences: ['tech', 'business']
      }
    },
    {
      email: 'suscriptor2@ejemplo.com',
      firstName: 'Pedro',
      lastName: 'Martín',
      customData: {
        isActive: true,
        subscriptionDate: '2024-01-15',
        preferences: ['marketing', 'design']
      }
    }
  ];
}

// Ejemplo 5: Uso con API REST
export async function sendCampaignViaAPI() {
  const campaignData = {
    campaignType: 'marketing',
    subject: 'Oferta Especial para {{firstName}}!',
    recipients: [
      {
        email: 'cliente@ejemplo.com',
        firstName: 'Cliente',
        lastName: 'Ejemplo'
      }
    ],
    templateData: {
      companyName: 'Mi Empresa API',
      campaignTitle: 'Descuento del 25%',
      campaignDescription: 'Oferta exclusiva para nuestros clientes VIP.',
      ctaText: 'Aprovechar Oferta',
      ctaUrl: 'https://miempresa.com/vip-offer'
    },
    options: {
      batchSize: 50,
      delayBetweenBatches: 2000
    }
  };

  // Simular llamada a API
  const response = await fetch('/api/send-campaign', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer tu-api-key-aqui'
    },
    body: JSON.stringify(campaignData)
  });

  const result = await response.json();
  console.log('Respuesta de la API:', result);
  
  return result;
}

// Función de utilidad para testing
export async function testEmailTemplate() {
  const testRecipient: EmailRecipient = {
    email: 'test@ejemplo.com',
    firstName: 'Usuario',
    lastName: 'Prueba'
  };

  const template = createElement(MarketingCampaignEmail, {
    companyName: 'Test Company',
    campaignTitle: 'Email de Prueba',
    campaignDescription: 'Este es un email de prueba para verificar el template.',
    ctaText: 'Botón de Prueba',
    ctaUrl: 'https://test.com'
  });

  const campaign = createCampaign(
    'Test Email para {{firstName}}',
    template,
    [testRecipient]
  );

  const sender = new MassEmailSender();
  return await sender.sendCampaign(campaign);
}