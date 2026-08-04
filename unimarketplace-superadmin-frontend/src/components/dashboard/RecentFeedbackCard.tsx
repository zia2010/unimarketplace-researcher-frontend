import React from 'react';
import { Card } from 'antd';
import { StarFilled } from '@ant-design/icons';

export interface FeedbackItem {
  name: string;
  rating: number;
  comment: string;
}

interface RecentFeedbackCardProps {
  title: string;
  feedback: FeedbackItem;
}

const RecentFeedbackCard: React.FC<RecentFeedbackCardProps> = ({
  title,
  feedback,
}) => {
  return (
    <Card
      bordered={false}
      style={{ borderRadius: 12 }}
      bodyStyle={{ padding: 24 }}
    >
      <h3 className='text-xl font-bold text-[#041B4B] font-space-grotesk mb-6'>
        {title}
      </h3>

      <div className='flex items-center gap-3 mb-4'>
        <div className='w-10 h-10 rounded-full bg-[#D0D5DD] flex items-center justify-center text-base font-bold text-[#667085]'>
          {feedback.name[0]}
        </div>

        <div>
          <p className='font-bold text-[#101828] font-space-grotesk'>
            {feedback.name}
          </p>
          <div className='flex gap-0.5'>
            {Array.from({ length: 5 }).map((_, i) => (
              <StarFilled
                key={i}
                style={{ color: i < feedback.rating ? '#FFD037' : '#D0D5DD' }}
              />
            ))}
          </div>
        </div>
      </div>

      <p className='text-sm text-[#344054] leading-relaxed font-medium'>
        {feedback.comment}
      </p>
    </Card>
  );
};

export default RecentFeedbackCard;
