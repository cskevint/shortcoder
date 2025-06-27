import type { Metadata } from "next";
import "./globals.css";
import Providers from '@/components/Providers';
import { Container } from '@mui/material';
import '@mui/icons-material';

export const metadata: Metadata = {
  title: "Content Manager",
  description: "A simple content management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Container maxWidth="lg" sx={{ py: 4 }}>
            {children}
          </Container>
        </Providers>
      </body>
    </html>
  );
}
