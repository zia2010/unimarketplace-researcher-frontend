import { Button } from 'antd';
import { Bell } from 'lucide-react';

const GlobalNotification = () => {

  return (
    <div className='flex justify-end items-center gap-4.75'>
      <Button
        type='primary'
        shape='circle'
        style={{
          width: 40,
          height: 40,
          backgroundColor: '#F7F8FF',
          borderColor: '#F7F8FF',
          boxShadow: 'none',
        }}
        icon={<Bell size={20} fill='#041B4B' stroke='#041B4B'/>}
      />
    </div>
  );
};

export default GlobalNotification;
