import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import NotificationProvider from './providers/NotificationProvider';
import ThemeProvider from './providers/ThemeProvider';
import AuthProvider from './providers/AuthProvider';

export const App = () => {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <ThemeProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </ThemeProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
};

export default App;
