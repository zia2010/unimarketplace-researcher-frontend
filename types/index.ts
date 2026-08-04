import { User as FirebaseUserObject } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role: string;
  profilePicture?: string;
  phone?: string | null;
  status?: number;
  title?: string;
  education?: string;
  coverImage?: string;
  city?: string;
  logo?: string;
  state?: string;
  postalCode?: string;
  uniId?: string;
  uniPhone?: string;
  website?: string;
  description?: string;
  street?: string;
  companyId?: string;
  roleId?: string;
  university?: {
    id: string;
    name: string;
    logo?: string;
  };
}

export interface EditUserFormValues {
  firstName: string;
  lastName: string;
  phone?: string;
  title?: string;
  education?: string;
}

export type ForgotPasswordPayload = {
  email: string;
  user: string;
};

export type ResetPasswordPayload = {
  token: string;
  newPassword: string;
};

export type SignInPayload = {
  email: string;
  password: string;
};

export interface GenericApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface ApiError {
  message: string;
  status: number;
  errors: Record<string, string[]> | null;
}

export interface SignUpPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface FirebaseTokenResponse {
  token: string;
}

export interface FirebaseSignInResult {
  user: FirebaseUserObject;
  idToken: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderRole: 'user';
  text: string;
  createdAt: Timestamp;
}

export type ChatStatus = 'open' | 'assigned' | 'closed';

export interface Conversation {
  conversationId: string;
  universityId: string;
  createdByUserId: string;
  assignedStaffId?: string | null;
  assignedStaffName?: string | null;
  name?: string | null; // Added field for student name
  status: ChatStatus;
  lastMessage: string;
  lastMessageAt: Timestamp;
  createdAt: Timestamp;
  assignedAt?: Timestamp;
  unreadCountStaff?: number;
  unreadCountUser?: number;
  productName?: string;
  productId?: string;
  universityName?: string;
  universityLogo?: string;
  userProfilePicture?: string;
}

export interface TeamMember {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: string;
  phone?: string;
  profilePicture?: string;
  isAdmin?: boolean;
  status?: 'Active' | 'Invited' | 'Inactive' | 'Pending';
}
export interface EndorsementUser {
  id: string;
  firstName: string;
  lastName: string;
  title?: string;
  profilePicture?: string;
}

// 2. Updated Endorsement Interface
export interface Endorsement {
  id: string;
  text: string; // Updated from 'message' to 'text' to match your API log
  giverId: string;
  receiverId: string; // Changed from recipientId to match receiver object
  createdAt: string;
  // Add these nested objects that the API is now sending:
  giver: EndorsementUser;
  receiver: EndorsementUser;
}

// 3. Updated Payload for creating an endorsement
export interface EndorsementPayload {
  recipientId: string;
  text: string; // Updated from 'content' to 'text' for consistency
  type: 'endorsement';
}

export interface GenericApiResponse<T> {
  success: boolean;
  data: T;
}

export * from './payments.types';
export * from './bookings.types';
export * from './resources.types';
export * from './company.types';
export * from './university.types';
export * from './uploads.types';
export * from './enquiry.types';
