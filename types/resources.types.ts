import { UniversityObject } from './university.types';

export interface ResourcesData {
  key: string;
  name: string;
  type: string;
  timeSlotUnit: string;
  pricePerUnit: string;
  status: 'Listed' | 'Unlisted';
  description: string;
  image?: string;
  originalData?: ResourceResponse;
  university?: UniversityObject;
  isFavourite?: boolean;
}

export interface ResourceResponse {
  id: string;
  name: string;
  type: 'equipment' | 'service';
  manufacturer: string;
  description: string;
  guidelines: string;
  timelostUnit: 'hours' | 'minutes';
  duration: string;
  maxDuration: string;
  advanceBookingLimit: number;
  uniId: string;
  isListed: 'listed' | 'unlisted';
  tags: string[];
  images: string[];
  youtubeLinks?: string[];
  links?: string[];
  configs?: ResourceConfig[];
  cancellationWindow?: string;
  resourceConfig?: ResourceConfig[];
  createdAt: string;
  updatedAt: string;
  subscription?: string;
  price?: number;
  priceUnit?: string;
  discountCoupon?: string;
  faq?: string;
  accessGuidelines?: string;
  labHours?: Record<
    string,
    { isOpen: boolean; startTime?: string; endTime?: string }
  >;
  minBookingDuration?: string;
  maxBookingDuration?: string;
  timeSlotUnit?: string;
  freeCancellationWindow?: string;
  status?: 'listed' | 'unlisted';
  universityId?: string;
  university?: UniversityObject;
  isFavourite?: boolean;
}

export interface ResourceConfig {
  day: string;
  open: boolean;
  startTime?: string;
  endTime?: string;
}

export interface PaginatedResourcesResponse {
  data: ResourceResponse[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ResourcesPropTypes {
  heading: string;
  isPreview: boolean;
  resourceType?: string;
  hideEmpty?: boolean;
}

export interface CreateFavouritePayload {
  resourceId: string;
  userId: string;
}

export interface AvailabilityCheckType {
  resourceId: string;
  startDate: string;
  endDate: string;
}

export interface AvailableDatesResponse {
  availableDates: string[];
  totalDays: number;
}

export interface TimeSlot {
  value: string;
  label: string;
}

export interface TimeSlotsData {
  startTime: TimeSlot[];
  endTime: TimeSlot[];
}

export interface AvailableSlotsQuery {
  resourceId: string;
  startDate: string;
  hours: number;
  endDate?: string;
}

export interface DateAvailableSlots {
  date: string;
  slots: string[];
}

export interface AvailableSlotsResponse {
  availableSlots: DateAvailableSlots[];
  commonSlots: string[];
}
