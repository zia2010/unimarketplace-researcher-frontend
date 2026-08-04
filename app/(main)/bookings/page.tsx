import BookingTable from '@/components/bookings/BookingTable';
import { App as AntdApp } from 'antd';

export default function BookingsPage() {
  return (
    <AntdApp>
      <BookingTable />
    </AntdApp>
  );
}
