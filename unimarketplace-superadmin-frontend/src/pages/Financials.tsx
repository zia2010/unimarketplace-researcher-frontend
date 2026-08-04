import React from 'react';
import GlobalNotification from '../components/layout/GlobalNotification';
import Heading from '../components/common/Heading';
import { en } from '../locales/en';
import { Sparkles, Rocket } from 'lucide-react';

const ComingSoon = () => {
  return (
    <div className='flex flex-col items-center justify-center bg-white text-center py-20'>
      {/* Icon */}
      <div className='relative mb-6'>
        <Sparkles className='w-14 h-14 text-[#1B56CC] animate-pulse' />
        <Rocket className='w-6 h-6 text-[#4E7AF7] absolute -top-4 -right-4 animate-bounce' />
      </div>

      {/* Text */}
      <h1 className='text-3xl font-semibold text-[#041B4B] mb-2'>
        Coming Soon
      </h1>

      <p className='text-sm text-gray-500 max-w-xs'>
        We’re working on something awesome. Stay tuned!
      </p>

      {/* Animated dots */}
      <div className='flex gap-1 mt-4'>
        <span className='w-2 h-2 bg-[#4E7AF7] rounded-full animate-bounce [animation-delay:0ms]' />
        <span className='w-2 h-2 bg-[#4E7AF7] rounded-full animate-bounce [animation-delay:150ms]' />
        <span className='w-2 h-2 bg-[#4E7AF7] rounded-full animate-bounce [animation-delay:300ms]' />
      </div>
    </div>
  );
};

const Financials: React.FC = () => {
  return (
    <>
      <div className='pt-17.75  h-screen overflow-scroll'>
        <div className='px-8'>
          <GlobalNotification />
        </div>
        <div className='mt-10 mx-15'>
          <div className='flex justify-between items-center'>
            <Heading>{en.financials}</Heading>
          </div>
          <div className='mt-9'>
            <ComingSoon />
          </div>
        </div>
      </div>
    </>
  );
};

export default Financials;
