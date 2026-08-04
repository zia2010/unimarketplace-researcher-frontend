'use client';

import { paymentApi } from '@/lib/services/api/payment.api';
import { useQuery } from '@tanstack/react-query';
import { Table, Card, Typography, Space, Empty } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DollarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAuth } from '@/lib/auth/context/AuthContext';
import { Payment } from '@/types';

const { Title, Text } = Typography;

const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount / 100);
};

function PaymentHistory() {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['payment-history', user?.id],
    queryFn: async () =>
      await paymentApi.getPaymentHistory({ userId: user?.id }),
    enabled: !!user?.id,
  });

  const columns: ColumnsType<Payment> = [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (_description: string, record: Payment) => (
        <Space orientation='vertical' size={0}>
          <Text>Payment for booking: {record.booking?.resource?.name}</Text>
          {record.booking?.resource?.name && (
            <Text type='secondary' style={{ fontSize: '12px' }}>
              Price per hour: {Math.floor(record.booking?.resource?.price || 0)}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 160,
      render: (amount: number, record: Payment) => (
        <span>{formatCurrency(amount, record.currency)}</span>
      ),
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 140,
      render: (method: string) => (
        <span>
          {method?.toLowerCase() === 'upi'
            ? 'UPI'
            : method
              ? method.charAt(0).toUpperCase() + method.slice(1).toLowerCase()
              : 'N/A'}
        </span>
      ),
    },
    {
      title: 'Transaction ID',
      dataIndex: 'razorPaymentId',
      key: 'razorPaymentId',
      width: 220,
      render: (transactionId: string, record) => (
        <span>{transactionId || record.razorpayOrderId}</span>
      ),
    },
    {
      title: 'Payment Date',
      dataIndex: 'updatedOn',
      key: 'updatedOn',
      width: 160,
      render: (date: string) => (
        <Space>
          <Space orientation='vertical' size={0}>
            <Text>{dayjs(date).format('MMM DD, YYYY')}</Text>
            <Text type='secondary' style={{ fontSize: '12px' }}>
              {dayjs(date).format('hh:mm A')}
            </Text>
          </Space>
        </Space>
      ),
    },
  ];

  if (error) {
    return (
      <Card>
        <Empty
          description='No Data oe Failed to load payment history'
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  return (
    <Card
      className='my-8 border border-[#EAECF0] shadow-sm rounded-xl'
      title={
        <Space align='center'>
          <DollarOutlined style={{ fontSize: '20px', color: '#1B56CC' }} />
          <Title level={4} style={{ margin: 0 }}>
            Payment History
          </Title>
        </Space>
      }
      extra={
        <Space>
          <Text type='secondary'>
            Total: {data?.data?.length || 0} transactions
          </Text>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={data?.data || []}
        rowKey='id'
        loading={isLoading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} payments`,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        scroll={{ x: 1200 }}
        rowClassName='hover:bg-[#F9FAFB] transition-colors'
      />
    </Card>
  );
}

export default PaymentHistory;
