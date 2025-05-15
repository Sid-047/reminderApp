import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Calendar, CheckSquare, LogOut, Moon, Sun, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/Button';

export const AppHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-primary-600 dark:text-primary-500 font-bold text-xl flex items-center">
                <CheckSquare className="h-6 w-6 mr-2" /> 
                Remainder
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <button 
              className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </button>
            <button 
              className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              onClick={() => navigate('/calendar')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </button>
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-2">
            <button
              className="btn-icon text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500 rounded-full p-2"
              onClick={toggleDarkMode}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            <button
              className="btn-icon text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500 rounded-full p-2 relative"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-error-500"></span>
            </button>
            
            <div className="relative ml-2">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2 hidden md:block">
                  {user?.name}
                </span>
                <div className="h-8 w-8 rounded-full bg-primary-600 text-white flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 dark:text-gray-300 hover:text-error-500 dark:hover:text-error-500"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};