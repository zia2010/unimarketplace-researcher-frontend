'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Building2,
  ChevronDown,
  Users,
  GraduationCap,
  Activity,
  Microscope,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { en } from '@/lib/locales/en';
import { useQuery } from '@tanstack/react-query';
import { universityApi } from '@/lib/services/api/university.api';
import { useRouter } from 'next/navigation';

const HeroSection = () => {
  const router = useRouter();
  const [institution, setInstitution] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentEquipmentIndex, setCurrentEquipmentIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  const labEquipment = ['Microscope', 'Spectrophotometer', 'Centrifuge'];

  const { data: universityData } = useQuery({
    queryKey: ['universities'],
    queryFn: async () =>
      await universityApi.getUniversities({ page: 1, limit: 50 }),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEquipmentIndex((prev) => (prev + 1) % labEquipment.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const tiltedFloat = {
    initial: {
      y: 0,
      rotateZ: 0,
      boxShadow: '0px 40px 80px -15px rgba(0, 0, 0, 0.2)',
    },
    animate: {
      y: [0, -15, 0],
      rotateZ: [0, 1.2, 0],
      boxShadow: [
        '0px 40px 80px -15px rgba(0, 0, 0, 0.2)',
        '0px 60px 100px -20px rgba(0, 0, 0, 0.2)',
        '0px 40px 80px -15px rgba(0, 0, 0, 0.2)',
      ],
    },
  };

  const handleSearch = () => {
    // Build query parameters based on what the user has entered
    const params = new URLSearchParams();

    if (searchTerm.trim()) {
      // Add search term if provided
      params.set('searchTerm', searchTerm.trim());
    }

    if (institution) {
      // Add institution if selected
      params.set('universities', institution);
    }

    // Navigate to resources page with query parameters
    const queryString = params.toString();
    router.push(queryString ? `/resources?${queryString}` : '/resources', {
      scroll: true,
    });
  };

  return (
    <section className='relative w-full min-h-screen pt-20 md:pt-32 pb-12 bg-white overflow-hidden flex flex-col items-center'>
      <div className='relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center'>
        {/* TITLE SECTION */}
        <div className='w-full text-center mb-6 md:mb-10'>
          <h1
            className='text-foreground leading-[1.1] tracking-tight animate-fade-in-up font-sans'
            style={{
              fontWeight: 850,
              // Corrected Clamp: Scales from 32px on small mobile to 72px on desktop
              fontSize: 'clamp(2rem, 8vw, 4.5rem)',
            }}
          >
            <span className='text-black block'>
              {en.landingPage.hero.title.main}
            </span>
            <span className='text-[#3B82F6] block'>
              {en.landingPage.hero.title.accent}
            </span>
          </h1>
        </div>

        <p
          className='w-full max-w-[700px] text-center text-[#64748b] leading-relaxed px-4 mb-8 md:mb-10'
          style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1.15rem)' }}
        >
          {en.landingPage.hero.description}
        </p>

        {/* SEARCH CONSOLE */}
        <div className='w-full max-w-3xl mx-auto z-20 relative'>
          <div className='bg-white p-3 lg:p-4 rounded-[24px] shadow-[0_16px_48px_-6px_rgba(0,0,0,0.25)] border border-slate-200 flex flex-col md:flex-row items-center gap-3'>
            <div className='w-full md:flex-[1.5] relative'>
              <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10' />
              <input
                type='text'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                className='
    w-full h-14
    pl-12 pr-4
    rounded-[20px]
    border border-slate-300
    focus:border-[#3B82F6]
    focus:ring-4 focus:ring-[#498bf5]/20
    focus:outline-none
    transition-all
    text-base text-[#1e293b]
    placeholder:text-transparent
  '
              />
              {!isFocused && !searchTerm && (
                <div className='absolute left-12 top-1/2 -translate-y-1/2 pointer-events-none overflow-hidden h-6'>
                  <motion.div
                    key={currentEquipmentIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className='text-base text-gray-500'
                  >
                    {labEquipment[currentEquipmentIndex]}
                  </motion.div>
                </div>
              )}
            </div>

            {/* Institution Select */}
            <div className='w-full md:flex-1 relative text-gray-500'>
              <Building2 className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10' />
              <select
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className={`w-full h-14 pl-12 pr-10 bg-slate-50/50 rounded-[20px] border border-slate-300 focus:border-[#3B82F6] focus:ring-4 focus:ring-[#498bf5]/20 appearance-none cursor-pointer focus:outline-none focus:bg-white transition-all text-base outline-none ${
                  institution === '' ? 'text-[#94a3b8]' : 'text-[#1e293b]'
                }`}
              >
                <option value=''>
                  {en.landingPage.hero.search.selectInstitution}
                </option>
                {universityData?.data?.map((uni) => (
                  <option key={uni.id} value={uni.id}>
                    {uni.name}
                  </option>
                ))}
              </select>
              <ChevronDown className='absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]' />
            </div>

            {/* Button*/}
            <button
              onClick={handleSearch}
              className='h-14 w-full md:w-20 rounded-[20px] bg-[#3B82F6] hover:bg-[#2563EB] active:bg-[#2563EB] flex items-center justify-center shadow-lg shadow-blue-200 transition-colors shrink-0'
            >
              <Search className='h-5 w-5 text-white stroke-[2px] cursor-pointer' />
            </button>
          </div>
        </div>

        {/*  Live metrics box */}
        <div className='mt-12 md:mt-20 w-full max-w-[1000px] px-2'>
          <div style={{ perspective: '2000px' }} className='py-4'>
            <motion.div
              initial={tiltedFloat.initial}
              animate={tiltedFloat.animate}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className='bg-white rounded-[24px] md:rounded-[32px] border border-slate-100 p-4 md:p-8 shadow-[0_32px_64px_-20px_rgba(0,0,0,0.2)] relative overflow-hidden'
            >
              {/* Header */}
              <div className='flex items-center justify-between mb-6'>
                <div className='flex items-center gap-3'>
                  <div className='h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center'>
                    <div className='h-5 w-5 rounded bg-[#3B82F6]' />
                  </div>
                  <div>
                    <div className='text-sm font-semibold text-foreground'>
                      Rent-O-Infra Dashboard
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      Live Platform Metrics
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
                {[
                  {
                    label: 'Registered Researchers',
                    value: '1,250+',
                    icon: Users,
                  },
                  {
                    label: 'Partner Institutions',
                    value: '45+',
                    icon: GraduationCap,
                  },
                  { label: 'Active Users', value: '320', icon: Activity },
                  {
                    label: 'Equipment Listed',
                    value: '500+',
                    icon: Microscope,
                  },
                ].map((stat, i) => (
                  <div key={i} className='bg-slate-50 rounded-xl p-4'>
                    <div className='flex items-center gap-2 mb-2'>
                      <stat.icon className='h-4 w-4 text-[#3B82F6]' />
                    </div>
                    <div className='text-2xl font-bold text-foreground'>
                      {stat.value}
                    </div>
                    <div className='text-xs text-muted-foreground mt-1'>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Live metrics */}
              <div className='bg-slate-50 rounded-xl p-4'>
                <div className='space-y-3'>
                  {/* Row 1: Monthly Traffic */}
                  <div className='flex items-center gap-4'>
                    <div className='h-10 w-10 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center'>
                      <TrendingUp className='h-5 w-5 text-[#3B82F6]' />
                    </div>
                    <div className='flex-1'>
                      <div className='text-sm font-medium text-foreground'>
                        Monthly Platform Traffic
                      </div>
                      <div className='text-xs text-muted-foreground'>
                        Unique visits to landing page
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm font-semibold text-foreground'>
                        15.2k Visits
                      </span>
                      <div className='h-6 px-2 bg-green-100 text-green-700 rounded-full flex items-center gap-1 text-xs font-medium'>
                        <TrendingUp className='h-3 w-3' />
                        12%
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Equipment Access Speed */}
                  <div className='flex items-center gap-4'>
                    <div className='h-10 w-10 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center'>
                      <Clock className='h-5 w-5 text-[#3B82F6]' />
                    </div>
                    <div className='flex-1'>
                      <div className='text-sm font-medium text-foreground'>
                        Equipment Access Speed
                      </div>
                      <div className='text-xs text-muted-foreground'>
                        Average time from booking to usage
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm font-semibold text-foreground'>
                        &lt; 24 Hours
                      </span>
                      <div className='h-6 px-2 bg-emerald-100 text-emerald-700 rounded-full flex items-center text-xs font-medium'>
                        Fast
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
