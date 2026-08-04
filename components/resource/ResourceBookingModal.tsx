import { useState } from 'react';
import { App, Modal } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { bookingsApi } from '@/lib/services/api/bookings.api';
import { BookingPayload, ResourceConfig } from '@/types';
import BookingPurposeStep from './BookingPurposeStep';
import BookingConfirmationStep from './BookingConfirmationStep';
import BookingDateStep, { BookingDate, SingleBooking } from './BookingDateStep';
import { DateRange } from 'react-day-picker';

interface ResourceBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  universityId: string;
  resourceId: string;
  resourceConfig: ResourceConfig[];
  resourceName?: string;
  resourceImage?: string;
  pricePerSlot?: number;
  maxDuration?: string;
  universityName?: string;
}

const ResourceBookingModal = ({
  isOpen,
  onClose,
  userId,
  universityId,
  resourceId,
  resourceConfig,
  resourceName,
  resourceImage,
  pricePerSlot,
  maxDuration,
  universityName,
}: ResourceBookingModalProps) => {
  const { message } = App.useApp();

  // --- STATE: Steps & Data ---
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [purpose, setPurpose] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

  // --- Date Step State ---
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const [rangeStartTime, setRangeStartTime] = useState<string | null>(null);
  const [rangeEndTime, setRangeEndTime] = useState<string | null>(null);
  const [singleDate, setSingleDate] = useState<string | null>(null);
  const [singleStartTime, setSingleStartTime] = useState<string | null>(null);
  const [singleEndTime, setSingleEndTime] = useState<string | null>(null);
  const [singleBookings, setSingleBookings] = useState<SingleBooking[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Stores the date/time structure calculated in Step 1 to be used in Step 2/3
  const [pendingBookingDates, setPendingBookingDates] = useState<
    BookingDate[] | null
  >(null);

  // --- MUTATION ---
  const saveMutation = useMutation({
    mutationFn: async ({ payload }: { payload: BookingPayload }) => {
      return bookingsApi.create(payload);
    },
    onSuccess: () => {
      message.success('Booking request sent successfully!');
      handleClose();
    },
    onError: (error) => {
      console.error('Failed to save booking:', error);
      message.error(error.message);
    },
  });

  // --- HANDLERS ---
  const handleClose = () => {
    setCurrentStep(1);
    setPendingBookingDates(null);
    setPurpose('');
    setTermsAccepted(false);

    // Reset Date Step State
    setSelectedRange(undefined);
    setRangeStartTime(null);
    setRangeEndTime(null);
    setSingleDate(null);
    setSingleStartTime(null);
    setSingleEndTime(null);
    setSingleBookings([]);
    setCurrentMonth(new Date());

    onClose();
  };

  const handleStep1Next = (dates: BookingDate[]) => {
    setPendingBookingDates(dates);
    setCurrentStep(2);
  };

  const handleStep2Next = (purposeVal: string) => {
    setCurrentStep(3);
    setPurpose(purposeVal);
  };

  const handleConfirmBooking = async () => {
    if (!pendingBookingDates) return;

    setLoading(true);
    try {
      const payload: BookingPayload = {
        userId,
        uniId: universityId,
        resourceId,
        bookingDates: pendingBookingDates,
        status: 'pending_review',
        purpose,
      };

      await saveMutation.mutateAsync({ payload });
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      centered
      width='90vw'
      style={{ maxWidth: 1200 }}
      destroyOnHidden
    >
      <div className='mt-6 rounded-xl p-4 relative min-h-[400px] flex flex-col md:px-8 px-0'>
        {currentStep === 1 && (
          <BookingDateStep
            resourceId={resourceId}
            resourceConfig={resourceConfig}
            onNext={handleStep1Next}
            selectedRange={selectedRange}
            setSelectedRange={setSelectedRange}
            rangeStartTime={rangeStartTime}
            setRangeStartTime={setRangeStartTime}
            rangeEndTime={rangeEndTime}
            setRangeEndTime={setRangeEndTime}
            singleDate={singleDate}
            setSingleDate={setSingleDate}
            singleStartTime={singleStartTime}
            setSingleStartTime={setSingleStartTime}
            singleEndTime={singleEndTime}
            setSingleEndTime={setSingleEndTime}
            singleBookings={singleBookings}
            setSingleBookings={setSingleBookings}
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            maxDuration={maxDuration}
          />
        )}
        {currentStep === 2 && (
          <BookingPurposeStep
            onBack={() => setCurrentStep(1)}
            onSubmit={handleStep2Next}
            loading={loading}
            purpose={purpose}
            setPurpose={setPurpose}
            termsAccepted={termsAccepted}
            setTermsAccepted={setTermsAccepted}
          />
        )}
        {currentStep === 3 && (
          <BookingConfirmationStep
            onFinish={handleConfirmBooking}
            onBack={() => setCurrentStep(2)}
            resourceName={resourceName}
            imageUrl={resourceImage}
            bookingDates={pendingBookingDates}
            pricePerSlot={pricePerSlot}
            universityName={universityName}
            loading={loading}
          />
        )}
      </div>
    </Modal>
  );
};

export default ResourceBookingModal;
