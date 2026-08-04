import { UniversityObject } from './university.types';

export type StatusType =
  | 'pending_review'
  | 'in_progress'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'awaiting_payment'
  | 'verification_pending';

export interface BookingResponse {
  id: string;
  userId: string;
  resourceId: string;
  startDate: string;
  endDate: string;
  status: StatusType;
  totalPrice?: number;
  type?: string;
  createdOn: string;
  updatedOn: string;
  user?: {
    id: string;
    firstName: string;
    lastName?: string;
    email: string;
  };
  resource?: {
    id: string;
    name: string;
    type?: string;
    universityId: string;
    price?: number;
    images?: string[] | string;
  };
  bookingDates?: Array<{
    bookingStartDate: string;
    startTime: string;
    endTime: string;
  }>;
  universityId?: string;
  uniId?: string;
  bookingAmount?: number;
  purpose?: string;
  university?: UniversityObject;
}

export interface PaginatedBookingsResponse {
  data: BookingResponse[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BookingPayload {
  userId: string;
  uniId: string;
  resourceId: string;
  bookingDates: Array<{
    bookingStartDate: string;
    bookingEndDate: string;
    startTime: string;
    endTime: string;
  }>;
  status: string;
  createdOn?: string;
  updatedOn?: string;
  cancellationReason?: string;
  purpose?: string;
}
