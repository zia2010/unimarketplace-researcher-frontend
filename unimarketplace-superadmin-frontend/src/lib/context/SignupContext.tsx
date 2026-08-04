import React, { createContext, useContext, useState } from 'react';

type SignupData = {
  email?: string;
  phone?: string;
  password?: string;
  name?: string;
  university?: string;
  gender?: string;
  dob?: {
    day?: number;
    month?: number;
    year?: number;
  };
};

type SignupContextType = {
  data: SignupData;
  update: (values: Partial<SignupData>) => void;
  reset: () => void;
};

const SignupContext = createContext<SignupContextType | null>(null);

export const SignupProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<SignupData>({});

  const update = (values: Partial<SignupData>) =>
    setData((prev) => ({ ...prev, ...values }));

  const reset = () => setData({});

  return (
    <SignupContext.Provider value={{ data, update, reset }}>
      {children}
    </SignupContext.Provider>
  );
};

export const UseSignup = () => {
  const ctx = useContext(SignupContext);
  if (!ctx) {
    throw new Error('useSignup must be used inside SignupProvider');
  }
  return ctx;
};
