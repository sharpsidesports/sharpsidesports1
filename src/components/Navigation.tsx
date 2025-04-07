import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export default function Navigation() {
  const { user } = useAuthContext();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 h-16">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                isActive
                  ? 'border-sharpside-green text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`
            }
          >
            Model Dashboard
          </NavLink>
          <NavLink
            to="/matchups"
            className={({ isActive }) =>
              `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                isActive
                  ? 'border-sharpside-green text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`
            }
          >
            Matchup Tool
          </NavLink>
          <NavLink
            to="/three-ball"
            className={({ isActive }) =>
              `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                isActive
                  ? 'border-sharpside-green text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`
            }
          >
            Three Ball Tool
          </NavLink>
          <NavLink
            to="/fantasy"
            className={({ isActive }) =>
              `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                isActive
                  ? 'border-sharpside-green text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`
            }
          >
            Fantasy Optimizer
          </NavLink>
          <NavLink
            to="/course-fit"
            className={({ isActive }) =>
              `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                isActive
                  ? 'border-sharpside-green text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`
            }
          >
            Course Fit Tool
          </NavLink>
          <NavLink
            to="/ai-caddie"
            className={({ isActive }) =>
              `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                isActive
                  ? 'border-sharpside-green text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`
            }
          >
            AI Caddie
          </NavLink>
          <NavLink
            to="/expert-insights"
            className={({ isActive }) =>
              `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                isActive
                  ? 'border-sharpside-green text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`
            }
          >
            Expert Insights
          </NavLink>
          <NavLink
            to="/strokes-gained"
            className={({ isActive }) =>
              `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                isActive
                  ? 'border-sharpside-green text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`
            }
          >
            Strokes Gained Stats
          </NavLink>
          <NavLink
            to="/subscription"
            className={({ isActive }) =>
              `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                isActive
                  ? 'border-sharpside-green text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`
            }
          >
            Pricing
          </NavLink>
        </div>
      </div>
    </nav>
  );
}