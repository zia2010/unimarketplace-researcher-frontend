import { Button, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UseForgotPassword } from '../../lib/context/ForgotPasswordContext';

const ForgotPasswordReset = () => {
  const navigate = useNavigate();
  const { clear } = UseForgotPassword();

  const submit = () => {
    clear(); // cleanup
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-2xl font-semibold text-center">
            Set new password
          </h2>

          <Input.Password size="large" placeholder="New password" />

          <Button type="primary" block size="large" onClick={submit}>
            Reset password
          </Button>

          <button
            className="text-sm text-blue-600 block mx-auto"
            onClick={() => navigate('/login')}
          >
            ← Back to log in
          </button>
        </div>
      </div>

     <div className='hidden lg:flex items-center justify-center bg-gray-100'>
        <img
          src='/reset-password.png'
          alt='Laboratory equipment'
          className='w-full h-screen object-cover'
        />
      </div>
    </div>
  );
};

export default ForgotPasswordReset;
