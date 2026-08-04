import { ProductImage } from '../common/productImage';
import { EditIcon, SquarePen } from 'lucide-react';
import { Button, Upload, type UploadProps } from 'antd';
import { CompanyCreateResponse } from '@/types';
import BecomeCompanyModal from '../layout/BecomeCompanyModal';
import { useState } from 'react';

type UploadTarget = 'logo' | 'cover';

const uploadProps: UploadProps = {
  accept: 'image/*',
  showUploadList: false,
};

const cdnUrl: string = process.env.NEXT_PUBLIC_CF_URL ?? '';

interface CompanyTabProps {
  companyData: CompanyCreateResponse;
  handleImageUpload: (target: UploadTarget) => UploadProps['customRequest'];
}

function CompanyTab({ companyData, handleImageUpload }: CompanyTabProps) {
  const [companyModalOpen, setCompanyModalOpen] = useState<boolean>(false);

  return (
    <div className='relative mb-10'>
      <div className='relative'>
        <div className='h-[180px] w-full rounded-xl overflow-hidden bg-gray-200'>
          <ProductImage
            src={cdnUrl + companyData?.coverImage}
            alt='cover image'
            classNames=''
          />
        </div>
        <Upload customRequest={handleImageUpload('cover')} {...uploadProps}>
          <div className='absolute -top-2.5 right-0 bg-white p-2 rounded-full cursor-pointer z-20 shadow-sm'>
            <SquarePen size={20} className='text-[#1652C9]' />
          </div>
        </Upload>
      </div>
      <div className='flex justify-between gap-4 pt-4'>
        <div className='flex justify-between gap-4 flex-wrap'>
          <div className='relative'>
            <ProductImage
              src={cdnUrl + companyData?.companyLogo}
              alt='cover image'
              classNames='w-[96px] h-[96px] rounded-full'
            />
            <Upload customRequest={handleImageUpload('logo')} {...uploadProps}>
              <div className='absolute -top-2.5 right-0 bg-white p-2 rounded-full cursor-pointer z-20 shadow-sm'>
                <SquarePen size={20} className='text-[#1652C9]' />
              </div>
            </Upload>
          </div>
          <div>
            <h2 className='text-xl font-semibold'>{companyData?.name ?? ''}</h2>
            <p className='text-gray-500 text-sm'>
              {companyData?.address ?? ''}
            </p>
          </div>
        </div>
        <Button
          onClick={() => setCompanyModalOpen(true)}
          variant='text'
          color='default'
        >
          <EditIcon size={24} />
        </Button>
      </div>
      <BecomeCompanyModal
        open={companyModalOpen}
        onClose={() => setCompanyModalOpen(false)}
        companyData={companyData}
      />
    </div>
  );
}

export default CompanyTab;
