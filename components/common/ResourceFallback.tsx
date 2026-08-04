import { Spin } from 'antd';

export function ResourceFallback() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-white'>
      <div className='text-gray-600'>
        <Spin size='large' />
      </div>
    </div>
  );
}
