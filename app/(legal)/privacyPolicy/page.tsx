import React from 'react';
import PrivacyPolicyPage from '@/components/landingPage/Privacypolicy';
import Navbar from '@/components/landingPage/Navbar';

const page = () => {
  return (
    <div className='font-Inter, Plus Jakarta Sans, system-ui, sans-serif'>
      <Navbar />
      <PrivacyPolicyPage />
    </div>
  );
};

export default page;
