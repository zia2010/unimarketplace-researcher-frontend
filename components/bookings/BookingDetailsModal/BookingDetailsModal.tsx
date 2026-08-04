'use client';

import { useState } from 'react';
import { Button, Modal, Table } from 'antd';
import dayjs from 'dayjs';
import Image from 'next/image';
import { BookingResponse, type StatusType } from '@/types/bookings.types';
import { formatTime } from '@/lib/utils/timeFormatter';

/** Single slot type from BookingResponse.bookingDates */
type BookingDateSlot = NonNullable<
  NonNullable<BookingResponse['bookingDates']>[number]
>;

function getStatusColor(status: StatusType): string {
  if (status === 'in_progress') return '#1b56cc';
  if (status === 'awaiting_payment' || status === 'pending_review')
    return '#FFAB00';
  if (status === 'cancelled') return '#D9261C';
  return '#16A34A';
}

function getStatusDisplayLabel(status: StatusType): string {
  if (status === 'in_progress') return 'Session started';
  return status
    .split('_')
    .map(
      (word: string) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(' ');
}

interface BookingDetailsModalProps {
  open: boolean;
  onCancel: () => void;
  booking: BookingResponse | null;
}

export const BookingDetailsModal = ({
  open,
  onCancel,
  booking,
}: BookingDetailsModalProps) => {
  const [purposeModalOpen, setPurposeModalOpen] = useState(false);

  if (!booking) return null;

  const resourceName = booking.resource?.name ?? 'N/A';
  const universityName = booking.university?.name ?? 'N/A';
  const pricePerSlot = booking.resource?.price ?? 0;
  const bookingDates = booking.bookingDates ?? [];
  const totalAmount =
    booking.bookingAmount ??
    bookingDates.reduce((acc, slot) => {
      const start = dayjs(`2000-01-01T${slot.startTime}`);
      const end = dayjs(`2000-01-01T${slot.endTime}`);
      const hours = end.diff(start, 'hour', true);
      return acc + hours * pricePerSlot;
    }, 0);

  const statusLabel = getStatusDisplayLabel(booking.status);

  console.log('booking', booking);
  const statusColor = getStatusColor(booking.status);

  const imageUrl = booking.resource?.images?.[0];
  const displayImage =
    imageUrl && !imageUrl.startsWith('http')
      ? `${process.env.NEXT_PUBLIC_CF_URL}${imageUrl}`
      : imageUrl;

  const tableData = bookingDates.map((slot: BookingDateSlot, index: number) => {
    const startDateTime = dayjs(`2000-01-01T${slot.startTime}`);
    const endDateTime = dayjs(`2000-01-01T${slot.endTime}`);
    const totalHours = endDateTime.diff(startDateTime, 'hour', true);
    const bookingCost = totalHours * pricePerSlot;

    return {
      key: `${slot.bookingStartDate}-${index}`,
      booking: slot,
      totalHours,
      bookingCost,
    };
  });

  return (
    <>
      <Modal
        title='Booking Summary'
        open={open}
        onCancel={onCancel}
        footer={null}
        width={640}
        centered
        destroyOnHidden
      >
        <div className='flex flex-col items-center max-w-3xl mx-auto w-full py-2'>
          <div className='text-center mb-4'>
            <div
              className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mt-2'
              style={{
                backgroundColor: `${statusColor}20`,
                color: statusColor,
              }}
            >
              <span>{statusLabel}</span>
            </div>
          </div>

          <div className='w-full bg-white border border-gray-200 rounded-xl p-6 mb-4 shadow-sm'>
            <div className='flex items-center gap-4 mb-6'>
              <div className='w-16 h-16 relative shrink-0 overflow-hidden rounded-lg bg-gray-100'>
                <Image
                  src={displayImage ?? ''}
                  alt={resourceName}
                  fill
                  className='object-cover'
                />
              </div>
              <div className='flex-1'>
                <h3 className='font-bold text-lg text-gray-900'>
                  {resourceName}
                </h3>
                <p className='text-sm text-gray-500'>{universityName}</p>
                {pricePerSlot > 0 && (
                  <p className='text-xs text-gray-500 font-medium mt-1'>
                    Price: ₹{pricePerSlot} / Hour
                  </p>
                )}
              </div>
            </div>

            {booking.purpose && (
              <div className='mb-4 pb-4 border-b border-gray-100'>
                <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1'>
                  Purpose
                </p>
                <p
                  className='text-sm text-gray-900 cursor-pointer hover:text-[#1652C9] transition-colors truncate block max-w-full'
                  onClick={() => setPurposeModalOpen(true)}
                  title='Click to view full purpose'
                >
                  {booking.purpose}
                </p>
              </div>
            )}

            {tableData.length > 0 && (
              <>
                <div className='mb-4'>
                  <Table
                    dataSource={tableData}
                    columns={[
                      {
                        title: 'Date',
                        dataIndex: 'booking',
                        key: 'date',
                        render: (slot: BookingDateSlot) => (
                          <div className='text-sm font-medium text-gray-900'>
                            {dayjs(slot.bookingStartDate).format(
                              'ddd, DD MMM YYYY'
                            )}
                          </div>
                        ),
                      },
                      {
                        title: 'Time Slot',
                        dataIndex: 'booking',
                        key: 'timeSlot',
                        render: (slot: BookingDateSlot) => (
                          <div className='text-sm text-gray-600 font-medium'>
                            {formatTime(slot.startTime)} -{' '}
                            {formatTime(slot.endTime)}
                          </div>
                        ),
                      },
                      {
                        title: 'Hours',
                        dataIndex: 'totalHours',
                        key: 'hours',
                        align: 'right',
                        render: (hours: number) => (
                          <span className='text-sm text-gray-700 font-medium'>
                            {hours}h
                          </span>
                        ),
                      },
                      {
                        title: 'Cost',
                        dataIndex: 'bookingCost',
                        key: 'cost',
                        align: 'right',
                        render: (cost: number) => (
                          <span className='text-sm text-gray-900 font-semibold'>
                            ₹{cost.toFixed(2)}
                          </span>
                        ),
                      },
                    ]}
                    pagination={false}
                    size='small'
                  />
                </div>

                <div className='space-y-2 w-full max-w-xs ml-auto'>
                  <div className='flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-dashed'>
                    <span>Total Amount</span>
                    <span>₹ {Number(totalAmount).toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>
      <Modal
        title='Booking Purpose'
        open={purposeModalOpen}
        onCancel={() => setPurposeModalOpen(false)}
        footer={[
          <Button
            key='close'
            type='primary'
            onClick={() => setPurposeModalOpen(false)}
          >
            Close
          </Button>,
        ]}
        width={600}
      >
        <div className='py-4'>
          <p className='text-[#1D2939] text-[14px] whitespace-pre-wrap'>
            {booking.purpose}
          </p>
        </div>
      </Modal>
    </>
  );
};

export default BookingDetailsModal;
