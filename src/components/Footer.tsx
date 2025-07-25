import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold mb-4">
              <span className="text-white">SHARPSIDE</span>
              <span className="text-green-500"> SPORTS</span>
            </div>
            <p className="text-gray-300 mb-4">
              Premier handicapping and tools service dedicated to helping you gain an edge and beat the book.
            </p>
            <p className="text-sm text-gray-400">
              BET ON THE SHARPSIDE
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/subscription" className="text-gray-300 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/expert-insights" className="text-gray-300 hover:text-white transition-colors">
                  Betting Picks
                </Link>
              </li>
              <li>
                <Link to="/reception-model" className="text-gray-300 hover:text-white transition-colors">
                  NFL Reception Model
                </Link>
              </li>
              <li>
                <Link to="/account" className="text-gray-300 hover:text-white transition-colors">
                  Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/subscription-management" className="text-gray-300 hover:text-white transition-colors">
                  Subscription Management
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:info@sharpsidesports.com" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Sharpside Sports. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 