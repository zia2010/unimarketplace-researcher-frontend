import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { endorsementApi } from '@/lib/services/api/endorsement.api';
import { EndorsementPayload } from '@/types';
import { message } from 'antd';

interface UseEndorsementsParams {
  activeTab: 'All' | 'Received' | 'Given';
  userId?: string;
  enabled?: boolean;
}

export function useEndorsements(params: UseEndorsementsParams) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ['endorsements', params.activeTab, params.userId],
    queryFn: async () => {
      // Clean logic to determine direction parameter
      let directionParam: 'received' | 'given' | undefined;

      if (params.activeTab === 'Received') directionParam = 'received';
      else if (params.activeTab === 'Given') directionParam = 'given';
      // If 'All', directionParam remains undefined

      return endorsementApi.list({
        userId: params.userId as string,
        direction: directionParam,
      });
    },
    enabled: !!params.userId && params.enabled !== false,
  });

  const addEndorsement = async (payload: EndorsementPayload) => {
    setIsSubmitting(true);
    try {
      const res = await endorsementApi.create(payload);
      message.success('Endorsement posted successfully!');
      queryClient.invalidateQueries({ queryKey: ['endorsements'] });
      return res;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteEndorsement = async (id: string) => {
    setDeletingId(id);
    try {
      await endorsementApi.delete(id);
      message.success('Endorsement removed');
      queryClient.invalidateQueries({ queryKey: ['endorsements'] });
    } finally {
      setDeletingId(null);
    }
  };

  return {
    endorsements: query.data?.data || [],
    response: query.data,
    isLoading: query.isLoading,
    addEndorsement,
    isSubmitting,
    deleteEndorsement,
    deletingId,
  };
}
