import React from 'react';
import { Link } from 'react-router-dom';
import { VERSION } from '../config/version';
import UserMenu from './layout/UserMenu';
import { useAuthContext } from '../context/AuthContext';

function Header() {
  const { user } = useAuthContext();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 flex flex-col sm:flex-row justify-between items-center">
        <div className="text-center sm:text-left mb-4 sm:mb-0">
          <Link to="/" className="text-3xl sm:text-4xl font-bold tracking-tight">
            <span className="text-sharpside-black">SHARPSIDE</span>
            <span className="text-sharpside-green"> GOLF</span>
          </Link>
          <p className="text-sm text-gray-600 tracking-wide mt-1 hidden sm:block">BET ON THE SHARPSIDE</p>
          <div className="text-xs text-gray-500 mt-1 hidden sm:block">
            Version {VERSION.major}.{VERSION.minor}.{VERSION.patch} - {VERSION.label}
          </div>
        </div>
        <div className="flex items-center">
          {user ? (
            <UserMenu />
          ) : (
            <Link
              to="/auth"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;