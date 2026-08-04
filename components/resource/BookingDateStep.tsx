import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Col, Row, Select, message } from 'antd';
import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useQuery } from '@tanstack/react-query';
import { resourcesApi } from '@/lib/services/api/resource.api';
import { ResourceConfig } from '@/types';

dayjs.extend(customParseFormat);

export interface SingleBooking {
  date: string;
  startTime: string;
  endTime: string;
}

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
  singleDate: string | null;
  setSingleDate: (date: string | null) => void;
  singleStartTime: string | null;
  setSingleStartTime: (time: string | null) => void;
  singleEndTime: string | null;
  setSingleEndTime: (time: string | null) => void;
  singleBookings: SingleBooking[];
  setSingleBookings: React.Dispatch<React.SetStateAction<SingleBooking[]>>;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  maxDuration?: string;
}

const timeOptions = [
  { value: '06:00', label: '06:00 AM' },
  { value: '07:00', label: '07:00 AM' },
  { value: '08:00', label: '08:00 AM' },
  { value: '09:00', label: '09:00 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '11:00', label: '11:00 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '13:00', label: '01:00 PM' },
  { value: '14:00', label: '02:00 PM' },
  { value: '15:00', label: '03:00 PM' },
  { value: '16:00', label: '04:00 PM' },
  { value: '17:00', label: '05:00 PM' },
  { value: '18:00', label: '06:00 PM' },
];

