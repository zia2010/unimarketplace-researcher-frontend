import { notificationEndpoints } from './endpoints';
import { request } from './axios.config';

export const notificationsApi = {
  triggerPushNotification: (payload: {
    conversationId: string;
    messageId: string;
    senderId: string;
  }) =>
    request({
      url: notificationEndpoints.sendChatNotification,
      method: 'POST',
      data: payload,
    }),
};
