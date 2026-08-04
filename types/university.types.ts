export interface UniversityObject {
  city: string;
  coverImage: string;
  createdOn: Date;
  description: string;
  facility_name: string;
  geom: string[] | null;
  id: string;
  isVerified: boolean;
  logo: string;
  name: string;
  phone: string;
  postalCode: string;
  state: string;
  street: string;
  updatedOn: Date;
  website: string;
}

// Response interfaces for different use cases
export interface UniversityResponse {
  id: string;
  name: string;
  facility_name?: string | null;
  website: string;
  description?: string | null;
  coverImage: string;
  logo?: string | null;
  phone?: string | null;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// For lists/pagination
export interface UniversitiesListResponse {
  data: UniversityResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