const BookingDateStep = ({
  resourceId,
  resourceConfig,
  onNext,
  selectedRange,
  setSelectedRange,
  rangeStartTime,
  setRangeStartTime,
  setRangeEndTime,
  singleDate,
  setSingleDate,
  singleStartTime,
  setSingleStartTime,
  setSingleEndTime,
  singleBookings,
  setSingleBookings,
  currentMonth,
  setCurrentMonth,
  maxDuration,
}: BookingDateStepProps) => {
  const [rangeQty, setRangeQty] = useState<number>(1);
  const [singleQty, setSingleQty] = useState<number>(1);

  // --- VALIDATION STATE ---
  const [invalidDates, setInvalidDates] = useState<string[]>([]);
  const [validating, setValidating] = useState(false);

  // Derived state or calculations
  const currentMonthRange = useMemo(
    () => ({
      from: dayjs(currentMonth).startOf('month').toDate(),
      to: dayjs(currentMonth).endOf('month').toDate(),
    }),
    [currentMonth]
  );

  // --- QUERIES ---
  const { data: availabileDates } = useQuery({
    queryKey: ['resourcesAvailability', resourceId, currentMonthRange],
    queryFn: async () =>
      await resourcesApi.getResourceAvailability(
        resourceId,
        dayjs(currentMonthRange.from).format('YYYY-MM-DD'),
        dayjs(currentMonthRange.to).format('YYYY-MM-DD')
      ),
  });

  const { data: availabileSlots } = useQuery({
    queryKey: [
      'resourcesTimeSlot',
      resourceId,
      selectedRange?.from,
      selectedRange?.to,
      singleDate,
    ],
    queryFn: async () => {
      if (selectedRange) {
        return await resourcesApi.getResourceTimeslot(
          resourceId,
          dayjs(selectedRange.from).format('YYYY-MM-DD'),
          dayjs(selectedRange.to).format('YYYY-MM-DD')
        );
      } else if (singleDate) {
        return await resourcesApi.getResourceTimeslot(
          resourceId,
          dayjs(singleDate).format('YYYY-MM-DD'),
          dayjs(singleDate).format('YYYY-MM-DD')
        );
      }
      return null;
    },
    enabled: !!(selectedRange || singleDate),
  });

  const getMaxEndTime = useCallback((startTime: string | null, qty = 1) => {
    if (!startTime) return null;

    return dayjs(`2000-01-01 ${startTime}`).add(qty, 'hour').format('HH:mm');
  }, []);

  // Validate range daily availability
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
          // Skip if overriden by single booking
          const isOverridden = singleBookings.some(
            (b) => dayjs(b.date).format('YYYY-MM-DD') === dateStr
          );
          if (isOverridden) return;

          try {
            const slots = await resourcesApi.getResourceTimeslot(
              resourceId,
              dateStr,
              dateStr
            );

            // Check if rangeStartTime exists in this day's available slots
            // Corrected property access: slots is TimeSlotsData
            const isAvailable = slots.startTime?.some(
              (slot) => slot.value === rangeStartTime
            );

            // Also check operating hours (config)
            const dayName = dayjs(dateStr).format('dddd');
            const config = resourceConfig.find(
              (c) => c.day.toLowerCase() === dayName.toLowerCase()
            );

            const isOpen = config?.open;
            // Logic: If plain unavailable or closed, mark invalid
            if (!isAvailable || !isOpen) {
              conflicts.push(dateStr);
            }
          } catch (err) {
            console.error('Error validating date:', dateStr, err);
          }
        })
      );

      setInvalidDates(conflicts.sort());
      setValidating(false);
    };

    const timer = setTimeout(() => {
      validateRange();
    }, 500); // Debounce

    return () => clearTimeout(timer);
  }, [
    selectedRange,
    rangeStartTime,
    rangeQty,
    singleBookings,
    resourceId,
    resourceConfig,
  ]);

  // --- HANDLERS ---
  // const handleRangeSelect = (range: DateRange | undefined) => {
  //   setSelectedRange(range);
  //   setRangeStartTime(null);
  //   setRangeEndTime(null);
  //   setSingleDate(null);
  //   setSingleStartTime(null);
  //   setSingleEndTime(null);
  // };
  const handleRangeSelect = (range: DateRange | undefined) => {
    // If the user clicks the same date or clears the selection,
    // react-day-picker might return undefined.
    // By setting it directly, we ensure the UI stays responsive.
    setSelectedRange(range);

    // Only reset times if we have a start date to avoid UI flickering
    if (range?.from) {
      setRangeStartTime(null);
      setRangeEndTime(null);
      setSingleDate(null);
      setSingleStartTime(null);
      setSingleEndTime(null);
    }
  };

  const addSingleBooking = () => {
    if (singleDate && singleStartTime) {
      const calculatedEndTime = getMaxEndTime(singleStartTime, singleQty);

      if (!calculatedEndTime) {
        message.error('Invalid duration selected');
        return;
      }

      setSingleBookings((prev) => [
        ...prev,
        {
          date: singleDate,
          startTime: singleStartTime,
          endTime: calculatedEndTime!,
        },
      ]);

      setSingleDate(null);
      setSingleStartTime(null);
      setSingleQty(1);
    }
  };

  const removeSingleBooking = (index: number) => {
    setSingleBookings((prev) => prev.filter((_, i) => i !== index));
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

  const generateTimeOptionsFromConfig = useCallback(
    (dateStr: string | Date | null | undefined) => {
      if (!dateStr) return timeOptions; // Fallback to static options

      const dayName = dayjs(dateStr).format('dddd');
      const config = resourceConfig.find(
        (c) => c.day.toLowerCase() === dayName.toLowerCase()
      );

      if (!config || !config.open) return [];

      const slots: { value: string; label: string }[] = [];
      let current = dayjs(`2000-01-01 ${config.startTime}`);
      const end = dayjs(`2000-01-01 ${config.endTime}`);

      while (current.isBefore(end) || current.isSame(end)) {
        const timeValue = current.format('HH:mm');
        const timeLabel = current.format('hh:mm A');

        slots.push({
          value: timeValue,
          label: timeLabel,
        });

        current = current.add(1, 'hour');
      }

      return slots;
    },
    [resourceConfig]
  );

  const disabledDates = useMemo(() => getDisabledDates(), [getDisabledDates]);
  const fullyBookedDates = useMemo(
    () => getFullyBookedDates(),
    [getFullyBookedDates]
  );

  const dateOptions = useMemo(() => {
    if (!selectedRange?.from || !selectedRange?.to) return [];
    const start = dayjs(selectedRange.from);
    const end = dayjs(selectedRange.to);
    const dates: Array<{ value: string; label: string; disabled?: boolean }> =
      [];

    const bookedDatesSet = new Set(
      singleBookings.map((booking) => dayjs(booking.date).format('YYYY-MM-DD'))
    );

    for (
      let date = start;
      date.isBefore(end) || date.isSame(end);
      date = date.add(1, 'day')
    ) {
      const dateStr = date.format('YYYY-MM-DD');
      const isAlreadyBooked = bookedDatesSet.has(dateStr);

      dates.push({
        value: dateStr,
        label: date.format('DD/MM/YYYY'),
        disabled: isAlreadyBooked,
      });
    }
    return dates;
  }, [selectedRange, singleBookings]);

  const formatTime = (time?: string) => {
    if (!time) return '';

    if (time.includes('AM') || time.includes('PM')) {
      return time;
    }

    return dayjs(time, ['HH:mm:ss', 'HH:mm']).format('hh:mm A');
  };

  const hasRangeSelected = selectedRange?.from && selectedRange?.to;
  const isRangeComplete = hasRangeSelected;
  const hasValidBookingData =
    (rangeStartTime && rangeQty > 0) || singleBookings.length > 0;

  // --- NAVIGATION & SUBMISSION ---

  const handleStep1Submit = () => {
    // We will use a map to handle overrides: Date -> BookingDetails
    const dailyBookings = new Map<
      string,
      { startTime: string; endTime: string }
    >();

    if (rangeStartTime && selectedRange?.from && selectedRange?.to) {
      const calculatedEndTime = getMaxEndTime(rangeStartTime, rangeQty);

      if (!calculatedEndTime) {
        message.error('Invalid range duration');
        return;
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

    // 2. Process Singles (Override Layer)
    singleBookings.forEach(({ date, startTime, endTime }) => {
      dailyBookings.set(dayjs(date).format('YYYY-MM-DD'), {
        startTime,
        endTime,
      });
    });

    // 2.5 Process Pending Single Booking (UX Fix: if user forgot to click + icon)
    if (singleDate && singleStartTime) {
      const calculatedEndTime = getMaxEndTime(singleStartTime, singleQty);

      if (!calculatedEndTime) {
        message.error('Invalid single duration');
        return;
      }

      dailyBookings.set(dayjs(singleDate).format('YYYY-MM-DD'), {
        startTime: singleStartTime,
        endTime: calculatedEndTime,
      });
    }

    // 3. Re-group into BookingDate[] components
    const sortedDates = Array.from(dailyBookings.keys()).sort();
    const finalBookings: BookingDate[] = [];

    if (sortedDates.length === 0) {
      onNext([]);
      return;
    }

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

    onNext(finalBookings);
  };

  const handleMonthChange = (month: Date) => {
    setCurrentMonth(month);
  };

  // const getClosingTimeForDate = useCallback(
  //   (dateStr: string | null) => {
  //     if (!dateStr) return null;
  //     const dayName = dayjs(dateStr).format('dddd');
  //     const config = resourceConfig.find(
  //       (c) => c.day.toLowerCase() === dayName.toLowerCase()
  //     );
  //     return config?.open ? config.endTime : null;
  //   },
  //   [resourceConfig]
  // );

  // const closingTime = useMemo(
  //   () => getClosingTimeForDate(singleDate),
  //   [singleDate, getClosingTimeForDate]
  // );

  const getMaxAllowedQty = useCallback(
    (startTime: string | null, dateStr: string | null) => {
      if (!startTime || !dateStr) return 1;

      const dayName = dayjs(dateStr).format('dddd');
      const config = resourceConfig.find(
        (c) => c.day.toLowerCase() === dayName.toLowerCase()
      );

      if (!config || !config.open) return 1;

      const closing = dayjs(`2000-01-01 ${config.endTime}`);
      const start = dayjs(`2000-01-01 ${startTime}`);

      const diffHours = closing.diff(start, 'hour');

      const maxFromDuration = maxDuration ? parseFloat(maxDuration) : diffHours;

      return Math.min(diffHours, maxFromDuration);
    },
    [resourceConfig, maxDuration]
  );

  const getProcessedOptions = useCallback(
    (
      baseOptions: typeof timeOptions,
      available: { value: string; label: string }[] | undefined,
      checkDate: Date | string | null | undefined,
      startTime?: string | null,
      maxEndTime?: string | null,
      closingTime?: string | null
    ) => {
      const dynamicOptions =
        available && available.length > 0
          ? available.map((opt) => ({
              value: opt.value,
              label: dayjs(`2000-01-01 ${opt.value}`).format('hh:mm A'),
            }))
          : generateTimeOptionsFromConfig(checkDate);

      const availableSet = new Set(available?.map((opt) => opt.value));

      // Find the first conflict AFTER the start time
      let firstConflictTime: string | null = null;
      if (startTime && available) {
        const sortedOptions = [...dynamicOptions].sort((a, b) =>
          a.value.localeCompare(b.value)
        );
        for (const opt of sortedOptions) {
          if (
            dayjs(`2000-01-01 ${opt.value}`).isAfter(
              dayjs(`2000-01-01 ${startTime}`)
            )
          ) {
            if (!availableSet.has(opt.value)) {
              firstConflictTime = opt.value;
              break;
            }
          }
        }
      }

      return dynamicOptions
        .filter((opt) => {
          if (checkDate) {
            const dayName = dayjs(checkDate).format('dddd');
            const config = resourceConfig.find(
              (c) => c.day.toLowerCase() === dayName.toLowerCase()
            );
            if (!config || !config.open) {
              return false;
            }
            const time = dayjs(`2000-01-01 ${opt.value}`);
            const start = dayjs(`2000-01-01 ${config.startTime}`);
            const end = dayjs(`2000-01-01 ${config.endTime}`);

            if (time.isBefore(start) || time.isAfter(end)) {
              return false;
            }
          }
          return true;
        })
        .map((opt) => {
          const isBooked = available && !availableSet.has(opt.value);
          const isAfterStart =
            !startTime ||
            dayjs(`2000-01-01 ${opt.value}`).isAfter(
              dayjs(`2000-01-01 ${startTime}`)
            );

          const isAfterFirstConflict =
            firstConflictTime &&
            dayjs(`2000-01-01 ${opt.value}`).isAfter(
              dayjs(`2000-01-01 ${firstConflictTime}`)
            );

          const isWithinMax =
            !maxEndTime ||
            !dayjs(`2000-01-01 ${opt.value}`).isAfter(
              dayjs(`2000-01-01 ${maxEndTime}`)
            );
          const isBeforeClose =
            !closingTime ||
            !dayjs(`2000-01-01 ${opt.value}`).isAfter(
              dayjs(`2000-01-01 ${closingTime}`)
            );

          const isLogicallyInvalid =
            !isAfterStart ||
            !isWithinMax ||
            !isBeforeClose ||
            !!isAfterFirstConflict;

          // Use the already-formatted label, don't reformat
          let label: React.ReactNode = opt.label;
          if (isBooked || isAfterFirstConflict) {
            label = (
              <span className='line-through text-gray-400'>{opt.label}</span>
            );
          }

          return {
            ...opt,
            disabled: isBooked || isLogicallyInvalid,
            label: label,
          };
        });
    },
    [resourceConfig, generateTimeOptionsFromConfig]
  );

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
            disabled={[disabledDates, { before: new Date() }]}
            modifiers={{
              fullyBooked: fullyBookedDates,
            }}
            required
            modifiersClassNames={{
              fullyBooked: 'line-through text-red-500 decoration-red-500',
            }}
            excludeDisabled
          />
          <div className='hidden lg:block w-full'>
            {singleBookings.length > 0 && (
              <div className='space-y-2 max-h-64 overflow-y-auto mt-4'>
                <p className='font-medium text-sm'>Added Bookings:</p>
                {singleBookings.map((booking, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-2 bg-gray-50 rounded-lg'
                  >
                    <span className='text-sm'>
                      {dayjs(booking.date).format('DD/MM')}{' '}
                      {formatTime(booking.startTime)}-
                      {formatTime(booking.endTime)}
                    </span>
                    <Button
                      size='small'
                      type='text'
                      danger
                      onClick={() => removeSingleBooking(index)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
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

              <div>
                <label className='text-sm font-medium text-gray-700 mb-1 block'>
                  From
                </label>
                <Select
                  className='w-full'
                  placeholder='Select start time'
                  size='middle'
                  value={rangeStartTime}
                  onChange={(val) => {
                    setRangeStartTime(val);
                    setRangeEndTime(null);
                  }}
                  disabled={!isRangeComplete}
                  options={getProcessedOptions(
                    [],
                    availabileSlots?.startTime,
                    selectedRange?.from
                  )}
                />
              </div>

              <div className='flex items-center justify-between mt-4'>
                <label className='text-sm font-medium text-gray-700'>
                  Duration (Hours)
                </label>

                <div className='flex items-center gap-4'>
                  <Button
                    onClick={() => setRangeQty((prev) => Math.max(1, prev - 1))}
                    disabled={!rangeStartTime}
                  >
                    -
                  </Button>

                  <span className='font-semibold text-lg w-8 text-center'>
                    {rangeQty}
                  </span>

                  <Button
                    onClick={() => {
                      const isSlotValid = availabileSlots?.endTime?.some(
                        (slot) =>
                          slot.value === getMaxEndTime(rangeStartTime, rangeQty)
                      );

                      if (!isSlotValid) {
                        message.warning('Maximum Booking limit reached');
                      }

                      const maxAllowed = getMaxAllowedQty(
                        rangeStartTime,
                        selectedRange?.from
                          ? dayjs(selectedRange.from).format('YYYY-MM-DD')
                          : null
                      );

                      if (rangeQty === maxAllowed) {
                        message.warning('Maximum Booking limit reached');
                      }

                      setRangeQty((prev) =>
                        Math.min(maxAllowed || 1, prev + 1)
                      );
                    }}
                    disabled={!rangeStartTime}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className='w-full border border-[#EEF0FE] rounded-2xl px-2 py-4 md:p-6 space-y-6 bg-white'>
            {invalidDates.length > 0 && (
              <div className='bg-red-50 border border-red-200 rounded-lg p-3 mb-4'>
                <p className='text-red-700 text-sm font-medium'>
                  Time slot already booked on the following dates:
                </p>
                <ul className='list-disc list-inside text-red-600 text-xs mt-1 space-y-1'>
                  {invalidDates.map((date) => (
                    <li key={date}>
                      {dayjs(date).format('MMM DD, YYYY')}
                      <span className='ml-1'>
                        (Choose another time for this date below)
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className='text-center text-sm text-gray-500'>
              Or choose different time slots for specific dates
            </p>

            <div className='space-y-4'>
              <div className='flex flex-col'>
                <label className='text-sm font-medium text-gray-700 mb-1'>
                  Date
                </label>
                <Select
                  className='w-full'
                  size='middle'
                  placeholder='Select a date'
                  value={singleDate}
                  onChange={(val) => {
                    setSingleDate(val);
                    setSingleStartTime(null);
                    setSingleEndTime(null);
                  }}
                  disabled={!isRangeComplete || dateOptions.length <= 1}
                  options={dateOptions}
                />
              </div>

              <div>
                <label className='text-sm font-medium text-gray-700 mb-1 block'>
                  From
                </label>
                <Select
                  className='w-full'
                  size='middle'
                  placeholder='Select start time'
                  value={singleStartTime}
                  onChange={(val) => {
                    setSingleStartTime(val);
                    setSingleQty(1);
                  }}
                  disabled={!singleDate}
                  options={getProcessedOptions(
                    [],
                    availabileSlots?.startTime,
                    singleDate
                  )}
                />
              </div>

              <div className='flex items-center justify-between mt-4'>
                <label className='text-sm font-medium text-gray-700'>
                  Duration (Hours)
                </label>

                <div className='flex items-center gap-4'>
                  <Button
                    onClick={() =>
                      setSingleQty((prev) => Math.max(1, prev - 1))
                    }
                    disabled={!singleStartTime}
                  >
                    -
                  </Button>

                  <span className='font-semibold text-lg w-8 text-center'>
                    {singleQty}
                  </span>

                  <Button
                    onClick={() => {
                      const maxAllowed = getMaxAllowedQty(
                        singleStartTime,
                        singleDate
                      );

                      if (singleQty === maxAllowed) {
                        message.warning('Maximum Booking limit reached');
                        return;
                      }

                      setSingleQty((prev) =>
                        Math.min(maxAllowed || 1, prev + 1)
                      );
                    }}
                    disabled={!singleStartTime}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>

            <Button
              type='primary'
              variant='solid'
              className='rounded-full px-6 h-9 w-full'
              disabled={!singleDate || !singleStartTime}
              onClick={addSingleBooking}
            >
              Add to List +
            </Button>
          </div>

          <div className='lg:hidden block'>
            {singleBookings.length > 0 && (
              <div className='space-y-2 max-h-64 overflow-y-auto mt-4'>
                <p className='font-medium text-sm'>Added Bookings:</p>
                {singleBookings.map((booking, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-2 bg-gray-50 rounded-lg'
                  >
                    <span className='text-sm'>
                      {dayjs(booking.date).format('DD/MM')}
                      {formatTime(booking.startTime)}-
                      {formatTime(booking.endTime)}
                    </span>
                    <Button
                      size='small'
                      type='text'
                      danger
                      onClick={() => removeSingleBooking(index)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
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
