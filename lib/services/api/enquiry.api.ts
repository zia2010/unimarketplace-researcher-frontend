import { enquiryEndpoints } from './endpoints';
import { request } from './axios.config';
import { EnquiryPayload, EnquiryResponse } from '@/types';

export const enquiryApi = {
  send: (payload: EnquiryPayload) =>
    request<EnquiryResponse>({
      url: enquiryEndpoints.send,
      method: 'POST',
      data: payload,
    }),
};
