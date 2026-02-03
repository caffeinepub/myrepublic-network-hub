import { Home, Network, Calculator, LayoutDashboard, UserPlus, Info, Shield } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { UserRole } from '../backend';

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: 'home' | 'network' | 'calculator' | 'dashboard' | 'join' | 'about' | 'admin') => void;
  userRole?: UserRole;
}

export default function BottomNav({ currentPage, onNavigate, userRole }: BottomNavProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const isAdmin = userRole === UserRole.admin;

  const navItems = [
    { id: 'home', label: 'Beranda', icon: Home, authRequired: false },
    { id: 'network', label: 'Jaringan', icon: Network, authRequired: true },
    { id: 'calculator', label: 'Kalkulator', icon: Calculator, authRequired: false },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, authRequired: true },
    { id: 'join', label: 'Gabung', icon: UserPlus, authRequired: false },
    { id: 'about', label: 'Tentang', icon: Info, authRequired: false },
  ];

  // Add admin tab only for admin users
  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Admin', icon: Shield, authRequired: true });
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t-2 border-purple-300 dark:border-purple-700 shadow-neon-purple z-50">
      <div className="flex items-center justify-around px-1 py-2">
        {navItems.map((item) => {
          if (item.authRequired && !isAuthenticated) return null;
          
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as any)}
              className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-lg transition-all min-w-[50px] ${
                isActive
                  ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-neon-purple scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-purple-100 dark:hover:bg-purple-900/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
              <span className={`text-[10px] font-bold ${isActive ? 'glow-text-purple' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
