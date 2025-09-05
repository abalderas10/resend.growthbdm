import { notFound } from 'next/navigation';

// Importaciones estáticas para los templates MIPIM (versiones preview)
import MipimInvitationV2Preview from '../../../emails/invitations/mipim-invitation-v2-preview';

// Lista de templates disponibles
const availableTemplates = [
  'invitations/mipim-invitation',
  'invitations/mipim-invitation-v2',
  'invitations/mipim-invitation-v3',
];

interface PreviewPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { slug } = await params;
  const templatePath = slug.join('/');
  
  // Verificar si el template existe
  if (!availableTemplates.includes(templatePath)) {
    notFound();
  }
  
  // Renderizar el template correspondiente
  if (templatePath === 'invitations/mipim-invitation' || 
      templatePath === 'invitations/mipim-invitation-v2' || 
      templatePath === 'invitations/mipim-invitation-v3') {
    return (
      <div style={{ backgroundColor: '#f6f9fc', minHeight: '100vh', padding: '20px' }}>
        <MipimInvitationV2Preview />
      </div>
    );
  }
  
  return notFound();
}

export function generateStaticParams() {
  return availableTemplates.map((template) => ({
    slug: template.split('/'),
  }));
}