import { useGetCurrentUserRole } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import { UserRole } from '../backend';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
  onUnauthorized?: () => void;
}

export default function RouteGuard({ children, requiredRole }: RouteGuardProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userRole, isLoading: roleLoading } = useGetCurrentUserRole();

  const isAuthenticated = !!identity;

  // Show loading state
  if (isInitializing || roleLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4 shadow-neon-purple"></div>
          <p className="text-gray-600 font-semibold">Checking access...</p>
        </div>
      </div>
    );
  }

  // Check authentication
  if (requiredRole && !isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert className="max-w-md mx-auto border-yellow-200 bg-yellow-50">
          <ShieldAlert className="h-5 w-5 text-yellow-600" />
          <AlertDescription className="text-yellow-800 ml-2">
            You must be logged in to access this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Check admin role
  if (requiredRole === 'admin' && userRole !== UserRole.admin) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert className="max-w-md mx-auto border-red-200 bg-red-50">
          <ShieldAlert className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-800 ml-2">
            Access denied. Only administrators can access this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}
