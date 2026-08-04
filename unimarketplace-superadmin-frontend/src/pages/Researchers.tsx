import React from 'react';
import GlobalNotification from '../components/layout/GlobalNotification';
import Heading from '../components/common/Heading';
import { en } from '../locales/en';
import ResearchersTable from '../components/researchers/ResearchersTable';

const Researchers: React.FC = () => {
  return (
    <>
      <div className='pt-17.75  h-screen overflow-scroll'>
        <div className='px-8'>
          <GlobalNotification />
        </div>
        <div className='mt-10 mx-15'>
          <div className='flex justify-between items-center'>
            <Heading>{en.researchers}</Heading>
          </div>
          <div className='my-6'>
            <ResearchersTable />
          </div>
        </div>
      </div>
    </>
  );
};

export default Researchers;
