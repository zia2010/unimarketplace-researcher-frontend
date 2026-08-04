'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/utils';

interface Section {
  id: string;
  title: string;
}

interface LegalContentLayoutProps {
  title: string;
  lastUpdated: string;
  sections: Section[];
  children: React.ReactNode;
}

const LegalContentLayout = ({
  title,
  lastUpdated,
  sections,
  children,
}: LegalContentLayoutProps) => {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || '');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -66%',
        threshold: 0,
      }
    );

    // Observe all sections
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sections]);

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className='min-h-screen bg-white'>
      {/* Page Header */}
      <div className='bg-gray-50 py-12 lg:py-16'>
        <div className='container mx-auto px-6 lg:px-8'>
          <h1 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-2'>
            {title}
          </h1>
          <p className='text-gray-600'>Last updated: {lastUpdated}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className='container mx-auto px-6 lg:px-8 py-12 lg:py-16'>
        <div className='max-w-6xl mx-auto'>
          {/* Mobile Table of Contents */}
          <div className='lg:hidden mb-8'>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='w-full flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 text-left'
            >
              <span className='font-medium text-gray-900'>
                Table of Contents
              </span>
              <ChevronDown
                className={cn(
                  'w-5 h-5 text-gray-600 transition-transform',
                  mobileMenuOpen && 'rotate-180'
                )}
              />
            </button>
            {mobileMenuOpen && (
              <nav className='mt-2 bg-gray-50 rounded-xl p-4 space-y-2'>
                {sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => handleSectionClick(section.id)}
                    className={cn(
                      'block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                      activeSection === section.id
                        ? '!text-blue-600 bg-blue-50 font-medium'
                        : 'text-muted-foreground hover:text-gray-900 hover:bg-gray-100'
                    )}
                  >
                    {index + 1}. {section.title}
                  </button>
                ))}
              </nav>
            )}
          </div>

          <div className='flex gap-12'>
            {/* Desktop Sidebar */}
            <aside className='hidden lg:block w-64 flex-shrink-0'>
              <nav className='sticky top-24 space-y-1'>
                {sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => handleSectionClick(section.id)}
                    className={cn(
                      'block w-full text-left px-4 py-2.5 text-sm transition-all border-l-2',
                      activeSection === section.id
                        ? '!text-blue-400 border-blue-600 font-medium bg-blue-50'
                        : 'text-muted-foreground border-transparent hover:text-gray-900 hover:border-gray-300'
                    )}
                  >
                    {index + 1}. {section.title}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Content Area */}
            <main className='flex-1 min-w-0'>{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalContentLayout;
