// 'use client';

// import React, { useState, useCallback } from 'react';
// import { Calendar } from 'antd';
// import type { Dayjs } from 'dayjs';
// import dayjs from 'dayjs';
// import isBetween from 'dayjs/plugin/isBetween';
// import type { CalendarProps } from 'antd/es/calendar';
// import styles from './DateRangeSelector.module.css';

// dayjs.extend(isBetween);

// interface DateRangeSelectorProps {
//   disabledDates: string[];
//   onRangeChange?: (start: string | null, end: string | null) => void;
// }

// export default function DateRangeSelector({
//   disabledDates,
//   onRangeChange,
// }: DateRangeSelectorProps) {
//   const [startDate, setStartDate] = useState<string | null>(null);
//   const [endDate, setEndDate] = useState<string | null>(null);
//   const [hoveredDate, setHoveredDate] = useState<string | null>(null);

//   const disabledDatesSet = useCallback(
//     () => new Set(disabledDates),
//     [disabledDates]
//   );

//   const handleSelect = useCallback(
//     (date: Dayjs) => {
//       const dateStr = date.format('YYYY-MM-DD');

//       if (disabledDatesSet().has(dateStr)) return;

//       if (!startDate || (startDate && endDate)) {
//         setStartDate(dateStr);
//         setEndDate(null);
//         onRangeChange?.(dateStr, null);
//       } else if (startDate && !endDate) {
//         if (date.isAfter(startDate, 'day')) {
//           setEndDate(dateStr);
//           onRangeChange?.(startDate, dateStr);
//         } else {
//           setStartDate(dateStr);
//           onRangeChange?.(dateStr, null);
//         }
//       }
//     },
//     [startDate, endDate, onRangeChange, disabledDatesSet]
//   );

//   const isInRange = useCallback(
//     (date: Dayjs) => {
//       const dateStr = date.format('YYYY-MM-DD');

//       if (startDate && endDate) {
//         return date.isBetween(startDate, endDate, 'day', '[]');
//       }

//       if (startDate && hoveredDate) {
//         return date.isBetween(startDate, hoveredDate, 'day', '[]');
//       }

//       return false;
//     },
//     [startDate, endDate, hoveredDate]
//   );

//   const disabledDate = useCallback(
//     (date: Dayjs) => {
//       return disabledDatesSet().has(date.format('YYYY-MM-DD'));
//     },
//     [disabledDatesSet]
//   );

//   const cellRender: CalendarProps<Dayjs>['cellRender'] = useCallback(
//     (date, info) => {
//       if (info.type !== 'date') return info.originNode;

//       const dateStr = date.format('YYYY-MM-DD');
//       const isDisabled = disabledDate(date);
//       const inRange = isInRange(date);
//       const isStart = startDate === dateStr;
//       const isEnd = endDate === dateStr;

//       return (
//         <div
//           className={`
//             ${styles.calendarCell}
//             ${isDisabled ? styles.disabled : ''}
//             ${inRange ? styles.inRange : ''}
//             ${isStart ? styles.startDate : ''}
//             ${isEnd ? styles.endDate : ''}
//           `}
//           onMouseEnter={() => !isDisabled && setHoveredDate(dateStr)}
//           onMouseLeave={() => setHoveredDate(null)}
//           onClick={() => !isDisabled && handleSelect(date)}
//         >
//           {info.originNode}
//         </div>
//       );
//     },
//     [disabledDate, isInRange, startDate, endDate, handleSelect]
//   );

//   return (
//     <div className={styles.calendarWrapper}>
//       <Calendar fullscreen={false} cellRender={cellRender} />

//       <div className={styles.selectedRange}>
//         {startDate && (
//           <div className={styles.dateDisplay}>
//             <span>Start:</span>
//             <strong>{startDate}</strong>
//           </div>
//         )}
//         {endDate && (
//           <div className={styles.dateDisplay}>
//             <span>End:</span>
//             <strong>{endDate}</strong>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
