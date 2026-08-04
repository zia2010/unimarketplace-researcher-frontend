'use client';

import { useState } from 'react';
import { Tabs, Card, type UploadProps, App } from 'antd';
import ManageMembersTable from './ManageMembersTable';
import { CompanyFormData } from '@/types';
import { useAuth } from '@/lib/auth/context/AuthContext';
import { uploadsApi } from '@/lib/services/api/uploads.api';
import { uploadToPresignedUrl } from '@/lib/services/api/axios.config';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { companyApi } from '@/lib/services/api/company.api';
import CompanyTab from './CompanyTab';
import AddUserModal from './AddUserModal';
import PaymentHistory from './PaymentHistory';

type UploadTarget = 'logo' | 'cover';

export default function SettingsContainer() {
  const { user } = useAuth();
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: companyData } = useQuery({
    queryKey: ['company_details', user?.companyId],
    queryFn: async () => await companyApi.getCompany(user?.companyId ?? ''),
    enabled: !!user?.companyId,
  });

  const updateMutation = useMutation({
    mutationFn: async (values: Partial<CompanyFormData & { id?: string }>) => {
      if (!values.id) {
        throw new Error('Company id not found please try again');
      }
      return companyApi.updateCompany(values, values.id);
    },
    onSuccess: () => {
      message.success('Company updated successfully');
    },
    onError: () => {
      message.error('Failed to update profile');
    },
  });

  const handleImageUpload =
    (target: UploadTarget): UploadProps['customRequest'] =>
    async (options) => {
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

        if (!user?.companyId) {
          message.error('Failed to update univeristy');
          return false;
        } else {
          updateMutation.mutate({
            ...(target === 'logo' ? { companyLogo: key } : { coverImage: key }),
            id: user?.companyId,
          });
        }
        message.success(
          `${target === 'logo' ? 'Logo' : 'Cover image'} uploaded successfully`
        );
        queryClient.invalidateQueries({ queryKey: ['company_details'] });
      } catch (err) {
        console.error(err);
        message.error('Image upload failed');
        onError?.(err as Error);
      }
    };

  return (
    <div className='mx-auto md:px-4 px-1 md:py-8 py-1'>
      <h1 className='text-2xl font-bold mb-6'>Settings</h1>

      <Card className='rounded-2xl px-1 md:px-2'>
        <style>
          {`
            .ant-card-body { padding: 12px 8px !important; }
            @media (min-width: 768px) {
              .ant-card-body { padding: 12px 24px !important; }
            }
        `}
        </style>
        <Tabs
          defaultActiveKey='company'
          centered
          items={[
            ...(user?.companyId && companyData
              ? [
                  {
                    key: 'company',
                    label: 'Company',
                    children: (
                      <>
                        <CompanyTab
                          companyData={companyData}
                          handleImageUpload={handleImageUpload}
                        />

                        {companyData.users && companyData.users.length && (
                          <div className='mt-16'>
                            <div className='flex flex-wrap gap-6'>
                              <ManageMembersTable
                                data={companyData.users}
                                onAddMember={() => setIsModalOpen(true)}
                                onClose={() => setIsModalOpen(false)}
                              />
                            </div>
                          </div>
                        )}
                      </>
                    ),
                  },
                ]
              : []),
            {
              key: 'payment',
              label: 'Payment History',
              children: <PaymentHistory />,
            },
          ]}
        />
      </Card>

      <AddUserModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        companyId={companyData?.id}
      />
    </div>
  );
}
