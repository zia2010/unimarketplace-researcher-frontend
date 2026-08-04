import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Col, Row, Spin, message } from 'antd';
import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useQuery } from '@tanstack/react-query';
import { resourcesApi } from '@/lib/services/api/resource.api';
import { ResourceConfig } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

dayjs.extend(customParseFormat);

export type BookingDate = {
  bookingStartDate: string;
  bookingEndDate: string;
  startTime: string;
  endTime: string;
};

interface BookingDateStepProps {
  resourceId: string;
  resourceConfig: ResourceConfig[];
  onNext: (dates: BookingDate[]) => void;
  selectedRange: DateRange | undefined;
  setSelectedRange: (range: DateRange | undefined) => void;
  rangeStartTime: string | null;
  setRangeStartTime: (time: string | null) => void;
  rangeEndTime: string | null;
  setRangeEndTime: (time: string | null) => void;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  maxDuration?: string;
  onAdvanced: (dates: BookingDate[]) => void;
  advancedCount: number;
  rangeQty: number;
  setRangeQty: React.Dispatch<React.SetStateAction<number>>;
  commonSlots: string[];
  setCommonSlots: (slots: string[]) => void;
  selectedSlot: string | null;
  setSelectedSlot: (slot: string | null) => void;
  lastFetchedFor: {
    resourceId: string;
    startDate: string;
    endDate: string | undefined;
    hours: number;
  } | null;
  setLastFetchedFor: (
    value: {
      resourceId: string;
      startDate: string;
      endDate: string | undefined;
      hours: number;
    } | null
  ) => void;
  lastValidatedKey: string | null;
  setLastValidatedKey: (key: string | null) => void;
  cachedInvalidDates: string[];
  setCachedInvalidDates: (dates: string[]) => void;
}

