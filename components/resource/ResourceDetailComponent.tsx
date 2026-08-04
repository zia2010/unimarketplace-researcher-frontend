'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Tag, Row, Col, Spin, Button, App, Image } from 'antd';
import { useRouter } from 'next/navigation';
import { Heart, ZoomIn, ZoomOut } from 'lucide-react';
import { resourcesApi } from '@/lib/services/api/resource.api';
import MessageModal from '../bookings/MessageModal';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/context/AuthContext';
import { CreateFavouritePayload, ResourceConfig } from '@/types';
import BookingModal from '../bookings/BookingModal/BookingModal';
import VideoCard from '../common/VideoCard';
import LinksCard from '../common/LinksCard';

interface ResourceDetailComponentProps {
  resourceId: string;
}

const formatTime = (time: string) => {
  if (!time) return '';

  const [hoursStr, minutesStr] = time.split(':');
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  const period = hours >= 12 ? 'pm' : 'am';
  const displayHours = hours % 12 || 12;

  if (minutes === 0) {
    return `${displayHours} ${period}`;
  }
  return `${displayHours}:${minutesStr} ${period}`;
};

export function ResourceDetailComponent({
  resourceId,
}: ResourceDetailComponentProps) {
  const { user } = useAuth();
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [chatModal, setChatModal] = useState<boolean>(false);
  const [directBookingModal, setDirectBookingModal] = useState<boolean>(false);

  // React Query hook
  const { data, isLoading, error } = useQuery({
    queryKey: ['resource-details', resourceId, user?.id],
    queryFn: async () =>
      await resourcesApi.getResourceById(resourceId, user?.id),
  });

  useEffect(() => {
    console.log('resource data', data);
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: async ({
      isFavourite,
      payload,
    }: {
      isFavourite?: boolean;
      payload: CreateFavouritePayload;
    }) => {
      if (isFavourite) {
        return resourcesApi.deleteFavourite(payload);
      } else {
        return resourcesApi.createFavourite(payload);
      }
    },
    onSuccess: () => {
      message.success(`Successfully updated favourite resource`);
      queryClient.invalidateQueries({ queryKey: ['resource-details'] });
    },
    onError: (error) => {
      console.error('Failed to save resource:', error);
      message.error(error.message);
    },
  });

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spin size='large' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex flex-col justify-center items-center min-h-screen gap-4'>
        <p className='text-red-500 text-lg'>Error loading resource</p>
        <button
          onClick={() => router.push('/resources', { scroll: true })}
          className='text-[#1B56CC] hover:underline'
        >
          Back to Resources
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className='flex flex-col justify-center items-center min-h-screen gap-4'>
        <p className='text-[#667085] text-lg'>Resource not found</p>
        <button
          onClick={() => router.push('/resources', { scroll: true })}
          className='text-[#1B56CC] hover:underline'
        >
          Back to Resources
        </button>
      </div>
    );
  }

  const resourceType = data.type;

  const handleSubmit = (
    payload: CreateFavouritePayload,
    isFavourite?: boolean
  ) => {
    saveMutation.mutate({
      payload,
      isFavourite: isFavourite ?? data.isFavourite,
    });
  };

  const images =
    Array.isArray(data?.images) && data.images.length > 0 ? data.images : [''];

  const videos =
    Array.isArray(data?.youtubeLinks) && data.youtubeLinks.length > 0
      ? data.youtubeLinks
      : [];

  const links =
    Array.isArray(data?.links) && data.links.length > 0 ? data.links : [];

  return (
    <div className='max-w-7xl mx-auto'>
      <div>
        {/* flex-wrap-reverse md: */}
        <div className='flex flex-wrap gap-4 justify-between items-start'>
          <div>
            <h1 className='text-[#041B4B] text-[36px] font-bold mb-0! leading-none flex items-center'>
              {data.name}{' '}
              <Button
                shape='default'
                size='large'
                variant='text'
                color='default'
                icon={
                  <Heart
                    fill={data.isFavourite ? 'red' : 'transparent'}
                    stroke={data.isFavourite ? 'red' : 'black'}
                    size={24}
                  />
                }
                onClick={() =>
                  handleSubmit(
                    { resourceId: data.id, userId: user?.id ?? '' },
                    data.isFavourite
                  )
                }
                className=' border-none hover:bg-white'
              />
            </h1>
            <p className='text-[#667085] text-[16px] mb-1! max-w-[400px] line-clamp-2 overflow-hidden'>
              {resourceType === 'equipment'
                ? 'Equipment Provided by '
                : 'Service Provided by '}
              {data?.university?.name + ' ' + data?.university?.city} |
              Manufactured by {data.manufacturer}
            </p>
            <div className='flex items-center gap-2 mb-4'>
              <Tag
                className=' text-white border-none px-4 py-1 rounded-full text-[14px]'
                style={{
                  color: '#ffffff',
                  backgroundColor:
                    resourceType === 'equipment' ? '#2E3CD1' : '#2EAED1',
                  borderRadius: '100px',
                  padding: '5px 15px',
                }}
              >
                {resourceType === 'equipment' ? 'Equipment' : 'Service'}
              </Tag>
              <>
                {data.tags &&
                  data.tags.length > 0 &&
                  data.tags.map((tag: string, index: number) => (
                    <Tag
                      key={index}
                      style={{
                        color: '#344054',
                        backgroundColor: '#F2F4F7',
                        borderRadius: '100px',
                        padding: '5px 15px',
                      }}
                      className='text-white border-none px-4 py-1 rounded-full text-[14px]'
                    >
                      {tag}
                    </Tag>
                  ))}
              </>
            </div>
          </div>
          <div className='flex gap-2'>
            {user && (
              <Button
                type='default'
                size='large'
                onClick={() => setChatModal(!chatModal)}
                className='bg-[#EEF0FE] text-[#1B56CC] px-6 rounded-lg font-semibold h-8 hover:bg-[#DDE3FD] hover:text-[#1B56CC] border-none'
              >
                Chat With university
              </Button>
            )}
            <Button
              type='primary'
              size='large'
              onClick={() => {
                return !user
                  ? router.replace('/login')
                  : setDirectBookingModal(true);
              }}
              className='bg-[#EEF0FE] text-[#1B56CC] px-6 rounded-lg font-semibold h-8 hover:bg-[#DDE3FD] hover:text-[#1B56CC] border-none'
            >
              Check Availability
            </Button>
          </div>
        </div>
      </div>

      <div className='flex gap-4 overflow-x-auto pb-2'>
        <Image.PreviewGroup
          preview={{
            actionsRender: (
              _,
              { transform: { scale }, actions: { onZoomOut, onZoomIn } }
            ) => (
              <div className='flex gap-2 items-center'>
                <button
                  onClick={onZoomOut}
                  className='px-3 py-2 bg-white/10 hover:bg-white/20 rounded text-white'
                >
                  <ZoomOut size={20} />
                </button>
                <span className='px-3 py-2 text-white'>
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={onZoomIn}
                  className='px-3 py-2 bg-white/10 hover:bg-white/20 rounded text-white'
                >
                  <ZoomIn size={20} />
                </button>
              </div>
            ),
          }}
        >
          {images.map((url: string, index: number) => (
            <div
              key={index}
              className='min-w-[140px] max-w-[140px] h-[140px] bg-[#F9FAFB] border border-[#F2F4F7] rounded-[20px] flex items-center justify-center overflow-hidden cursor-pointer'
            >
              <Image
                src={url ? process.env.NEXT_PUBLIC_CF_URL + url : ''}
                alt={`Resource image ${index + 1}`}
                className='w-full h-full object-cover'
              />
            </div>
          ))}
        </Image.PreviewGroup>
      </div>

      <p className='text-[#101010] text-[16px]'>
        {' '}
        <span className='font-semibold'>Price:</span> ₹
        {data.price || 'Not defined'} / Hour
      </p>

      <div className='space-y-6 mb-10'>
        <div className='p-6 border border-[#EAECF0] rounded-[20px]'>
          <h3 className='text-[#101010] text-[14px] font-bold mb-2'>
            Description
          </h3>
          <p className='text-[#667085] text-[14px] leading-relaxed'>
            {data.description}
          </p>
        </div>

        <div className='p-6 border border-[#EAECF0] rounded-[20px]'>
          <h3 className='text-[#101010] text-[14px] font-bold mb-2'>
            {resourceType === 'equipment' ? 'Access Guidelines' : 'Guidelines'}
          </h3>
          <p className='text-[#667085] text-[14px] leading-relaxed'>
            {data.guidelines}
          </p>
        </div>

        {resourceType === 'service' && data.faq && (
          <div className='p-6 border border-[#EAECF0] rounded-[20px]'>
            <h3 className='text-[#101010] text-[14px] font-bold mb-2'>FAQ</h3>
            <p className='text-[#667085] text-[14px] leading-relaxed'>
              {data.faq}
            </p>
          </div>
        )}
      </div>

      {videos && videos.length > 0 && (
        <div className='p-6 border border-[#EAECF0] rounded-[20px] mb-10'>
          <h3 className='text-[#101010] text-[14px] font-bold mb-2'>Videos</h3>
          <Row gutter={[24, 24]}>
            {videos.map((videoUrl: string, index: number) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <VideoCard
                  url={videoUrl}
                  height={215}
                  title={`Video ${index + 1}`}
                />
              </Col>
            ))}
          </Row>
        </div>
      )}

      {links && links.length > 0 && (
        <div className='p-6 border border-[#EAECF0] rounded-[20px] mb-10'>
          <h3 className='text-[#101010] text-[14px] font-bold mb-2'>Links</h3>
          <Row gutter={[24, 24]}>
            {links.map((link: string, index: number) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <LinksCard url={link} />
              </Col>
            ))}
          </Row>
        </div>
      )}

      <Row gutter={[24, 24]} className='mb-12'>
        {data.resourceConfig && data.resourceConfig?.length > 0 ? (
          <Col xs={24} sm={24} md={12} lg={6}>
            <div className='p-6 border border-[#EAECF0] rounded-[20px] h-full min-w-60'>
              <h3 className='text-[#101010] text-[14px] font-bold mb-4'>
                Lab Hours
              </h3>
              <div className='space-y-2'>
                {data.resourceConfig.map((config) => (
                  <div
                    key={config.day}
                    className='flex justify-between text-[14px] truncate'
                  >
                    <span className='text-[#101010] capitalize'>
                      {config.day}
                    </span>
                    <span
                      className={
                        config.open ? 'text-[#101010]' : 'text-[#F04438]'
                      }
                    >
                      {config.open
                        ? `${
                            config?.startTime
                              ? formatTime(config.startTime)
                              : ''
                          } ${
                            config?.endTime
                              ? 'to ' + formatTime(config.endTime)
                              : ''
                          }`
                        : 'Closed'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        ) : null}
      </Row>
      <MessageModal
        isOpen={!!chatModal}
        onClose={() => setChatModal(false)}
        userId={user?.id ?? ''}
        universityId={
          data?.universityId ? data?.universityId : (user?.uniId ?? '')
        }
        resourceId={data.id}
        resourceName={data.name}
        universityName={data.university?.name ?? ''}
        universityLogo={data.university?.logo ?? ''}
      />
      <BookingModal
        isOpen={!!directBookingModal}
        onClose={() => setDirectBookingModal(false)}
        userId={user?.id ?? ''}
        universityId={
          data?.universityId ? data?.universityId : (user?.uniId ?? '')
        }
        resourceId={data.id}
        resourceConfig={data.resourceConfig || ([] as ResourceConfig[])}
        resourceName={data.name}
        resourceImage={data.images?.[0]}
        pricePerSlot={data.price}
        maxDuration={data.maxDuration}
        universityName={data.university?.name ?? ''}
      />
    </div>
  );
}
