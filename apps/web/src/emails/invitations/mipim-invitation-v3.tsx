import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from '@react-email/components';
import * as React from 'react';

interface MipimInvitationEmailProps {
  recipientName?: string;
  magicLinkUrl?: string;
  eventDate?: string;
  eventLocation?: string;
  customMessage?: string;
}

export const MipimInvitationEmail = ({
  recipientName = 'Alberto Balderas',
  magicLinkUrl = '#',
  eventDate = '10 de Septiembre, 2025',
  eventLocation = 'Neuchatel, Ciudad de México',
  customMessage = ''
}: MipimInvitationEmailProps) => {
  const previewText = `Promoción MIPIM La Feria de Real Estate más Grande del Mundo - ${eventDate}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Aliest Growth Logo */}
          <Section style={header}>
            <Row>
              <Column align="center">
                <Img
                  src="https://mpeimoornrbahdpszhor.supabase.co/storage/v1/object/public/email-images/logos/aliestGrowth.png"
                  width="200"
                  height="60"
                  alt="Aliest Growth"
                  style={logo}
                />
              </Column>
            </Row>
          </Section>

          {/* Main Title with MIPIM Logo */}
          <Section style={titleSection}>
            <Row>
              <Column align="center">
                <Heading as="h1" style={h1}>
                  Promoción{' '}
                  <Img
                    src="https://mpeimoornrbahdpszhor.supabase.co/storage/v1/object/public/email-images/logos/mipim.png"
                    width="120"
                    height="40"
                    alt="MIPIM"
                    style={inlineLogo}
                  />{' '}
                  La Feria de Real Estate más Grande del Mundo
                </Heading>
              </Column>
            </Row>
          </Section>

          {/* Subtitle */}
          <Section style={subtitleSection}>
            <Row>
              <Column align="center">
                <Heading as="h2" style={h2}>
                  Aliest Growth - Oportunidades de Desarrollo e Inversión en Europa y México
                </Heading>
              </Column>
            </Row>
          </Section>

          {/* Event Details */}
          <Section style={eventDetailsSection}>
            <Row>
              <Column align="center">
                <Heading as="h3" style={h3}>
                  {eventDate} | 8:30 a.m. | {eventLocation}
                </Heading>
              </Column>
            </Row>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={text}>
              Estimado/a {recipientName},
            </Text>
            
            <Text style={text}>
              Desde <strong>GrowthBDM</strong> tenemos el honor de invitarte a participar en el evento de Promoción MIPIM, el evento más prestigioso del sector inmobiliario en Latinoamérica.
            </Text>
            
            <Text style={text}>
              Aliest Growth - Oportunidades de Desarrollo e Inversión en Europa y México
            </Text>

            {customMessage && (
              <Section style={customMessageSection}>
                <Text style={customMessageText}>
                  {customMessage}
                </Text>
              </Section>
            )}

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Row>
                <Column align="center">
                  <Button style={button} href={magicLinkUrl}>
                    Confirmar asistencia y Generar Boleto
                  </Button>
                </Column>
              </Row>
            </Section>

            <Text style={text}>
              ¡No te pierdas MIPIM La Feria Inmobiliaria más Grande del Mundo, un evento exclusivo diseñado para líderes C-Level del sector inmobiliario!
            </Text>

            <Text style={text}>
              Sumérgete en el futuro del real estate y descubre las claves para la inversión y el desarrollo de negocios a nivel global. Conecta directamente con figuras influyentes y obtén insights estratégicos de:
            </Text>

            {/* Speakers Section */}
            <Section style={benefitsSection}>
              <Row>
                <Column>
                  <Heading as="h3" style={h3}>Ponentes Destacados</Heading>
                  
                  <Text style={benefitItem}>
                    <strong>Juan Bravo - MIPIM Latinoamerica:</strong><br/>
                    Oportunidades de Inversión y Negocios entre México y el Mundo
                  </Text>

                  <Text style={benefitItem}>
                    <strong>Hines - Desarrollador Inmobiliario Global:</strong><br/>
                    Trayectoria, Proyectos Emblemáticos y Visión del Futuro Inmobiliario
                  </Text>

                  <Text style={benefitItem}>
                    <strong>Luis Méndez Trillo - Presidente de Coldwell Banker Commercial:</strong><br/>
                    Mercado inmobiliario de oficinas e industrial
                  </Text>

                  <Text style={benefitItem}>
                    <strong>Iñigo Arturo Aragón - Subsecretario de Fomento Económico y Atracción a la Inversión del Estado de Oaxaca:</strong><br/>
                    Oportunidades Inversión en el Corredor Interoceánico del Istmo de Tehuantepec
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Event Details */}
            <Section style={eventDetailsSection}>
              <Text style={eventDetailsTitle}>Detalles del Evento:</Text>
              
              <Text style={text}>
                ====================
              </Text>
              
              <Text style={eventDetailItem}>
                <strong>Fecha:</strong><br/>
                Miércoles, 10 de septiembre de 2025
              </Text>
              
              <Text style={eventDetailItem}>
                <strong>Hora:</strong><br/>
                8:30 a.m. (Recepción y Desayuno Networking)
              </Text>
              
              <Text style={eventDetailItem}>
                <strong>Sede:</strong><br/>
                Neuchatel, Av. Río San Joaquín 498, Col. Ampliación Granada, Alcaldía Miguel Hidalgo, Ciudad de México.
              </Text>
              
              <Text style={text}>
                Este es un evento con cupo estrictamente limitado para garantizar una experiencia de networking de alta calidad. Asegura tu acceso gratuito y sé parte de este encuentro que definirá el futuro de tu negocio.
              </Text>
            </Section>

            {/* Ticket Access Section */}
            <Section style={ticketSection}>
              <Text style={ticketTitle}>🎫 Acceso directo a tu boleto</Text>
              
              <Text style={text}>
                Haz clic en el botón de arriba para acceder directamente a tu boleto con código QR. No necesitas registrarte.
              </Text>
              
              <Text style={text}>
                Si el botón no funciona, copia y pega este enlace en tu navegador:
              </Text>
              
              <Text style={text}>
                <Link href={magicLinkUrl} style={link}>{magicLinkUrl}</Link>
              </Text>
            </Section>

          </Section>

          <Hr style={hr} />

          {/* Footer */}
            <Section style={footer}>
              <Text style={footerText}>
                <strong>GrowthBDM</strong><br/>
                Impulsando el crecimiento del sector inmobiliario en México
              </Text>
              
              <Text style={footerText}>
                📧 networking@growthbdm.com | 🌐 www.aliest.growthbdm.com
              </Text>
              
              <Hr style={hr} />
              
              <Text style={unsubscribeText}>
                Has recibido esta invitación porque formas parte de nuestra red de profesionales del Real Estate. Si no deseas recibir más comunicaciones, puedes darte de baja respondiendo a este email.
              </Text>
            </Section>
        </Container>
      </Body>
    </Html>
  );
};



// Styles
const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  minHeight: '100vh',
  padding: '20px 0',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
  padding: '40px 30px',
  textAlign: 'center' as const,
  borderRadius: '12px 12px 0 0',
};

const logo = {
  margin: '0 auto',
};

const content = {
  padding: '30px 30px 40px',
};

const h1 = {
  color: '#1e40af',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 20px',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#333333',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '30px 0 15px',
};

const h3 = {
  color: '#1e40af',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '20px 0 10px',
  textAlign: 'center' as const,
};

const titleSection = {
  padding: '20px 30px 10px',
  textAlign: 'center' as const,
};

const subtitleSection = {
  padding: '0 30px 10px',
  textAlign: 'center' as const,
};

const eventDetailsSection = {
  padding: '10px 30px 20px',
  textAlign: 'center' as const,
};

const inlineLogo = {
  verticalAlign: 'middle',
  margin: '0 8px',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '16px 0',
};

const customMessageSection = {
  backgroundColor: '#f8f9fa',
  borderLeft: '4px solid #0066CC',
  padding: '16px 20px',
  margin: '20px 0',
};

const customMessageText = {
  color: '#333333',
  fontSize: '16px',
  fontStyle: 'italic',
  lineHeight: '1.6',
  margin: '0',
};

const eventDetails = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
};

const detailItem = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 8px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#1e40af',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
  margin: '20px 0',
  boxShadow: '0 4px 12px rgba(30, 64, 175, 0.4)',
  border: 'none',
  cursor: 'pointer',
};

const benefitsSection = {
  margin: '30px 0',
};

const benefitItem = {
  color: '#1f2937',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '12px 0',
  paddingLeft: '8px',
  fontWeight: '400',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '30px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0 0 8px',
  textAlign: 'center' as const,
};

const link = {
  color: '#1e40af',
  textDecoration: 'underline',
  fontSize: '14px',
  wordBreak: 'break-all' as const,
  fontWeight: '500',
};

export default MipimInvitationEmail;

const eventDetailsFullSection = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
};

const ticketSection = {
  backgroundColor: '#e8f4fd',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
  textAlign: 'center' as const,
};

const ticketTitle = {
  color: '#0066CC',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 16px',
  textAlign: 'center' as const,
};

const footerBrand = {
  color: '#0066CC',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 8px',
  textAlign: 'center' as const,
};

const footerTagline = {
  color: '#666666',
  fontSize: '14px',
  fontStyle: 'italic',
  margin: '0 0 16px',
  textAlign: 'center' as const,
};

const footerContact = {
  color: '#333333',
  fontSize: '14px',
  margin: '0 0 16px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '1.5',
  margin: '0',
  textAlign: 'center' as const,
};