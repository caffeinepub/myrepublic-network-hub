import { useInternetIdentity } from './useInternetIdentity';
import { useGetCallerUserProfile, useGetCurrentUserRole } from './useQueries';
import { UserRole, ProfileCompletionStatus } from '@/backend';

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  ctaLabel?: string;
  ctaAction?: () => void;
}

export function useOnboardingSteps(onNavigate?: (page: 'join' | 'dashboard' | 'home') => void) {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: userRole } = useGetCurrentUserRole();

  const isAuthenticated = !!identity;
  const isAdmin = userRole === UserRole.admin;
  const isRegistered = !!userProfile;
  const isProfileComplete = userProfile?.profileCompletionStatus === ProfileCompletionStatus.complete;
  const isVerified = userProfile?.registrationFields.subscriptionsVerified || false;

  // Admin users skip all steps
  if (isAdmin) {
    return {
      steps: [],
      currentStepIndex: -1,
      isLoading: profileLoading,
    };
  }

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: 'Step 1: Login',
      description: 'Authenticate using Internet Identity to access the platform',
      status: isAuthenticated ? 'completed' : 'current',
      ctaLabel: isAuthenticated ? undefined : 'Login Now',
      ctaAction: isAuthenticated ? undefined : () => {
        // Login action handled by parent component
      },
    },
    {
      id: 2,
      title: 'Step 2: Join as Member',
      description: 'Register your basic information to become a member',
      status: !isAuthenticated ? 'upcoming' : isRegistered ? 'completed' : 'current',
      ctaLabel: !isAuthenticated ? undefined : isRegistered ? undefined : 'Join Now',
      ctaAction: !isAuthenticated ? undefined : isRegistered ? undefined : () => {
        onNavigate?.('join');
      },
    },
    {
      id: 3,
      title: 'Step 3: Complete Your Profile',
      description: 'Fill in your complete profile including sponsor ID, bank account, and address',
      status: !isRegistered ? 'upcoming' : isProfileComplete ? 'completed' : 'current',
      ctaLabel: !isRegistered ? undefined : isProfileComplete ? undefined : 'Complete Profile',
      ctaAction: !isRegistered ? undefined : isProfileComplete ? undefined : () => {
        onNavigate?.('dashboard');
      },
    },
    {
      id: 4,
      title: 'Step 4: Subscribe via WhatsApp',
      description: 'Choose a package and subscribe through WhatsApp to get verified',
      status: !isProfileComplete ? 'upcoming' : isVerified ? 'completed' : 'current',
      ctaLabel: !isProfileComplete ? undefined : isVerified ? undefined : 'View Packages',
      ctaAction: !isProfileComplete ? undefined : isVerified ? undefined : () => {
        onNavigate?.('home');
        // Scroll to packages section after navigation
        setTimeout(() => {
          const packagesSection = document.querySelector('section:nth-of-type(2)');
          packagesSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      },
    },
    {
      id: 5,
      title: 'Step 5: Get Verified',
      description: 'After subscribing, you will receive "Verified" status',
      status: !isVerified ? 'upcoming' : 'completed',
    },
    {
      id: 6,
      title: 'Step 6: Start Recruiting',
      description: 'Share your referral ID and recruit new members to earn commissions',
      status: !isVerified ? 'upcoming' : 'completed',
      ctaLabel: isVerified ? 'Go to Dashboard' : undefined,
      ctaAction: isVerified ? () => {
        onNavigate?.('dashboard');
      } : undefined,
    },
  ];

  const currentStepIndex = steps.findIndex(step => step.status === 'current');

  return {
    steps,
    currentStepIndex,
    isLoading: profileLoading && !isFetched,
  };
}
