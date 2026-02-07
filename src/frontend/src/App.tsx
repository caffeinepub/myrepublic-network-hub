import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetCurrentUserRole, useIsProfileComplete } from './hooks/useQueries';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import RouteGuard from './components/RouteGuard';
import ProfileSetupModal from './components/ProfileSetupModal';
import HomePage from './pages/HomePage';
import JoinPage from './pages/JoinPage';
import NetworkPage from './pages/NetworkPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CalculatorPage from './pages/CalculatorPage';
import AboutPage from './pages/AboutPage';
import { useState, useEffect } from 'react';
import { UserRole } from './backend';
import { getPageFromPath, navigateToPage, setupPopstateListener, type PageType } from './utils/clientRouting';

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: userRole } = useGetCurrentUserRole();
  const { data: isProfileComplete, isLoading: profileCompleteLoading } = useIsProfileComplete();
  
  // Initialize currentPage from URL
  const [currentPage, setCurrentPage] = useState<PageType>(() => getPageFromPath(window.location.pathname));
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  const isAuthenticated = !!identity;
  const isAdmin = userRole === UserRole.admin;

  // Set up browser back/forward navigation
  useEffect(() => {
    const cleanup = setupPopstateListener(setCurrentPage);
    return cleanup;
  }, []);

  // Redirect authenticated users without profile to join page
  useEffect(() => {
    if (isAuthenticated && !profileLoading && isFetched && userProfile === null && currentPage !== 'join') {
      navigateToPage('join', setCurrentPage);
    }
  }, [isAuthenticated, profileLoading, isFetched, userProfile, currentPage]);

  // Show profile setup modal for incomplete profiles (non-admin only)
  useEffect(() => {
    if (isAuthenticated && !profileCompleteLoading && isProfileComplete === false && !isAdmin) {
      setShowProfileSetup(true);
    } else {
      setShowProfileSetup(false);
    }
  }, [isAuthenticated, profileCompleteLoading, isProfileComplete, isAdmin]);

  // Navigation handler that updates both state and URL
  const handleNavigate = (page: PageType) => {
    navigateToPage(page, setCurrentPage);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4 shadow-neon-purple"></div>
          <p className="text-gray-600 font-semibold">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <Header currentPage={currentPage} onNavigate={handleNavigate} userRole={userRole} />
        
        <main className="flex-1 pb-20 md:pb-0">
          {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
          {currentPage === 'join' && <JoinPage onNavigate={handleNavigate} />}
          {currentPage === 'network' && (
            <RouteGuard requiredRole="user">
              <NetworkPage />
            </RouteGuard>
          )}
          {currentPage === 'dashboard' && (
            <RouteGuard requiredRole="user">
              <DashboardPage onNavigate={handleNavigate} />
            </RouteGuard>
          )}
          {currentPage === 'admin' && (
            <RouteGuard requiredRole="admin">
              <AdminDashboardPage />
            </RouteGuard>
          )}
          {currentPage === 'calculator' && <CalculatorPage />}
          {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}
        </main>

        <Footer />
        
        {/* Mobile Bottom Navigation */}
        <BottomNav currentPage={currentPage} onNavigate={handleNavigate} userRole={userRole} />
        
        {/* Profile Setup Modal */}
        <ProfileSetupModal open={showProfileSetup} onOpenChange={setShowProfileSetup} />
        
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
