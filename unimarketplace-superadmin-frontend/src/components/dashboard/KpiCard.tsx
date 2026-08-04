import React from 'react';
import { Card } from 'antd';

interface KpiCardProps {
  title: string;
  amount: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, amount }) => {
  return (
    <Card
      bordered={false}
      className='flex flex-col justify-center h-[160px]'
      style={{ borderRadius: '12px', padding: '12px' }}
      bodyStyle={{ padding: '0 8px' }}
    >
      <p className='text-[#667085] text-sm font-semibold mb-4 font-space-grotesk'>
        {title}
      </p>
      <p className='text-[#1B56CC] text-4xl font-bold font-space-grotesk whitespace-nowrap'>
        {amount}
      </p>
    </Card>
  );
};

export default KpiCard;
