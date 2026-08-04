import { Button, Input, Form } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UseForgotPassword } from '../../lib/context/ForgotPasswordContext';
import { ArrowLeft, KeyRound } from 'lucide-react';

const ForgotPasswordEmail = () => {
  const navigate = useNavigate();
  const { setEmail } = UseForgotPassword();
  const [form] = Form.useForm();

  const onFinish = (values: { email: string }) => {
    setEmail(values.email);
    navigate('/forgot-password/otp');
  };

  return (
    <div className='min-h-screen grid grid-cols-1 lg:grid-cols-2'>
      <div className='flex items-center justify-center px-6'>
        <div className='w-full max-w-md space-y-6'>
          <div className='w-full justify-center items-center flex'>
            <div className='rounded-full bg-[#F2F4FE] w-fit flex p-4'>
              <KeyRound />
            </div>
          </div>

          <h2 className='text-2xl font-semibold text-center'>
            Forgot password?
          </h2>

          <p className='text-sm text-gray-500 text-center'>
            No worries, we’ll send you reset instructions.
          </p>

          <Form
            form={form}
            layout='vertical'
            onFinish={onFinish}
          >
            <Form.Item
              name='email'
              rules={[
                { required: true, message: 'Email is required' },
                { type: 'email', message: 'Enter a valid email address' },
              ]}
            >
              <Input size='large' placeholder='Enter your email' />
            </Form.Item>

            <Button
              type='primary'
              block
              size='large'
              htmlType='submit'
            >
              Reset password
            </Button>
          </Form>

          <div
            className='cursor-pointer flex gap-2 items-center w-fit mx-auto mt-6'
            onClick={() => navigate('/login')}
          >
            <ArrowLeft size={20} />
            <span className='text-base text-[#475467]'>
              Back to log in
            </span>
          </div>
        </div>
      </div>

      <div className='hidden lg:flex items-center justify-center bg-gray-100 '>
        <img
          src='/login.png'
          alt='Laboratory equipment'
          className='w-full h-screen object-cover'
        />
      </div>
    </div>
  );
};

export default ForgotPasswordEmail;
