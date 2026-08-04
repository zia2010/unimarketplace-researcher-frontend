import { User } from '.';

export interface CompanyFormData {
  name: string;
  description: string;
  address: string;
  email: string;
  coverImage?: string;
  companyLogo?: string;
}

export interface CompanyCreateResponse {
  name: string;
  description: string;
  address: string;
  email: string;
  id: string;
  updatedOn: string;
  createdOn: string;
  coverImage?: string;
  companyLogo?: string;
  users?: User[];
}

export interface BecomeCompanyModalProps {
  open: boolean;
  onClose: () => void;
  companyData?: CompanyCreateResponse;
}

export interface Role {
  createdOn: string;
  updatedOn: string;
  isDeleted: boolean;
  id: string;
  name: string;
  description: string;
  permissions: string | string[];
  roleType: string;
  isUniversityDefault: boolean;
  isUserDefault: boolean;
  isAdminDefault: boolean;
}
