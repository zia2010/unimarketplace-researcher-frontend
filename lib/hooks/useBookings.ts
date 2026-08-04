import { useQuery } from '@tanstack/react-query';
import { bookingsApi } from '@/lib/services/api/bookings.api';

interface UseBookingsParams {
  activeTab: string;
  page: number;
  pageSize: number;
  status?: string;
  userId?: string;
  uniId?: string;
  enabled?: boolean;
}

export function useBookings({
  activeTab,
  page,
  pageSize,
  status,
  uniId,
  userId,
  enabled = true,
}: UseBookingsParams) {
  return useQuery({
    queryKey: ['bookings', activeTab, page, pageSize, status, uniId, userId],
    queryFn: async () => {
      const params: Record<string, string | number> = {
        page,
        limit: pageSize,
      };

      if (userId) {
        params.userId = userId;
      }

      if (uniId) {
        params.uniId = uniId;
      }

      if (activeTab !== 'All') {
        params.type = activeTab.toLowerCase();
      }

      if (status) {
        params.status = status;
      }

      return bookingsApi.list(params);
    },
    enabled: !!userId && enabled,
    retry: 2,
  });
}
