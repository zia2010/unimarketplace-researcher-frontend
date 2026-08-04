'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, Menu, X } from 'lucide-react';
import { en } from '@/lib/locales/en';
import { useAuth } from '@/lib/auth/context/AuthContext';
import { useSignIn } from '@/lib/hooks/useSignIn';
import { Popconfirm, message } from 'antd';
import { useCallback, useEffect, useState, useRef } from 'react';
import { User } from '@/types';
import { isError } from '@/lib/utils/error.util';
import { UserDropDown } from './UserDropDown';
import { storage } from '@/lib/services/storage';
import NotificationDrawer from './NotificationDrawer';
import RatingModal from './RatingModal';
import { authApi } from '@/lib/services/api/auth.api';
import { useQuery } from '@tanstack/react-query';
import { ProductImage } from '../common/productImage';

const cdnUrl: string = process.env.NEXT_PUBLIC_CF_URL ?? '';

export default function TopNavbar() {
  const pathname = usePathname();
  const { user, logout, isHydrating, unreadMessage, isLoggedIn } = useAuth();
  const { setProfile } = useSignIn();
  const [companyModalOpen, setCompanyModalOpen] = useState<boolean>(false);
  const [userProfile, setuserProfile] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const profileFetchedRef = useRef(false);

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const { data: fetchedUser } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => await authApi.getProfile(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: isLoggedIn, // Only fetch profile when user is logged in
  });

  const getProfile = useCallback(async () => {
    const loginState = storage.getLoginState();
    if (isLoggedIn || loginState) {
      return await setProfile();
    }
  }, [isLoggedIn, setProfile]);

  useEffect(() => {
    if (!user && !isHydrating && !profileFetchedRef.current) {
      profileFetchedRef.current = true;
      getProfile()
        .then((data) => {
          if (!data) return;
          setuserProfile(data);
        })
        .catch((error) => {
          const errorMessage = isError(error)
            ? error.message
            : 'Failed to get user profile';
          console.log('error occured in top nav bar component', errorMessage);
          profileFetchedRef.current = false;
        });
    }
  }, [isHydrating, user, getProfile]);

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { href: '/home', label: en.navbar.links.home },
    ...(user ? [{ href: '/bookings', label: en.navbar.links.bookings }] : []),
    { href: '/resources', label: en.navbar.links.resources },
    ...(user ? [{ href: '/settings', label: en.navbar.links.settings }] : []),
  ];

  return (
    <>
      <nav className='fixed left-1/2 top-5 md:top-[39px] z-50 flex h-[70px] md:h-[86px] w-[95%] md:w-[98%] max-w-[1664px] -translate-x-1/2 items-center justify-between rounded-2xl md:rounded-3xl border-[1.52px] border-[#8EA3FA] bg-[#F2F4FE]/80 backdrop-blur-md px-4 md:px-8 shadow-[0px_1.52px_3.05px_rgba(0,0,0,0.05)]'>
        <div className='flex items-center'>
          <Link
            href='/'
            className='text-xl md:text-2xl font-bold text-[#041B4B]'
            onClick={handleLinkClick}
          >
            {en.navbar.brand}
            <span className='hidden sm:block text-xs md:text-sm font-normal text-[#041B4B]/70'>
              {en.navbar.subBrand}
            </span>
          </Link>
        </div>

        <div className='hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-6 xl:gap-8'>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-medium transition-colors ${
                isActive(link.href)
                  ? 'text-[#1B56CC]'
                  : 'text-[#041B4B] hover:text-[#1B56CC]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className='flex items-center gap-3 md:gap-6'>
          {isLoggedIn && (
            <>
              <Link
                href='/messages'
                className='relative text-[#041B4B] hover:text-[#1B56CC] transition-colors'
                onClick={handleLinkClick}
              >
                <MessageSquare className='h-5 w-5 md:h-6 md:w-6' />
                {unreadMessage ? (
                  <span className='absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1B56CC] text-[10px] text-white'>
                    {unreadMessage}
                  </span>
                ) : null}
              </Link>
              {/* <button
                className='text-[#041B4B] hover:text-[#1B56CC] transition-colors'
                onClick={() =>
                  setNotificationDrawerOpen(!notificationDrawerOpen)
                }
              >
                <Bell className='h-5 w-5 md:h-6 md:w-6 hover:text-[#1B56CC] hover:cursor-pointer' />
              </button> */}
            </>
          )}

          <UserDropDown
            isHydrating={isHydrating}
            logout={logout}
            user={fetchedUser ?? user}
            userProfile={userProfile}
            onOpen={() => setCompanyModalOpen(true)}
          />

          <button
            className='lg:hidden text-[#041B4B] hover:text-[#1B56CC] transition-colors'
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label='Toggle menu'
          >
            {mobileMenuOpen ? (
              <X className='h-6 w-6' />
            ) : (
              <Menu className='h-6 w-6' />
            )}
          </button>
        </div>
      </nav>

      <NotificationDrawer
        isOpen={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
        onOpenRating={() => setRatingModalOpen(true)}
      />

      <RatingModal
        isOpen={ratingModalOpen}
        onClose={() => setRatingModalOpen(false)}
      />

      {mobileMenuOpen && (
        <div className='fixed inset-0 z-40 lg:hidden'>
          <div
            className='absolute inset-0 bg-black/20 backdrop-blur-sm'
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className='absolute right-0 top-0 h-full w-full bg-[#F2F4FE] shadow-xl border-l-[1.52px] border-[#8EA3FA] pt-[110px] px-6'>
            <div className='border-b border-[#8EA3FA]/30 gap-3 pb-6 mb-6'>
              <div>
                {user ? (
                  <Popconfirm
                    title='Logout'
                    description='Are you sure you want to logout?'
                    onConfirm={logout}
                    okText='Logout'
                    cancelText='Cancel'
                    okButtonProps={{ danger: true }}
                  >
                    <div className='flex md:hidden cursor-pointer items-center gap-3'>
                      <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 text-[#041B4B] overflow-hidden'>
                        {user && user?.profilePicture ? (
                          <ProductImage
                            src={cdnUrl + user?.profilePicture}
                            alt='Profile Picture'
                            classNames=''
                          />
                        ) : (
                          user?.firstName?.charAt(0).toUpperCase() || 'G'
                        )}
                      </div>
                      <div className='flex flex-col'>
                        <span className='font-semibold text-[#041B4B]'>
                          {isHydrating
                            ? 'Loading...'
                            : user
                              ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                              : userProfile
                                ? `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim()
                                : 'Guest'}
                        </span>
                        <span className='text-[#07080db3]/50 text-xs mt-2'>
                          Tap to logout
                        </span>
                      </div>
                    </div>
                  </Popconfirm>
                ) : (
                  <Link href='/login'>
                    <div className='flex md:hidden cursor-pointer items-center gap-3'>
                      <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 text-[#041B4B]'></div>
                      <div className='flex flex-col'>
                        <span className='font-semibold text-[#041B4B]'>
                          Guest
                        </span>
                        <span className='text-[#07080db3]/50 text-xs mt-2'>
                          Tap to login
                        </span>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
              <div className='flex flex-col gap-4 mt-4'>
                <Link
                  href='/favourites?isFavourite=true'
                  onClick={handleLinkClick}
                  className={`font-medium text-lg py-2 px-4 rounded-lg transition-all ${
                    isActive('/favourites')
                      ? 'text-[#1B56CC] bg-white/50'
                      : 'text-[#041B4B] hover:bg-white/30'
                  }`}
                >
                  Favourites
                </Link>

                {user && (
                  <Link
                    href='/profile'
                    onClick={handleLinkClick}
                    className={`font-medium text-lg py-2 px-4 rounded-lg transition-all ${
                      isActive('/profile')
                        ? 'text-[#1B56CC] bg-white/50'
                        : 'text-[#041B4B] hover:bg-white/30'
                    }`}
                  >
                    Profile
                  </Link>
                )}

                {user && !user?.companyId && (
                  <button
                    onClick={() => message.info('Coming soon')}
                    className={`font-medium text-lg py-2 px-4 rounded-lg transition-all text-left ${
                      isActive('/become-company')
                        ? 'text-[#1B56CC] bg-white/50'
                        : 'text-[#041B4B] hover:bg-white/30'
                    }`}
                  >
                    Become a Company
                  </button>
                )}
              </div>
            </div>

            <div className='flex flex-col gap-4'>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick}
                  className={`font-medium text-lg py-2 px-4 rounded-lg transition-all ${
                    isActive(link.href)
                      ? 'text-[#1B56CC] bg-white/50'
                      : 'text-[#041B4B] hover:bg-white/30'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* <BecomeCompanyModal
        open={companyModalOpen}
        onClose={() => setCompanyModalOpen(false)}
      /> */}
    </>
  );
}
