import { ResourceFallback } from '@/components/common/ResourceFallback';
import SearchableDropdown from '@/components/common/SearchComponent';
import Resources from '@/components/home/Resource';
import { App as AntdApp } from 'antd';
import { Suspense } from 'react';

export default function ResourcesFavouritePage() {
  return (
    <AntdApp>
      <Suspense fallback={<ResourceFallback />}>
        <div className='pb-8'>
          <SearchableDropdown />
        </div>
        <Resources heading='Favourites' isPreview={false} />
      </Suspense>
    </AntdApp>
  );
}
