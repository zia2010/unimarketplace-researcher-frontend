'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Table,
  ConfigProvider,
  Card,
  Button,
  App,
  Modal,
  Popconfirm,
  Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { en } from '@/lib/locales/en';
import { MessageSquare } from 'lucide-react';
import { BookingResponse, StatusType } from '@/types';
import { useAuth } from '@/lib/auth/context/AuthContext';
import { useBookings } from '@/lib/hooks/useBookings';
import MessageModal from './MessageModal';
import RazorpayPayment from './RazorpayPayment';
import BookingDetailsModal from './BookingDetailsModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '@/lib/services/api/bookings.api';
import { AxiosError } from 'axios';
import { formatDate } from '@/lib/utils/formatDate';

const calculateTotalAmount = (booking: BookingResponse): number => {
  // If bookingAmount exists, use it
  if (booking.bookingAmount) {
    return booking.bookingAmount;
  }

  // Otherwise, calculate based on booking dates and resource price
  const resourcePrice = booking.resource?.price || 0;
  const bookingDates = booking.bookingDates || [];

  if (!resourcePrice || bookingDates.length === 0) {
    return 0;
  }

  let totalHours = 0;

  bookingDates.forEach((dateSlot) => {
    const startTime = dateSlot.startTime;
    const endTime = dateSlot.endTime;

    if (startTime && endTime) {
      // Parse time strings (HH:MM:SS or HH:MM)
      const startParts = startTime.split(':');
      const endParts = endTime.split(':');

      const startHour = parseInt(startParts[0], 10);
      const startMinute = parseInt(startParts[1], 10);
      const endHour = parseInt(endParts[0], 10);
      const endMinute = parseInt(endParts[1], 10);

      // Calculate hours
      const startTotalMinutes = startHour * 60 + startMinute;
      const endTotalMinutes = endHour * 60 + endMinute;
      const durationMinutes = endTotalMinutes - startTotalMinutes;
      const hours = durationMinutes / 60;

      totalHours += hours;
    }
  });

  return totalHours * resourcePrice;
};

const BOOKING_STATUSES: StatusType[] = [
  'pending_review',
  'in_progress',
  'confirmed',
  'completed',
  'cancelled',
  'awaiting_payment',
];

