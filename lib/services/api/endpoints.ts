import { AvailabilityCheckType } from '@/types';

export const authEndpoints = {
  login: '/auth/login',
  logout: '/auth/logout',
  refresh: '/auth/refresh',
  google: '/auth/google',
  profile: '/auth/profile',
  register: '/auth/register',
  resendEmail: '/auth/resend-email',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  verifyEmail: '/auth/verify-email',
  firebaseToken: '/auth/get-firebase-token',
  fcmToken: '/auth/fcm-token',
};

export const paymentEndpoints = {
  createOrder: '/payments/create-order',
  verifyOrder: '/payments/verify',
  getPaymentHistory: '/payments',
};

export const bookingsEndpoints = {
  list: '/bookings',
  create: '/bookings',
  getOne: (id: string) => `/bookings/${id}`,
  update: (id: string) => `/bookings/${id}`,
};

export const notificationEndpoints = {
  sendChatNotification: '/notifications/send-chat-notifications',
};

export const resourceEndpoints = {
  list: '/resourses',
  getOne: (id: string, userId?: string) =>
    `/resourses/${id}?${userId ? 'queryUserId=' + userId : ''}`,
  update: (id: string) => `/resourses/${id}`,
  getAvailability: ({
    resourceId,
    startDate,
    endDate,
  }: AvailabilityCheckType) =>
    `/resourses/availability?resourceId=${resourceId}&startDate=${startDate}&endDate=${endDate}`,
  getTimeSlots: ({
    resourceId,
    startDate,
    endDate,
  }: {
    resourceId: string;
    startDate: string;
    endDate?: string;
  }) =>
    `/resourses/time-slots?resourceId=${resourceId}&startDate=${startDate}${
      endDate ? `&endDate=${endDate}` : ''
    }`,
  getAvailableSlots: ({
    resourceId,
    startDate,
    endDate,
    hours,
  }: {
    resourceId: string;
    startDate: string;
    endDate?: string;
    hours: number;
  }) =>
    `/resourses/available-slots?resourceId=${resourceId}&startDate=${startDate}${
      endDate ? '&endDate=' + endDate : ''
    }&hours=${hours}`,
};

export const favouriteEndpoints = {
  create: `/favourites`,
  delete: (userId: string, resourceId: string) =>
    `/favourites/user/${userId}/resource/${resourceId}`,
};

export const companyEndpoints = {
  create: '/company',
  update: (id: string) => `/company/${id}`,
  get: (id: string) => `/company/${id}`,
};

export const userEndpoints = {
  create: `/users`,
  update: (id: string) => `/users/${id}`,
  reportUser: (id: string, userId: string) =>
    `/users/${id}/report/${userId}/user`,
};

export const universitiesEndpoints = {
  get: (page: number, limit: number) =>
    `/universities?page=${page}&limit=${limit}`,
};

export const rolesEndpoints = {
  getbyRole: () => `/roles/by-type?roleType=researcher`,
};
export const endorsementEndpoints = {
  list: '/endorsements',
  create: '/endorsements',
  delete: (id: string) => `/endorsements/${id}`,
};

export const enquiryEndpoints = {
  send: '/users/enquiry',
};
