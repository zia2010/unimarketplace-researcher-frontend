'use client';

import React, { useState } from 'react';
import { Pencil, SquarePen } from 'lucide-react';
import { en } from '@/lib/locales/en';
import { useEndorsements } from '@/lib/hooks/useEndorsements';
import { Upload, type UploadProps, App, Form } from 'antd';
import { uploadToPresignedUrl } from '@/lib/services/api/axios.config';
import { uploadsApi } from '@/lib/services/api/uploads.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/lib/services/api/user.api';
import { EditUserFormValues, User } from '@/types';
import { ProductImage } from '../common/productImage';
import ProfileModal from './profile-modal';
import { authApi } from '@/lib/services/api/auth.api';
import ComingSoon from '../common/ComingSoon';

const cdnUrl: string = process.env.NEXT_PUBLIC_CF_URL ?? '';

const uploadProps: UploadProps = {
  accept: 'image/*',
  showUploadList: false,
};

const isEndorsementsReady = false;

const Profile = () => {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [form] = Form.useForm<EditUserFormValues>();
  const [activeTab, setActiveTab] = useState<'Received' | 'Given'>('Received');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: user,
    isError: userError,
    isLoading,
  } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => await authApi.getProfile(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { endorsements, isLoading: endorsementsLoading } = useEndorsements({
    activeTab,
    userId: user?.id,
  });

  const monogram = user?.firstName?.charAt(0).toUpperCase() || '?';

  const updateMutation = useMutation({
    mutationFn: async (values: Partial<User & { id?: string }>) => {
      if (!values.id) {
        throw new Error('Company id not found please try again');
      }
      return userApi.updateUser(values, values.id);
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['user', 'profile'] });

      const previousUserData = queryClient.getQueryData<User>([
        'user',
        'profile',
      ]);

      if (previousUserData) {
        queryClient.setQueryData(
          ['user', 'profile'],
          (old: User | undefined) => {
            if (!old) return old;
            return {
              ...old,
              ...newData,
              id: old.id,
            };
          }
        );
      }

      return { previousUserData };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user-profile'], data);
      message.success('Company updated successfully');
    },
    onError: () => {
      message.error('Failed to update profile');
    },
  });

  const handleImageUpload =
    (): UploadProps['customRequest'] => async (options) => {
      const { file, onSuccess, onError, onProgress } = options;

      try {
        const actualFile = file as File;

        const { uploadUrl, key } = await uploadsApi.getPresignedUrl({
          fileName: actualFile.name,
          contentType: actualFile.type,
          folder: 'misc',
        });

        await uploadToPresignedUrl(uploadUrl, actualFile, (percent) => {
          onProgress?.({ percent });
        });

        onSuccess?.({ url: key });

        if (!user?.id) {
          message.error('Failed to update profile picture');
          return false;
        } else {
          updateMutation.mutate({
            ...{ profilePicture: key },
            id: user?.id,
          });
        }
        message.success(`Profile picture uploaded successfully`);
      } catch (err) {
        console.error(err);
        message.error(
          'Image upload failed, Please hit CTRL+SHIFT+R and retry again.'
        );
        onError?.(err as Error);
      }
    };

  console.log('Current user from cache:', user);

  const handleEditClick = () => {
    if (!user) return;

    // Set form initial values
    form.setFieldsValue({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      title: user.title || '',
      education: user.education || '',
    });

    setIsEditModalVisible(true);
  };

  // Handle form submission
  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);

      const updateData: Partial<User> = {
        firstName: values.firstName.trim(),
        lastName: values.lastName?.trim() || '',
        phone: values.phone?.trim() || null,
        title: values.title?.trim() || '',
        education: values.education?.trim() || '',
        id: user?.id,
      };

      Object.keys(updateData).forEach((key) => {
        if (
          updateData[key as keyof typeof updateData] === '' ||
          updateData[key as keyof typeof updateData] === null
        ) {
          delete updateData[key as keyof typeof updateData];
        }
      });

      updateMutation.mutate(updateData, {
        onSettled: () => {
          setIsEditModalVisible(false);
          setIsSubmitting(false);

          setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
          }, 2000);
        },
      });
    } catch (error) {
      console.error('Form validation failed:', error);
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log(userError, 'this is user error');
  if (userError) {
    return;
  }

  return (
    <div className='min-h-screen bg-white font-sans'>
      <div className='pb-24 overflow-y-auto'>
        <div className='max-w-[1664px] mx-auto px-1 md:px-16 lg:px-40'>
          <div className='flex w-full justify-between items-center py-6 flex-wrap'>
            <p className='text-[30px] font-bold text-[#001D4D] tracking-tight min-w-[200px]'>
              {en.profile.title}
            </p>
          </div>

          {/* Profile Identity Row */}
          <div className='flex flex-wrap items-center justify-between gap-12 '>
            <div className='flex items-center gap-10 flex-wrap'>
              <div className='relative'>
                <div className='flex h-[180px] w-[180px] items-center justify-center rounded-full bg-gray-200 text-[64px] font-bold text-[#041B4B] border-4 border-white shadow-md overflow-hidden'>
                  {user?.profilePicture ? (
                    <ProductImage
                      src={cdnUrl + user?.profilePicture}
                      alt='cover image'
                      classNames=''
                    />
                  ) : isLoading ? (
                    '...'
                  ) : (
                    monogram
                  )}
                </div>
                <Upload customRequest={handleImageUpload()} {...uploadProps}>
                  <button className='absolute bottom-2 right-2 p-2.5 bg-white rounded-lg shadow-lg border border-gray-100 hover:scale-105 transition-transform'>
                    <Pencil
                      size={18}
                      className='text-[#001D4D] cursor-pointer'
                    />
                  </button>
                </Upload>
              </div>

              <div>
                <span className='text-[32px] font-bold text-[#101010]'>
                  {isLoading
                    ? '...'
                    : (user?.firstName ?? '') + ' ' + (user?.lastName ?? '')}
                </span>
                <div className='flex flex-col text-[16px] text-[#101010] font-medium'>
                  <span>{user?.email}</span>
                  <span>{user?.phone}</span>
                </div>
              </div>
            </div>

            {/* Edit Profile Button */}
            <button
              onClick={handleEditClick}
              className='flex items-center justify-center w-12 h-12 bg-[#001D4D] rounded-full text-white shadow-xl hover:bg-blue-600 transition-all hover:scale-105'
            >
              <SquarePen size={22} strokeWidth={1.5} className='text-white p' />
            </button>
          </div>

          {/* Endorsements Card */}
          <div className='group mt-10 bg-white rounded-3xl border border-[#F2F4FE] shadow-[0px_8px_30px_rgba(0,0,0,0.04)] p-8 md:p-10 relative transition-all duration-300 hover:border-blue-400 hover:shadow-[0px_8px_30px_rgba(59,130,246,0.1)]'>
            <p className='text-[24px] font-bold text-[#101010] mb-8'>
              {en.profile.endorsements}
            </p>

            {isEndorsementsReady ? (
              <>
                {/* Tabs */}
                <div className='flex gap-12 border-b border-[#F2F4FE] mb-10'>
                  {(['Received', 'Given'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-4 text-[18px] font-semibold transition-all ${
                        activeTab === tab
                          ? 'text-[#3B82F6] border-b-2 border-[#3B82F6]'
                          : 'text-[#98A2B3]'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Endorsements List */}
                <div className='space-y-10'>
                  {endorsementsLoading ? (
                    <p className='text-[#98A2B3] text-[16px]'>Loading...</p>
                  ) : endorsements.length === 0 ? (
                    <p className='text-[#98A2B3] text-[16px] text-center'>
                      No endorsements {activeTab.toLowerCase()}.
                    </p>
                  ) : (
                    endorsements.map((item) => {
                      // Partner is whoever is NOT the profile owner
                      const isReceived = activeTab === 'Received';
                      const partner = isReceived ? item.giver : item.receiver;
                      const partnerName = partner
                        ? `${partner.firstName} ${partner.lastName}`.trim()
                        : 'Unknown User';

                      return (
                        <React.Fragment key={item.id}>
                          <EndorsementItem
                            name={partnerName}
                            role={
                              partner?.title ||
                              (isReceived ? 'Giver' : 'Recipient')
                            }
                            text={item.text}
                            type={isReceived ? 'Received' : 'Given'}
                          />
                          <div className='border-t border-[#F2F4FE]' />
                        </React.Fragment>
                      );
                    })
                  )}
                </div>
              </>
            ) : (
              <ComingSoon size='small' />
            )}

            {/* 
            view more button for endorsements 

            <div className='flex justify-end mt-10'>
              <button className='text-[14px] font-medium text-[#667085] hover:text-[#3B82F6] transition'>
                View More
              </button>
            </div> 
            */}
          </div>
        </div>
      </div>
      <ProfileModal
        form={form}
        isSubmitting={isSubmitting}
        isEditModalVisible={isEditModalVisible}
        setIsEditModalVisible={setIsEditModalVisible}
        handleFormSubmit={handleFormSubmit}
        email={user?.email ?? ''}
      />
    </div>
  );
};

const EndorsementItem = ({
  name,
  role,
  text,
  type,
}: {
  name: string;
  role: string;
  text: string;
  type: 'Received' | 'Given';
}) => (
  <div className='flex gap-6 items-start'>
    <div className='relative'>
      <div className='w-16 h-16 rounded-full bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center text-xl font-bold text-[#041B4B] shadow-sm'>
        {name.charAt(0)}
      </div>
      <span
        className={`absolute -bottom-1 -right-1 text-[10px] px-1.5 py-0.5 rounded-md font-bold text-white shadow-sm ${
          type === 'Received' ? 'bg-green-500' : 'bg-blue-500'
        }`}
      >
        {type.charAt(0)}
      </span>
    </div>
    <div className='flex flex-col'>
      <h4 className='text-[18px] font-bold text-[#101010]'>{name}</h4>
      <p className='text-[14px] font-medium text-[#475467] mb-3'>{role}</p>
      <p className='text-[14px] leading-relaxed text-[#475467] max-w-[1100px]'>
        {text}
      </p>
    </div>
  </div>
);

export default Profile;
