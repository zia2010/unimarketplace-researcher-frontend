'use client';

import { ResourceFallback } from '@/components/common/ResourceFallback';
import SearchableDropdown from '@/components/common/SearchComponent';
import Resources from '@/components/home/Resource';
import { App as AntdApp, Button } from 'antd';
import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { X } from 'lucide-react';

// Separate component that uses useSearchParams
function ResourcesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Check if there are any query parameters
  const hasQueryParams = searchParams.toString().length > 0;

  const handleClearFilters = () => {
    router.push('/resources', { scroll: true });
  };

  return (
    <>
      <div className='pb-8 flex items-center gap-3'>
        <div className='flex-1'>
          <SearchableDropdown />
        </div>
        {hasQueryParams && (
          <Button
            type='default'
            icon={<X size={16} />}
            onClick={handleClearFilters}
            className='h-10'
          >
            Clear Filters
          </Button>
        )}
      </div>
      <Resources heading='Resources' isPreview={false} />
    </>
  );
}

// Main page component with Suspense boundary
export default function ResourcesPage() {
  return (
    <AntdApp>
      <Suspense fallback={<ResourceFallback />}>
        <ResourcesContent />
      </Suspense>
    </AntdApp>
  );
}
