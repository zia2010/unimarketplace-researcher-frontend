import {
  GenericApiResponse,
  CreateOrderPayload,
  VerifyPaymentPayload,
  RazorpayOrderResponse,
  getPaymentParams,
  PaymentApiResponse,
} from '@/types';
import { paymentEndpoints } from './endpoints';
import { request } from './axios.config';

export const paymentApi = {
  createOrder: async (
    payload: CreateOrderPayload
  ): Promise<RazorpayOrderResponse> => {
    return request<RazorpayOrderResponse>({
      method: 'POST',
      url: paymentEndpoints.createOrder,
      data: payload,
    });
  },

  verifyOrder: async (
    payload: VerifyPaymentPayload
  ): Promise<GenericApiResponse<{ success: boolean }>> => {
    return request<GenericApiResponse<{ success: boolean }>>({
      method: 'POST',
      url: paymentEndpoints.verifyOrder,
      data: payload,
    });
  },

  getPaymentHistory: async (
    params: getPaymentParams
  ): Promise<PaymentApiResponse> => {
    return request<PaymentApiResponse>({
      method: 'GET',
      url: paymentEndpoints.getPaymentHistory,
      params: params,
    });
  },
};
