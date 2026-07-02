import React from 'react';
import { SignIn } from '@clerk/clerk-react';

export const Login = () => {
  return (
    <SignIn
      routing="path"
      path="/login"
      signUpUrl="/signup"
      fallbackRedirectUrl="/"
    />
  );
};

export default Login;
