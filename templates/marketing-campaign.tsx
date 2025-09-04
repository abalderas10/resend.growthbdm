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

interface MarketingCampaignEmailProps {
  firstName?: string;
  companyName?: string;
  campaignTitle?: string;
  campaignDescription?: string;
  ctaText?: string;
  ctaUrl?: string;
  unsubscribeUrl?: string;
  logoUrl?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';

export const MarketingCampaignEmail = ({
  firstName = 'Estimado cliente',
  companyName = 'Tu Empresa',
  campaignTitle = 'Oferta Especial',
  campaignDescription = 'No te pierdas esta increíble oportunidad.',
  ctaText = 'Ver Oferta',
  ctaUrl = '#',
  unsubscribeUrl = '#',
  logoUrl = `${baseUrl}/logo.png`,
}: MarketingCampaignEmailProps) => (
  <Html>
    <Head />
    <Preview>{campaignTitle} - {companyName}</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header con logo */}
        <Section style={header}>
          <Img
            src={logoUrl}
            width="150"
            height="50"
            alt={companyName}
            style={logo}
          />
        </Section>

        {/* Contenido principal */}
        <Section style={content}>
          <Heading style={h1}>¡Hola {firstName}!</Heading>
          
          <Text style={text}>
            Esperamos que estés teniendo un excelente día. Nos complace presentarte nuestra nueva campaña:
          </Text>

          <Heading as="h2" style={h2}>{campaignTitle}</Heading>
          
          <Text style={text}>
            {campaignDescription}
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={ctaUrl}>
              {ctaText}
            </Button>
          </Section>

          <Text style={text}>
            Esta oferta es válida por tiempo limitado. ¡No dejes pasar esta oportunidad!
          </Text>

          <Hr style={hr} />

          <Text style={text}>
            Si tienes alguna pregunta, no dudes en contactarnos respondiendo a este email.
          </Text>

          <Text style={signature}>
            Saludos cordiales,<br />
            El equipo de {companyName}
          </Text>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            Recibiste este email porque estás suscrito a nuestras comunicaciones.
          </Text>
          <Link href={unsubscribeUrl} style={unsubscribeLink}>
            Cancelar suscripción
          </Link>
          <Text style={footerText}>
            © 2024 {companyName}. Todos los derechos reservados.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default MarketingCampaignEmail;

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

const header = {
  padding: '20px 30px',
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #e6ebf1',
};

const logo = {
  margin: '0 auto',
  display: 'block',
};

const content = {
  padding: '30px 30px 40px 30px',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 20px',
  lineHeight: '1.3',
};

const h2 = {
  color: '#1a1a1a',
  fontSize: '22px',
  fontWeight: 'bold',
  margin: '30px 0 15px',
  lineHeight: '1.3',
};

const text = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 20px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#007ee6',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 30px',
  border: 'none',
  cursor: 'pointer',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '30px 0',
};

const signature = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '30px 0 0',
  fontStyle: 'italic',
};

const footer = {
  padding: '20px 30px',
  backgroundColor: '#f8f9fa',
  borderTop: '1px solid #e6ebf1',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '1.5',
  margin: '0 0 10px',
};

const unsubscribeLink = {
  color: '#007ee6',
  fontSize: '12px',
  textDecoration: 'underline',
  margin: '0 0 10px',
  display: 'block',
};