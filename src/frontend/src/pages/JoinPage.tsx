import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegisterMember, useGetCallerUserProfile, useGetCurrentUserRole } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Sparkles, Rocket } from 'lucide-react';

interface JoinPageProps {
  onNavigate?: (page: 'dashboard') => void;
}

export default function JoinPage({ onNavigate }: JoinPageProps) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');

  const { mutate: registerMember, isPending, isSuccess, error } = useRegisterMember();
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: userRole, isLoading: roleLoading } = useGetCurrentUserRole();

  const isAuthenticated = !!identity;
  const isAdmin = userRole === 'admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim() || !contact.trim()) {
      return;
    }

    registerMember({
      name: name.trim(),
      contact: contact.trim(),
    });
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card className="border-2 border-purple-300 dark:border-purple-700 shadow-neon-purple overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 opacity-10"></div>
            <CardHeader className="text-center relative z-10">
              <Sparkles className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <CardTitle className="text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 bg-clip-text text-transparent">
                Gabung sebagai Member
              </CardTitle>
              <CardDescription className="text-base">
                Silakan login terlebih dahulu untuk mendaftar sebagai member
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center relative z-10">
              <Button 
                onClick={login} 
                disabled={loginStatus === 'logging-in'}
                className="rounded-full px-10 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 text-white font-black shadow-neon-purple text-lg"
              >
                {loginStatus === 'logging-in' ? 'Memproses...' : 'Login dengan Internet Identity'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show loading while checking profile
  if (profileLoading || roleLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4 shadow-neon-purple"></div>
          <p className="text-gray-600 dark:text-gray-300 font-semibold">Memeriksa status pendaftaran...</p>
        </div>
      </div>
    );
  }

  // If user already has profile, redirect to dashboard
  if (userProfile) {
    if (onNavigate) {
      onNavigate('dashboard');
    }
    return null;
  }

  // Show success message
  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card className="border-2 border-green-300 dark:border-green-700 shadow-neon-gold overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-yellow-400 to-green-500 opacity-10"></div>
            <CardHeader className="text-center relative z-10">
              <div className="relative inline-block mx-auto mb-4">
                <CheckCircle2 className="w-20 h-20 text-green-600 animate-bounce" />
                <Sparkles className="w-8 h-8 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
              </div>
              <CardTitle className="text-3xl font-black text-green-800 dark:text-green-300">Pendaftaran Berhasil!</CardTitle>
              <CardDescription className="text-green-700 dark:text-green-400 text-base font-semibold">
                {isAdmin 
                  ? 'Selamat! Anda telah terdaftar sebagai admin MyRepublic Network Hub.'
                  : 'Selamat! Akun Anda telah dibuat. Silakan lengkapi profil Anda untuk melanjutkan.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center relative z-10">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 font-medium">
                {isAdmin
                  ? 'Akun admin Anda telah berhasil dibuat. Silakan cek dashboard untuk mengelola sistem.'
                  : 'Anda akan diarahkan untuk melengkapi profil Anda. Pastikan semua data terisi dengan benar.'}
              </p>
              {onNavigate && (
                <Button 
                  onClick={() => onNavigate('dashboard')}
                  className="rounded-full px-10 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 text-white font-black shadow-neon-purple text-lg"
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  Lanjutkan
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show registration form
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Card className="border-2 border-purple-300 dark:border-purple-700 shadow-neon-purple">
          <CardHeader>
            <CardTitle className="text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 bg-clip-text text-transparent">
              Formulir Pendaftaran Member
            </CardTitle>
            <CardDescription className="text-base">
              Lengkapi informasi dasar untuk mendaftar sebagai member
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6 border-2 border-purple-300 dark:border-purple-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
              <AlertCircle className="h-5 w-5 text-purple-600" />
              <AlertDescription className="text-purple-800 dark:text-purple-200 font-semibold ml-2">
                <strong>Catatan:</strong> Setelah pendaftaran, Anda akan diminta untuk melengkapi profil lengkap Anda.
              </AlertDescription>
            </Alert>

            {error && (
              <Alert className="mb-6 border-2 border-red-300 dark:border-red-700 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <AlertDescription className="text-red-800 dark:text-red-200 font-semibold ml-2">
                  {error.message}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-base font-bold">Nama *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama Anda"
                  required
                  className="mt-2 border-2 border-purple-200 dark:border-purple-800 focus:border-purple-600 rounded-xl h-12"
                />
              </div>

              <div>
                <Label htmlFor="contact" className="text-base font-bold">Kontak (Email/Telepon) *</Label>
                <Input
                  id="contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="email@example.com atau 08123456789"
                  required
                  className="mt-2 border-2 border-purple-200 dark:border-purple-800 focus:border-purple-600 rounded-xl h-12"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full rounded-full py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 text-white font-black shadow-neon-purple text-lg uppercase tracking-wide glossy" 
                disabled={isPending || !name.trim() || !contact.trim()}
              >
                {isPending ? 'Mendaftar...' : 'Daftar Sekarang'}
              </Button>
            </form>

            <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-2xl border-2 border-purple-200 dark:border-purple-800">
              <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-600" />
                Keuntungan Menjadi Member:
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  Komisi 10% dari downline level 1
                </li>
                <li className="flex items-center gap-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  Komisi 5% dari downline level 2
                </li>
                <li className="flex items-center gap-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  Komisi 2% dari downline level 3
                </li>
                <li className="flex items-center gap-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  Dashboard untuk tracking jaringan dan komisi
                </li>
                <li className="flex items-center gap-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  Bonus dan reward untuk pencapaian tertentu
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
