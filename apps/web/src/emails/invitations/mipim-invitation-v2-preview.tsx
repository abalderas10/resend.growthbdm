import {
  Button,
  Container,
  Img,
  Link,
  Section,
  Text,
  Hr,
} from '@react-email/components';

interface InvitationEmailV2Props {
  recipientName?: string;
  recipientEmail?: string;
  magicLinkUrl?: string;
  eventDate?: string;
  eventLocation?: string;
  customMessage?: string;
}

export const InvitationEmailV2Preview = ({ 
  recipientName = 'Estimado/a invitado/a', 
  recipientEmail = 'invitado@ejemplo.com', 
  magicLinkUrl = '#', 
  eventDate = '10 de Septiembre, 2025', 
  eventLocation = 'Neuchatel, Ciudad de México', 
  customMessage 
}: InvitationEmailV2Props) => {
  return (
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
          📍 <strong>Ubicación:</strong> {eventLocation}
        </Text>

        <Text style={paragraph}>
          Durante el evento tendrás la oportunidad de:
        </Text>

        <Text style={bulletPoints}>
          • Conocer proyectos de desarrollo inmobiliario de alto impacto<br/>
          • Conectar con inversionistas y desarrolladores internacionales<br/>
          • Explorar oportunidades de inversión en mercados emergentes<br/>
          • Participar en presentaciones exclusivas de proyectos premium
        </Text>
      </Section>

      {/* CTA Button */}
      <Section style={buttonSection}>
        <Button style={button} href={magicLinkUrl}>
          Confirmar Asistencia
        </Button>
      </Section>

      <Hr style={divider} />

      {/* Additional Info */}
      <Section style={additionalInfo}>
        <Text style={infoTitle}>Información Adicional</Text>
        
        <Text style={infoText}>
          <strong>Código de vestimenta:</strong> Business Formal
        </Text>
        
        <Text style={infoText}>
          <strong>Idiomas:</strong> Español e Inglés
        </Text>
        
        <Text style={infoText}>
          <strong>Networking:</strong> Cocktail de bienvenida incluido
        </Text>
      </Section>

      <Hr style={divider} />

      {/* Contact Info */}
      <Section style={contactSection}>
        <Text style={contactTitle}>¿Tienes preguntas?</Text>
        <Text style={contactText}>
          Contáctanos en: <Link href="mailto:mipim@aliest.growthbdm.com" style={link}>mipim@aliest.growthbdm.com</Link>
        </Text>
        <Text style={contactText}>
          Teléfono: +52 55 1234 5678
        </Text>
      </Section>

      {/* Footer */}
      <Section style={footer}>
        <Text style={footerText}>
          Este es un evento exclusivo por invitación. Por favor, confirma tu asistencia antes del {eventDate}.
        </Text>
        
        <Text style={disclaimer}>
          Aliest Growth | Oportunidades de Desarrollo e Inversión<br/>
          Ciudad de México, México<br/>
          <Link href="https://aliest.growthbdm.com" style={link}>www.aliest.growthbdm.com</Link>
        </Text>
      </Section>
    </Container>
  );
};

export default InvitationEmailV2Preview;

// Estilos
const container = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  padding: '20px',
};

const logoSection = {
  textAlign: 'center' as const,
  padding: '20px 0',
  backgroundColor: '#1a1a1a',
};

const logo = {
  margin: '0 auto',
};

const header = {
  backgroundColor: '#1a1a1a',
  color: '#ffffff',
  textAlign: 'center' as const,
  padding: '40px 20px',
};

const headerTitle = {
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0',
  lineHeight: '1.2',
};

const eventTitle = {
  fontSize: '48px',
  fontWeight: 'bold',
  margin: '20px 0 10px 0',
  color: '#ffd700',
  letterSpacing: '2px',
};

const subtitle = {
  fontSize: '18px',
  margin: '10px 0',
  fontStyle: 'italic',
};

const companyLine = {
  fontSize: '14px',
  margin: '20px 0 10px 0',
  opacity: 0.9,
};

const eventDetails = {
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '20px 0 0 0',
  color: '#ffd700',
};

const content = {
  backgroundColor: '#ffffff',
  padding: '40px',
  borderRadius: '8px',
  margin: '20px 0',
};

const greeting = {
  fontSize: '20px',
  fontWeight: 'bold',
  marginBottom: '20px',
  color: '#1a1a1a',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.6',
  marginBottom: '16px',
  color: '#374151',
};

const eventInfo = {
  fontSize: '16px',
  lineHeight: '1.8',
  marginBottom: '20px',
  padding: '20px',
  backgroundColor: '#f8fafc',
  borderRadius: '6px',
  borderLeft: '4px solid #ffd700',
};

const bulletPoints = {
  fontSize: '16px',
  lineHeight: '1.8',
  marginBottom: '20px',
  color: '#374151',
};

const buttonSection = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#ffd700',
  color: '#1a1a1a',
  padding: '16px 32px',
  borderRadius: '6px',
  textDecoration: 'none',
  fontWeight: 'bold',
  fontSize: '18px',
  display: 'inline-block',
};

const divider = {
  borderColor: '#e5e7eb',
  margin: '30px 0',
};

const additionalInfo = {
  backgroundColor: '#f8fafc',
  padding: '30px',
  borderRadius: '8px',
  margin: '20px 0',
};

const infoTitle = {
  fontSize: '20px',
  fontWeight: 'bold',
  marginBottom: '16px',
  color: '#1a1a1a',
};

const infoText = {
  fontSize: '16px',
  lineHeight: '1.6',
  marginBottom: '12px',
  color: '#374151',
};

const contactSection = {
  backgroundColor: '#1a1a1a',
  color: '#ffffff',
  padding: '30px',
  borderRadius: '8px',
  textAlign: 'center' as const,
  margin: '20px 0',
};

const contactTitle = {
  fontSize: '20px',
  fontWeight: 'bold',
  marginBottom: '16px',
};

const contactText = {
  fontSize: '16px',
  marginBottom: '8px',
};

const link = {
  color: '#ffd700',
  textDecoration: 'underline',
};

const footer = {
  textAlign: 'center' as const,
  padding: '20px',
};

const footerText = {
  fontSize: '14px',
  color: '#6b7280',
  marginBottom: '16px',
  fontStyle: 'italic',
};

const disclaimer = {
  fontSize: '12px',
  color: '#9ca3af',
  lineHeight: '1.5',
};