import { userEndpoints } from './endpoints';
import { request } from './axios.config';
import { User } from '@/types';

export const userApi = {
  updateUser: (payload: Partial<User>, id: string) =>
    request<Partial<User>>({
      url: userEndpoints.update(id),
      method: 'PATCH',
      data: payload,
    }),

  createUser: (payload: Partial<User>) =>
    request<Partial<User>>({
      url: userEndpoints.create,
      method: 'POST',
      data: payload,
    }),

  reportUser: (
    payload: { reason?: string; description?: string },
    reporterId: string,
    reportedId: string
  ) =>
    request({
      url: userEndpoints.reportUser(reporterId, reportedId),
      method: 'POST',
      data: payload,
    }),
};
