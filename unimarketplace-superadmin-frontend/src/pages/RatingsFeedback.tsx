import React from 'react';
import GlobalNotification from '../components/layout/GlobalNotification';
import Heading from '../components/common/Heading';
import { en } from '../locales/en';
import RatingsFeedbackTable from '../components/ratings/RatingsFeedbackTable';

const RatingsFeedback: React.FC = () => {
  return (
    <>
      <div className='pt-17.75  h-screen overflow-scroll'>
        <div className='px-8'>
          <GlobalNotification />
        </div>
        <div className='mt-10 mx-15'>
          <div className='flex justify-between items-center'>
            <Heading>{en.ratingsFeedback}</Heading>
          </div>
          <div className='my-6'>
            <RatingsFeedbackTable />
          </div>
        </div>
      </div>
    </>
  );
};

export default RatingsFeedback;
