import ResetPassword from '@/components/profile/reset-password';
import { App as AntdApp } from 'antd';
import { Suspense } from 'react';

export default function ForgotPasswordPage() {
  return (
    <AntdApp>
      <Suspense fallback={<div>Fallback</div>}>
        <ResetPassword />
      </Suspense>
    </AntdApp>
  );
}
