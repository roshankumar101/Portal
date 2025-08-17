import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAuth } from '../hooks/useAuth';

export default function DatabaseTest() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');
  const { user, role, loading } = useAuth();

  const testDatabase = async () => {
    try {
      console.log('Testing database connection...');
      
      // Test 1: Read all users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
      console.log('Users found:', usersList);

      // Test 2: Get current user data if logged in
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setCurrentUser({ id: userDoc.id, ...userDoc.data() });
          console.log('Current user data:', userDoc.data());
        } else {
          console.log('No user document found for UID:', user.uid);
        }
      }
    } catch (err) {
      console.error('Database test failed:', err);
      setError(err.message);
    }
  };

  useEffect(() => {
    testDatabase();
  }, [user]);

  if (loading) return <div>Loading auth...</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Database Connection Test</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Authentication Status:</h3>
          <p>User: {user ? user.email : 'Not logged in'}</p>
          <p>Role: {role || 'No role assigned'}</p>
          <p>UID: {user?.uid || 'N/A'}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Current User Document:</h3>
          {currentUser ? (
            <pre className="bg-gray-100 p-2 rounded text-sm">
              {JSON.stringify(currentUser, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-600">No user document found or not logged in</p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold">All Users in Database ({users.length}):</h3>
          {users.length > 0 ? (
            <div className="space-y-2">
              {users.map(user => (
                <div key={user.id} className="bg-gray-50 p-2 rounded">
                  <p><strong>ID:</strong> {user.id}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Full Name:</strong> {user.fullName}</p>
                  <p><strong>Role:</strong> {user.role || 'No role (will be inferred)'}</p>
                  <p><strong>Department:</strong> {user.department}</p>
                  <p><strong>CGPA:</strong> {user.cgpa}</p>
                  <p><strong>Roll No:</strong> {user.rollNo}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No users found in database</p>
          )}
        </div>

        <button 
          onClick={testDatabase}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Refresh Test
        </button>
      </div>
    </div>
  );
}
