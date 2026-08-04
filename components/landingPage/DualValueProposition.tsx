'use client';

import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { en } from '@/lib/locales/en';
import { useRouter } from 'next/navigation';
import ContactModal from './ContactModal';

const DualValueProposition = () => {
  const router = useRouter();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  return (
    <section className='py-24 bg-white '>
      <div className='container mx-auto px-6'>
        {/* Header */}
        <div className='text-center mb-20'>
          <h2
            className='text-4xl md:text-5xl lg:text-5xl mb-4 '
            style={{
              fontFamily: '"Inter","Plus Jakarta Sans",sans-serif',
              fontWeight: 700,
              letterSpacing: '-0.030em',
              lineHeight: '1.1',
              color: '#1e293b',
              margin: '0 0 1rem 0',
            }}
          >
            {en.landingPage.dualValue.heading}
          </h2>
          <p className='text-[#64748b] text-[17px] max-w-2xl mx-auto '>
            {en.landingPage.dualValue.subheading}
          </p>
        </div>

        {/* Two Column Grid */}
        <div className='grid lg:grid-cols-2 gap-12 max-w-[1200px] mx-auto '>
          {/* For Researchers - White Card */}
          <div className='bg-white rounded-[30px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-10 lg:p-12 flex flex-col transition-all duration-300'>
            <h3 className='text-[32px] font-extrabold text-[#3B82F6] mb-4'>
              {en.landingPage.dualValue.researcher.title}
            </h3>
            <p className='text-[#64748b] text-[16px] leading-relaxed mb-10'>
              {en.landingPage.dualValue.researcher.description}
            </p>

            <ul className='space-y-5 mb-12 flex-1'>
              {en.landingPage.dualValue.researcher.benefits.map(
                (benefit, index) => (
                  <li key={index} className='flex items-center gap-4'>
                    <div className='w-6 h-6 rounded-full bg-[#EEF2FF] flex items-center justify-center shrink-0'>
                      <Check className='w-3.5 h-3.5 text-[#3B82F6] stroke-[3px]' />
                    </div>
                    <span className='text-[#475569] text-[16px] font-medium'>
                      {benefit}
                    </span>
                  </li>
                )
              )}
            </ul>

            <button
              onClick={() => {
                router.push('/resources', { scroll: true });
              }}
              className='h-10 px-4 py-2 w-fit bg-[#3B82F6] hover:bg-[#2563EB] rounded-2xl text-[15px] font-semibold group transition-all border-none cursor-pointer'
            >
              <div className='flex items-center'>
                <span className='text-white'>
                  {en.landingPage.dualValue.researcher.button}
                </span>
                <ArrowRight className='ml-2 w-4 h-4 text-white transition-transform group-hover:translate-x-1' />
              </div>
            </button>
          </div>

          {/* For Labs - Blue Card */}
          <motion.div
            whileHover={{
              y: 0,
              boxShadow: '0 30px 60px -12px rgba(59,130,246,0.35)',
            }}
            className='bg-[#3B82F6] rounded-[40px] shadow-[0_25px_60px_rgba(59,130,246,0.3)] p-10 lg:p-12 flex flex-col transition-all duration-300'
          >
            <h3 className='text-[32px] font-bold text-white mb-4'>
              {en.landingPage.dualValue.lab.title}
            </h3>
            <p className='text-blue-50 text-[16px] leading-relaxed mb-10'>
              {en.landingPage.dualValue.lab.description}
            </p>

            <ul className='space-y-5 mb-12 flex-1'>
              {en.landingPage.dualValue.lab.benefits.map((benefit, index) => (
                <li key={index} className='flex items-center gap-4'>
                  <div className='w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0'>
                    <Check className='w-3.5 h-3.5 text-white stroke-[3px]' />
                  </div>
                  <span className='text-white text-[16px] font-medium'>
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>

            <button className='h-10 px-4 py-2 rounded-xl font-semibold group w-fit text-[15px] transition-all border-none'></button>
            <button
              onClick={() => setIsContactModalOpen(true)}
              className='h-10 px-4 py-2 w-fit bg-white text-primary hover:bg-white/90 rounded-2xl text-[15px] font-semibold group transition-all border-none cursor-pointer'
            >
              <div className='flex items-center'>
                <span className='text-[#3B82F6]'>
                  {en.landingPage.dualValue.lab.button}
                </span>

                <ArrowRight className='ml-2 w-4 h-4 text-[#3B82F6] transition-transform group-hover:translate-x-1' />
              </div>
            </button>
          </motion.div>
        </div>
      </div>
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </section>
  );
};

export default DualValueProposition;
