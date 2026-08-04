import { Button, Input } from 'antd';
import type { InputRef } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UseForgotPassword } from '../../lib/context/ForgotPasswordContext';
import { KeyRound } from 'lucide-react';

const OTP_LENGTH = 6;

const ForgotPasswordOtp = () => {
  const navigate = useNavigate();
  const { setOtp } = UseForgotPassword();

  const [seconds, setSeconds] = useState(30);
  const [otp, setOtpLocal] = useState<string[]>(
    Array(OTP_LENGTH).fill('')
  );

  const inputsRef = useRef<(InputRef | null)[]>([]);

  /* Countdown timer */
  useEffect(() => {
    if (seconds === 0) return;

    const timer = setTimeout(() => {
      setSeconds((s) => s - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const next = [...otp];
    next[index] = value;
    setOtpLocal(next);

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const resend = () => {
    setSeconds(30);
    setOtpLocal(Array(OTP_LENGTH).fill(''));
    inputsRef.current[0]?.focus();
  };

  const isComplete = otp.every(Boolean);

  const verify = () => {
    const finalOtp = otp.join('');
    setOtp(finalOtp); // ✅ set ONCE, no loop
    navigate('/forgot-password/reset');
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md space-y-6">
          <div className="w-full flex justify-center">
            <div className="rounded-full bg-[#F2F4FE] p-4">
              <KeyRound />
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-center">
            Enter verification code
          </h2>

          <p className="text-sm text-gray-500 text-center">
            We’ve sent a 6-digit code to your email.
          </p>

          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => {
                  inputsRef.current[index] = el; // ✅ FIXED
                }}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength={1}
                inputMode="numeric"
                size="large"
                className="text-center text-lg font-semibold"
              />
            ))}
          </div>

          <Button
            type="primary"
            block
            size="large"
            disabled={!isComplete}
            onClick={verify}
          >
            Verify
          </Button>

          <button
            disabled={seconds > 0}
            onClick={resend}
            className={`text-sm mx-auto block ${
              seconds > 0 ? 'text-gray-400' : 'text-blue-600'
            }`}
          >
            Resend OTP {seconds > 0 && `(${seconds}s)`}
          </button>
        </div>
      </div>

      <div className="hidden lg:flex items-center justify-center bg-gray-100">
        <img
          src="/forgot-password.png"
          alt="Forgot password"
          className="w-full h-screen object-cover"
        />
      </div>
    </div>
  );
};

export default ForgotPasswordOtp;
