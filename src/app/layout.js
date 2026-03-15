import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';

export const metadata = {
    title: 'CHHAAPAYA — Premium Indian Handcrafted Clothing',
    description: 'Shop authentic Indian handcrafted sarees, kurtas, sherwanis and more. Premium quality ethnic wear delivered across India.',
    keywords: 'sarees, kurtas, indian clothing, handcrafted, ethnic wear, banarasi silk, chhaapaya',
    openGraph: {
        title: 'CHHAAPAYA — Premium Indian Handcrafted Clothing',
        description: 'Shop authentic Indian handcrafted sarees, kurtas, sherwanis and more.',
        url: 'https://chhaapaya.com',
        siteName: 'CHHAAPAYA',
        images: [
            {
                url: 'https://chhaapaya.com/chhaapaya-logo-circle.svg',
                width: 800,
                height: 600,
            }
        ],
        locale: 'en_IN',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'CHHAAPAYA — Premium Indian Handcrafted Clothing',
        description: 'Shop authentic Indian handcrafted sarees, kurtas, sherwanis and more.',
        images: ['https://chhaapaya.com/chhaapaya-logo-circle.svg'],
    },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@400;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingActions />
        </AuthProvider>
      </body>
    </html>
  );
}
