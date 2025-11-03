// Root layout for Next.js App Router
import type { Metadata } from 'next';
import { Providers } from './providers';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'React Node Auth',
  description: 'Full-featured authentication application',
  themeColor: '#0d6efd',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
        <script 
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js" 
          integrity="sha384-HwwvtgBNo3bZJJLYd8oVXjrBZt8cqVSpeBNS5n7C8IVInixGAoxmnlMuBnhbgrkm" 
          crossOrigin="anonymous"
          async
        />
      </body>
    </html>
  );
}

