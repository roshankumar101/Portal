/**
 * Simple test to verify authentication flow
 * Run this in browser console or as a development test
 */

console.log('Testing authentication flow...');

// Test 1: Check if Firebase is properly initialized
try {
  import('./firebase.js').then(({ auth, db }) => {
    console.log('✅ Firebase initialized successfully');
    console.log('Auth:', auth);
    console.log('Firestore:', db);
  }).catch(err => {
    console.error('❌ Firebase initialization failed:', err);
  });
} catch (err) {
  console.error('❌ Error importing Firebase:', err);
}

// Test 2: Check if AuthContext is properly setup
try {
  import('./hooks/useAuth.js').then(({ useAuth }) => {
    console.log('✅ useAuth hook imported successfully');
  }).catch(err => {
    console.error('❌ useAuth hook import failed:', err);
  });
} catch (err) {
  console.error('❌ Error importing useAuth:', err);
}

// Test 3: Check routing components
const testRoutes = [
  './pages/dashboard/StudentDashboard.jsx',
  './pages/dashboard/RecruiterDashboard.jsx', 
  './pages/dashboard/AdminDashboard.jsx',
  './pages/Login.jsx',
  './components/ProtectedRoute.jsx'
];

testRoutes.forEach(route => {
  try {
    import(route).then(() => {
      console.log(`✅ ${route} imported successfully`);
    }).catch(err => {
      console.error(`❌ ${route} import failed:`, err);
    });
  } catch (err) {
    console.error(`❌ Error importing ${route}:`, err);
  }
});

console.log('Authentication test completed. Check above for any errors.');
