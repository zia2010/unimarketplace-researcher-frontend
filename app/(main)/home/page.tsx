'use client';

import { ResourceFallback } from '@/components/common/ResourceFallback';
import { Suspense } from 'react';
import { AuthDebug } from '@/components/common/AuthDebug';
import SearchableDropdown from '@/components/common/SearchComponent';
import Resources from '@/components/home/Resource';
import { App as AntdApp, Empty } from 'antd';
import { Inbox } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { resourcesApi } from '@/lib/services/api/resource.api';
import { useAuth } from '@/lib/auth/context/AuthContext';

function HomeResources() {
  const { user } = useAuth();

  // Fetch counts for both to determine if we should show a global fallback
  const servicesQuery = useQuery({
    queryKey: ['resources-count', 'service'],
    queryFn: () =>
      resourcesApi.list({
        type: 'service',
        limit: 1,
        ...(user?.id ? { userId: user?.id } : {}),
      }),
  });

  const equipmentsQuery = useQuery({
    queryKey: ['resources-count', 'equipment'],
    queryFn: () =>
      resourcesApi.list({
        type: 'equipment',
        limit: 1,
        ...(user?.id ? { userId: user?.id } : {}),
      }),
  });

  const isLoading = servicesQuery.isLoading || equipmentsQuery.isLoading;
  const hasServices = (servicesQuery.data?.total ?? 0) > 0;
  const hasEquipments = (equipmentsQuery.data?.total ?? 0) > 0;

  if (isLoading) {
    return <ResourceFallback />;
  }

  if (!hasServices && !hasEquipments) {
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
    <>
      <Resources
        heading='Popular Services'
        isPreview={true}
        resourceType={'service'}
        hideEmpty={true}
      />
      <Resources
        heading='Popular Equipments'
        isPreview={true}
        resourceType={'equipment'}
        hideEmpty={true}
      />
    </>
  );
}

export default function Home() {
  return (
    <AntdApp>
      <AuthDebug />
      <Suspense fallback={<ResourceFallback />}>
        <div className='pb-8'>
          <SearchableDropdown />
        </div>
      </Suspense>
      <Suspense fallback={<ResourceFallback />}>
        <HomeResources />
      </Suspense>
    </AntdApp>
  );
}
