import React, { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';

interface User {
  id: string;
  email: string;
  isAdmin: boolean;
  created_at: string;
}

export default function Admin() {
  const { user } = useAuthContext();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      // In a real app, make API call to fetch users
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'user1@example.com',
          isAdmin: false,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          email: 'user2@example.com',
          isAdmin: true,
          created_at: new Date().toISOString()
        }
      ];
      setUsers(mockUsers);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      // In a real app, make API call to update user admin status
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, isAdmin: !user.isAdmin }
          : user
      ));
    } catch (err) {
      setError('Failed to update user admin status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage users and system settings</p>

        <div className="mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">User Management</h2>
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {loading ? 'Loading...' : 'Refresh Users'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-800 rounded-md">
              {error}
            </div>
          )}

          <div className="mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.isAdmin ? 'Admin' : 'User'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleToggleAdmin(user.id)}
                        disabled={loading}
                        className="text-green-600 hover:text-green-500"
                      >
                        {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 