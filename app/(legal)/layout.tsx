import Navbar from '@/components/landingPage/Navbar';
import Footer from '@/components/landingPage/Footer';

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <main className='flex-1 pt-16 md:pt-20'>{children}</main>
      <Footer />
    </div>
  );
}
