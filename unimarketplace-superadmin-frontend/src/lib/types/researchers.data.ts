export interface ResearcherData {
  key: string;
  name: string;
  organisation: string;
  status: 'Active' | 'Inactive';
  joiningDate: string;
  totalSpend: string;
}

export const researchersData: ResearcherData[] = [
  {
    key: '1',
    name: 'Sathya Gupta',
    organisation: 'Individual',
    status: 'Active',
    joiningDate: '28/11/25',
    totalSpend: '₹ 20,000',
  },
  {
    key: '2',
    name: 'Sathya Gupta',
    organisation: 'Bio Chem Labs',
    status: 'Active',
    joiningDate: '28/11/25',
    totalSpend: '₹ 20,000',
  },
];
