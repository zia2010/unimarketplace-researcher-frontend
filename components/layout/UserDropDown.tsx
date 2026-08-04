import { User } from '@/types';
import { Button, Dropdown, message } from 'antd';
import { Building2, Heart, LogOut, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProductImage } from '../common/productImage';

const cdnUrl: string = process.env.NEXT_PUBLIC_CF_URL ?? '';

export const UserDropDown = ({
  logout,
  user,
  userProfile,
  isHydrating,
  onOpen,
}: {
  logout: () => void;
  user: User | null;
  userProfile: User | null;
  isHydrating: boolean;
  onOpen: () => void;
}) => {
  const router = useRouter();
  // 1. Identify if we have a valid logged-in user
  const currentUser = user || userProfile;

  // If no user, return a clickable guest button that redirects to login
  if (!user) {
    return (
      <div
        className='hidden md:flex cursor-pointer items-center gap-3 hover:opacity-80 transition-opacity'
        onClick={() => router.push('/login', { scroll: true })}
      >
        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-[#041B4B] overflow-hidden transition-colors'>
          {userProfile && userProfile?.profilePicture ? (
            <ProductImage
              src={cdnUrl + userProfile?.profilePicture}
              alt='cover image'
              classNames=''
            />
          ) : (
            currentUser?.firstName?.charAt(0).toUpperCase() || 'G'
          )}
        </div>

        <span className='hidden lg:block font-semibold text-[#041B4B]'>
          {isHydrating
            ? 'Loading...'
            : currentUser
              ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim()
              : 'Guest'}
        </span>
      </div>
    );
  }

  return (
    <Dropdown
      menu={{
        items: [
          // 2. ONLY show Profile if the user is logged in
          ...(user
            ? [
                {
                  key: 'profile',
                  icon: <UserIcon size={16} />,
                  label: (
                    <Link href='/profile' className='pl-2'>
                      Profile
                    </Link>
                  ),
                },
              ]
            : []),

          {
            key: 'favourites',
            icon: <Heart size={16} />,
            label: (
              <Link href='/favourites?isFavourite=true' className='pl-2'>
                Favourites
              </Link>
            ),
          },

          // 3. ONLY show "Become a Company" if logged in AND doesn't have a companyId
          ...(currentUser && !user?.companyId
            ? [
                {
                  key: 'company',
                  icon: <Building2 size={16} />,
                  label: (
                    <Button
                      variant='text'
                      color='default'
                      onClick={() => onOpen()}
                      className='px-1!'
                    >
                      {' '}
                      Become a Company
                    </Button>
                  ),
                  onClick: () => message.info('Coming soon'),
                },
              ]
            : []),

          {
            type: 'divider',
          },
          {
            key: 'logout',
            icon: <LogOut size={16} />,
            danger: true,
            label: <span className='pl-2'>Logout</span>,
            onClick: logout,
          },
        ],
      }}
      placement='bottomRight'
      trigger={['hover']}
    >
      <div className='hidden md:flex cursor-pointer items-center gap-3 hover:opacity-80 transition-opacity'>
        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-[#041B4B] overflow-hidden hover:bg-[#1B56CC] hover:text-white transition-colors'>
          {user && user?.profilePicture ? (
            <ProductImage
              src={cdnUrl + user?.profilePicture}
              alt='Profile Picture'
              classNames=''
            />
          ) : (
            currentUser?.firstName?.charAt(0).toUpperCase() || 'G'
          )}
        </div>

        <span className='hidden lg:block font-semibold text-[#041B4B]'>
          {isHydrating
            ? 'Loading...'
            : currentUser
              ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim()
              : 'Guest'}
        </span>
      </div>
    </Dropdown>
  );
};
