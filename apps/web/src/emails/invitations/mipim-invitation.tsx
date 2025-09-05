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
  recipientName = 'Estimado/a',
  magicLinkUrl = '#',
  eventDate = 'Próximamente',
  eventLocation = 'Por confirmar',
  customMessage = ''
}: MipimInvitationEmailProps) => {
  const previewText = `Invitación exclusiva MIPIM 2024 - ${eventDate}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src="https://via.placeholder.com/200x60/0066CC/FFFFFF?text=MIPIM+2024"
              width="200"
              height="60"
              alt="MIPIM 2024"
              style={logo}
            />
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>Invitación Exclusiva MIPIM 2024</Heading>
            
            <Text style={text}>
              Hola {recipientName},
            </Text>

            <Text style={text}>
              Nos complace invitarte al evento más importante del sector inmobiliario internacional.
              MIPIM reúne a los profesionales más influyentes del mercado inmobiliario mundial.
            </Text>

            {customMessage && (
              <Section style={customMessageSection}>
                <Text style={customMessageText}>
                  {customMessage}
                </Text>
              </Section>
            )}

            {/* Event Details */}
            <Section style={eventDetails}>
              <Heading style={h2}>Detalles del Evento</Heading>
              
              <Text style={detailItem}>
                <strong>📅 Fecha:</strong> {eventDate}
              </Text>
              
              <Text style={detailItem}>
                <strong>📍 Ubicación:</strong> {eventLocation}
              </Text>
              
              <Text style={detailItem}>
                <strong>🎯 Sector:</strong> Real Estate & Investment
              </Text>
            </Section>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={magicLinkUrl}>
                Confirmar Asistencia
              </Button>
            </Section>

            <Text style={text}>
              Este enlace es personal e intransferible. Te permitirá acceder directamente
              a tu registro sin necesidad de introducir datos adicionales.
            </Text>

            {/* Benefits Section */}
            <Section style={benefitsSection}>
              <Heading style={h2}>¿Por qué asistir a MIPIM?</Heading>
              
              <Text style={benefitItem}>
                ✓ <strong>Networking exclusivo</strong> con más de 26,000 profesionales
              </Text>
              
              <Text style={benefitItem}>
                ✓ <strong>Conferencias magistrales</strong> con líderes de la industria
              </Text>
              
              <Text style={benefitItem}>
                ✓ <strong>Exhibición de proyectos</strong> inmobiliarios innovadores
              </Text>
              
              <Text style={benefitItem}>
                ✓ <strong>Oportunidades de inversión</strong> en mercados emergentes
              </Text>
            </Section>

            <Hr style={hr} />

            {/* Footer */}
            <Text style={footer}>
              Si tienes alguna pregunta, no dudes en contactarnos.
              <br />
              <Link href="mailto:info@mipim.com" style={link}>
                info@mipim.com
              </Link>
              {' | '}
              <Link href="https://www.mipim.com" style={link}>
                www.mipim.com
              </Link>
            </Text>

            <Text style={footer}>
              © 2024 MIPIM. Todos los derechos reservados.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};



// Styles
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

const header = {
  padding: '20px 30px',
  backgroundColor: '#0066CC',
  textAlign: 'center' as const,
};

const logo = {
  margin: '0 auto',
};

const content = {
  padding: '30px 30px 40px',
};

const h1 = {
  color: '#0066CC',
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

const text = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px',
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
  backgroundColor: '#0066CC',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 28px',
  border: 'none',
};

const benefitsSection = {
  margin: '30px 0',
};

const benefitItem = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 12px',
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
  color: '#0066CC',
  textDecoration: 'underline',
};

export default MipimInvitationEmail;