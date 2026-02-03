import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetOwnMemberProfile, useGetTransactions, useGetFamilyTree, useGetMemberWithdrawalSummary, useGetMemberWithdrawals } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wallet, Users, TrendingUp, Copy, CheckCircle2, Sparkles, Gift, Infinity, ArrowDownToLine, ShieldCheck } from 'lucide-react';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import WithdrawalRequestModal from '../components/WithdrawalRequestModal';
import { Badge } from '@/components/ui/badge';
import OnboardingStepper from '../components/OnboardingStepper';

// Progressive commission rates for unlimited levels
const getCommissionRateForLevel = (level: number): string => {
  if (level === 1) return '10%';
  if (level === 2) return '5%';
  if (level === 3) return '2%';
  if (level === 4) return '1%';
  if (level === 5) return '0.5%';
  return '0.25%';
};

interface DashboardPageProps {
  onNavigate?: (page: 'home' | 'join' | 'dashboard') => void;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: memberProfile, isLoading: profileLoading } = useGetOwnMemberProfile();
  const { data: transactions, isLoading: transactionsLoading } = useGetTransactions();
  const { data: familyTree, isLoading: familyTreeLoading } = useGetFamilyTree();
  const { data: withdrawalSummary, isLoading: withdrawalSummaryLoading } = useGetMemberWithdrawalSummary();
  const { data: withdrawals, isLoading: withdrawalsLoading } = useGetMemberWithdrawals();
  const [copied, setCopied] = useState(false);
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false);

  const isAuthenticated = !!identity;

  // Check if user is verified (has completed at least one subscription)
  const isVerified = memberProfile?.registrationFields.subscriptionsVerified || false;

  const directDownlinesCount = useMemo(() => {
    if (!familyTree) return 0;
    return familyTree.children.length;
  }, [familyTree]);

  const copyPrincipalId = () => {
    if (identity) {
      navigator.clipboard.writeText(identity.getPrincipal().toString());
      setCopied(true);
      toast.success('ID Principal berhasil disalin!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card className="border-2 border-purple-300 dark:border-purple-700 shadow-neon-purple">
            <CardHeader className="text-center">
              <Sparkles className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <CardTitle className="text-2xl font-black">Dashboard Member</CardTitle>
              <CardDescription>
                Login untuk mengakses dashboard Anda
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

  if (profileLoading || transactionsLoading || familyTreeLoading || withdrawalSummaryLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4 shadow-neon-purple"></div>
          <p className="text-gray-600 dark:text-gray-300 font-semibold">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  const totalCommission = transactions?.reduce((sum, tx) => sum + Number(tx.commissionAmount), 0) || 0;
  const totalSponsorBonus = transactions?.reduce((sum, tx) => sum + Number(tx.sponsorBonus), 0) || 0;
  const recentTransactions = transactions?.slice(0, 5) || [];
  const availableBalance = withdrawalSummary ? Number(withdrawalSummary.availableBalance) : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Onboarding Stepper Section */}
      <section className="mb-8">
        <OnboardingStepper onNavigate={onNavigate} />
      </section>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 bg-clip-text text-transparent">
            Dashboard Member
          </h1>
          {isVerified && (
            <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 text-sm font-bold shadow-lg">
              <ShieldCheck className="w-4 h-4 mr-1" />
              Verified
            </Badge>
          )}
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300">Selamat datang, <span className="font-bold text-purple-600">{memberProfile?.basic.name || 'Member'}</span>!</p>
      </div>

      {/* Verification Status Alert */}
      {!isVerified && (
        <Alert className="mb-8 border-2 border-yellow-300 dark:border-yellow-700 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
          <ShieldCheck className="h-5 w-5 text-yellow-600" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-200 font-semibold ml-2">
            <strong>Status: Not Verified</strong><br />
            You must complete at least one package subscription before you can recruit new members. After subscribing, you will receive "Verified" status and unlock recruiting features.
            {onNavigate && (
              <div className="mt-3">
                <Button
                  onClick={() => {
                    onNavigate('home');
                    setTimeout(() => {
                      const packagesSection = document.querySelector('section:nth-of-type(2)');
                      packagesSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                  }}
                  size="sm"
                  className="rounded-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold"
                >
                  View Packages & Subscribe
                </Button>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Member Info Card */}
      <Card className="mb-8 border-2 border-purple-300 dark:border-purple-700 shadow-neon-purple overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute w-32 h-32 bg-yellow-400 rounded-full blur-2xl top-0 right-0"></div>
          <div className="absolute w-32 h-32 bg-pink-400 rounded-full blur-2xl bottom-0 left-0"></div>
        </div>
        
        <CardHeader className="relative z-10">
          <CardTitle className="text-white font-black text-xl flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            Informasi Member
            {isVerified && (
              <Badge className="bg-green-500/20 text-green-100 border border-green-400 ml-2">
                <ShieldCheck className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 relative z-10">
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
            <p className="text-purple-100 text-sm font-semibold mb-1">Nama</p>
            <p className="font-black text-xl text-white">{memberProfile?.basic.name}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
            <p className="text-purple-100 text-sm font-semibold mb-1">Kontak</p>
            <p className="font-bold text-white">{memberProfile?.basic.contact}</p>
          </div>
          {memberProfile?.registrationFields.bankAccount && (
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <p className="text-purple-100 text-sm font-semibold mb-1">No Rekening Bank</p>
              <p className="font-bold text-white">{memberProfile.registrationFields.bankAccount}</p>
            </div>
          )}
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
            <p className="text-purple-100 text-sm font-semibold mb-2">ID Principal (untuk referral)</p>
            <div className="flex items-center gap-2 bg-white/20 p-3 rounded-lg">
              <code className="text-xs flex-1 break-all text-white font-mono">{identity?.getPrincipal().toString()}</code>
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 rounded-lg"
                onClick={copyPrincipalId}
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-yellow-300" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            {!isVerified && (
              <p className="text-yellow-200 text-xs mt-2 font-semibold">
                ⚠️ Subscribe to any package to get Verified status and unlock recruiting
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-2 border-purple-300 dark:border-purple-700 hover:shadow-neon-purple transition-all bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-neon-gold">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              Total Komisi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Rp {totalCommission.toLocaleString('id-ID')}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-semibold flex items-center gap-1">
              Dari jaringan tanpa batas <Infinity className="w-3 h-3" />
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-300 dark:border-purple-700 hover:shadow-neon-purple transition-all bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                <Gift className="w-5 h-5 text-white" />
              </div>
              Bonus Sponsor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Rp {totalSponsorBonus.toLocaleString('id-ID')}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-semibold">Dari rekrutmen member</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-300 dark:border-purple-700 hover:shadow-neon-purple transition-all bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-neon-purple">
                <Users className="w-5 h-5 text-white" />
              </div>
              Downline Langsung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{directDownlinesCount}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-semibold">Member aktif</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-300 dark:border-purple-700 hover:shadow-neon-purple transition-all bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center shadow-neon-purple">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              Transaksi Bulan Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">{transactions?.length || 0}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-semibold">Total transaksi</p>
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal Section */}
      <Card className="mb-8 border-2 border-yellow-300 dark:border-yellow-700 shadow-neon-gold">
        <CardHeader className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30">
          <CardTitle className="font-black text-2xl flex items-center gap-2">
            <ArrowDownToLine className="w-6 h-6 text-yellow-600" />
            Penarikan Saldo
          </CardTitle>
          <CardDescription className="text-base">Kelola saldo komisi Anda</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white p-6 rounded-2xl shadow-neon-gold">
              <p className="text-sm font-semibold mb-2">Saldo Tersedia</p>
              <p className="text-4xl font-black">
                Rp {availableBalance.toLocaleString('id-ID')}
              </p>
            </div>
            <div className="flex flex-col justify-center">
              <Button
                onClick={() => setWithdrawalModalOpen(true)}
                disabled={availableBalance === 0}
                className="rounded-full px-8 py-6 bg-gradient-to-r from-yellow-600 via-orange-600 to-yellow-700 hover:from-yellow-700 hover:via-orange-700 hover:to-yellow-800 text-white font-black shadow-neon-gold text-lg"
              >
                <ArrowDownToLine className="w-5 h-5 mr-2" />
                Tarik Saldo
              </Button>
              {availableBalance === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                  Saldo tidak mencukupi untuk penarikan
                </p>
              )}
            </div>
          </div>

          {/* Withdrawal History */}
          {!withdrawalsLoading && withdrawals && withdrawals.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold text-lg mb-4">Riwayat Penarikan</h3>
              <div className="space-y-3">
                {withdrawals.slice(0, 5).map((withdrawal) => {
                  const statusColors = {
                    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
                    Approved: 'bg-blue-100 text-blue-800 border-blue-300',
                    Rejected: 'bg-red-100 text-red-800 border-red-300',
                    Paid: 'bg-green-100 text-green-800 border-green-300',
                  };
                  const statusText = {
                    Pending: 'Menunggu',
                    Approved: 'Disetujui',
                    Rejected: 'Ditolak',
                    Paid: 'Dibayar',
                  };
                  const status = Object.keys(withdrawal.status)[0] as keyof typeof statusColors;
                  
                  return (
                    <div key={Number(withdrawal.requestId)} className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 rounded-xl border-2 border-yellow-200 dark:border-yellow-800">
                      <div>
                        <p className="font-bold text-gray-800 dark:text-gray-100">
                          Rp {Number(withdrawal.amount).toLocaleString('id-ID')}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(Number(withdrawal.requestDate) / 1000000).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${statusColors[status]}`}>
                        {statusText[status]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="border-2 border-purple-300 dark:border-purple-700 shadow-neon-purple">
        <CardHeader>
          <CardTitle className="font-black text-2xl flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            Laporan Komisi & Bonus
          </CardTitle>
          <CardDescription className="text-base">Riwayat komisi tanpa batas level dan bonus sponsor yang Anda terima</CardDescription>
        </CardHeader>
        <CardContent>
          {recentTransactions.length === 0 ? (
            <Alert className="border-2 border-purple-300 dark:border-purple-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <AlertDescription className="text-purple-800 dark:text-purple-200 font-semibold ml-2">
                Belum ada transaksi. Mulai rekrut member untuk mendapatkan komisi!
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((tx, index) => {
                const isSponsorBonus = Number(tx.sponsorBonus) > 0;
                const amount = isSponsorBonus ? Number(tx.sponsorBonus) : Number(tx.commissionAmount);
                const level = Number(tx.level);
                
                return (
                  <div key={index} className="flex items-center justify-between p-5 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-xl border-2 border-purple-200 dark:border-purple-800 hover:shadow-neon-purple transition-all">
                    <div>
                      {isSponsorBonus ? (
                        <>
                          <div className="flex items-center gap-2 mb-1">
                            <Gift className="w-5 h-5 text-green-600" />
                            <p className="font-black text-gray-800 dark:text-gray-100 text-lg">Bonus Sponsor</p>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                            {new Date(Number(tx.date) / 1000000).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                            Dari produk: Rp {Number(tx.productPrice).toLocaleString('id-ID')}
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 mb-1">
                            {level > 5 && <Infinity className="w-5 h-5 text-purple-600" />}
                            <p className="font-black text-gray-800 dark:text-gray-100 text-lg">Komisi Level {level}</p>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                            {new Date(Number(tx.date) / 1000000).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                            Dari produk: Rp {Number(tx.productPrice).toLocaleString('id-ID')}
                          </p>
                        </>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-black text-2xl text-green-600 dark:text-green-400">
                        +Rp {amount.toLocaleString('id-ID')}
                      </p>
                      {isSponsorBonus ? (
                        <p className="text-xs font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          5% Bonus
                        </p>
                      ) : (
                        <p className="text-xs font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                          {getCommissionRateForLevel(level)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Withdrawal Request Modal */}
      <WithdrawalRequestModal
        open={withdrawalModalOpen}
        onClose={() => setWithdrawalModalOpen(false)}
        availableBalance={availableBalance}
        bankAccount={memberProfile?.registrationFields.bankAccount || ''}
      />
    </div>
  );
}
