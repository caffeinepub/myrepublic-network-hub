import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Menu, X, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { UserRole } from '../backend';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: 'home' | 'join' | 'network' | 'dashboard' | 'admin' | 'calculator' | 'about') => void;
  userRole?: UserRole;
}

export default function Header({ currentPage, onNavigate, userRole }: HeaderProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';
  const isAdmin = userRole === UserRole.admin;

  const handleGabung = async () => {
    if (!isAuthenticated) {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    } else if (!userProfile) {
      onNavigate('join');
    } else {
      onNavigate('dashboard');
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    onNavigate('home');
  };

  const navItems = [
    { id: 'home', label: 'Beranda' },
    { id: 'network', label: 'Jaringan', authRequired: true },
    { id: 'calculator', label: 'Kalkulator' },
    { id: 'about', label: 'Tentang' },
    { id: 'dashboard', label: 'Dashboard', authRequired: true },
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Admin', authRequired: true });
  }

  return (
    <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b-2 border-purple-200 dark:border-purple-800 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('home')}>
            <div className="relative">
              <img 
                src="/assets/generated/myrepublic-network-hub-logo-transparent.dim_200x200.png" 
                alt="MyRepublic Network Hub Logo" 
                className="h-14 w-14 transition-transform group-hover:scale-110 drop-shadow-[0_0_15px_rgba(147,51,234,0.5)]" 
              />
              <div className="absolute inset-0 bg-purple-600 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity"></div>
            </div>
            <div>
              <h1 className="text-xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 bg-clip-text text-transparent">
                MyRepublic Network Hub
              </h1>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Internet Marketing Network</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {navItems.map((item) => {
              if (item.authRequired && !isAuthenticated) return null;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id as any)}
                  className={`text-sm font-bold transition-all px-4 py-2 rounded-full ${
                    currentPage === item.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-neon-purple'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3 ml-2 pl-4 border-l-2 border-purple-200 dark:border-purple-800">
              {!isAuthenticated ? (
                <Button
                  onClick={handleGabung}
                  disabled={disabled}
                  className="rounded-full px-8 py-3 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-purple-900 font-black shadow-neon-gold uppercase tracking-wide glossy border-2 border-yellow-300"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {disabled ? 'Memproses...' : 'Gabung'}
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleGabung}
                    className="rounded-full px-8 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 text-white font-black shadow-neon-purple uppercase tracking-wide glossy"
                  >
                    {userProfile ? 'Dashboard' : 'Gabung'}
                  </Button>
                  <Button
                    onClick={handleLogout}
                    disabled={disabled}
                    variant="outline"
                    className="rounded-full px-6 py-3 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950 font-bold"
                  >
                    {disabled ? 'Memproses...' : 'Keluar'}
                  </Button>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-purple-600" /> : <Menu className="w-6 h-6 text-purple-600" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-3 border-t-2 border-purple-200 dark:border-purple-800 pt-4">
            {navItems.map((item) => {
              if (item.authRequired && !isAuthenticated) return null;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-4 py-3 rounded-xl transition-all font-bold ${
                    currentPage === item.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-neon-purple'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            
            {/* Mobile Action Buttons */}
            <div className="flex flex-col gap-3 mt-2 pt-3 border-t-2 border-purple-200 dark:border-purple-800">
              {!isAuthenticated ? (
                <Button
                  onClick={() => {
                    handleGabung();
                    setMobileMenuOpen(false);
                  }}
                  disabled={disabled}
                  className="w-full rounded-full py-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-purple-900 font-black shadow-neon-gold uppercase tracking-wide glossy border-2 border-yellow-300"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {disabled ? 'Memproses...' : 'Gabung'}
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      handleGabung();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full rounded-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 text-white font-black shadow-neon-purple uppercase tracking-wide glossy"
                  >
                    {userProfile ? 'Dashboard' : 'Gabung'}
                  </Button>
                  <Button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    disabled={disabled}
                    variant="outline"
                    className="w-full rounded-full py-4 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950 font-bold"
                  >
                    {disabled ? 'Memproses...' : 'Keluar'}
                  </Button>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
