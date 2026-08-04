import { Button, Table } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import { BookingPayload } from '@/types';
import Image from 'next/image';

interface BookingConfirmationStepProps {
  onFinish: () => void;
  onBack: () => void;
  resourceName?: string;
  imageUrl?: string;
  bookingDates: BookingPayload['bookingDates'] | null;
  pricePerSlot?: number;
  universityName?: string;
  loading?: boolean;
}

export const BookingConfirmationStep = ({
  onFinish,
  onBack,
  resourceName = 'Equipment',
  imageUrl,
  bookingDates,
  pricePerSlot = 0,
  universityName,
  loading = false,
}: BookingConfirmationStepProps) => {
  if (!bookingDates || bookingDates.length === 0) return null;

  const total = bookingDates.reduce((acc, curr) => {
    // Calculate number of days in this booking range
    const days =
      dayjs(curr.bookingEndDate).diff(dayjs(curr.bookingStartDate), 'day') + 1;

    // Calculate hours for this time slot
    const startDateTime = dayjs(`2000-01-01T${curr.startTime}`);
    const endDateTime = dayjs(`2000-01-01T${curr.endTime}`);
    const hours = endDateTime.diff(startDateTime, 'hour', true); // true for fractional hours

    // Calculate cost: days × hours × price per hour
    const bookingCost = days * hours * pricePerSlot;

    return acc + bookingCost;
  }, 0);

  const displayImage =
    imageUrl && !imageUrl.startsWith('http')
      ? `${process.env.NEXT_PUBLIC_CF_URL}${imageUrl}`
      : imageUrl;

  return (
    <div className='flex flex-col h-full items-center max-w-3xl mx-auto w-full py-4'>
      <div className='text-center mb-6'>
        <h2 className='text-xl font-bold text-gray-900'>
          Booking Request Summary
        </h2>
        <div className='inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs font-semibold mb-2'>
          <CheckCircleFilled />
          <span>Pending Confirmation</span>
        </div>
      </div>

      <div className='w-full bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm'>
        <div className='flex items-center gap-4 mb-6'>
          <div className='w-16 h-16 relative flex-shrink-0 overflow-hidden rounded-lg bg-gray-100'>
            {displayImage && (
              <Image
                src={displayImage}
                alt={resourceName}
                fill
                className='object-cover'
              />
            )}
          </div>
          <div className='flex-1'>
            <h3 className='font-bold text-lg text-gray-900'>{resourceName}</h3>
            <p className='text-sm text-gray-500'>{universityName}</p>
            <p className='text-xs text-gray-500 font-medium mt-1'>
              Price: ₹{pricePerSlot} / Hour
            </p>
          </div>
        </div>

        <div className='mb-6'>
          <Table
            dataSource={bookingDates.map((booking, index) => {
              const days =
                dayjs(booking.bookingEndDate).diff(
                  dayjs(booking.bookingStartDate),
                  'day'
                ) + 1;
              const startDateTime = dayjs(`2000-01-01T${booking.startTime}`);
              const endDateTime = dayjs(`2000-01-01T${booking.endTime}`);
              const hoursPerDay = endDateTime.diff(startDateTime, 'hour', true);
              const totalHours = Math.ceil(days * hoursPerDay);
              const bookingCost = totalHours * pricePerSlot;

              return {
                key: `${booking.bookingStartDate}-${index}`,
                booking,
                days,
                totalHours,
                bookingCost,
              };
            })}
            columns={[
              {
                title: 'Date',
                dataIndex: 'booking',
                key: 'date',
                render: (booking: BookingPayload['bookingDates'][0]) => {
                  const isRange =
                    booking.bookingStartDate !== booking.bookingEndDate;
                  return (
                    <div className='text-sm font-medium text-gray-900'>
                      {dayjs(booking.bookingStartDate).format(
                        'ddd, DD MMM YYYY'
                      )}
                      {isRange && (
                        <>
                          <span className='mx-1 text-gray-400'>-</span>
                          {dayjs(booking.bookingEndDate).format(
                            'ddd, DD MMM YYYY'
                          )}
                        </>
                      )}
                    </div>
                  );
                },
              },
              {
                title: 'Time Slot',
                dataIndex: 'booking',
                key: 'timeSlot',
                render: (booking: BookingPayload['bookingDates'][0]) => {
                  const formatTime = (time: string) =>
                    dayjs(`2000-01-01T${time}`).format('hh:mm A');
                  return (
                    <div className='text-sm text-gray-600 font-medium'>
                      {formatTime(booking.startTime)} -{' '}
                      {formatTime(booking.endTime)}
                    </div>
                  );
                },
              },
              {
                title: 'Hours',
                dataIndex: 'totalHours',
                key: 'hours',
                align: 'right' as const,
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
                align: 'right' as const,
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
            <span>₹ {total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className='w-full flex justify-end gap-3'>
        <Button onClick={onBack} className='h-10 px-6 rounded-lg font-semibold'>
          Back
        </Button>
        <Button
          type='primary'
          className='h-10 px-10 rounded-lg bg-[#1B56CC] hover:bg-[#1B56CC]/90 border-none font-semibold'
          onClick={onFinish}
          loading={loading}
          disabled={loading}
        >
          {loading ? 'Finishing...' : 'Finish'}
        </Button>
      </div>
    </div>
  );
};

export default BookingConfirmationStep;
