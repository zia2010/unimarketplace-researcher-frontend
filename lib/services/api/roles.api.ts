import { rolesEndpoints } from './endpoints';
import { request } from './axios.config';

export const rolesApi = {
  getRoles: () =>
    /* eslint-disable @typescript-eslint/no-explicit-any */
    request<Record<string, any>>({
      url: rolesEndpoints.getbyRole(),
      method: 'GET',
    }),
};
