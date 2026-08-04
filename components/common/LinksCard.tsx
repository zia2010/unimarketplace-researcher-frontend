'use client';

import { Card, Tooltip } from 'antd';
import { ExternalLink } from 'lucide-react';

type LinksCardProps = {
  url: string;
  className?: string;
};

export default function LinksCard({ url, className = '' }: LinksCardProps) {
  const href = url.startsWith('http') ? url : `https://${url}`;

  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className='block h-full'
    >
      <Card
        className={`h-full border border-[#EAECF0] rounded-[20px] hover:shadow-md transition-shadow ${className}`}
        style={{
          width: '100%',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <div className='flex items-center gap-3 w-full'>
          <div className='bg-[#F2F4F7] p-2 rounded-full min-w-[40px] h-[40px] flex items-center justify-center shrink-0'>
            <ExternalLink size={20} className='text-[#667085]' />
          </div>
          <Tooltip title={url}>
            <div className='font-semibold overflow-x-hidden text-[#1B56CC] transition-colors flex-1 min-w-0'>
              {url}
            </div>
          </Tooltip>
        </div>
      </Card>
    </a>
  );
}
