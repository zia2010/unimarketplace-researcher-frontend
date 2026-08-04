'use client';

import { Button, Empty, Pagination } from 'antd';
import { Heart, Inbox } from 'lucide-react';
import { CreateFavouritePayload, ResourcesData } from '@/types';
import { en } from '@/lib/locales/en';
import { ProductImage } from '../common/productImage';
import { useAuth } from '@/lib/auth/context/AuthContext';
import { useRouter } from 'next/navigation';

interface ResourcesGridViewProps {
  data: ResourcesData[];
  onFavourite?: (
    resource: CreateFavouritePayload,
    isFavourite?: boolean
  ) => void;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  isPreview: boolean;
  heading: string;
  hideEmpty?: boolean;
}

const ResourcesGridView = ({
  data,
  onFavourite,
  pagination,
  isPreview,
  heading,
  hideEmpty = false,
}: ResourcesGridViewProps) => {
  const { user } = useAuth();
  const router = useRouter();
  const cdnUrl: string = process.env.NEXT_PUBLIC_CF_URL ?? '';

  const handleCardClick = (id: string, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    console.log(' this is listed ');
    router.push(`/resource/${id}`, { scroll: true });
  };

  const handleFavoriteClick = (item: ResourcesData, e: React.MouseEvent) => {
    e.stopPropagation();
    onFavourite?.(
      {
        resourceId: item.key,
        userId: user?.id ?? '',
      },
      item?.isFavourite
    );
  };

  if (!data || data.length <= 0) {
    if (hideEmpty) {
      return null;
    }
    return (
      <div className='flex flex-col items-center justify-center py-16'>
        <Empty
          description={<h2>No resource found</h2>}
          image={<Inbox className='w-16 h-16 text-gray-400' />}
        />
      </div>
    );
  }

  return (
    <div className='pb-1'>
      <p className='text-[24px] font-bold'>{heading}</p>
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 lg:grid-cols-4 gap-6'>
        {data.map((item) => {
          return (
            <div
              key={item.key}
              className='flex flex-col gap-3 group relative cursor-pointer'
              onClick={(e) => handleCardClick(item.key, e)}
            >
              <div className='relative h-[200px] w-full rounded-xl overflow-hidden'>
                <ProductImage
                  src={cdnUrl + item?.image}
                  alt={item.originalData?.description || item.name}
                />
                <div className='absolute top-3 left-3 flex flex-col gap-1'>
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-medium leading-3 text-white ${
                      item.type.includes('Equipment')
                        ? 'bg-[#2E3CD1]'
                        : 'bg-[#2EAED1]'
                    }`}
                  >
                    {item.type.split(' - ')[0]}
                  </span>
                  {item.type.includes('Subscription') && (
                    <span className='px-2 py-1 rounded-full text-[10px] font-medium leading-3 text-white bg-[#EAB308]'>
                      {en.resourcesTable.subscription}
                    </span>
                  )}
                </div>
                <div
                  className={`absolute top-3 right-3 transition-opacity max-sm:opacity-100 ${
                    item?.isFavourite
                      ? 'opacity-100'
                      : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <Button
                    shape='default'
                    size='large'
                    variant='text'
                    color='default'
                    icon={
                      <Heart
                        fill={item?.isFavourite ? 'red' : 'transparent'}
                        stroke={item?.isFavourite ? 'red' : 'black'}
                        size={24}
                      />
                    }
                    onClick={(e) => handleFavoriteClick(item, e)}
                    className=' border-none hover:bg-white'
                  />
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <h3 className='text-[#101010] text-[18px] font-semibold whitespace-nowrap overflow-x-hidden text-ellipsis'>
                  {item.name}
                </h3>
                <div className='flex justify-between items-center flex-wrap'>
                  <div className='text-[#101828] whitespace-nowrap'>
                    <span className='font-bold'>
                      {'\u20B9'}
                      {item.pricePerUnit}
                    </span>{' '}
                    <span className='text-sm'>{en.resourcesTable.per} Hrs</span>
                  </div>
                </div>
                <p className='text-[#10101046] text-[15px] font-semibold line-clamp-2 overflow-hidden mt-4'>
                  {item?.university?.name ??
                    item?.originalData?.university?.name}
                  ,{' '}
                  {item?.university?.city ??
                    item?.originalData?.university?.city}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {!isPreview && pagination && (
        <div className='flex justify-end mt-6'>
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={pagination.onChange}
            showSizeChanger
          />
        </div>
      )}
    </div>
  );
};

export default ResourcesGridView;
