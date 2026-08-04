import { SquarePen } from 'lucide-react';
import { UserData, UserFormModal } from '../components/profile/UserFormModal';
import { useState } from 'react';
import { profileData } from '../lib/types/profile.data';
import { en } from '../locales/en';
import GlobalNotification from '../components/layout/GlobalNotification';
import Heading from '../components/common/Heading';

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const onSubmit = (values: UserData) => {
    profileData.title = values.title ?? '';
    profileData.firstName = values.firstName ?? '';
    profileData.lastName = values.lastName ?? '';
    profileData.email = values.email ?? '';
    profileData.role = values.role ?? '';
    profileData.phone = values.mobile ?? '';
    profileData.education = values.education ?? '';
    setIsModalOpen(false);
  };
  return (
    <>
      <div className='pt-17.75 h-screen overflow-scroll'>
        <div className='px-8'>
          <GlobalNotification />
        </div>
        <div className='mt-10 mx-15'>
          <Heading>{en.profilePage.profile}</Heading>

          <div className='mt-5 relative'>
            <div className='absolute -top-4 -right-4 z-10' onClick={showModal}>
              <div className='bg-[#041B4B] p-2 rounded-lg cursor-pointer shadow-lg'>
                <SquarePen size={24} className='text-white' />
              </div>
            </div>
            <div className='bg-white border border-[#F2F4F7] rounded-[12px] p-8 shadow-sm'>
              <h2 className='text-[#000000] text-[16px] font-bold leading-[19px] mb-8'>
                {en.profilePage.personalInfo}
              </h2>

              <div className='grid grid-cols-2 gap-x-20 gap-y-8'>
                <div className='border-b border-[#F2F4F7] pb-2'>
                  <label className='block text-[#929292] text-[14px] font-normal leading-[17px] mb-1'>
                    {profileData.title + ' ' + profileData.firstName}
                  </label>
                  <div className='text-[#101010] text-[14px] font-normal'></div>
                </div>
                <div className='border-b border-[#F2F4F7] pb-2'>
                  <label className='block text-[#929292] text-[14px] font-normal leading-[17px] mb-1'>
                    {profileData.lastName}
                  </label>
                </div>

                <div className='border-b border-[#F2F4F7] pb-2'>
                  <label className='block text-[#929292] text-[14px] font-normal leading-[17px] mb-1'>
                    {profileData.personalEmail}
                  </label>
                </div>
                <div className='border-b border-[#F2F4F7] pb-2'>
                  <label className='block text-[#929292] text-[14px] font-normal leading-[17px] mb-1'>
                    {profileData.phone}
                  </label>
                </div>

                <div className='border-b border-[#F2F4F7] pb-2'>
                  <label className='block text-[#929292] text-[14px] font-normal leading-[17px] mb-1'>
                    {profileData.university}
                  </label>
                </div>
                <div className='border-b border-[#F2F4F7] pb-2'>
                  <label className='block text-[#929292] text-[14px] font-normal leading-[17px] mb-1'>
                    {profileData.education}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <UserFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={{
          title: profileData.title,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          email: profileData.email,
          role: profileData.role,
          mobile: profileData.phone,
          education: profileData.education,
        }}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default Profile;
