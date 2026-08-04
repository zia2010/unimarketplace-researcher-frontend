import { Button, Table, Select, Alert } from 'antd';
import dayjs from 'dayjs';
import { BookingDate } from './BookingDateStep';
import { motion } from 'framer-motion';
import { useMemo, useState, useEffect, useCallback } from 'react';
import type { AvailableSlotsResponse } from '@/types';

/** Compare two HH:mm times. Returns true if a is strictly before b. */
function isTimeBefore(a: string, b: string): boolean {
  return a < b;
}

/** Two time ranges [start1,end1) and [start2,end2) overlap if start1 < end2 && end1 > start2. */
function timeRangesOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  return isTimeBefore(start1, end2) && isTimeBefore(start2, end1);
}

export type ExpandedDateRow = {
  date: string;
  startTime: string;
  endTime: string;
};

function expandBookingsToRows(bookings: BookingDate[]): ExpandedDateRow[] {
  const rows: ExpandedDateRow[] = [];
  for (const b of bookings) {
    let current = dayjs(b.bookingStartDate);
    const end = dayjs(b.bookingEndDate);
    while (current.isBefore(end) || current.isSame(end, 'day')) {
      rows.push({
        date: current.format('YYYY-MM-DD'),
        startTime: b.startTime,
        endTime: b.endTime,
      });
      current = current.add(1, 'day');
    }
  }
  return rows;
}

function rowsToBookings(rows: ExpandedDateRow[]): BookingDate[] {
  return rows.map((r) => ({
    bookingStartDate: r.date,
    bookingEndDate: r.date,
    startTime: r.startTime,
    endTime: r.endTime,
  }));
}

interface AdvancedBookingStepProps {
  bookings: BookingDate[];
  setBookings: (bookings: BookingDate[]) => void;
  availableSlotsData: AvailableSlotsResponse | null;
  loadingSlots?: boolean;
  onBack: () => void;
  onNext: () => void;
}

