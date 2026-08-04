import React from 'react';
import { Card } from 'antd';

interface RankedItem {
  name: string;
  amount: string;
}

interface RankedListCardProps {
  title: string;
  items: RankedItem[];
}

const RankedListCard: React.FC<RankedListCardProps> = ({ title, items }) => {
  return (
    <Card bordered={false} className='h-full' style={{ borderRadius: '12px' }}>
      <h3 className='text-[#041B4B] text-xl font-bold font-space-grotesk mb-6'>
        {title}
      </h3>

      <div className='flex flex-col gap-6'>
        {items.map((item, index) => (
          <div key={index} className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className='w-8 h-8 rounded-full bg-[#1B56CC] flex items-center justify-center text-white font-bold text-sm'>
                {index + 1}
              </div>
              <span className='text-[#041B4B] font-bold font-space-grotesk'>
                {item.name}
              </span>
            </div>
            <span className='text-[#041B4B] font-bold font-space-grotesk'>
              {item.amount}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RankedListCard;
