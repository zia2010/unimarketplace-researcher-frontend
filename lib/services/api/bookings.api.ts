import { BookingPayload, PaginatedBookingsResponse } from '@/types';
import { bookingsEndpoints } from './endpoints';
import { request } from './axios.config';

export const bookingsApi = {
  list: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    userId?: string;
    resourceId?: string;
    startDate?: string;
    endDate?: string;
    uniId?: string;
    type?: string;
  }) =>
    request<PaginatedBookingsResponse>({
      url: bookingsEndpoints.list,
      method: 'GET',
      params,
    }),

  create: (payload: BookingPayload) =>
    request<BookingPayload>({
      url: bookingsEndpoints.create,
      method: 'POST',
      data: payload,
    }),

  update: (payload: Partial<BookingPayload>, id: string) =>
    request<BookingPayload>({
      url: bookingsEndpoints.update(id),
      method: 'PATCH',
      data: payload,
    }),
};
