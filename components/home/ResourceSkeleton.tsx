'use client';

import React from 'react';

const ResourceSkeleton: React.FC = () => {
  const skeletonCount = 15;
  const skeletons = Array.from({ length: skeletonCount }, (_, i) => i);

  return (
    <div className='pb-1'>
      {/* Heading skeleton */}
      <div className='w-52 h-8 bg-gray-200 rounded animate-pulse mb-6' />

      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 lg:grid-cols-4 gap-6'>
        {skeletons.map((index) => (
          <div key={index} className='flex flex-col gap-3'>
            {/* Image container */}
            <div className='relative h-[200px] w-full rounded-xl overflow-hidden bg-gray-200'>
              {/* Main image skeleton - plain animated block */}
              <div className='w-full h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse' />

              {/* Badges - positioned absolutely */}
              <div className='absolute top-3 left-3 flex flex-col gap-1'>
                <div className='w-20 h-6 bg-white/80 rounded-full animate-pulse' />
                <div className='w-16 h-6 bg-white/80 rounded-full animate-pulse' />
              </div>

              {/* Heart button - positioned absolutely */}
              <div className='absolute top-3 right-3'>
                <div className='w-8 h-8 bg-white rounded-full animate-pulse' />
              </div>
            </div>

            {/* Content section */}
            <div className='flex flex-col gap-2'>
              {/* Title */}
              <div className='h-5 bg-gray-200 rounded animate-pulse w-full' />

              {/* Price row */}
              <div className='flex items-center gap-2 mt-2'>
                <div className='w-4 h-4 bg-gray-200 rounded animate-pulse' />
                <div className='w-16 h-6 bg-gray-200 rounded animate-pulse' />
                <div className='w-10 h-4 bg-gray-200 rounded animate-pulse' />
              </div>

              {/* University info */}
              <div className='mt-2 space-y-2'>
                <div className='h-4 bg-gray-200 rounded animate-pulse w-4/5' />
                <div className='h-4 bg-gray-200 rounded animate-pulse w-3/5' />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className='flex justify-end mt-6'>
        <div className='w-80 h-8 bg-gray-200 rounded animate-pulse' />
      </div>
    </div>
  );
};

export default ResourceSkeleton;
