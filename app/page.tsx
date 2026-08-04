import Navbar from '@/components/landingPage/Navbar';
import HeroSection from '@/components/landingPage/HeroSection';
import HowItWorks from '@/components/landingPage/HowItWorks';
import DualValueProposition from '@/components/landingPage/DualValueProposition';
import Footer from '@/components/landingPage/Footer';

const page = () => {
  return (
    <div className='font-Inter, Plus Jakarta Sans, system-ui, sans-serif'>
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <DualValueProposition />
      <Footer />
    </div>
  );
};

export default page;
