import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ConfirmModal from '../ui/ConfirmModal';
import { useAuth } from '../../lib/context/AuthContext';
import {
  List,
  LucideIcon,
  Microscope,
  University,
  ChevronLeftIcon,
  ChevronRightIcon,
  MessageSquare,
  Wallet,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { en } from '../../locales/en';

type MenuItem =
  | {
      path: string;
      label: string;
      iconType: 'svg';
      icon: string;
    }
  | {
      path: string;
      label: string;
      iconType: 'lucide';
      icon: LucideIcon;
    };

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const menuItems: MenuItem[] = [
  {
    path: '/dashboard',
    label: en.dashboard,
    iconType: 'lucide',
    icon: LayoutDashboard,
  },
  {
    path: '/universities',
    label: en.universities,
    iconType: 'lucide',
    icon: University,
  },
  {
    path: '/researchers',
    label: en.researchers,
    iconType: 'lucide',
    icon: Microscope,
  },
  {
    path: '/listings',
    label: en.listings,
    iconType: 'lucide',
    icon: List,
  },
  {
    path: '/ratings',
    label: en.ratingsFeedback,
    iconType: 'lucide',
    icon: MessageSquare,
  },
  {
    path: '/financials',
    label: en.financials,
    iconType: 'lucide',
    icon: Wallet,
  },
  
];

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const userInitial = user?.name?.charAt(0).toUpperCase() ?? 'U';
  const profileActive = location.pathname.startsWith('/profile');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`
        relative
        h-screen
        flex
        flex-col
        bg-[#EEF0FE75]
        border border-[#8EA3FA]
        rounded-tr-4xl
        rounded-br-4xl
        transition-all
        duration-300
        ${collapsed ? 'w-fit px-3 ml-6.25 rounded-tl-4xl rounded-bl-4xl' : 'w-72.5 px-8'}
      `}
    >
      {/* LOGO */}
      <div className='py-6'>
        {!collapsed && (
          <>
            <h1 className='text-[#041B4B] text-3xl font-bold truncate'>
              {en.Sidebar.title}
            </h1>
            <p className='text-[#041B4B] text-base'>{en.Sidebar.role}</p>
          </>
        )}
      </div>

      {/* MENU */}
      <nav className='flex-1 space-y-2'>
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                w-full
                flex
                items-center
                ${collapsed ? '' : 'gap-3'}
                rounded-lg
                px-3
                py-2
                transition
                ${
                  isActive
                    ? 'bg-white text-[#0E3789]'
                    : 'text-[#041B4B] hover:bg-[#DDE3FD]'
                }
              `}
            >
              {/* ICON */}
              {item.iconType === 'svg' ? (
                <img src={item.icon} alt='' className='w-5 h-5 shrink-0' />
              ) : (
              <item.icon className='w-5 h-5 shrink-0' />
              )}

              {/* LABEL */}
              {!collapsed && (
                <span className='text-sm font-medium truncate'>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* USER SECTION */}
      <div
        onClick={() => navigate('/profile')}
        className={`
          mt-auto
          mb-4
          flex
          items-center
          gap-3
          cursor-pointer
          rounded-lg

          hover:bg-[#DDE3FD]
           ${
             profileActive
               ? 'bg-white text-[#0E3789]'
               : 'text-[#041B4B] hover:bg-[#DDE3FD]'
           }
        `}
      >
        {/* AVATAR */}
        <div className='w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0'>
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt='avatar'
              className='w-full h-full rounded-full object-cover'
            />
          ) : (
            <span className='font-semibold'>{userInitial}</span>
          )}
        </div>

        {/* NAME + LOGOUT */}
        <div className='flex items-center justify-between w-full ml-3'>
          <span className='text-sm font-medium truncate'>
            {user?.firstName || 'Unknown User'}
          </span>

          {/* LOGOUT WITH MODAL */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsModalVisible(true);
            }}
            className='text-blue-950 hover:bg-red-50 p-1 rounded'
          >
            <LogOut className='w-4 h-4' />
          </button>
        </div>
      </div>

      {/* TOGGLE BUTTON */}
      <button
        onClick={onToggle}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className='
          absolute
          -right-4
          top-10
          w-4
          h-7
          flex
          items-center
          justify-center
          rounded-tr-md
          rounded-br-md
          bg-[#0E3789]
          hover:bg-[#1e3a8a]
          transition
        '
      >
        {collapsed ? (
          <ChevronRightIcon className='w-4 h-4 text-white' />
        ) : (
          <ChevronLeftIcon className='w-4 h-4 text-white' />
        )}
      </button>
      <ConfirmModal
        open={isModalVisible}
        title={en.logout.title}
        description={en.logout.description}
        okText={en.logout.button.logout}
        cancelText={en.logout.button.cancel}
        isDanger={true}
        onOk={() => {
          handleLogout();
          setIsModalVisible(false);
        }}
        onCancel={() => setIsModalVisible(false)}
      /> 
    </aside>
  );
};

export default Sidebar;
