import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { UserRole } from '../backend';
import type { PageType } from '../utils/clientRouting';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: PageType) => void;
  userRole?: UserRole;
}

export default function Header({ currentPage, onNavigate, userRole }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isAdmin = userRole === UserRole.admin;
  const disabled = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      onNavigate('home');
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navItems = [
    { id: 'home' as PageType, label: 'Beranda' },
    { id: 'calculator' as PageType, label: 'Kalkulator' },
    { id: 'about' as PageType, label: 'Tentang' },
  ];

  if (isAuthenticated) {
    navItems.push(
      { id: 'network' as PageType, label: 'Jaringan' },
      { id: 'dashboard' as PageType, label: 'Dashboard' }
    );
  }

  if (isAdmin && userRole !== undefined) {
    navItems.push({ id: 'admin' as PageType, label: 'Admin' });
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b-2 border-purple-300 dark:border-purple-700 shadow-neon-purple">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-neon-purple">
              <span className="text-white font-black text-xl">M</span>
            </div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 bg-clip-text text-transparent">
              MyRepublic Network Hub
            </h1>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`font-bold transition-all ${
                  currentPage === item.id
                    ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600'
                    : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button
              onClick={handleAuth}
              disabled={disabled}
              variant={isAuthenticated ? 'outline' : 'default'}
              className={`rounded-full px-6 font-bold ${
                isAuthenticated
                  ? 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-neon-purple'
              }`}
            >
              {disabled ? 'Processing...' : isAuthenticated ? 'Logout' : 'Login'}
            </Button>
            
            {!isAuthenticated && (
              <Button
                onClick={() => onNavigate('join')}
                className="rounded-full px-8 py-6 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-purple-900 font-black shadow-neon-gold text-lg uppercase tracking-wide glossy pulse-glow border-2 border-yellow-300"
              >
                Gabung
              </Button>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-purple-200 dark:border-purple-800 pt-4">
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-4 py-2 rounded-lg font-bold transition-all ${
                    currentPage === item.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <Button
                onClick={() => {
                  handleAuth();
                  setMobileMenuOpen(false);
                }}
                disabled={disabled}
                variant={isAuthenticated ? 'outline' : 'default'}
                className={`rounded-full font-bold ${
                  isAuthenticated
                    ? 'border-2 border-purple-600 text-purple-600'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                }`}
              >
                {disabled ? 'Processing...' : isAuthenticated ? 'Logout' : 'Login'}
              </Button>
              {!isAuthenticated && (
                <Button
                  onClick={() => {
                    onNavigate('join');
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-purple-900 font-black"
                >
                  Gabung
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
