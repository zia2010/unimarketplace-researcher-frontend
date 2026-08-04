export interface KpiData {
  title: string;
  amount: string;
}

export interface RankedItem {
  name: string;
  amount: string;
}

export interface FeedbackData {
  name: string;
  rating: number;
  comment: string;
}

export const kpiMetrics: KpiData[] = [
  { title: 'Total GMV', amount: '₹ 2,20,000' },
  { title: 'MRR', amount: '₹ 95,000' },
  { title: 'Active ARR', amount: '₹ 1,20,000' },
  { title: 'Active Bookings', amount: '450' },
  { title: 'Pending Verifications', amount: '24' },
  { title: 'Monthly Infra Cost', amount: '₹ 20,000' },
  { title: 'Website Visitors', amount: '12,000' },
  { title: 'Active Users', amount: '800' },
];

export const revenueTrendPoints = [
  { date: 'Week 1', value: 80000 },
  { date: 'Week 1.5', value: 140000 },
  { date: 'Week 2', value: 90000 },
  { date: 'Week 2.5', value: 130000 },
  { date: 'Week 3', value: 70000 },
  { date: 'Week 3.5', value: 120000 },
  { date: 'Week 4', value: 40000 },
  { date: 'Wave 5', value: 180000 },
  { date: 'Wave 6', value: 60000 },
  { date: 'Wave 7', value: 140000 },
];

export const topUniversities: RankedItem[] = [
  { name: 'IIT Madras', amount: '₹ 20,000' },
  { name: 'VIT Madras', amount: '₹ 20,000' },
  { name: 'VIT Madras', amount: '₹ 20,000' },
];

export const topEquipments: RankedItem[] = [
  { name: 'Vehicle Systems', amount: '₹ 20,000' },
  { name: 'Microscope', amount: '₹ 20,000' },
  { name: 'Diagnostic Machines', amount: '₹ 20,000' },
];

export const recentFeedback: FeedbackData = {
  name: 'Ritik Narayanan',
  rating: 4,
  comment:
    'Quaerat dicta itaque excepturi et magnam facilis unde. Fugiat porro delectus. Laudantium vel consectetur id sed nisi. Facere vel beatae quidern perferendis nostrum quod mollitia sequi. Necessitatibus beatae laboriosam veniam necessitatibus perspiciatis. Quidem iure placeat praesentium omnis adipisci. Illum nostrum facere nihil facere qui saepe amet. Accusamus accusamus animi commodi autem quam. A repudiandae facilis enim fugiat facilis.',
};
