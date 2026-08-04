import { useState, useEffect } from 'react';
import { App, Modal } from 'antd';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { bookingsApi } from '@/lib/services/api/bookings.api';
import { resourcesApi } from '@/lib/services/api/resource.api';
import {
  AvailableSlotsResponse,
  BookingPayload,
  ResourceConfig,
} from '@/types';
import BookingPurposeStep from '@/components/resource/BookingPurposeStep';
import BookingConfirmationStep from '@/components/resource/BookingConfirmationStep';
import BookingDateStep, { BookingDate } from './BookingDateStep';
import { DateRange } from 'react-day-picker';
import AdvancedBookingStep from './AdvancedBookingStep';

interface BookingModalProps {
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

const BookingModal = ({
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
}: BookingModalProps) => {
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
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Stores the date/time structure calculated in Step 1 to be used in Step 2/3
  const [pendingBookingDates, setPendingBookingDates] = useState<BookingDate[]>(
    []
  );

  // Persist across step navigation (e.g. Back from Advanced): hours, common slots, selected slot
  const [rangeQty, setRangeQty] = useState<number>(1);
  const [commonSlots, setCommonSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [lastFetchedFor, setLastFetchedFor] = useState<{
    resourceId: string;
    startDate: string;
    endDate: string | undefined;
    hours: number;
  } | null>(null);
  const [lastValidatedKey, setLastValidatedKey] = useState<string | null>(null);
  const [cachedInvalidDates, setCachedInvalidDates] = useState<string[]>([]);

  // Available slots for Advanced step (fetched when on step 1.5)
  const [availableSlotsData, setAvailableSlotsData] =
    useState<AvailableSlotsResponse | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Fetch available slots when on Advanced step so we can pass to AdvancedBookingStep
  useEffect(() => {
    if (
      currentStep !== 1.5 ||
      pendingBookingDates.length === 0 ||
      !resourceId
    ) {
      setAvailableSlotsData(null);
      return;
    }

    const fetchSlots = async () => {
      const uniqueDates = Array.from(
        new Set(
          pendingBookingDates.flatMap((b) => {
            const dates: string[] = [];
            let current = dayjs(b.bookingStartDate);
            const end = dayjs(b.bookingEndDate);
            while (current.isBefore(end) || current.isSame(end, 'day')) {
              dates.push(current.format('YYYY-MM-DD'));
              current = current.add(1, 'day');
            }
            return dates;
          })
        )
      );
      const sorted = [...uniqueDates].sort();
      const startDate = sorted[0];
      const lastDate = sorted[sorted.length - 1];
      // Some backends treat endDate as exclusive; request through next day so last day is included
      const endDate = dayjs(lastDate).add(1, 'day').format('YYYY-MM-DD');

      setLoadingSlots(true);
      try {
        const res = await resourcesApi.getAvailableSlots({
          resourceId,
          startDate,
          endDate,
          hours: 1,
        });
        setAvailableSlotsData(res);
      } catch (error) {
        console.error('Failed to fetch available slots:', error);
        setAvailableSlotsData(null);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [currentStep, resourceId, pendingBookingDates]);

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
    setPendingBookingDates([]);
    setPurpose('');
    setTermsAccepted(false);

    // Reset Date Step State
    setSelectedRange(undefined);
    setRangeStartTime(null);
    setRangeEndTime(null);
    setCurrentMonth(new Date());
    setRangeQty(1);
    setCommonSlots([]);
    setSelectedSlot(null);
    setLastFetchedFor(null);
    setLastValidatedKey(null);
    setCachedInvalidDates([]);
    setAvailableSlotsData(null);

    onClose();
  };

  const getDateRangeKey = (bookings: BookingDate[]) => {
    if (!bookings.length) return null;
    const unique = Array.from(
      new Set(
        bookings.flatMap((b) => {
          const dates: string[] = [];
          let current = dayjs(b.bookingStartDate);
          const end = dayjs(b.bookingEndDate);
          while (current.isBefore(end) || current.isSame(end, 'day')) {
            dates.push(current.format('YYYY-MM-DD'));
            current = current.add(1, 'day');
          }
          return dates;
        })
      )
    );
    return [...unique].sort().join('|');
  };

  const handleStep1Next = (dates: BookingDate[]) => {
    setPendingBookingDates(dates);
    setCurrentStep(2);
  };

  const handleOpenAdvanced = (dates: BookingDate[]) => {
    const incomingRange = getDateRangeKey(dates);
    const currentRange = getDateRangeKey(pendingBookingDates);
    if (
      incomingRange &&
      currentRange === incomingRange &&
      pendingBookingDates.length > 0
    ) {
      setCurrentStep(1.5);
      return;
    }
    setPendingBookingDates(dates);
    setCurrentStep(1.5);
  };

  const handleStep2Next = (purposeVal: string) => {
    setCurrentStep(3);
    setPurpose(purposeVal);
  };

  const handleConfirmBooking = async () => {
    if (pendingBookingDates.length === 0) return;

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
            onAdvanced={handleOpenAdvanced}
            advancedCount={pendingBookingDates.length}
            selectedRange={selectedRange}
            setSelectedRange={setSelectedRange}
            rangeStartTime={rangeStartTime}
            setRangeStartTime={setRangeStartTime}
            rangeEndTime={rangeEndTime}
            setRangeEndTime={setRangeEndTime}
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            maxDuration={maxDuration}
            rangeQty={rangeQty}
            setRangeQty={setRangeQty}
            commonSlots={commonSlots}
            setCommonSlots={setCommonSlots}
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
            lastFetchedFor={lastFetchedFor}
            setLastFetchedFor={setLastFetchedFor}
            lastValidatedKey={lastValidatedKey}
            setLastValidatedKey={setLastValidatedKey}
            cachedInvalidDates={cachedInvalidDates}
            setCachedInvalidDates={setCachedInvalidDates}
          />
        )}
        {currentStep === 1.5 && (
          <AdvancedBookingStep
            bookings={pendingBookingDates}
            setBookings={setPendingBookingDates}
            availableSlotsData={availableSlotsData}
            loadingSlots={loadingSlots}
            onBack={() => setCurrentStep(1)}
            onNext={() => setCurrentStep(2)}
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

export default BookingModal;
