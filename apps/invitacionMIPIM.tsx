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
          {/* Header */}
          <Section style={header}>
            <Img
              src="https://mipim.growthbdm.com/logo-aliest-growth.png"
              width="200"
              height="60"
              alt="Aliest-Growth Logo"
              style={logo}
            />
            <Text style={headerTitle}>Aliest Growth</Text>
            <Text style={headerTitle}>Promoción</Text>
            <Text style={eventTitle}>MIPIM</Text>
            <Text style={subtitle}>La Feria Mundial de Real Estate más Grande del Mundo</Text>
            <Text style={companyLine}>Aliest Growth - Oportunidades de Desarrollo e Inversión en Europa y México</Text>
            <Text style={eventDetails}>{eventDate} | 8:30 a.m. | {eventLocation}</Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={greeting}>Estimado/a {recipientName},</Text>
            
            <Text style={paragraph}>
              Desde GrowthBDM tenemos el honor de invitarte a participar al evento de Promoción MIPIM 2026 México, el evento más prestigioso del sector inmobiliario en Latinoamérica.
            </Text>

            <Text style={paragraph}>
              ¡No te pierdas MIPIM La Feria Inmobiliaria más Grande del Mundo, un evento exclusivo diseñado para líderes C-Level del sector inmobiliario!
            </Text>

            <Text style={paragraph}>
              Sumérgete en el futuro del real estate y descubre las claves para la inversión y el desarrollo de negocios a nivel global. Conecta directamente con figuras influyentes y obtén insights estratégicos de ponentes.
            </Text>

            {/* CTA Section */}
            <Section style={ctaSection}>
              <Button style={button} href={magicLinkUrl}>
                Obtener Mi Boleto Aliest-Growth Promoción MIPIM
              </Button>
              <Text style={ctaNote}>No necesitas registrarte</Text>
            </Section>

            {/* Event Details Section */}
            <Section style={eventDetailsSection}>
              <Text style={sectionTitle}>Detalles del Evento:</Text>
              <Hr style={separator} />
              <Text style={eventDetailItem}><strong>Fecha:</strong> 10 de Septiembre, 2025</Text>
              <Text style={eventDetailItem}><strong>Hora:</strong> 8:30 a.m.</Text>
              <Text style={eventDetailItem}><strong>Sede:</strong> Neuchatel, Ciudad de México</Text>
            </Section>
            <Text style={paragraph}>
              Este es un evento con cupo estrictamente limitado para garantizar una experiencia de networking de alta calidad. Asegura tu acceso gratuito y sé parte de este encuentro que definirá el futuro de tu negocio.
            </Text>

            {/* Ticket Access */}
            <Section style={ticketSection}>
              <Text style={sectionTitle}>🎫 Acceso directo a tu boleto</Text>
              <Text style={paragraph}>Haz clic en el botón de arriba para acceder directamente a tu boleto con código QR.</Text>
              <Text style={paragraph}>Si el botón no funciona, copia y pega este enlace en tu navegador:</Text>
              <Text style={linkText}>
                <Link href={magicLinkUrl} style={link}>
                  {magicLinkUrl}
                </Link>
              </Text>
            </Section>

            {/* Custom Message */}
            {customMessage && (
              <Section style={customMessageStyle}>
                <Text style={paragraph}>{customMessage}</Text>
              </Section>
            )}
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
  padding: '0',
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
  backgroundColor: '#2c5aa0',
  padding: '30px 20px',
  textAlign: 'center' as const,
  color: '#ffffff',
};

const headerTitle = {
  fontSize: '14px',
  fontWeight: 'normal',
  margin: '0 0 10px',
  color: '#ffffff',
};

const eventTitle = {
  fontSize: '48px',
  fontWeight: 'bold',
  margin: '0 0 10px',
  color: '#ffffff',
  letterSpacing: '2px',
};

const subtitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 20px',
  color: '#ffffff',
};

const companyLine = {
  fontSize: '14px',
  margin: '0 0 20px',
  color: '#ffffff',
  fontStyle: 'italic',
};

const eventDetails = {
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0',
  color: '#ffffff',
};

const content = {
  padding: '30px',
};

const greeting = {
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 20px',
  color: '#2c5aa0',
};

const paragraph = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '16px 0',
};

const networkingSection = {
  backgroundColor: '#f8fafc',
  border: '2px solid #e2e8f0',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const sectionTitle = {
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 15px',
  color: '#2c5aa0',
};

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#2c5aa0',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
  border: 'none',
  cursor: 'pointer',
};

const speakersSection = {
  margin: '24px 0',
};

const speakerItem = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '16px 0',
  padding: '12px',
  backgroundColor: '#f8fafc',
  borderRadius: '6px',
};

const divider = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
};

const eventDetailsSection = {
  backgroundColor: '#f8fafc',
  padding: '20px',
  borderRadius: '8px',
  margin: '24px 0',
};

const detailItem = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '16px 0',
};

const customMessageStyle = {
  color: '#2d3748',
  fontSize: '16px',
  fontStyle: 'italic',
  lineHeight: '1.6',
  margin: '20px 0',
  padding: '16px',
  backgroundColor: '#edf2f7',
  borderLeft: '4px solid #2c5aa0',
};

const linkText = {
  margin: '16px 0',
};

const link = {
  color: '#2c5aa0',
  fontSize: '14px',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
};

const ctaNote = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '8px 0 0 0',
  fontStyle: 'italic',
};

const separator = {
  borderColor: '#e5e7eb',
  margin: '16px 0',
};

const eventDetailItem = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '8px 0',
};

const ticketSection = {
  backgroundColor: '#f8fafc',
  border: '2px solid #e2e8f0',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
  textAlign: 'center' as const,
};