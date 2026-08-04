import React, { createContext, useContext, useState } from 'react';

interface ForgotPasswordState {
  email: string;
  otp: string;
}

interface ForgotPasswordContextType {
  data: ForgotPasswordState;
  setEmail: (email: string) => void;
  setOtp: (otp: string) => void;
  clear: () => void;
}

const ForgotPasswordContext = createContext<ForgotPasswordContextType | null>(
  null
);

export const ForgotPasswordProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<ForgotPasswordState>({
    email: '',
    otp: '',
  });

  return (
    <ForgotPasswordContext.Provider
      value={{
        data,
        setEmail: (email) => setData((p) => ({ ...p, email })),
        setOtp: (otp) => setData((p) => ({ ...p, otp })),
        clear: () => setData({ email: '', otp: '' }),
      }}
    >
      {children}
    </ForgotPasswordContext.Provider>
  );
};

export const UseForgotPassword = () => {
  const ctx = useContext(ForgotPasswordContext);
  if (!ctx) throw new Error('ForgotPasswordContext missing');
  return ctx;
};
