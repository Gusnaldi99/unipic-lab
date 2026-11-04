import type { Metadata } from 'next';
import './globals.css';
import './agency.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'Unipic Lab · Agency Dashboard',
  description: 'Unipic Lab Marketing Agency Content Management Dashboard built with Next.js & TypeScript',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

