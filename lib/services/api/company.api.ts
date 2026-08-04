import { companyEndpoints } from './endpoints';
import { request } from './axios.config';
import { CompanyCreateResponse, CompanyFormData } from '@/types/company.types';

export const companyApi = {
  createCompany: (payload: CompanyFormData) =>
    request<CompanyCreateResponse>({
      url: companyEndpoints.create,
      method: 'POST',
      data: payload,
    }),

  updateCompany: (payload: Partial<CompanyFormData>, id: string) =>
    request<CompanyCreateResponse>({
      url: companyEndpoints.update(id),
      method: 'PATCH',
      data: payload,
    }),

  getCompany: (id: string) => {
    console.log(id);
    return request<CompanyCreateResponse>({
      url: companyEndpoints.get(id),
      method: 'GET',
    });
  },
};
