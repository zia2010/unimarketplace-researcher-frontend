import Messages from '@/components/messages/Messages';
import { App as AntdApp } from 'antd';
import { Suspense } from 'react';

export default function MessagesPage() {
  return (
    <AntdApp>
      <Suspense fallback={<div>Loading...</div>}>
        <Messages />
      </Suspense>
    </AntdApp>
  );
}
