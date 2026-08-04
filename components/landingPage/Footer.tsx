'use client';

import { useState } from 'react';
import Link from 'next/link';
import { en } from '@/lib/locales/en';
import { ArrowRight } from 'lucide-react';
import ContactModal from './ContactModal';

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper to handle link clicks
  const handleLinkClick = (
    e: React.MouseEvent,
    label: string,
    href: string
  ) => {
    // If the link is "Support", open modal and stop navigation
    if (label.toLowerCase() === 'support' || href === '#support') {
      e.preventDefault();
      setIsModalOpen(true);
    }
  };

  return (
    <footer className='bg-[#192035] text-white'>
      {/* CTA Section */}
      <div className='border-b border-white/10'>
        <div className='container mx-auto px-6 lg:px-8 py-20 lg:py-28 text-center'>
          <h2 className='text-3xl lg:text-5xl font-bold mb-6 tracking-tight'>
            {en.landingPage.footer.cta.heading}
          </h2>
          <p className='text-white/60 text-lg mb-8 max-w-xl mx-auto leading-relaxed'>
            {en.landingPage.footer.cta.subheading}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className='h-10 px-4 py-2 w-fit bg-[#3B82F6] hover:bg-[#2563EB] rounded-2xl text-[15px] font-semibold group transition-all border-none'
          >
            <div className='flex items-center'>
              <span className='text-white'>
                {en.landingPage.footer.cta.button}
              </span>
              <ArrowRight className='ml-2 w-4 h-4 text-white transition-transform group-hover:translate-x-1' />
            </div>
          </button>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className='max-w-[1430px] mx-auto px-6 lg:px-12 py-10'>
        <div className='flex flex-col lg:flex-row items-center justify-between gap-8'>
          {/* Logo */}
          <div className='flex items-center shrink-0'>
            <span
              className='font-semibold tracking-tighter text-white whitespace-nowrap'
              style={{ fontSize: 'clamp(20px, 4vw, 28px)' }}
            >
              {en.landingPage.footer.brand}
            </span>
          </div>

          {/* Links */}
          <nav className='flex flex-wrap items-center justify-center gap-x-10 gap-y-4'>
            {en.landingPage.footer.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                // Use the helper to check if it's the Support link
                onClick={(e) => handleLinkClick(e, link.label, link.href)}
                className='text-sm font-medium text-white/60 hover:text-white transition-colors duration-200'
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Copyright*/}
          <div className='text-sm text-white/40 whitespace-nowrap shrink-0'>
            © {new Date().getFullYear()} {en.landingPage.footer.brand}.{' '}
            {en.landingPage.footer.copyright}
          </div>
        </div>
      </div>

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </footer>
  );
};

export default Footer;
