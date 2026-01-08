import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from '../ui/Loading';

interface TutorRedirectProps {
  children: React.ReactNode;
}

/**
 * Component wrapper that redirects tutors to dashboard
 * Prevents rendering children if user is a tutor
 */
const TutorRedirect: React.FC<TutorRedirectProps> = ({ children }) => {
  const navigate = useNavigate();
  const { state } = useAuth();

  useEffect(() => {
    if (state.user?.role === 'tutor') {
      navigate('/dashboard', { replace: true });
    }
  }, [state.user?.role, navigate]);

  // Show loading if user is a tutor (during redirect)
  if (state.user?.role === 'tutor') {
    return <Loading />;
  }

  return <>{children}</>;
};

export default TutorRedirect;
