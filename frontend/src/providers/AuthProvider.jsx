import { ClerkProvider, useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import { createContext, useState, useEffect, useContext } from 'react';
import { CLERK_PUBLISHABLE_KEY } from '../config/clerk';
import axiosInstance, { setTokenResolver } from '../apis/axios';

const CustomAuthContext = createContext(null);

export const useAuth = () => useContext(CustomAuthContext);

const AuthSyncProvider = ({ children }) => {
  const { isSignedIn, isLoaded: isClerkLoaded, getToken } = useClerkAuth();
  const { user } = useUser();
  const [role, setRole] = useState(null);
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isClerkLoaded && isSignedIn) {
      setTokenResolver(() => getToken());
    } else {
      setTokenResolver(null);
    }
  }, [isClerkLoaded, isSignedIn, getToken]);

  useEffect(() => {
    const syncUserSession = async () => {
      if (!isClerkLoaded) return;

      if (!isSignedIn) {
        setRole(null);
        setCandidateProfile(null);
        setIsLoading(false);
        return;
      }

      try {
        const userRole = user?.publicMetadata?.role || 'candidate';
        setRole(userRole);

        if (userRole === 'candidate') {
          try {
            const response = await axiosInstance.get('/auth/me');
            setCandidateProfile(response.data.data);
          } catch (error) {
            if (error.response?.status === 400 || error.response?.status === 404 || error.response?.data?.message?.includes('not found')) {
              try {
                const registerResponse = await axiosInstance.post('/auth/register', {
                  email: user.primaryEmailAddress?.emailAddress,
                  firstName: user.firstName || 'Candidate',
                  lastName: user.lastName || '',
                  phone: user.phoneNumbers?.[0]?.phoneNumber || '',
                });
                setCandidateProfile(registerResponse.data.data);
              } catch (regError) {
                console.error('Failed to sync candidate profile to Postgres:', regError);
              }
            } else {
              console.error('Failed to retrieve candidate profile:', error);
            }
          }
        }
      } catch (err) {
        console.error('Error in auth sync process:', err);
      } finally {
        setIsLoading(false);
      }
    };

    syncUserSession();
  }, [isSignedIn, isClerkLoaded, user]);

  return (
    <CustomAuthContext.Provider
      value={{
        isSignedIn,
        isLoaded: isClerkLoaded && !isLoading,
        user,
        role,
        candidateProfile,
        setCandidateProfile,
      }}
    >
      {children}
    </CustomAuthContext.Provider>
  );
};

export const AuthProvider = ({ children }) => {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <AuthSyncProvider>{children}</AuthSyncProvider>
    </ClerkProvider>
  );
};

export default AuthProvider;
