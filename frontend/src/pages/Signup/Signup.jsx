import React from 'react';
import { SignUp } from '@clerk/clerk-react';

export const Signup = () => {
  return (
    <SignUp
      routing="path"
      path="/signup"
      signInUrl="/login"
      fallbackRedirectUrl="/"
    />
  );
};

export default Signup;
