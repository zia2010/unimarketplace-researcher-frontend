import { universitiesEndpoints } from './endpoints';
import { request } from './axios.config';
import { UniversitiesListResponse } from '@/types';

export const universityApi = {
  getUniversities: ({
    page = 1,
    limit = 10,
  }: {
    page: number;
    limit: number;
  }) =>
    request<UniversitiesListResponse>({
      url: universitiesEndpoints.get(page, limit),
      method: 'GET',
    }),
};
