import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../hooks';
import LogoutButton from '../features/auth/LogoutButton';

const Header: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-blue-700 text-white px-6 py-3 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        Test_School
      </Link>
      <nav className="flex items-center space-x-4">
        {user ? (
          <>
            <Link to="/" className="hover:underline">
              Dashboard
            </Link>
            
            {user.role === 'student' && (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center hover:underline focus:outline-none"
                >
                  My Results
                  <svg 
                    className={`ml-1 h-4 w-4 transition-transform ${dropdownOpen ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                    <Link 
                      to="/my-results" 
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      View All Results
                    </Link>
                    <Link 
                      to="/completed-tests" 
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Completed Tests
                    </Link>
                    <Link 
                      to="/certificates" 
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      My Certificates
                    </Link>
                    <Link 
                      to="/performance" 
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Performance Analytics
                    </Link>
                  </div>
                )}
              </div>
            )}

            {user.role === 'admin' && (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center hover:underline focus:outline-none"
                >
                  Admin Panel
                  <svg 
                    className={`ml-1 h-4 w-4 transition-transform ${dropdownOpen ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                    <Link 
                      to="/admin/quizzes" 
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Manage Quizzes
                    </Link>
                    <Link 
                      to="/admin/users" 
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Manage Users
                    </Link>
                    <Link 
                      to="/admin/reports" 
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Reports
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            <LogoutButton />
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
