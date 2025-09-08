import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Heading } from '../../../components/heading';
import { Text } from '../../../components/text';

// Importaciones estáticas para los templates MIPIM - comentadas para evitar errores de build
// import MipimInvitationV1 from '../../../emails/invitations/mipim-invitation';
// import MipimInvitationV2 from '../../../emails/invitations/mipim-invitation-v2';
// import MipimInvitationV3 from '../../../emails/invitations/mipim-invitation-v3';

// Lista de templates disponibles (misma que en templates/page.tsx)
const availableTemplates = [
  'magic-links/aws-verify-email',
  'notifications/github-access-token',
  'receipts/apple-receipt',
  'receipts/nike-receipt',
  'newsletters/stack-overflow-tips',
  'magic-links/slack-confirm',
  'reset-password/twitch-reset-password',
  'magic-links/raycast-magic-link',
  'notifications/yelp-recent-login',
  'magic-links/linear-login-code',
  'newsletters/google-play-policy-update',
  'reviews/airbnb-review',
  'reset-password/dropbox-reset-password',
  'welcome/koala-welcome',
  'notifications/vercel-invite-user',
  'welcome/stripe-welcome',
  'magic-links/notion-magic-link',
  'magic-links/plaid-verify-identity',
  'invitations/mipim-invitation',
  'invitations/mipim-invitation-v2',
  'invitations/mipim-invitation-v3',
];

interface TemplatePreviewPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function TemplatePreviewPage({ params }: TemplatePreviewPageProps) {
  const { slug } = await params;
  const templatePath = slug.join('/');
  
  // Verificar si el template existe
  if (!availableTemplates.includes(templatePath)) {
    notFound();
  }
  
  const templateName = templatePath.split('/').pop();
  
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Heading className="text-white mb-4" size="6">
            Vista Previa: {templateName}
          </Heading>
          <Text className="text-slate-11">
            Esta es una vista previa del template {templatePath}
          </Text>
        </div>
        
        <div className="bg-white rounded-lg p-8 text-black">
          <Suspense fallback={<div>Cargando template...</div>}>
            <TemplateContent templatePath={templatePath} />
          </Suspense>
        </div>
        
        <div className="mt-8">
          <a 
            href="/templates" 
            className="text-blue-400 hover:text-blue-300 underline"
          >
            ← Volver a Templates
          </a>
        </div>
      </div>
    </div>
  );
}

function TemplateContent({ templatePath }: { templatePath: string }) {
  // Renderizar templates MIPIM reales en un iframe para evitar conflictos de HTML
  if (templatePath === 'invitations/mipim-invitation' || 
      templatePath === 'invitations/mipim-invitation-v2' || 
      templatePath === 'invitations/mipim-invitation-v3') {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Template: {templatePath}</h2>
        <p className="text-gray-600 mb-4">
          Vista previa del template de invitación MIPIM.
        </p>
        <div className="border rounded-lg overflow-hidden">
          <iframe 
            src={`/preview/${templatePath}`}
            className="w-full h-96 border-0"
            title={`Preview of ${templatePath}`}
          />
        </div>
        <div className="bg-blue-50 p-4 rounded">
          <p className="text-sm text-blue-700">
            💡 Este es un template real de React Email para invitaciones MIPIM.
          </p>
        </div>
      </div>
    );
  }
  
  // Para otros templates, mostrar placeholder
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Template: {templatePath}</h2>
      <p className="text-gray-600">
        Este es el contenido del template {templatePath}. 
        En una implementación completa, aquí se mostraría el email renderizado.
      </p>
      <div className="bg-gray-100 p-4 rounded">
        <p className="text-sm text-gray-500">
          Nota: Para ver los templates reales de React Email, necesitarías configurar 
          el servidor de preview completo con las dependencias correspondientes.
        </p>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return availableTemplates.map((template) => ({
    slug: template.split('/'),
  }));
}