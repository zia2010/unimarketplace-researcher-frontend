'use client';

import { en } from '@/lib/locales/en';
import { Search, BarChart3, CalendarCheck, MessageSquare } from 'lucide-react';

const HowItWorks = () => {
  const renderPreview = (index: number) => {
    const data = en.landingPage.howItWorks.previews[index];
    if (!data) return null;

    const containerClass =
      'bg-slate-50/50 border border-blue-50 rounded-xl p-4 text-[10px] space-y-3 shadow-sm min-h-[140px]';
    const iconBoxClass = 'p-1.5 bg-blue-50 rounded-lg';

    switch (index) {
      case 0:
        return (
          <div className={containerClass}>
            <div className='flex items-center gap-2 text-slate-800 font-bold mb-3'>
              <div className={iconBoxClass}>
                <Search size={12} className='text-blue-600' />
              </div>
              <span className='text-[11px] tracking-tight'>{data.title}</span>
            </div>
            <div className='space-y-2'>
              {data.items?.map((item: string, i: number) => (
                <div
                  key={i}
                  className='flex justify-between items-start bg-white border border-slate-100 p-2.5 rounded-lg'
                >
                  <span className='text-slate-700 font-medium break-words leading-tight pr-2'>
                    {item}
                  </span>
                  <span className='text-blue-600 font-bold text-[8px] uppercase tracking-tighter shrink-0 bg-blue-50 px-1.5 py-0.5 rounded mt-0.5'>
                    {data.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      case 1:
        return (
          <div className={containerClass}>
            <div className='flex items-center gap-2 text-slate-800 font-bold mb-3'>
              <div className={iconBoxClass}>
                <BarChart3 size={12} className='text-blue-600' />
              </div>
              <span className='text-[11px] tracking-tight'>{data.title}</span>
            </div>
            <div className='grid grid-cols-2 gap-2'>
              <div className='bg-white p-2.5 border border-slate-100 rounded-lg'>
                <p className='text-slate-400 text-[8px] uppercase font-semibold mb-0.5'>
                  {data.labels?.res}
                </p>
                <p className='font-bold text-slate-700 text-[11px]'>
                  {data.values?.res}
                </p>
              </div>
              <div className='bg-white p-2.5 border border-slate-100 rounded-lg'>
                <p className='text-slate-400 text-[8px] uppercase font-semibold mb-0.5'>
                  {data.labels?.rate}
                </p>
                <p className='font-bold text-blue-600 text-[11px]'>
                  {data.values?.rate}
                </p>
              </div>
              <div className='bg-white p-2.5 border border-slate-100 rounded-lg'>
                <p className='text-slate-400 text-[8px] uppercase font-semibold mb-0.5'>
                  {data.labels?.avail}
                </p>
                <p className='font-bold text-green-600 text-[11px]'>
                  {data.values?.avail}
                </p>
              </div>
              <div className='bg-white p-2.5 border border-slate-100 rounded-lg'>
                <p className='text-slate-400 text-[8px] uppercase font-semibold mb-0.5'>
                  {data.labels?.lead}
                </p>
                <p className='font-bold text-slate-700 text-[11px]'>
                  {data.values?.lead}
                </p>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className={containerClass}>
            <div className='flex items-center gap-2 text-slate-800 font-bold mb-3'>
              <div className={iconBoxClass}>
                <CalendarCheck size={12} className='text-blue-600' />
              </div>
              <span className='text-[11px] tracking-tight'>{data.title}</span>
            </div>
            <div className='bg-slate-100/80 border border-slate-200/50 p-3 rounded-lg space-y-1'>
              <p className='text-slate-400 text-[8px] font-medium uppercase'>
                Selected Date
              </p>
              <p className='text-slate-700 font-bold leading-tight break-words'>
                {data.date}
              </p>
            </div>
            <div className='bg-blue-600 text-white py-2.5 rounded-lg text-center font-bold shadow-md shadow-blue-200 cursor-pointer'>
              {data.button}
            </div>
          </div>
        );
      case 3:
        return (
          <div className={containerClass}>
            <div className='flex items-center gap-2 text-slate-800 font-bold mb-3'>
              <div className={iconBoxClass}>
                <MessageSquare size={12} className='text-blue-600' />
              </div>
              <span className='text-[11px] tracking-tight'>{data.title}</span>
            </div>
            <div className='space-y-2'>
              <div className='bg-white p-3 rounded-lg border border-slate-100 shadow-sm'>
                <p className='text-blue-600 font-bold text-[8px] uppercase mb-1'>
                  {data.roles?.director}
                </p>
                <p className='text-slate-600 leading-snug break-words'>
                  {data.texts?.director}
                </p>
              </div>
              <div className='bg-blue-50/80 p-3 rounded-lg ml-4 border border-blue-100/50 shadow-sm'>
                <p className='text-blue-700 font-bold text-[8px] uppercase mb-1'>
                  {data.roles?.user}
                </p>
                <p className='text-slate-600 leading-snug break-words'>
                  {data.texts?.user}
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section className='py-25 bg-gray-50 overflow-hidden font-inter relative z-10 -mt-12'>
      <div className='container mx-auto px-6'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl lg:text-5xl tracking-tight mb-4 font-bold text-slate-800 leading-tight'>
            {en.landingPage.howItWorks.heading}
          </h2>
          <p className='text-slate-500 text-lg max-w-2xl mx-auto font-normal'>
            {en.landingPage.howItWorks.subheading}
          </p>
        </div>

        <div className='max-w-7xl mx-auto'>
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {en.landingPage.howItWorks.steps.map((step, index) => (
              <div key={index} className='flex flex-col items-center group'>
                <div className='w-12 h-12 rounded-full bg-white text-blue-500 flex items-center justify-center font-bold text-base shadow-lg shadow-blue-100 mb-4 z-10 transition-colors group-hover:bg-blue-500 group-hover:text-white'>
                  {step.step}
                </div>
                <div className='bg-white border border-slate-100 p-6 rounded-[32px] shadow-[0_15px_35px_-12px_rgba(0,0,0,0.05)] transition-all duration-300 h-full flex flex-col w-full'>
                  <div className='mb-2 flex-1'>{renderPreview(index)}</div>
                  <div className='text-left mt-0'>
                    <h3 className='text-xl font-bold text-slate-900 mb-1 tracking-tight'>
                      {step.title}
                    </h3>
                    <p className='text-slate-500 text-sm leading-relaxed'>
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
