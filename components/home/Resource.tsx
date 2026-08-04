'use client';

import { useState } from 'react';
import ResourcesGridView from './PopularGrid';
import {
  ResourcesData,
  ResourceResponse,
  ResourcesPropTypes,
  CreateFavouritePayload,
} from '@/types';
import { resourcesApi } from '@/lib/services/api/resource.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getResourceDisplayType } from '@/lib/utils/utils';
import { App } from 'antd';
import ResourceSkeleton from './ResourceSkeleton';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/context/AuthContext';

const Resources = ({
  heading,
  isPreview,
  resourceType,
  hideEmpty,
}: ResourcesPropTypes) => {
  const { message } = App.useApp();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const searchParams = useSearchParams();
  const [pageSize, setPageSize] = useState(isPreview ? 5 : 15);

  const universitiesParam = searchParams.get('universities') ?? '';
  const searchTermParam = searchParams.get('searchTerm') ?? '';
  const isFavourite = searchParams.get('isFavourite') ?? '';

  const resourcesQuery = useQuery({
    queryKey: [
      'resources',
      currentPage,
      pageSize,
      resourceType,
      isFavourite,
      universitiesParam,
      searchTermParam,
      'listed',
    ],
    queryFn: async () => {
      const params: Record<string, string | number> = {
        page: currentPage,
        limit: pageSize,
        isListed: 'listed',
        ...(user?.id ? { userId: user?.id } : {}),
        ...(resourceType ? { type: resourceType } : {}),
        ...(isFavourite ? { isFavorite: isFavourite } : {}),
        ...(universitiesParam.length > 0 ? { uniId: universitiesParam } : {}),
        ...(searchTermParam.length > 0 ? { searchTerm: searchTermParam } : {}),
      };

      const response = await resourcesApi.list(params);
      const list = response.data ?? [];

      return {
        data: list.map((item: ResourceResponse) => ({
          key: item.id,
          name: item.name,
          type: getResourceDisplayType(item),
          timeSlotUnit: item.timelostUnit === 'hours' ? 'Hours' : 'Minutes',
          pricePerUnit: item.price?.toString() ?? '0',
          price: item.price,
          status: item.isListed === 'listed' ? 'Listed' : 'Unlisted',
          image: item.images?.[0],
          description: item.description,
          university: item.university,
          originalData: item,
          isFavourite: item.isFavourite,
        })) as ResourcesData[],
        total: response.total ?? 0,
      };
    },
  });

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
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
    onError: (error) => {
      console.error('Failed to save resource:', error);
      message.error('Failed to save resource');
    },
  });

  const handleSubmit = (
    payload: CreateFavouritePayload,
    isFavourite?: boolean
  ) => {
    saveMutation.mutate({ payload, isFavourite });
  };

  if (resourcesQuery.isLoading) {
    return <ResourceSkeleton />;
  }

  return (
    <div className='pb-18 overflow-y-auto'>
      <ResourcesGridView
        data={resourcesQuery.data?.data ?? []}
        isPreview={isPreview}
        heading={heading}
        hideEmpty={hideEmpty}
        pagination={{
          current: currentPage,
          pageSize,
          total: resourcesQuery.data?.total ?? 0,
          onChange: (page: number, size: number) => {
            setCurrentPage(page);
            setPageSize(size);
          },
        }}
        onFavourite={handleSubmit}
      />
    </div>
  );
};

export default Resources;
