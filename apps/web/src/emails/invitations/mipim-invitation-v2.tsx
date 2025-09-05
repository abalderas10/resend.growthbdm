import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';

interface InvitationEmailV2Props {
  recipientName?: string;
  recipientEmail: string;
  magicLinkUrl: string;
  eventDate?: string;
  eventLocation?: string;
  customMessage?: string;
}

export const InvitationEmailV2 = ({ recipientName = 'Estimado/a invitado/a', recipientEmail, magicLinkUrl, eventDate = '10 de Septiembre, 2025', eventLocation = 'Neuchatel, Ciudad de México', customMessage }: InvitationEmailV2Props) => {
  return (
    <Html>
      <Head />
      <Preview>Invitación exclusiva a la Promoción MIPIM 2026 México - El evento más prestigioso del sector inmobiliario</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo Section */}
          <Section style={logoSection}>
            <Img
              src="https://mipim.growthbdm.com/logo-white.png"
              width="200"
              height="60"
              alt="MIPIM Logo"
              style={logo}
            />
          </Section>

          {/* Header */}
          <Section style={header}>
            <Text style={headerTitle}>Aliest Growth</Text>
            <Text style={headerTitle}>Promoción</Text>
            <Text style={eventTitle}>MIPIM</Text>
            <Text style={subtitle}>La Feria Mundial de Real Estate más Grande del Mundo</Text>
            <Text style={companyLine}>Aliest Growth - Oportunidades de Desarrollo e Inversión en Europa y México</Text>
            <Text style={eventDetails}>{eventDate} | 8:30 a.m. | {eventLocation}</Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={greeting}>Hola {recipientName},</Text>
            
            <Text style={paragraph}>
              Nos complace invitarte a la <strong>Promoción MIPIM 2026 México</strong>, el evento más prestigioso del sector inmobiliario a nivel mundial.
            </Text>

            <Text style={paragraph}>
              Este evento exclusivo reunirá a los principales líderes, desarrolladores e inversionistas del sector inmobiliario para explorar las oportunidades más prometedoras en México y Europa.
            </Text>

            {customMessage && (
              <Text style={paragraph}>
                {customMessage}
              </Text>
            )}

            <Text style={paragraph}>
              <strong>Detalles del evento:</strong>
            </Text>
            
            <Text style={eventInfo}>
              📅 <strong>Fecha:</strong> {eventDate}<br/>
              🕰️ <strong>Hora:</strong> 8:30 a.m.<br/>
              📍 <strong>Ubicación:</strong> {eventLocation}<br/>
              🎯 <strong>Enfoque:</strong> Oportunidades de Desarrollo e Inversión
            </Text>

            <Text style={paragraph}>
              Durante el evento podrás:
            </Text>

            <Text style={bulletPoints}>
              • Conocer proyectos inmobiliarios exclusivos en México y Europa<br/>
              • Conectar con inversionistas y desarrolladores de primer nivel<br/>
              • Explorar oportunidades de inversión con alto potencial de retorno<br/>
              • Participar en presentaciones de proyectos innovadores<br/>
              • Networking con profesionales del sector inmobiliario
            </Text>
          </Section>

          {/* CTA Section */}
          <Section style={ctaSection}>
            <Text style={ctaText}>
              Confirma tu asistencia haciendo clic en el siguiente enlace:
            </Text>
            
            <Button
              href={magicLinkUrl}
              style={button}
            >
              Confirmar Asistencia
            </Button>

            <Text style={linkText}>
              O copia y pega este enlace en tu navegador:<br/>
              <Link href={magicLinkUrl} style={link}>
                {magicLinkUrl}
              </Link>
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Additional Info */}
          <Section style={infoSection}>
            <Text style={infoTitle}>¿Por qué MIPIM?</Text>
            
            <Text style={paragraph}>
              MIPIM es reconocido mundialmente como la plataforma líder para profesionales del sector inmobiliario. Con más de 30 años de experiencia, conecta a los principales actores del mercado global.
            </Text>

            <Text style={paragraph}>
              <strong>Beneficios exclusivos para asistentes:</strong>
            </Text>

            <Text style={bulletPoints}>
              • Acceso a proyectos pre-lanzamiento<br/>
              • Condiciones preferenciales de inversión<br/>
              • Asesoría personalizada de expertos<br/>
              • Materiales exclusivos del evento<br/>
              • Seguimiento post-evento
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Contact Info */}
          <Section style={contactSection}>
            <Text style={contactTitle}>Información de Contacto</Text>
            
            <Text style={contactInfo}>
              <strong>Aliest Growth</strong><br/>
              📧 Email: {recipientEmail}<br/>
              🌐 Web: www.aliestgrowth.com<br/>
              📱 WhatsApp: +52 55 1234 5678
            </Text>

            <Text style={paragraph}>
              Si tienes alguna pregunta o necesitas más información, no dudes en contactarnos. Nuestro equipo estará encantado de asistirte.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Esperamos verte en este evento exclusivo.<br/>
              <strong>Equipo Aliest Growth</strong>
            </Text>
            
            <Text style={disclaimer}>
              Este es un evento por invitación únicamente. La confirmación de asistencia es requerida.
              Si no deseas recibir más invitaciones, puedes darte de baja respondiendo a este correo.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Estilos
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const logoSection = {
  backgroundColor: '#1a365d',
  padding: '20px',
  textAlign: 'center' as const,
};

