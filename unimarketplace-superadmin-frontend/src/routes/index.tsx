/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import { SignupProvider } from '../lib/context/SignupContext';
import { ForgotPasswordProvider } from '../lib/context/ForgotPasswordContext';
import Universities from '../pages/Universities';
import Researchers from '../pages/Researchers';
import Listings from '../pages/Listings';
import RatingsFeedback from '../pages/RatingsFeedback';
import Financials from '../pages/Financials';

const Login = lazy(() => import('../pages/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Profile = lazy(() => import('../pages/Profile'));
const NotFound = lazy(() => import('../pages/NotFound'));

const AuthLayout = lazy(() => import('../components/layout/AuthLayout'));
const MainLayout = lazy(() => import('../components/layout/MainLayout'));
const ProtectedRoute = lazy(() => import('./ProtectedRoute'));

const SignupStart = lazy(() => import('../pages/signup/SignupStart'));
const SignupRegister = lazy(() => import('../pages/signup/SignupRegister'));
const SignupVerify = lazy(() => import('../pages/signup/SignupVerify'));
const SignupProfile = lazy(() => import('../pages/signup/SignupProfile'));

const ForgotPasswordEmail = lazy(
  () => import('../pages/forgot-password/ForgotPasswordEmail')
);
const ForgotPasswordOtp = lazy(
  () => import('../pages/forgot-password/ForgotPasswordOtp')
);
const ForgotPasswordReset = lazy(
  () => import('../pages/forgot-password/ForgotPasswordReset')
);

const LoadingSpinner = () => (
  <div className='min-h-screen flex items-center justify-center'>
    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
  </div>
);

export const router = createBrowserRouter([
  /* ---------- LOGIN ---------- */
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <AuthLayout />
      </Suspense>
    ),
    children: [{ index: true, element: <Login /> }],
  },
  /* ---------- SIGNUP (UNCHANGED) ---------- */
  {
    path: '/signup',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <SignupProvider>
          <AuthLayout />
        </SignupProvider>
      </Suspense>
    ),
    children: [
      { index: true, element: <SignupStart /> },
      { path: 'register', element: <SignupRegister /> },
      { path: 'verify', element: <SignupVerify /> },
      { path: 'profile', element: <SignupProfile /> },
    ],
  },

  /* ---------- FORGOT PASSWORD (FIXED) ---------- */
  {
    path: '/forgot-password',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <ForgotPasswordProvider>
          <AuthLayout />
        </ForgotPasswordProvider>
      </Suspense>
    ),
    children: [
      { index: true, element: <ForgotPasswordEmail /> },
      { path: 'otp', element: <ForgotPasswordOtp /> },
      { path: 'reset', element: <ForgotPasswordReset /> },
    ],
  },

  /* ---------- PROTECTED ---------- */
  {
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <ProtectedRoute />
      </Suspense>
    ),
    children: [
      {
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <MainLayout />
          </Suspense>
        ),
        children: [
          { index: true, element: <Navigate to='/dashboard' replace /> },
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/universities', element: <Universities /> },
          { path: '/researchers', element: <Researchers /> },
          { path: '/listings', element: <Listings /> },
          { path: '/ratings', element: <RatingsFeedback /> },
          { path: '/financials', element: <Financials /> },
          { path: '/profile', element: <Profile /> },
        ],
      },
    ],
  },

  /* ---------- FALLBACK ---------- */
  {
    path: '*',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <NotFound />
      </Suspense>
    ),
    errorElement: (
      <ErrorBoundary>
        <div className='min-h-screen flex items-center justify-center'>
          <h1 className='text-2xl font-bold text-red-600'>Routing Error</h1>
        </div>
      </ErrorBoundary>
    ),
  },
]);
