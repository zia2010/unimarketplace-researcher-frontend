export interface UniversityData {
  key: string;
  name: string;
  avatar?: string;
  status: 'Verified' | 'Verification Pending';
  revenue: number;
  joiningDate: string;
}

export const universitiesData: UniversityData[] = [
  {
    key: '1',
    name: 'IIT Madras',
    status: 'Verified',
    revenue: 20000,
    joiningDate: '28/11/2025',
  },
  {
    key: '2',
    name: 'IIT Madras',
    status: 'Verification Pending',
    revenue: 20000,
    joiningDate: '28/12/2025',
  },
  {
    key: '3',
    name: 'BITS Pilani',
    status: 'Verification Pending',
    revenue: 80000,
    joiningDate: '28/12/2025',
  },
];
