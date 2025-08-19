// Standalone script to fix logout redirect issue
// This script updates the logout functionality to properly redirect to landing page

const fs = require('fs');
const path = require('path');

// File paths
const authContextPath = path.join(__dirname, 'src', 'context', 'AuthContext.jsx');
const authRedirectPath = path.join(__dirname, 'src', 'components', 'AuthRedirect.jsx');

// Fix AuthContext logout function
function fixAuthContext() {
  console.log('Fixing AuthContext logout function...');
  
  const authContextContent = fs.readFileSync(authContextPath, 'utf8');
  
  // Replace the logout function to clear state and redirect properly
  const updatedAuthContext = authContextContent.replace(
    /const logout = async \(\) => \{[\s\S]*?\};/,
    `const logout = async () => {
    try {
      await signOut(auth);
      // Clear state immediately
      setUser(null);
      setRole(null);
      // Force redirect to landing page
      window.location.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear state and redirect
      setUser(null);
      setRole(null);
      window.location.replace('/');
    }
  };`
  );
  
  fs.writeFileSync(authContextPath, updatedAuthContext);
  console.log('✓ AuthContext logout function updated');
}

// Fix AuthRedirect to not interfere with logout
function fixAuthRedirect() {
  console.log('Fixing AuthRedirect component...');
  
  const authRedirectContent = fs.readFileSync(authRedirectPath, 'utf8');
  
  // Update AuthRedirect to handle logout state properly
  const updatedAuthRedirect = authRedirectContent.replace(
    /useEffect\(\(\) => \{[\s\S]*?\}, \[user, role, loading, navigate, location\.pathname\]\);/,
    `useEffect(() => {
    console.log('AuthRedirect - Auth state:', { user: !!user, role, loading, currentPath: location.pathname });
    
    if (loading) {
      console.log('AuthRedirect - Still loading, waiting...');
      return; // Wait for auth to load
    }

    // Don't redirect if we're on the landing page and user is null (logout scenario)
    if (!user && location.pathname === '/') {
      console.log('AuthRedirect - User logged out, staying on landing page');
      return;
    }

    if (user && role) {
      // User is authenticated with a role, redirect to appropriate dashboard
      const currentPath = location.pathname;
      console.log('AuthRedirect - User authenticated with role:', role, 'Current path:', currentPath);
      
      // Don't redirect if already on the correct dashboard
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
  }, [user, role, loading, navigate, location.pathname]);`
  );
  
  fs.writeFileSync(authRedirectPath, updatedAuthRedirect);
  console.log('✓ AuthRedirect component updated');
}

// Main function
function fixLogoutRedirect() {
  try {
    console.log('Starting logout redirect fix...\n');
    
    fixAuthContext();
    fixAuthRedirect();
    
    console.log('\n✅ Logout redirect fix completed!');
    console.log('Users will now be redirected to the landing page after logout.');
    
  } catch (error) {
    console.error('❌ Error fixing logout redirect:', error);
    process.exit(1);
  }
}

// Run the fix
fixLogoutRedirect();
