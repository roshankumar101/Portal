import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function AuthRedirect() {
  const { user, role, userStatus, loading, emailVerified } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('AuthRedirect - Auth state:', { user: !!user, role, loading, currentPath: location.pathname });
    
    if (loading) {
      console.log('AuthRedirect - Still loading, waiting...');
      return; // Wait for auth to load
    }

    if (user && role) {
      // User is authenticated with a role, check verification status from Firestore
      const currentPath = location.pathname;
      console.log('AuthRedirect - User authenticated with role:', role, 'status:', userStatus, 'Current path:', currentPath);
      
      // Public paths accessible to logged-in users without a redirect.
      const publicPaths = ['/', '/dev-team', '/test'];

      // Don't redirect if the user is on an allowed public page.
      if (publicPaths.includes(currentPath)) {
        console.log(`AuthRedirect - User on allowed public page (${currentPath}), not redirecting`);
        return;
      }
      
      // Direct role-based redirects (simplified - no status checks)
      if (role === 'student' && currentPath !== '/student') {
        console.log('AuthRedirect - Redirecting to student dashboard');
        navigate('/student', { replace: true });
      } else if (role === 'recruiter' && currentPath !== '/recruiter') {
        console.log('AuthRedirect - Redirecting to recruiter dashboard');
        navigate('/recruiter', { replace: true });
      } else if (role === 'admin' && currentPath !== '/admin') {
        console.log('AuthRedirect - Redirecting to admin dashboard');
        navigate('/admin', { replace: true });
      } else {
        console.log('AuthRedirect - Already on correct dashboard or no redirect needed');
      }
    } else if (user && !role) {
      // User is authenticated but no role assigned, stay on home page
      console.log('AuthRedirect - User authenticated but no role, staying on home');
      if (location.pathname !== '/') {
        navigate('/', { replace: true });
      }
    } else {
      console.log('AuthRedirect - User not authenticated');
    }
    // If user is null (not authenticated), let ProtectedRoute handle redirects
  }, [user, role, userStatus, loading, navigate, location.pathname]);

  return null; // This component doesn't render anything
}
