'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function TicketLayoutContent({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const cleanView = searchParams.get('clean') === 'true';

  // Si es vista limpia, no usar el layout principal
  if (cleanView) {
    return (
      <html lang="es">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>MIPIM 2026 México - Boleto Digital</title>
        </head>
        <body className="antialiased">
          {children}
        </body>
      </html>
    );
  }

  // Vista normal con layout completo
  return <>{children}</>;
}

export default function TicketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <TicketLayoutContent>{children}</TicketLayoutContent>
    </Suspense>
  );
}