const BookingDateStep = ({
  resourceId,
  resourceConfig,
  onNext,
  selectedRange,
  setSelectedRange,
  rangeStartTime,
  setRangeStartTime,
  setRangeEndTime,
  currentMonth,
  setCurrentMonth,
  onAdvanced,
  advancedCount,
  rangeQty,
  setRangeQty,
  commonSlots,
  setCommonSlots,
  selectedSlot,
  setSelectedSlot,
  lastFetchedFor,
  setLastFetchedFor,
  lastValidatedKey,
  setLastValidatedKey,
  cachedInvalidDates,
  setCachedInvalidDates,
}: BookingDateStepProps) => {
  // --- VALIDATION STATE ---
  const [invalidDates, setInvalidDates] = useState<string[]>([]);
  const [validating, setValidating] = useState(false);

  // --- FETCH STATE (local; only true while request in flight) ---
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);

  const rangeKey =
    selectedRange?.from && selectedRange?.to
      ? `${dayjs(selectedRange.from).format('YYYY-MM-DD')}-${dayjs(selectedRange.to).format('YYYY-MM-DD')}`
      : selectedRange?.from
        ? dayjs(selectedRange.from).format('YYYY-MM-DD')
        : null;
  const prevRangeKeyRef = useRef<string | null>(null);

  // --- DEBOUNCED API CALL: only when date range (or resource) changes; skip if we already have data for this range ---
  useEffect(() => {
    if (!selectedRange?.from || !rangeQty) {
      setCommonSlots([]);
      setLastFetchedFor(null);
      setIsFetchingSlots(false);
      return;
    }

    const startDate = dayjs(selectedRange.from).format('YYYY-MM-DD');
    const endDate = selectedRange.to
      ? dayjs(selectedRange.to).format('YYYY-MM-DD')
      : undefined;
    const alreadyFetched =
      commonSlots.length > 0 &&
      lastFetchedFor &&
      lastFetchedFor.resourceId === resourceId &&
      lastFetchedFor.startDate === startDate &&
      lastFetchedFor.endDate === endDate &&
      lastFetchedFor.hours === rangeQty;

    if (alreadyFetched) {
      return;
    }

    setIsFetchingSlots(true);

    const fetchSlots = async () => {
      if (!selectedRange?.from || !rangeQty) {
        setCommonSlots([]);
        setLastFetchedFor(null);
        setIsFetchingSlots(false);
        return;
      }

      try {
        const response = await resourcesApi.getAvailableSlots({
          resourceId,
          startDate: dayjs(selectedRange.from).format('YYYY-MM-DD'),
          endDate: selectedRange.to
            ? dayjs(selectedRange.to).format('YYYY-MM-DD')
            : undefined,
          hours: rangeQty,
        });
        setCommonSlots(response.commonSlots || []);
        setLastFetchedFor({
          resourceId,
          startDate: dayjs(selectedRange.from).format('YYYY-MM-DD'),
          endDate: selectedRange.to
            ? dayjs(selectedRange.to).format('YYYY-MM-DD')
            : undefined,
          hours: rangeQty,
        });
      } catch (error) {
        console.error('Failed to fetch common slots:', error);
        message.error('Failed to fetch available slots');
        setCommonSlots([]);
        setLastFetchedFor(null);
      } finally {
        setIsFetchingSlots(false);
      }
    };

    const timer = setTimeout(() => {
      fetchSlots();
    }, 2000); // 2 second delay

    return () => clearTimeout(timer);
  }, [
    selectedRange,
    resourceId,
    rangeQty,
    commonSlots.length,
    lastFetchedFor,
    setCommonSlots,
    setLastFetchedFor,
  ]);

  // Reset slot selection only when date range *changes* (not on mount when coming back)
  useEffect(() => {
    const currentKey = rangeKey;
    const prevKey = prevRangeKeyRef.current;
    if (prevKey !== null && currentKey !== prevKey) {
      setSelectedSlot(null);
    }
    prevRangeKeyRef.current = currentKey;
  }, [rangeKey, setSelectedSlot]);

  useEffect(() => {
    // Sync rangeStartTime with selected common slot
    if (selectedSlot) {
      const startTime = selectedSlot.split('-')[0].trim();
      setRangeStartTime(startTime);
    } else {
      setRangeStartTime(null);
    }
  }, [selectedSlot, setRangeStartTime]);

  // Derived state or calculations
  const currentMonthRange = useMemo(
    () => ({
      from: dayjs(currentMonth).startOf('month').toDate(),
      to: dayjs(currentMonth).endOf('month').toDate(),
    }),
    [currentMonth]
  );

  // Wider range (prev + current + next month) for availability so outside days can be enabled when allowed
  const availabilityRange = useMemo(
    () => ({
      from: dayjs(currentMonth).add(-1, 'month').startOf('month').toDate(),
      to: dayjs(currentMonth).add(1, 'month').endOf('month').toDate(),
    }),
    [currentMonth]
  );

  // --- QUERIES ---
  const { data: availabileDates } = useQuery({
    queryKey: ['resourcesAvailability', resourceId, availabilityRange],
    queryFn: async () =>
      await resourcesApi.getResourceAvailability(
        resourceId,
        dayjs(availabilityRange.from).format('YYYY-MM-DD'),
        dayjs(availabilityRange.to).format('YYYY-MM-DD')
      ),
    staleTime: 5 * 60 * 1000, // 5 min: avoid refetch when returning to this step if range/date unchanged
  });

  const getMaxEndTime = useCallback((startTime: string | null, qty = 1) => {
    if (!startTime) return null;

    return dayjs(`2000-01-01 ${startTime}`).add(qty, 'hour').format('HH:mm');
  }, []);

  /** Open duration in whole hours for one day config (startTime → endTime). Returns 0 if closed or missing times. */
  const getOpenHoursForConfig = useCallback(
    (config: ResourceConfig): number => {
      if (!config.open || config.startTime == null || config.endTime == null)
        return 0;
      const start = dayjs(`2000-01-01 ${config.startTime}`, [
        'YYYY-MM-DD HH:mm',
        'YYYY-MM-DD HH:mm:ss',
      ]);
      const end = dayjs(`2000-01-01 ${config.endTime}`, [
        'YYYY-MM-DD HH:mm',
        'YYYY-MM-DD HH:mm:ss',
      ]);
      if (!start.isValid() || !end.isValid()) return 0;
      const diffHours = end.diff(start, 'hour', true);
      return diffHours > 0 ? Math.floor(diffHours) : 0;
    },
    []
  );

  /** Max duration (hours) allowed for the selected range = minimum open hours across all selected days. */
  const maxDurationHours = useMemo(() => {
    if (!selectedRange?.from || !selectedRange?.to) return undefined;
    const openHoursPerDay: number[] = [];
    let current = dayjs(selectedRange.from);
    const end = dayjs(selectedRange.to);
    while (current.isBefore(end) || current.isSame(end, 'day')) {
      const dayName = current.format('dddd');
      const config = resourceConfig.find(
        (c) => c.day.toLowerCase() === dayName.toLowerCase()
      );
      openHoursPerDay.push(config ? getOpenHoursForConfig(config) : 0);
      current = current.add(1, 'day');
    }
    const minOpenHours =
      openHoursPerDay.length > 0 ? Math.min(...openHoursPerDay) : 0;
    return Math.max(1, minOpenHours);
  }, [
    selectedRange?.from,
    selectedRange?.to,
    resourceConfig,
    getOpenHoursForConfig,
  ]);

  // Clamp rangeQty when max duration decreases (e.g. user changes range to days with shorter open hours)
  useEffect(() => {
    if (maxDurationHours == null) return;
    setRangeQty((prev) => Math.min(prev, maxDurationHours));
  }, [maxDurationHours, setRangeQty]);

  // Validate range daily availability (skip API calls when range/time/hours unchanged)
  const validationKey =
    selectedRange?.from && selectedRange?.to && rangeStartTime
      ? `${rangeKey}-${rangeStartTime}-${rangeQty}`
      : null;

  useEffect(() => {
    const validateRange = async () => {
      if (!selectedRange?.from || !selectedRange?.to || !rangeStartTime) {
        setInvalidDates([]);
        return;
      }

      const calculatedEndTime = getMaxEndTime(rangeStartTime, rangeQty);

      if (!calculatedEndTime) {
        setInvalidDates([]);
        return;
      }

      // Use cached validation result when range, time, and hours unchanged (e.g. returning to this step)
      if (validationKey && lastValidatedKey === validationKey) {
        setInvalidDates(cachedInvalidDates);
        return;
      }

      setValidating(true);
      const conflicts: string[] = [];
      let current = dayjs(selectedRange.from);
      const end = dayjs(selectedRange.to);
      const fullRangeDates: string[] = [];

      // Generate all dates in range
      while (current.isBefore(end) || current.isSame(end, 'day')) {
        fullRangeDates.push(current.format('YYYY-MM-DD'));
        current = current.add(1, 'day');
      }

      // Check each date
      await Promise.all(
        fullRangeDates.map(async (dateStr) => {
          try {
            const slots = await resourcesApi.getResourceTimeslot(
              resourceId,
              dateStr,
              dateStr
            );

            // Check if rangeStartTime exists in this day's available slots
            const isAvailable = slots.startTime?.some(
              (slot) => slot.value === rangeStartTime
            );

            const dayName = dayjs(dateStr).format('dddd');
            const config = resourceConfig.find(
              (c) => c.day.toLowerCase() === dayName.toLowerCase()
            );

            const isOpen = config?.open;
            if (!isAvailable || !isOpen) {
              conflicts.push(dateStr);
            }
          } catch (err) {
            console.error('Error validating date:', dateStr, err);
          }
        })
      );

      const sorted = conflicts.sort();
      setInvalidDates(sorted);
      if (validationKey) {
        setLastValidatedKey(validationKey);
        setCachedInvalidDates(sorted);
      }
      setValidating(false);
    };

    const timer = setTimeout(() => {
      validateRange();
    }, 500); // Debounce

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- use lastValidatedKey/cachedInvalidDates for cache skip only; avoid deps to prevent extra runs
  }, [
    selectedRange,
    rangeStartTime,
    rangeQty,
    resourceId,
    resourceConfig,
    getMaxEndTime,
  ]);

  // --- HANDLERS ---
  const handleRangeSelect = (range: DateRange | undefined) => {
    // If the user clicks the same date or clears the selection,
    // react-day-picker might return undefined.
    // By setting it directly, we ensure the UI stays responsive.
    setSelectedRange(range);

    // Only reset times if we have a start date to avoid UI flickering
    if (range?.from) {
      setRangeStartTime(null);
      setRangeEndTime(null);
      setSelectedSlot(null);
    }
  };

  const getDisabledDates = useCallback(() => {
    const disabled = new Set<string>();
    const today = dayjs();
    const monthStart = dayjs(currentMonthRange.from);
    const monthEnd = dayjs(currentMonthRange.to);

    for (
      let date = monthStart;
      date.isBefore(today) || date.isSame(today);
      date = date.add(1, 'day')
    ) {
      disabled.add(date.format('YYYY-MM-DD'));
    }

    if (availabileDates?.availableDates) {
      const availableSet = new Set(availabileDates.availableDates);
      for (
        let date = monthStart;
        date.isBefore(monthEnd) || date.isSame(monthEnd);
        date = date.add(1, 'day')
      ) {
        const dateStr = date.format('YYYY-MM-DD');
        if (!availableSet.has(dateStr)) {
          disabled.add(dateStr);
        }
      }
    } else {
      for (
        let date = today.add(1, 'day');
        date.isBefore(monthEnd) || date.isSame(monthEnd);
        date = date.add(1, 'day')
      ) {
        disabled.add(date.format('YYYY-MM-DD'));
      }
    }

    return Array.from(disabled).map((dateStr) => dayjs(dateStr).toDate());
  }, [currentMonthRange, availabileDates]);

  const getFullyBookedDates = useCallback(() => {
    if (!availabileDates?.availableDates) return [];

    const fullyBooked = new Set<Date>();
    const monthStart = dayjs(currentMonthRange.from);
    const monthEnd = dayjs(currentMonthRange.to);
    const availableSet = new Set(availabileDates.availableDates);
    const today = dayjs();

    for (
      let date = monthStart;
      date.isBefore(monthEnd) || date.isSame(monthEnd);
      date = date.add(1, 'day')
    ) {
      const dateStr = date.format('YYYY-MM-DD');
      const dayName = date.format('dddd');

      const config = resourceConfig.find(
        (c) => c.day.toLowerCase() === dayName.toLowerCase()
      );
      const isOpen = config?.open ?? false;
      const isNotAvailable = !availableSet.has(dateStr);
      // We only care about future/today dates for this visual
      const isFutureOrToday =
        date.isSame(today, 'day') || date.isAfter(today, 'day');

      if (isOpen && isFutureOrToday && isNotAvailable) {
        fullyBooked.add(date.toDate());
      }
    }
    return Array.from(fullyBooked);
  }, [currentMonthRange, availabileDates, resourceConfig]);

  const disabledDates = useMemo(() => getDisabledDates(), [getDisabledDates]);
  const fullyBookedDates = useMemo(
    () => getFullyBookedDates(),
    [getFullyBookedDates]
  );

  const formatTime = (time?: string) => {
    if (!time) return '';

    if (time.includes('AM') || time.includes('PM')) {
      return time;
    }

    return dayjs(time, ['HH:mm:ss', 'HH:mm']).format('hh:mm A');
  };

  const isRangeComplete = selectedRange?.from && selectedRange?.to;
  const isMultiDayRange =
    isRangeComplete &&
    selectedRange?.from &&
    selectedRange?.to &&
    !dayjs(selectedRange.from).isSame(selectedRange.to, 'day');
  // Allow proceeding if user has selected a slot OR has advanced bookings
  const hasValidBookingData =
    (rangeStartTime && rangeQty > 0) || advancedCount > 0;

  // --- NAVIGATION & SUBMISSION ---

  const handleStep1Submit = () => {
    const finalBookings = getCalculatedDates();

    if (finalBookings.length === 0 && advancedCount === 0) {
      message.error('Please select at least one booking');
      return;
    }

    onNext(finalBookings);
  };

  const handleMonthChange = (month: Date) => {
    setCurrentMonth(month);
  };

  const getCalculatedDates = (): BookingDate[] => {
    const dailyBookings = new Map<
      string,
      { startTime: string; endTime: string }
    >();

    if (rangeStartTime && selectedRange?.from && selectedRange?.to) {
      const calculatedEndTime = getMaxEndTime(rangeStartTime, rangeQty);

      if (!calculatedEndTime) {
        return [];
      }
      let current = dayjs(selectedRange.from);
      const end = dayjs(selectedRange.to);

      while (current.isBefore(end) || current.isSame(end, 'day')) {
        dailyBookings.set(current.format('YYYY-MM-DD'), {
          startTime: rangeStartTime,
          endTime: calculatedEndTime!,
        });
        current = current.add(1, 'day');
      }
    }

    const sortedDates = Array.from(dailyBookings.keys()).sort();
    const finalBookings: BookingDate[] = [];

    if (sortedDates.length === 0) return [];

    let tempStart = sortedDates[0];
    let tempEnd = sortedDates[0];
    let tempTime = dailyBookings.get(tempStart)!;

    for (let i = 1; i < sortedDates.length; i++) {
      const date = sortedDates[i];
      const info = dailyBookings.get(date)!;
      const prevDate = sortedDates[i - 1];

      const isConsecutive = dayjs(date).diff(dayjs(prevDate), 'day') === 1;
      const isSameTime =
        info.startTime === tempTime.startTime &&
        info.endTime === tempTime.endTime;

      if (isConsecutive && isSameTime) {
        tempEnd = date;
      } else {
        finalBookings.push({
          bookingStartDate: tempStart,
          bookingEndDate: tempEnd,
          startTime: tempTime.startTime,
          endTime: tempTime.endTime,
        });
        tempStart = date;
        tempEnd = date;
        tempTime = info;
      }
    }

    finalBookings.push({
      bookingStartDate: tempStart,
      bookingEndDate: tempEnd,
      startTime: tempTime.startTime,
      endTime: tempTime.endTime,
    });

    return finalBookings;
  };

  // When opening Advanced without a slot selected, still pass the date range (one row per day) so slots get fetched
  const getDateRangeAsBookings = (): BookingDate[] => {
    if (!selectedRange?.from || !selectedRange?.to) return [];
    const result: BookingDate[] = [];
    let current = dayjs(selectedRange.from);
    const end = dayjs(selectedRange.to);
    while (current.isBefore(end) || current.isSame(end, 'day')) {
      const dateStr = current.format('YYYY-MM-DD');
      result.push({
        bookingStartDate: dateStr,
        bookingEndDate: dateStr,
        startTime: '',
        endTime: '',
      });
      current = current.add(1, 'day');
    }
    return result;
  };

  const handleOpenAdvanced = (e: React.MouseEvent) => {
    e.preventDefault();
    const currentResults = getCalculatedDates();
    // If no slot selected yet, pass date range so Advanced step can fetch and show slots
    onAdvanced(
      currentResults.length > 0 ? currentResults : getDateRangeAsBookings()
    );
  };

  return (
    <div className='flex flex-col'>
      <style>{`
        .rdp-day_button:not(:disabled) {
          font-weight: 700 !important;
        }
      `}</style>
      <Row gutter={[24, 24]}>
        <Col
          xs={24}
          sm={24}
          md={12}
          lg={12}
          className='flex flex-col items-center justify-center'
        >
          <h3 className='font-bold text-2xl text-center mb-4'>
            Choose your dates
          </h3>
          <DayPicker
            captionLayout='label'
            mode='range'
            navLayout='around'
            showOutsideDays
            month={currentMonth}
            onMonthChange={handleMonthChange}
            selected={selectedRange}
            onSelect={handleRangeSelect}
            disabled={[
              disabledDates,
              { before: new Date() },
              (date: Date) => {
                const d = dayjs(date);
                const isOutsideMonth =
                  d.month() !== dayjs(currentMonth).month() ||
                  d.year() !== dayjs(currentMonth).year();
                if (!isOutsideMonth) return false;
                // Outside current month: only allow if date is in available set
                const dateStr = d.format('YYYY-MM-DD');
                const availableSet = availabileDates?.availableDates
                  ? new Set(availabileDates.availableDates)
                  : null;
                if (!availableSet) return true; // no data → disable outside days
                return !availableSet.has(dateStr);
              },
            ]}
            modifiers={{
              fullyBooked: fullyBookedDates,
            }}
            required
            modifiersClassNames={{
              fullyBooked: 'line-through text-red-500 decoration-red-500',
            }}
            excludeDisabled
          />
          <div className='mt-4 w-full'>
            <div className='p-6 bg-gray-50 border border-gray-100 rounded-[20px]'>
              <h3 className='text-gray-900 text-sm font-semibold mb-4'>
                Lab Hours
              </h3>
              <div className='space-y-2'>
                {resourceConfig.map((config) => {
                  return (
                    <div
                      key={config.day}
                      className='flex justify-between text-[14px] truncate'
                    >
                      <span className='text-gray-600 capitalize font-medium'>
                        {config.day}
                      </span>
                      <span
                        className={
                          config.open
                            ? 'text-gray-900 font-medium'
                            : 'text-red-500 font-medium'
                        }
                      >
                        {config.open
                          ? `${formatTime(config.startTime)} to ${formatTime(
                              config.endTime
                            )}`
                          : 'Closed'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Col>

        <Col
          xs={24}
          sm={24}
          md={12}
          lg={12}
          className='flex flex-col items-center'
        >
          <h3 className='font-bold text-2xl text-center mb-6'>
            Select time slots
          </h3>

          <div className='w-full border border-[#EEF0FE] mb-6 rounded-2xl px-2 py-4 md:p-6 space-y-6 bg-white'>
            <div className='space-y-4'>
              {isRangeComplete && (
                <div className='pt-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg'>
                  <p className='font-medium'>Selected Range:</p>
                  <p>
                    {dayjs(selectedRange.from!).format('MMM DD, YYYY')} -{' '}
                    {dayjs(selectedRange.to!).format('MMM DD, YYYY')}
                  </p>
                </div>
              )}

              <div className='flex items-center justify-between'>
                <label className='text-sm font-medium text-gray-700'>
                  Duration (Hours)
                </label>

                <div className='flex items-center gap-4'>
                  <Button
                    onClick={() => setRangeQty((prev) => Math.max(1, prev - 1))}
                    disabled={!isRangeComplete}
                  >
                    -
                  </Button>

                  <span className='font-semibold text-lg w-8 text-center'>
                    {rangeQty}
                  </span>

                  <Button
                    onClick={() => {
                      setRangeQty((prev) =>
                        Math.min(prev + 1, maxDurationHours ?? prev + 1)
                      );
                    }}
                    disabled={
                      !isRangeComplete ||
                      (maxDurationHours != null && rangeQty >= maxDurationHours)
                    }
                  >
                    +
                  </Button>
                </div>
              </div>
              {isRangeComplete && maxDurationHours != null && (
                <p className='text-xs text-gray-500'>
                  Max {maxDurationHours} hour
                  {maxDurationHours !== 1 ? 's' : ''} for this range (by lab
                  hours)
                </p>
              )}
            </div>
          </div>

          <div className='w-full border border-[#EEF0FE] rounded-2xl px-4 py-6 bg-white'>
            <h4 className='font-bold text-lg mb-4'>Available Slots</h4>
            {isFetchingSlots ? (
              <div className='flex justify-center items-center py-10'>
                <Spin size='small' />
              </div>
            ) : commonSlots.length > 0 ? (
              <div className='grid grid-cols-2 gap-3 max-h-[220px] min-h-[120px] overflow-y-auto overflow-x-hidden available-slots-scroll'>
                <style>{`
                  .available-slots-scroll { scrollbar-gutter: stable; }
                  .available-slots-scroll::-webkit-scrollbar { width: 6px; }
                  .available-slots-scroll::-webkit-scrollbar-track { background: transparent; }
                  .available-slots-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 3px; }
                `}</style>
                <AnimatePresence>
                  {commonSlots.map((slot) => (
                    <motion.button
                      key={slot}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: selectedSlot === slot ? 1.05 : 1,
                      }}
                      whileHover={{
                        scale: selectedSlot === slot ? 1.05 : 1.02,
                      }}
                      whileTap={{ scale: 0.98 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 25,
                      }}
                      className={`h-11 rounded-xl px-4 flex items-center justify-center font-medium transition-colors cursor-pointer shrink-0 ${
                        selectedSlot === slot
                          ? 'bg-[#1B56CC] text-white! border-none ring-2 ring-offset-2 ring-[#1B56CC] shadow-md'
                          : 'bg-white border border-[#EEF0FE] text-gray-600 hover:border-[#1B56CC] hover:text-[#1B56CC]'
                      }`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot}
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className='text-center py-10 text-gray-400 min-h-[120px]'>
                {isRangeComplete
                  ? 'No common slots available for this duration.'
                  : 'Please select a date range first.'}
              </div>
            )}
          </div>

          {isMultiDayRange && selectedRange?.from && !isFetchingSlots && (
            <div className='flex items-center justify-between px-1 mt-3'>
              <a
                href='#'
                className='text-xs text-[#1B56CC] underline font-medium'
                onClick={handleOpenAdvanced}
              >
                Advanced booking
              </a>
              {advancedCount > 0 && (
                <div className='flex items-center gap-1.5 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 animate-pulse'>
                  <div className='w-1.5 h-1.5 bg-blue-500 rounded-full' />
                  <span className='text-[10px] text-blue-600 font-bold uppercase tracking-wider'>
                    {advancedCount} Active selections
                  </span>
                </div>
              )}
            </div>
          )}
        </Col>
      </Row>

      <div className='flex justify-end mt-8'>
        <Button
          type='primary'
          className='bg-[#1B56CC] hover:bg-[#1B56CC]/90 h-10 px-8 rounded-lg font-semibold'
          onClick={handleStep1Submit}
          disabled={
            !hasValidBookingData || invalidDates.length > 0 || validating
          }
        >
          {validating ? 'Verifying...' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default BookingDateStep;