const formatStatusLabel = (status: string) =>
  status
    .split('_')
    .map(
      (word: string) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(' ');

const getStatusDisplayLabel = (status: string) =>
  status === 'in_progress' ? 'Session started' : formatStatusLabel(status);

const BookingTable = () => {
  const { user } = useAuth();
  const { message } = App.useApp();

  const [activeTab, setActiveTab] = useState('All');
  const [statusFilter, setStatusFilter] = useState<StatusType | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const queryClient = useQueryClient();
  const [bookingModal, setBookingModal] = useState<boolean>(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState<boolean>(false);
  const [purposeModal, setPurposeModal] = useState<boolean>(false);
  const [selectedPurpose, setSelectedPurpose] = useState<string>('');
  const [selectedBooking, setSelectedBooking] =
    useState<BookingResponse | null>(null);

  const { data: bookingsResponse, isLoading } = useBookings({
    activeTab,
    page: currentPage,
    pageSize,
    status: statusFilter || undefined,
    userId: user?.id,
    enabled: !!user?.id,
  });

  useEffect(() => {
    console.log('booking data', bookingsResponse);
  }, [bookingsResponse]);

  const bookings = bookingsResponse?.data ?? [];

  const filteredBookings = useMemo(() => {
    if (activeTab === 'All') return bookings;

    return bookings.filter((booking: BookingResponse) => {
      const type = booking.type || booking.resource?.type;
      return type?.toLowerCase() === activeTab.toLowerCase();
    });
  }, [bookings, activeTab]);

  const onTabChange = (key: string) => {
    setActiveTab(key);
    setCurrentPage(1);
  };

  const onStatusFilterChange = (value: StatusType | '') => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const saveMutation = useMutation({
    mutationFn: async (payload: Partial<BookingResponse>) => {
      if (!payload.id) throw new Error('Booking id not found');
      if (!payload.status) throw new Error('Booking status not found');
      return bookingsApi.update({ status: payload.status }, payload.id);
    },
    onSuccess: (_, variables) => {
      if (variables.status === 'verification_pending') {
        message.success('OTP has been sent to your mail');
      } else if (variables.status === 'cancelled') {
        message.success('Booking cancelled');
      } else {
        message.success('Successfully updated the booking');
      }
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      message.error(
        error?.response?.data?.message || 'Failed to update booking'
      );
    },
  });

  const handleBookingUpdate = (id: string, status: StatusType) => {
    saveMutation.mutate({ id, status });
  };

  const columns: ColumnsType<BookingResponse> = [
    {
      title: en.table.equipmentService,
      dataIndex: 'resource',
      key: 'equipment',
      align: 'center',
      render: (resource, record) => (
        <div className='flex flex-col min-w-36 items-center text-center'>
          <span className='font-semibold text-[#1D2939] text-[14px]'>
            {resource?.name}
          </span>
          <span className='text-[#667085] text-[12px] mt-0.5'>
            {record.university?.name ?? 'N/A'}
          </span>
        </div>
      ),
    },
    {
      title: en.table.dateBooking,
      dataIndex: ['startDate', 'endDate'],
      key: 'date',
      width: 180,
      align: 'center',
      render: (_, record) => {
        const startDate =
          record.startDate ||
          record.bookingDates?.[0]?.bookingStartDate ||
          'N/A';
        const endDate =
          record.endDate ||
          record.bookingDates?.[record.bookingDates?.length - 1]
            ?.bookingStartDate ||
          startDate;
        const startFormatted = formatDate(startDate, false);
        const endFormatted = formatDate(endDate, false);
        return (
          <div className='flex items-center justify-center gap-2 min-w-36'>
            <div className='flex flex-col items-center text-center min-w-0'>
              <span className='text-[#101010] text-[12px]'>
                {startFormatted} to {endFormatted}
              </span>
            </div>
            <Button
              type='text'
              onClick={() => {
                setSelectedBooking(record);
                setDetailsModalOpen(true);
              }}
              className='text-[#1D2939] hover:text-[#1652C9] transition-colors p-2 flex items-center justify-center shrink-0'
              icon={<ExclamationCircleOutlined style={{ fontSize: 20 }} />}
              title='View details'
            />
          </div>
        );
      },
    },
    {
      title: 'Total Amount',
      dataIndex: 'bookingAmount',
      key: 'amount',
      align: 'center',
      render: (_, record) => {
        const totalAmount = calculateTotalAmount(record);
        return (
          <div className='flex flex-col min-w-28 items-center text-center'>
            <span className='font-semibold text-[#1D2939] text-[14px]'>
              {totalAmount >= 0
                ? `₹${totalAmount.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                : 'N/A'}
            </span>
          </div>
        );
      },
    },
    {
      title: en.table.status,
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => {
        const color =
          status === 'in_progress'
            ? '#1b56cc'
            : status === 'awaiting_payment' || status === 'pending_review'
              ? '#FFAB00'
              : status === 'cancelled'
                ? '#D9261C'
                : '#16A34A';
        const label = getStatusDisplayLabel(status);
        return (
          <div className='flex flex-col min-w-24 items-center text-center'>
            <span style={{ color }} className='font-medium text-[14px]'>
              {label}
            </span>
          </div>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      align: 'left',
      render: (_, record) => {
        return (
          <div className='flex grow gap-1 min-w-24 justify-start'>
            <Button
              color='default'
              variant='outlined'
              onClick={() => {
                setBookingModal(true);
                setSelectedBooking(record);
              }}
              className='text-[#667085] hover:text-[#1652C9] transition-colors p-2'
            >
              <MessageSquare size={20} />
            </Button>
            {record.status === 'confirmed' && (
              <Button
                color='primary'
                onClick={() =>
                  handleBookingUpdate(record.id, 'verification_pending')
                }
                variant='solid'
                disabled={saveMutation.status === 'pending'}
                loading={saveMutation.status === 'pending'}
              >
                Check in
              </Button>
            )}
            {record.status === 'awaiting_payment' && (
              <RazorpayPayment
                bookingId={record.id}
                amount={record?.bookingAmount}
              />
            )}
            {(record.status === 'pending_review' ||
              record.status === 'awaiting_payment') && (
              <Popconfirm
                title='Cancel Booking'
                description='Are you sure you want to cancel this booking?'
                onConfirm={() => handleBookingUpdate(record.id, 'cancelled')}
                okText='Yes, Cancel'
                cancelText='No'
                okButtonProps={{
                  danger: true,
                  type: 'primary',
                }}
                cancelButtonProps={{
                  type: 'default',
                }}
              >
                <Button
                  color='danger'
                  variant='outlined'
                  className='hover:border-red-500 hover:text-red-600'
                >
                  Cancel
                </Button>
              </Popconfirm>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <ConfigProvider>
        <Card className='my-8 py-4 md:py-10'>
          <style>
            {`
              .ant-card-body { padding: 12px 0 !important; }
              @media (min-width: 768px) {
                .ant-card-body { padding: 24px 0 !important; }
              }
              .ant-table-wrapper { overflow-x: auto; }
              @media (max-width: 767px) {
                .ant-pagination { font-size: 12px !important; }
                .ant-pagination-item,
                .ant-pagination-prev,
                .ant-pagination-next { 
                  min-width: 28px !important; height: 28px !important; 
                  line-height: 26px !important; margin: 0 2px !important;
                }
                .ant-pagination-options { display: none !important; }
                .ant-pagination-total-text { font-size: 11px !important; }
              }
            `}
          </style>

          <div className='flex flex-wrap items-center gap-1.5 px-2 md:px-6 pb-3'>
            {(['All', 'Equipment', 'Service'] as const).map((key) => (
              <Tag
                key={key}
                color={activeTab === key ? 'blue' : undefined}
                className='cursor-pointer text-xs px-2 py-0.5 m-0'
                onClick={() => onTabChange(key)}
              >
                {key}
              </Tag>
            ))}
            <div
              className='h-4 w-px shrink-0 bg-[#E4E7EC] mx-0.5'
              role='separator'
              aria-label='Filter divider'
            />
            <Tag
              color={!statusFilter ? 'blue' : undefined}
              className='cursor-pointer text-xs px-2 py-0.5 m-0'
              onClick={() => onStatusFilterChange('')}
            >
              All statuses
            </Tag>
            {BOOKING_STATUSES.map((s) => (
              <Tag
                key={s}
                color={statusFilter === s ? 'blue' : undefined}
                className='cursor-pointer text-xs px-2 py-0.5 m-0'
                onClick={() => onStatusFilterChange(s)}
              >
                {getStatusDisplayLabel(s)}
              </Tag>
            ))}
          </div>

          {/* <div className='overflow-x-auto'> */}
          <div>
            <Table
              columns={columns}
              dataSource={filteredBookings}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: bookingsResponse?.meta.total,
                onChange: (page, size) => {
                  setCurrentPage(page);
                  setPageSize(size);
                },
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} bookings`,
                responsive: true,
              }}
              loading={isLoading}
              rowKey='id'
              scroll={{
                x: 'max-content',
              }}
              locale={{
                emptyText: (
                  <div className='py-12 text-center'>
                    <p className='text-gray-400 text-lg'>No bookings found</p>
                    <p className='text-gray-300 text-sm mt-2'>
                      There are no bookings to display
                    </p>
                  </div>
                ),
              }}
              style={{
                width: '100%',
                overflowX: 'auto',
              }}
              className='w-full booking-table'
            />
          </div>
        </Card>
      </ConfigProvider>

      <BookingDetailsModal
        open={detailsModalOpen}
        onCancel={() => setDetailsModalOpen(false)}
        booking={selectedBooking}
      />
      <MessageModal
        isOpen={bookingModal}
        onClose={() => setBookingModal(false)}
        userId={user?.id ?? ''}
        universityId={
          (selectedBooking?.uniId
            ? selectedBooking?.university
              ? selectedBooking?.university.id
              : user?.uniId
            : '') ?? ''
        }
        resourceId={selectedBooking?.resource?.id ?? ''}
        resourceName={selectedBooking?.resource?.name ?? ''}
        universityName={selectedBooking?.university?.name ?? ''}
        universityLogo={selectedBooking?.university?.logo ?? ''}
      />
      <Modal
        title='Booking Purpose'
        open={purposeModal}
        onCancel={() => setPurposeModal(false)}
        footer={[
          <Button
            key='close'
            type='primary'
            onClick={() => setPurposeModal(false)}
          >
            Close
          </Button>,
        ]}
        width={600}
      >
        <div className='py-4'>
          <p className='text-[#1D2939] text-[14px] whitespace-pre-wrap'>
            {selectedPurpose}
          </p>
        </div>
      </Modal>
    </>
  );
};

export default BookingTable;
