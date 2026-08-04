import { ResourceDetailComponent } from '@/components/resource/ResourceDetailComponent';
import { App as AntdApp } from 'antd';

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <AntdApp>
      <ResourceDetailComponent resourceId={id} />
    </AntdApp>
  );
}
