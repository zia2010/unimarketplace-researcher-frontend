'use client';

import { useEffect, useState } from 'react';
import {
  CreateOrderPayload,
  RazorpayOrderResponse,
  VerifyPaymentPayload,
} from '@/types';
import { paymentApi } from '@/lib/services/api/payment.api';
import { useAuth } from '@/lib/auth/context/AuthContext';
import { Button, App } from 'antd';
import { isError } from '@/lib/utils/error.util';
import { loadRazorpayScript } from '@/lib/utils/razorpayLoader';
import { useQueryClient } from '@tanstack/react-query';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

interface RazorpayPaymentProps {
  bookingId: string;
  amount?: number;
}

export async function createPaymentOrder(
  payload: CreateOrderPayload
): Promise<RazorpayOrderResponse> {
  try {
    console.log(payload);
    const data = await paymentApi.createOrder(payload);
    return data;
  } catch (error) {
    console.log(error);
    throw new Error('createPaymentOrder not implemented');
  }
}

export async function verifyPayment(
  payload: VerifyPaymentPayload
): Promise<{ success: boolean }> {
  try {
    console.log(payload);
    const data = await paymentApi.verifyOrder(payload);
    return data;
  } catch (error) {
    console.log(error);
    throw new Error('verifyPayment not implemented');
  }
}

export default function RazorpayPayment({
  bookingId,
  amount,
}: RazorpayPaymentProps) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { message } = App.useApp();
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRazorpayScript()
      .then(() => setRazorpayLoaded(true))
      .catch((err) => console.error('Failed to load Razorpay:', err));
  }, []);

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      message.warning('Razorpay gateway issue, Please try again later');
      return;
    }

    if (!bookingId) {
      setStatus('Please enter valid booking ID and amount');
      return;
    }

    try {
      setLoading(true);
      setStatus('Creating payment order…');
      console.log(user, 'this is user', status);
      const order = await createPaymentOrder({
        bookingId,
        amount,
        description: `Payment for booking: ${bookingId}`,
        userId: user?.id,
      });

      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: 'Rent-O-Infra',
        description: `Payment for booking: ${bookingId}`,
        order_id: order.orderId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async (response: any) => {
          setStatus('Verifying payment…');

          const result = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (result.success) {
            message.success('✅ Payment successful');
            setStatus('Payment verified');
          } else {
            message.error('❌ Payment verification failed');
            setStatus('Payment error please contact admin');
          }

          queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
        modal: {
          ondismiss: () => {
            setStatus('Payment cancelled');
            setLoading(false);
          },
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      const errorMessage = isError(error)
        ? error.message
        : 'Failed to ge user profile';
      setStatus(errorMessage || 'Payment error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        color='primary'
        variant='solid'
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? 'Processing…' : 'Pay Now'}
      </Button>
      {/* {status && <p className='text-sm text-gray-700'>{status}</p>} */}
    </>
  );
}
