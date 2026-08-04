'use client';

import { useMemo, useState } from 'react';
import { Card, Spin, Alert } from 'antd';

type VideoCardProps = {
  url: string;
  title?: string;
  width?: string | number;
  height?: number;
  className?: string;
};

export default function VideoCard({
  url,
  title = 'Video',
  width = '100%',
  height = 420,
  className = '',
}: VideoCardProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const embedUrl = useMemo(() => {
    try {
      if (!url) return '';
      const u = new URL(url);

      if (u.hostname.includes('youtu.be')) {
        const id = u.pathname.replace('/', '');
        return `https://www.youtube.com/embed/${id}`;
      }

      const videoId = u.searchParams.get('v');
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    } catch {
      return url;
    }
  }, [url]);

  return (
    <Card
      title={null}
      style={{ width, padding: 0 }}
      className={`overflow-hidden rounded-[20px] ${className}`}
    >
      {error && (
        <Alert
          title='Video could not be loaded'
          type='error'
          showIcon
          style={{ margin: 6 }}
        />
      )}

      <div style={{ position: 'relative', minHeight: height }}>
        <Spin spinning={loading && !error} tip='Loading video...'>
          <iframe
            src={embedUrl}
            width='100%'
            height={height}
            title={title}
            loading='lazy'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
            style={{
              border: 'none',
            }}
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
          />
        </Spin>
      </div>
    </Card>
  );
}
