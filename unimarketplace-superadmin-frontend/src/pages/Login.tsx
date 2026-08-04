import React, { useState } from 'react';
import { Form, Input, Button, Divider, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/context/AuthContext';
import { LoginCredentials } from '../lib/types';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: LoginCredentials) => {
    setLoading(true);
    try {
      await login(values);
      message.success('Login successful');
      navigate('/dashboard', { replace: true });
    } catch {
      message.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen w-full grid grid-cols-1 lg:grid-cols-2'>
      {/* LEFT: LOGIN CONTENT */}
      <div className='flex items-center justify-center px-6 py-12'>
        <div className='w-full max-w-md space-y-6'>
          {/* Heading */}
          <div className='text-center'>
            <h1 className='text-3xl font-semibold text-gray-900'>
              Welcome back
            </h1>
            <p className='mt-2 text-sm text-gray-500'>
              Level up your experiments by experiencing premium equipments & services 
            </p>
          </div>

          {/* Social login */}
          <div className='space-y-3'>
            <Button block size='large'>
              Continue with Google
            </Button>
            <Button block size='large'>
              Continue with Facebook
            </Button>
            <Button block size='large'>
              Continue with Apple
            </Button>
          </div>

          {/* Divider */}
          <Divider plain className='text-gray-400'>
            OR
          </Divider>

          {/* Login form */}
          <Form layout='vertical' onFinish={onFinish}>
            <Form.Item
              name='email'
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Enter a valid email' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder='User name or email address'
                size='large'
              />
            </Form.Item>

            <Form.Item
              name='password'
              rules={[
                { required: true, message: 'Please enter your password' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder='Your password'
                size='large'
              />
            </Form.Item>

            <div className='text-right mb-4'>
              <Button
                type='link'
                size='small'
                className='p-0'
                onClick={() => navigate('/forgot-password')}
              >
                Forget your password
              </Button>
            </div>

            <Button
              type='primary'
              htmlType='submit'
              block
              size='large'
              loading={loading}
            >
              Sign in
            </Button>
          </Form>

          {/* Switch to signup */}
          <p className='text-sm text-center text-gray-600'>
            Don’t have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className='text-blue-600 font-medium hover:underline'
            >
              Sign up
            </button>
          </p>
        </div>
      </div>

      {/* RIGHT: PLACEHOLDER / IMAGE */}
      <div className='hidden lg:flex items-center justify-cente'>
        
        <img
          src="/siginin.png"
          alt="Laboratory equipment"
          className="w-full h-screen object-cover"
        />
       
      </div>
    </div>
  );
};

export default Login;
