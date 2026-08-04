import TopNavbar from '@/components/layout/TopNavbar';
import Script from 'next/script';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-white'>
      <TopNavbar />
      <main className='pt-26 md:pt-40 px-3 md:px-8 max-w-[1664px] mx-auto w-full'>
        {children}
      </main>

      <Script
        id='razorpay-checkout-js'
        src='https://checkout.razorpay.com/v1/checkout.js'
        strategy='beforeInteractive'
      />
    </div>
  );
}
