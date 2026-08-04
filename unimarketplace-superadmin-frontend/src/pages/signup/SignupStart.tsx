import { Button, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';

const SignupStart = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT: CONTENT */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-6">
          {/* Heading */}
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-gray-900 leading-tight">
              Level up your experiments by experiencing premium equipments & services
            </h1>

            <p className="mt-3 text-sm text-gray-500">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              <br />
              Morbi lobortis maximus
            </p>
          </div>

          {/* Social buttons */}
          <div className="space-y-3">
            <Button block size="large">
              Continue with Google
            </Button>

            <Button block size="large">
              Continue with Facebook
            </Button>

            <Button block size="large">
              Continue with Apple
            </Button>
          </div>

          {/* Divider */}
          <Divider plain className="text-gray-400">
            OR
          </Divider>

          {/* Email signup */}
          <Button
            type="primary"
            block
            size="large"
            onClick={() => navigate('/signup/register')}
          >
            Sign up with email
          </Button>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center">
            By signing up, you agree to the{' '}
            <span className="underline cursor-pointer">Terms of Service</span> and{' '}
            <span className="underline cursor-pointer">Privacy Policy</span>, including
            cookie use.
          </p>

          {/* Switch to login */}
          <p className="text-sm text-center text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 font-medium hover:underline"
            >
              Log in
            </button>
          </p>
        </div>
      </div>

      {/* RIGHT: PLACEHOLDER (desktop only) */}
      <div className="hidden lg:flex items-center justify-center bg-gray-100">
       <img
          src="/login.png"
          alt="Laboratory equipment"
          className="w-full h-screen object-cover"
        />
      </div>
    </div>
  );
};

export default SignupStart;
