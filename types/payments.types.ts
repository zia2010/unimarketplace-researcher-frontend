import { ResourceResponse } from './resources.types';

export interface CreateOrderPayload {
  bookingId: string;
  amount?: number;
  description?: string;
  userId?: string;
}

export interface RazorpayOrderResponse {
  key: string;
  orderId: string;
  amount: number;
  currency: string;
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface getPaymentParams {
  userId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  bookingId?: string;
  status?: string;
}

// payment table types

export interface RazorpayOrder {
  id: string;
  [key: string]: string | number | object | Date | boolean | undefined;
}

export interface PaymentMeta {
  razorpayOrder: RazorpayOrder;
  webhookEvent?: string;
  [key: string]: string | number | object | Date | boolean | undefined;
}

export interface Booking {
  createdOn: string;
  updatedOn: string;
  isDeleted: boolean;
  [key: string]: string | number | object | Date | boolean | undefined;
  resource?: ResourceResponse;
}

export interface Payment {
  id: string;
  amount: string;
  currency: string;
  status: 'pending' | 'failed' | 'successful' | 'refunded';
  paymentMethod: string;
  description: string;
  paymentDate: string;
  bookingId: string;
  booking: Booking;
  invoiceId: string;
  meta: PaymentMeta;
  razorPaymentId: string;
  razorpayOrderId: string;
  createdOn: string;
  updatedOn: string;
  isDeleted: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaymentApiResponse {
  data: Payment[];
  pagination: Pagination;
}
