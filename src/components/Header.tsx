import { Link } from 'react-router-dom';
import { VERSION } from '../config/version.js';
import UserMenu from './layout/UserMenu.js';
import { useAuthContext } from '../context/AuthContext.js';

function Header() {
  const { user } = useAuthContext();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 flex flex-col sm:flex-row justify-between items-center">
        <div className="text-center sm:text-left mb-4 sm:mb-0">
          <Link to="/" className="text-3xl sm:text-4xl font-bold tracking-tight">
            <span className="text-sharpside-black">Sharpside</span>
            <span className="text-sharpside-green"> Sports</span>
          </Link>
          <p className="text-sm text-gray-600 tracking-wide mt-1 hidden sm:block">BET ON THE SHARPSIDE--</p>
        </div>
        <div className="flex items-center">
          {user ? (
            <UserMenu />
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default Header;