const logo = {
  margin: '0 auto',
};

const header = {
  backgroundColor: '#2d3748',
  padding: '30px 20px',
  textAlign: 'center' as const,
  color: '#ffffff',
};

const headerTitle = {
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 5px 0',
  color: '#ffffff',
};

const eventTitle = {
  fontSize: '36px',
  fontWeight: 'bold',
  margin: '10px 0',
  color: '#ffd700',
  textTransform: 'uppercase' as const,
  letterSpacing: '2px',
};

const subtitle = {
  fontSize: '16px',
  margin: '10px 0',
  color: '#e2e8f0',
  fontStyle: 'italic',
};

const companyLine = {
  fontSize: '14px',
  margin: '15px 0 5px 0',
  color: '#cbd5e0',
};

const eventDetails = {
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '15px 0 0 0',
  color: '#ffd700',
};

const content = {
  padding: '30px 40px',
};

const greeting = {
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 20px 0',
  color: '#2d3748',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
  color: '#4a5568',
};

const eventInfo = {
  fontSize: '16px',
  lineHeight: '1.8',
  margin: '16px 0',
  padding: '20px',
  backgroundColor: '#f7fafc',
  borderLeft: '4px solid #3182ce',
  color: '#2d3748',
};

const bulletPoints = {
  fontSize: '16px',
  lineHeight: '1.8',
  margin: '16px 0',
  color: '#4a5568',
  paddingLeft: '20px',
};

const ctaSection = {
  padding: '30px 40px',
  textAlign: 'center' as const,
  backgroundColor: '#f7fafc',
};

const ctaText = {
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 20px 0',
  color: '#2d3748',
};

const button = {
  backgroundColor: '#3182ce',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
  margin: '0 0 20px 0',
};

const linkText = {
  fontSize: '14px',
  margin: '20px 0 0 0',
  color: '#718096',
};

const link = {
  color: '#0066CC',
  textDecoration: 'underline',
};



const divider = {
  borderColor: '#e2e8f0',
  margin: '30px 40px',
};

const infoSection = {
  padding: '0 40px 30px',
};

const infoTitle = {
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
  color: '#2d3748',
};

const contactSection = {
  padding: '0 40px 30px',
};

const contactTitle = {
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
  color: '#2d3748',
};

const contactInfo = {
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
  color: '#4a5568',
  padding: '16px',
  backgroundColor: '#f7fafc',
  borderRadius: '8px',
};

const footer = {
  padding: '20px 40px',
  textAlign: 'center' as const,
  backgroundColor: '#2d3748',
};

const footerText = {
  fontSize: '16px',
  margin: '0 0 16px 0',
  color: '#ffffff',
};

const disclaimer = {
  fontSize: '12px',
  lineHeight: '1.4',
  margin: '0',
  color: '#a0aec0',
};

export default InvitationEmailV2;