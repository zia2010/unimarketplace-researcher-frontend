import React from 'react';
import { useAuth } from '../lib/context/AuthContext';
import { en } from '../locales/en';
import GlobalNotification from '../components/layout/GlobalNotification';
import KpiCard from '../components/dashboard/KpiCard';
import RankedListCard from '../components/dashboard/RankedListCard';
import RevenueTrends from '../components/dashboard/RevenueTrends';
import RecentFeedbackCard from '../components/dashboard/RecentFeedbackCard';
import {
  kpiMetrics,
  revenueTrendPoints,
  topUniversities,
  topEquipments,
  recentFeedback,
} from '../lib/types/dashboard.data';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className='pt-17.75 pl-7.5 px-8 pb-12 h-screen overflow-scroll bg-[#F9FAFB]'>
      <GlobalNotification />

      <h1 className='text-2xl font-bold font-space-grotesk text-[#4E7AF7]'>
        {en.dashboardPage.title}
      </h1>

      <p className='text-[#041B4B] text-4xl font-bold font-space-grotesk mb-8'>
        {en.dashboardPage.welcomeBack}, {user?.firstName}!
      </p>

      {/* KPI Cards Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8'>
        {kpiMetrics.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className='grid grid-cols-12 gap-6'>
        {/* Left Column */}
        <div className='col-span-12 lg:col-span-6 flex flex-col gap-6'>
          <RevenueTrends points={revenueTrendPoints} />
          <RankedListCard
            title='Top Equipments and Services'
            items={topEquipments}
          />
        </div>

        {/* Right Column */}
        <div className='col-span-12 lg:col-span-6 flex flex-col gap-6'>
          <RankedListCard title='Top Universities' items={topUniversities} />
          <RecentFeedbackCard
            title='Recent Feedbacks'
            feedback={recentFeedback}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
