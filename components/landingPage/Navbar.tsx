'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { en } from '@/lib/locales/en';
import { useAuth } from '@/lib/auth/context/AuthContext';

const Navbar = () => {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className='fixed top-0 left-0 w-full z-100 bg-white/80 border-b border-slate-100'>
      <div className='max-w-[1100px] mx-auto px-8 sm:px-10 lg:px-12'>
        <div className='flex items-center justify-between h-16 md:h-20'>
          {/* Logo */}
          <Link href='/' className='flex items-center z-101 shrink-0'>
            <span
              className='font-bold tracking-tight text-[#3b82f6] whitespace-nowrap shrink-100'
              style={{
                fontSize: 'clamp(20px, 5vw, 30px)',
              }}
            >
              {en.landingPage.navbar.logo}
            </span>
          </Link>

          {/* Center Links */}
          <div className='hidden md:flex items-center gap-6 lg:gap-8 mx-4 ml-5'>
            {en.landingPage.navbar.links.map((link) => {
              const isExploreLink = link.label === 'Explore Listings';
              const isAboutLink = link.label === 'About';

              // 1. Internal Research/Listing Page
              if (isExploreLink) {
                return (
                  <Link
                    key={link.label}
                    href='/resources'
                    className='text-[16px] font-semibold text-slate-500 hover:text-slate-900 transition-colors whitespace-nowrap'
                  >
                    {link.label}
                  </Link>
                );
              }

              // 2. Internal About Page
              if (isAboutLink) {
                return (
                  <Link
                    key={link.label}
                    href='/about'
                    className='text-[16px] font-semibold text-slate-500 hover:text-slate-900 transition-colors whitespace-nowrap'
                  >
                    {link.label}
                  </Link>
                );
              }
            })}
          </div>
          {/* Right Actions */}
          <div className='flex items-center gap-2 sm:gap-4 md:gap-8'>
            {isLoggedIn || user?.id ? (
              <Link
                href='/home'
                className='hidden md:inline-flex text-[14px] font-semibold text-slate-500 hover:text-slate-900 tracking-tight whitespace-nowrap'
              >
                {en.landingPage.navbar.actions.home}
              </Link>
            ) : (
              <Link
                href='/login'
                className='hidden md:inline-flex text-[14px] font-semibold text-slate-500 hover:text-slate-900 tracking-tight whitespace-nowrap'
              >
                {en.landingPage.navbar.actions.login}
              </Link>
            )}
            <button
              onClick={() => {
                const externalSignupUrl =
                  process.env.NEXT_PUBLIC_UNIVERSITY_URL;

                if (externalSignupUrl) {
                  window.open(`${externalSignupUrl}/signup`, '_blank');
                }
              }}
              className='
              h-10
              px-4 sm:px-6
              hover:bg-[#2563EB]
              active:bg-[#2563EB]
              text-[5px] sm:text-[5px]
              leading-none
              flex items-center justify-center
              transition-none
              border-none
              bg-primary
              hover:bg-blue-dark
              rounded-xl
              font-semibold
              shadow-md
              hover:shadow-lg
              hover:cursor-pointer
              w-full
            '
            >
              <span className='text-white text-[13.2px]'>
                {en.landingPage.navbar.actions.partner}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className='md:hidden p-1 sm:p-2 text-slate-600 shrink-0'
              onClick={() => setIsOpen(!isOpen)}
              aria-label='Toggle menu'
            >
              {isOpen ? (
                <X className='h-6 w-6' />
              ) : (
                <Menu className='h-6 w-6' />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className='md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-6 flex flex-col gap-6 shadow-xl'>
          {en.landingPage.navbar.links.map((link) => {
            const isExploreLink = link.label === 'Explore Listings';
            const isAboutLink = link.label === 'About';
            const isHomeLink = link.label === 'Home';

            // Skiping Home link in mobile menu - we handle it separately below
            if (isHomeLink) return null;

            const href = isExploreLink
              ? '/resources'
              : isAboutLink
                ? '/about'
                : link.href;
            return (
              <Link
                key={link.label}
                href={href}
                onClick={() => setIsOpen(false)}
                className='text-lg font-semibold text-slate-600'
              >
                {link.label}
              </Link>
            );
          })}
          {(isLoggedIn || user?.id) && (
            <>
              <hr className='border-slate-100' />
              <button
                onClick={() => {
                  router.push('/home', { scroll: true });
                  setIsOpen(false);
                }}
                className='text-left text-lg font-semibold text-slate-600 hover:text-slate-900'
              >
                {en.landingPage.navbar.actions.home}
              </button>
            </>
          )}
          {!(isLoggedIn || user?.id) && (
            <>
              <hr className='border-slate-100' />
              <Link
                href='/login'
                onClick={() => setIsOpen(false)}
                className='text-lg font-semibold text-slate-600'
              >
                {en.landingPage.navbar.actions.login}
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
