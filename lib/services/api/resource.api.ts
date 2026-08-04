import { favouriteEndpoints, resourceEndpoints } from './endpoints';
import { request } from './axios.config';
import {
  AvailableDatesResponse,
  AvailableSlotsQuery,
  AvailableSlotsResponse,
  PaginatedResourcesResponse,
  ResourceResponse,
  TimeSlotsData,
} from '@/types';

export const resourcesApi = {
  list: (params?: {
    page?: number;
    limit?: number;
    tags?: string;
    isListed?: string;
    type?: string;
    uniId?: string | string[];
    searchTerm?: string;
  }) =>
    request<PaginatedResourcesResponse>({
      url: resourceEndpoints.list,
      method: 'GET',
      params,
    }),

  createFavourite: (payload: { userId: string; resourceId: string }) =>
    request({
      url: favouriteEndpoints.create,
      method: 'POST',
      data: payload,
    }),

  deleteFavourite: (payload: { userId: string; resourceId: string }) =>
    request({
      url: favouriteEndpoints.delete(payload.userId, payload.resourceId),
      method: 'DELETE',
    }),

  getResourceById: (id: string, userId?: string) =>
    request<ResourceResponse>({
      url: resourceEndpoints.getOne(id, userId),
      method: 'GET',
    }),

  getResourceAvailability: (
    resourceId: string,
    startDate: string,
    endDate: string
  ) =>
    request<AvailableDatesResponse>({
      url: resourceEndpoints.getAvailability({
        resourceId,
        startDate,
        endDate,
      }),
      method: 'GET',
    }),

  getResourceTimeslot: (
    resourceId: string,
    startDate: string,
    endDate?: string
  ) =>
    request<TimeSlotsData>({
      url: resourceEndpoints.getTimeSlots({ resourceId, startDate, endDate }),
      method: 'GET',
    }),
  getAvailableSlots: (params: AvailableSlotsQuery) =>
    request<AvailableSlotsResponse>({
      url: resourceEndpoints.getAvailableSlots(params),
      method: 'GET',
    }),
};
