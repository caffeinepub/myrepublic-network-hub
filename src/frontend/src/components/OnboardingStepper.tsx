import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { useOnboardingSteps } from '@/hooks/useOnboardingSteps';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';

interface OnboardingStepperProps {
  onNavigate?: (page: 'join' | 'dashboard' | 'home') => void;
}

export default function OnboardingStepper({ onNavigate }: OnboardingStepperProps) {
  const { login, loginStatus } = useInternetIdentity();
  const { steps, isLoading } = useOnboardingSteps(onNavigate);

  // Don't show stepper for admin users
  if (steps.length === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <Card className="border-2 border-purple-300 dark:border-purple-700 shadow-neon-purple">
        <CardContent className="py-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-purple-300 dark:border-purple-700 shadow-neon-purple bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950">
      <CardHeader>
        <CardTitle className="text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 bg-clip-text text-transparent">
          Getting Started Guide
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
          Follow these steps to unlock all features and start earning commissions
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';
          const isUpcoming = step.status === 'upcoming';

          return (
            <div
              key={step.id}
              className={`relative flex gap-4 p-4 rounded-xl transition-all ${
                isCurrent
                  ? 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 border-2 border-purple-400 dark:border-purple-600 shadow-lg'
                  : isCompleted
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-300 dark:border-green-700'
                  : 'bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800'
              }`}
            >
              {/* Step Icon */}
              <div className="flex-shrink-0 pt-1">
                {isCompleted ? (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-neon-purple animate-pulse">
                    <span className="text-white font-black text-sm">{step.id}</span>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                    <Circle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-bold text-base mb-1 ${
                    isCurrent
                      ? 'text-purple-900 dark:text-purple-100'
                      : isCompleted
                      ? 'text-green-900 dark:text-green-100'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`text-sm ${
                    isCurrent
                      ? 'text-purple-700 dark:text-purple-300'
                      : isCompleted
                      ? 'text-green-700 dark:text-green-300'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {step.description}
                </p>

                {/* CTA Button for current step */}
                {isCurrent && step.ctaLabel && (
                  <div className="mt-3">
                    <Button
                      onClick={() => {
                        if (step.id === 1) {
                          // Special handling for login
                          login();
                        } else if (step.ctaAction) {
                          step.ctaAction();
                        }
                      }}
                      disabled={step.id === 1 && loginStatus === 'logging-in'}
                      className="rounded-full px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-neon-purple text-sm"
                    >
                      {step.id === 1 && loginStatus === 'logging-in' ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        step.ctaLabel
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute left-[1.9rem] top-[3.5rem] w-0.5 h-[calc(100%+0.5rem)] ${
                    isCompleted
                      ? 'bg-gradient-to-b from-green-400 to-green-600'
                      : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                />
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
