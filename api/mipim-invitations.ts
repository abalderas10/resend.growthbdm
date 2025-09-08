import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Configuración de Resend
const resend = new Resend(process.env.RESEND_API_KEY!);

interface InvitationRequest {
  contacts: Array<{
    name: string;
    email: string;
    company?: string;
    position?: string;
    phone?: string;
    linkedin_profile?: string;
  }>;
  template_key: string;
  campaign_name?: string;
  send_immediately?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: InvitationRequest = await request.json();
    const { contacts, template_key, campaign_name, send_immediately = false } = body;

    // Validar datos de entrada
    if (!contacts || contacts.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere al menos un contacto' },
        { status: 400 }
      );
    }

    if (!template_key) {
      return NextResponse.json(
        { error: 'Se requiere especificar un template' },
        { status: 400 }
      );
    }

    // Obtener template de la base de datos
    const { data: template, error: templateError } = await supabase
      .from('mipim_templates')
      .select('*')
      .eq('template_key', template_key)
      .eq('is_active', true)
      .single();

    if (templateError || !template) {
      return NextResponse.json(
        { error: 'Template no encontrado o inactivo' },
        { status: 404 }
      );
    }

    const results = {
      success: [],
      errors: [],
      invitation_codes: []
    };

    // Procesar cada contacto
    for (const contact of contacts) {
      try {
        // 1. Crear o actualizar contacto
        const { data: existingContact } = await supabase
          .from('contacts')
          .select('*')
          .eq('email', contact.email)
          .single();

        let contactRecord;
        if (existingContact) {
          // Actualizar contacto existente
          const { data: updatedContact, error: updateError } = await supabase
            .from('contacts')
            .update({
              name: contact.name,
              company: contact.company,
              position: contact.position,
              phone: contact.phone,
              linkedin_profile: contact.linkedin_profile,
              updated_at: new Date().toISOString()
            })
            .eq('email', contact.email)
            .select()
            .single();

          if (updateError) throw updateError;
          contactRecord = updatedContact;
        } else {
          // Crear nuevo contacto
          const { data: newContact, error: insertError } = await supabase
            .from('contacts')
            .insert({
              name: contact.name,
              email: contact.email,
              company: contact.company,
              position: contact.position,
              phone: contact.phone,
              linkedin_profile: contact.linkedin_profile,
              status: 'pending'
            })
            .select()
            .single();

          if (insertError) throw insertError;
          contactRecord = newContact;
        }

        // 2. Generar código de invitación único
        const invitationCode = `MIPIM2025-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        
        const { data: codeRecord, error: codeError } = await supabase
          .from('invitation_codes')
          .insert({
            code: invitationCode,
            type: 'email_invitation',
            email: contact.email,
            status: 'active',
            max_uses: 1,
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
            created_by: 'system'
          })
          .select()
          .single();

        if (codeError) throw codeError;

        // 3. Actualizar contacto con código de invitación
        await supabase
          .from('contacts')
          .update({
            invitation_code_id: codeRecord.id,
            status: send_immediately ? 'invited' : 'pending',
            invited_at: send_immediately ? new Date().toISOString() : null
          })
          .eq('id', contactRecord.id);

        // 4. Enviar email si se solicita
        if (send_immediately) {
          try {
            const emailResult = await resend.emails.send({
              from: 'MIPIM 2025 <invitations@mipim.growthbdm.com>',
              to: contact.email,
              subject: 'Invitación Exclusiva - MIPIM 2025',
              html: generateInvitationHTML(contact, invitationCode, template)
            });

            // Log del email enviado
            await supabase
              .from('email_logs')
              .insert({
                email_type: 'mipim_invitation',
                recipient_email: contact.email,
                resend_id: emailResult.data?.id,
                status: 'sent'
              });

            results.success.push({
              email: contact.email,
              name: contact.name,
              invitation_code: invitationCode,
              email_id: emailResult.data?.id
            });
          } catch (emailError) {
            console.error('Error enviando email:', emailError);
            results.errors.push({
              email: contact.email,
              error: 'Error enviando email',
              details: emailError
            });
          }
        } else {
          results.invitation_codes.push({
            email: contact.email,
            name: contact.name,
            invitation_code: invitationCode
          });
        }

      } catch (contactError) {
        console.error('Error procesando contacto:', contactError);
        results.errors.push({
          email: contact.email,
          error: 'Error procesando contacto',
          details: contactError
        });
      }
    }

    // Crear métricas de campaña si se especifica
    if (campaign_name && send_immediately) {
      await supabase
        .from('campaign_metrics')
        .insert({
          campaign_name,
          template_id: template.id,
          total_sent: results.success.length,
          campaign_date: new Date().toISOString().split('T')[0]
        });
    }

    return NextResponse.json({
      message: 'Invitaciones procesadas exitosamente',
      results,
      summary: {
        total_processed: contacts.length,
        successful: results.success.length,
        errors: results.errors.length,
        pending_codes: results.invitation_codes.length
      }
    });

  } catch (error) {
    console.error('Error en API de invitaciones:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error },
      { status: 500 }
    );
  }
}

// Función para generar HTML de invitación
function generateInvitationHTML(contact: any, invitationCode: string, template: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invitación MIPIM 2025</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://mipim.growthbdm.com/logo-white.png" alt="MIPIM 2025" style="max-width: 200px;">
        </div>
        
        <h1 style="color: #2c3e50; text-align: center;">¡Estás Invitado a MIPIM 2025!</h1>
        
        <p>Estimado/a ${contact.name},</p>
        
        <p>Nos complace invitarte al evento más importante del sector inmobiliario: <strong>MIPIM 2025</strong>.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #2c3e50;">Detalles del Evento</h3>
          <p><strong>Fecha:</strong> 11-14 Marzo 2025</p>
          <p><strong>Lugar:</strong> Cannes, Francia</p>
          <p><strong>Tu código de invitación:</strong> <code style="background: #e9ecef; padding: 4px 8px; border-radius: 4px; font-weight: bold;">${invitationCode}</code></p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://mipim.growthbdm.com/register?code=${invitationCode}" 
             style="background: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Confirmar Asistencia
          </a>
        </div>
        
        <p>Este es un evento exclusivo con cupos limitados. Te recomendamos confirmar tu asistencia lo antes posible.</p>
        
        <p>¡Esperamos verte en Cannes!</p>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #666;">
          <p>Growth BDM Team<br>
          Email: info@growthbdm.com<br>
          Web: https://growthbdm.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// GET endpoint para obtener estadísticas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const campaign = searchParams.get('campaign');
    const template = searchParams.get('template');

    let query = supabase
      .from('contacts')
      .select(`
        *,
        invitation_codes(*)
      `);

    if (campaign) {
      // Filtrar por campaña si se especifica
      query = query.eq('created_by', campaign);
    }

    const { data: contacts, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Error obteniendo contactos' },
        { status: 500 }
      );
    }

    // Calcular estadísticas
    const stats = {
      total_contacts: contacts.length,
      pending: contacts.filter(c => c.status === 'pending').length,
      invited: contacts.filter(c => c.status === 'invited').length,
      registered: contacts.filter(c => c.status === 'registered').length,
      declined: contacts.filter(c => c.status === 'declined').length
    };

    return NextResponse.json({
      contacts,
      statistics: stats
    });

  } catch (error) {
    console.error('Error en GET de invitaciones:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}