const AdvancedBookingStep = ({
  bookings,
  setBookings,
  availableSlotsData,
  loadingSlots = false,
  onBack,
  onNext,
}: AdvancedBookingStepProps) => {
  // One row per date: expand ranges so user can set different timings per date
  const [expandedRows, setExpandedRows] = useState<ExpandedDateRow[]>(() =>
    expandBookingsToRows(bookings)
  );

  useEffect(() => {
    setExpandedRows(expandBookingsToRows(bookings));
  }, [bookings]);

  // Build slots-by-date map (ranges like "08:00-09:00") from available-slots API (respects booked hours)
  const slotsByDate = useMemo(() => {
    if (!availableSlotsData?.availableSlots?.length) return {};
    const map: Record<string, string[]> = {};
    availableSlotsData.availableSlots.forEach((s) => {
      const dateKey = dayjs(s.date).format('YYYY-MM-DD');
      map[dateKey] = s.slots || [];
    });
    return map;
  }, [availableSlotsData]);

  // From slot ranges ("08:00-09:00", ...) get unique start times and end times for dropdowns
  const getStartAndEndTimes = (slots: string[]) => {
    const startSet = new Set<string>();
    const endSet = new Set<string>();
    slots.forEach((range) => {
      const [start = '', end = ''] = range.split('-').map((t) => t.trim());
      if (start) startSet.add(start);
      if (end) endSet.add(end);
    });
    return {
      startTimes: Array.from(startSet).sort(),
      endTimes: Array.from(endSet).sort(),
    };
  };

  /** End times that are strictly after startTime (only valid options for end dropdown). */
  const getValidEndTimes = useCallback(
    (slots: string[], startTime: string): string[] => {
      if (!startTime) return [];
      const { endTimes } = getStartAndEndTimes(slots);
      return endTimes.filter((t) => isTimeBefore(startTime, t));
    },
    []
  );

  // Clear endTime only when we have slot data and the current endTime is invalid (don't clear when slots not loaded yet, so preserved end times survive)
  useEffect(() => {
    let changed = false;
    const next = expandedRows.map((row) => {
      if (!row.startTime || !row.endTime) return row;
      const slots = slotsByDate[row.date] || [];
      if (slots.length === 0) return row;
      const validEnds = getValidEndTimes(slots, row.startTime);
      if (
        !validEnds.includes(row.endTime) ||
        !isTimeBefore(row.startTime, row.endTime)
      ) {
        changed = true;
        return { ...row, endTime: '' };
      }
      return row;
    });
    if (changed) {
      setExpandedRows(next);
      setBookings(rowsToBookings(next));
    }
  }, [expandedRows, slotsByDate, getValidEndTimes, setBookings]);

  // Rows that have overlapping bookings (same date, overlapping time range)
  const conflictRowIndices = useMemo(() => {
    const conflicting = new Set<number>();
    const rows = expandedRows;
    for (let i = 0; i < rows.length; i++) {
      const a = rows[i];
      if (!a.startTime || !a.endTime) continue;
      if (isTimeBefore(a.endTime, a.startTime) || a.endTime === a.startTime) {
        conflicting.add(i);
        continue;
      }
      for (let j = i + 1; j < rows.length; j++) {
        const b = rows[j];
        if (!b.startTime || !b.endTime) continue;
        if (a.date !== b.date) continue;
        if (timeRangesOverlap(a.startTime, a.endTime, b.startTime, b.endTime)) {
          conflicting.add(i);
          conflicting.add(j);
        }
      }
    }
    return conflicting;
  }, [expandedRows]);

  const updateRow = (
    index: number,
    field: keyof ExpandedDateRow,
    value: string
  ) => {
    const updated = [...expandedRows];
    const row = { ...updated[index], [field]: value };
    if (field === 'startTime') {
      row.endTime = '';
    } else if (
      field === 'endTime' &&
      row.startTime &&
      value &&
      !isTimeBefore(row.startTime, value)
    ) {
      row.endTime = '';
    }
    updated[index] = row;
    setExpandedRows(updated);
    setBookings(rowsToBookings(updated));
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => (
        <span className='font-medium text-gray-700'>
          {dayjs(date).format('MMM DD, YYYY')}
        </span>
      ),
    },
    {
      title: 'Start time',
      key: 'startTime',
      render: (_: unknown, record: ExpandedDateRow, index: number) => {
        const slots = slotsByDate[record.date] || [];
        const { startTimes } = getStartAndEndTimes(slots);
        return (
          <Select
            className='w-full min-w-[120px]'
            value={record.startTime || undefined}
            onChange={(val) => val && updateRow(index, 'startTime', val)}
            placeholder='Select time'
            options={startTimes.map((t) => ({ label: t, value: t }))}
          />
        );
      },
    },
    {
      title: 'End time',
      key: 'endTime',
      render: (_: unknown, record: ExpandedDateRow, index: number) => {
        const slots = slotsByDate[record.date] || [];
        const endOptions = record.startTime
          ? getValidEndTimes(slots, record.startTime)
          : [];
        return (
          <Select
            className='w-full min-w-[120px]'
            value={record.endTime || undefined}
            onChange={(val) => val && updateRow(index, 'endTime', val)}
            placeholder='Select time'
            options={endOptions.map((t) => ({ label: t, value: t }))}
            disabled={!record.startTime}
          />
        );
      },
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className='flex flex-col space-y-6'
    >
      <div className='flex items-center gap-4'>
        <h3 className='font-bold text-2xl'>Advanced Booking</h3>
      </div>

      {conflictRowIndices.size > 0 && (
        <Alert
          type='warning'
          showIcon
          message='Booking conflicts'
          description='Some bookings overlap on the same date or have end time before start time. Please adjust times so no two bookings on the same day overlap.'
          className='rounded-xl'
        />
      )}

      <div className='bg-white border border-[#EEF0FE] rounded-2xl overflow-hidden'>
        <Table
          dataSource={expandedRows.map((r, i) => ({ ...r, key: i }))}
          columns={columns}
          pagination={false}
          loading={loadingSlots}
          className='custom-table'
          locale={{ emptyText: 'No advanced bookings added yet' }}
          rowClassName={(_, index) =>
            conflictRowIndices.has(index) ? 'bg-red-50' : ''
          }
        />
      </div>

      <div className='flex justify-end gap-4 pt-4'>
        <Button onClick={onBack} className='h-10 px-8 rounded-lg'>
          Back
        </Button>
        <Button
          type='primary'
          className='bg-[#1B56CC] h-10 px-8 rounded-lg'
          onClick={onNext}
          disabled={expandedRows.length === 0 || conflictRowIndices.size > 0}
        >
          Next
        </Button>
      </div>
    </motion.div>
  );
};

export default AdvancedBookingStep;
