import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

export default function UserMenu() {
  const { user, signOut } = useAuthContext();

  if (!user) return null;

  return (
    <Menu as="div" className="relative ml-3">
      <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
        <span className="sr-only">Open user menu</span>
        <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white">
          {user.email ? user.email[0].toUpperCase() : 'U'}
        </div>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <Link
                to="/account"
                className={`${
                  active ? 'bg-gray-100' : ''
                } block px-4 py-2 text-sm text-gray-700`}
              >
                Your Account
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={signOut}
                className={`${
                  active ? 'bg-gray-100' : ''
                } block w-full text-left px-4 py-2 text-sm text-gray-700`}
              >
                Sign out
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}