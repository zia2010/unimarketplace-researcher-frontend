import { request } from './axios.config';
import { endorsementEndpoints } from './endpoints';
import { Endorsement, GenericApiResponse, EndorsementPayload } from '@/types';

export const endorsementApi = {
  // Added 'direction?' correctly here
  list: (params: { userId: string; direction?: 'received' | 'given' }) =>
    request<GenericApiResponse<Endorsement[]>>({
      url: endorsementEndpoints.list,
      method: 'GET',
      params,
    }),

  create: (payload: EndorsementPayload) =>
    request<GenericApiResponse<Endorsement>>({
      url: endorsementEndpoints.create,
      method: 'POST',
      data: payload,
    }),

  delete: (id: string) =>
    request<void>({
      url: endorsementEndpoints.delete(id),
      method: 'DELETE',
    }),
};
