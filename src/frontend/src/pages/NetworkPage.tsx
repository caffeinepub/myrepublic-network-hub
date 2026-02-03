import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetFamilyTree } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NetworkTreeVisualization from '../components/NetworkTreeVisualization';
import { useMemo } from 'react';

export default function NetworkPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: familyTree, isLoading: treeLoading } = useGetFamilyTree();

  const isAuthenticated = !!identity;

  // Calculate direct downlines count from family tree
  const totalDownlines = useMemo(() => {
    if (!familyTree) return 0;
    return familyTree.children.length;
  }, [familyTree]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card className="border-2 border-purple-300 dark:border-purple-700 shadow-neon-purple">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-black">Struktur Jaringan</CardTitle>
              <CardDescription>
                Login untuk melihat struktur jaringan Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={login} 
                disabled={loginStatus === 'logging-in'}
                className="rounded-full px-8 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 text-white font-black shadow-neon-purple"
              >
                {loginStatus === 'logging-in' ? 'Memproses...' : 'Login'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (treeLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4 shadow-neon-purple"></div>
          <p className="text-gray-600 dark:text-gray-300 font-semibold">Memuat struktur jaringan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 bg-clip-text text-transparent mb-2">
          Struktur Jaringan Anda
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">Visualisasi hierarki anggota dan jaringan profesional Anda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-2 border-purple-300 dark:border-purple-700 hover:shadow-neon-purple transition-all bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-gray-600 dark:text-gray-300">Total Anggota Langsung</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="w-8 h-8 text-purple-600" />
              <span className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{totalDownlines}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-300 dark:border-purple-700 hover:shadow-neon-purple transition-all bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-gray-600 dark:text-gray-300">Level Maksimal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">3</div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-300 dark:border-purple-700 hover:shadow-neon-purple transition-all bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-gray-600 dark:text-gray-300">Status Jaringan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-black text-green-600 dark:text-green-400">Aktif</div>
          </CardContent>
        </Card>
      </div>

      {totalDownlines === 0 ? (
        <Alert className="border-2 border-purple-300 dark:border-purple-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
          <AlertCircle className="h-5 w-5 text-purple-600" />
          <AlertDescription className="text-purple-800 dark:text-purple-200 font-semibold ml-2">
            Anda belum memiliki anggota sponsor. Mulai rekrut anggota baru untuk membangun jaringan Anda dan dapatkan insentif profesional!
          </AlertDescription>
        </Alert>
      ) : (
        <Card className="border-2 border-purple-300 dark:border-purple-700 shadow-neon-purple">
          <CardHeader>
            <CardTitle className="font-black text-2xl flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
              Diagram Pohon Jaringan
            </CardTitle>
            <CardDescription className="text-base">
              Visualisasi interaktif struktur jaringan profesional Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            {familyTree && <NetworkTreeVisualization treeData={familyTree} />}
          </CardContent>
        </Card>
      )}

      <div className="mt-8">
        <Card className="border-2 border-purple-300 dark:border-purple-700 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 shadow-neon-purple">
          <CardHeader>
            <CardTitle className="font-black text-xl">Tips Membangun Jaringan Profesional</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm md:text-base text-gray-700 dark:text-gray-300 font-semibold">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-black">✓</span>
                <span>Bagikan ID Principal Anda kepada calon anggota sebagai sponsor</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-black">✓</span>
                <span>Bantu anggota sponsor Anda untuk merekrut anggota baru</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-black">✓</span>
                <span>Pantau perkembangan jaringan secara berkala</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-black">✓</span>
                <span>Berikan dukungan dan motivasi kepada anggota sponsor Anda</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
