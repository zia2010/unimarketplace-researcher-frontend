'use client';

import React from 'react';
import { en } from '@/lib/locales/en';
import { Mail, MapPin } from 'lucide-react';

interface AboutSection {
  title: string;
  content?: string | string[];
  items?: string[];
}

const About = () => {
  return (
    <div className='min-h-screen bg-white'>
      {/* Header Section */}
      <div className='bg-[#f8fafc] border-b border-gray-100'>
        <div className='max-w-7xl mx-auto px-4 py-13 sm:px-6 lg:px-8 text-center sm:text-left'>
          <h1 className='text-3xl font-bold text-slate-900 sm:text-4xl tracking-tight'>
            {en.aboutPage.title}
          </h1>
          <p className='mt-4 text-xl text-blue-600 font-semibold italic'>
            {en.aboutPage.subtitle}
          </p>
        </div>
      </div>

      {/* Intro & Main Content Area */}
      <div className='max-w-4xl mx-auto px-6 py-16'>
        <p className='text-xl text-gray-700  mb-16 font-medium  border-blue-500 pb-10'>
          {en.aboutPage.intro}
        </p>

        <div className='space-y-20'>
          {en.aboutPage.sections.map((section: AboutSection, index: number) => (
            <section key={index}>
              <h2 className='text-2xl font-bold mb-6 text-gray-900 border-b border-gray-100 pb-2'>
                {section.title}
              </h2>

              <div className='space-y-6'>
                {(Array.isArray(section.content)
                  ? section.content
                  : section.content
                    ? [section.content]
                    : []
                ).map((p: string, i: number) => (
                  <p key={i} className='text-lg text-slate-600 leading-relaxed'>
                    {p}
                  </p>
                ))}
              </div>

              {section.items && (
                <ul className='list-disc list-outside ml-6 mt-6 text-lg text-slate-600 leading-relaxed space-y-4'>
                  {section.items.map((item: string, i: number) => (
                    <li key={i} className='pl-2'>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {/* Contact Section */}
          <section className='bg-blue-50 rounded-2xl p-8 mt-12 border border-blue-100'>
            <h2 className='text-2xl font-bold mb-4 text-blue-900'>
              {en.aboutPage.contactInfo.title}
            </h2>
            <p className='text-blue-800 mb-6'>
              {en.aboutPage.contactInfo.description}
            </p>
            <div className='space-y-4'>
              <div className='flex items-center text-slate-700'>
                <Mail className='w-5 h-5 mr-3 text-blue-600' />
                <span className='text-lg'>
                  {en.aboutPage.contactInfo.email}
                </span>
              </div>
              <div className='flex items-center text-slate-700'>
                <MapPin className='w-5 h-5 mr-3 text-blue-600' />
                <span className='text-lg'>
                  {en.aboutPage.contactInfo.location}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
