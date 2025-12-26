import './globals.css';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'Tortillería Eduardo',
  description: 'Sistema de Control Diario',
};

export default function RootLayout({ children }) {
  return (
    <html lang='es'>
      <body className={'antialiased'}>
        {children}
        <Toaster position='top-center' theme='dark' richColors />
      </body>
    </html>
  );
}
