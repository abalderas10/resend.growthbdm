import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Heading } from '../../../components/heading';
import { Text } from '../../../components/text';

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
  // Por ahora mostramos información del template
  // En una implementación completa, aquí cargaríamos y renderizaríamos el template real
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