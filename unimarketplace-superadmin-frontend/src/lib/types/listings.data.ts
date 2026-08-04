export interface ListingData {
  key: string;
  name: string;
  university: string;
  price: string;
  listingDate: string;
  status: 'Listed' | 'Unlisted';
}

export const listingsData: ListingData[] = [
  {
    key: '1',
    name: 'Microscope',
    university: 'IIT Madras',
    price: '₹ 300/hr',
    listingDate: '28/11/25',
    status: 'Listed',
  },
  {
    key: '2',
    name: 'Diagnostic Machine',
    university: 'VIT',
    price: '₹ 700/hr',
    listingDate: '28/11/25',
    status: 'Unlisted',
  },
];
