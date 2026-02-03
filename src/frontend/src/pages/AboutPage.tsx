import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, TrendingUp, DollarSign, Gift, Network, UserPlus, Rocket, Sparkles, Award, Target } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';

interface AboutPageProps {
  onNavigate: (page: 'join' | 'dashboard') => void;
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  const { login, loginStatus, identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const handleGabung = async () => {
    if (!isAuthenticated) {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
      }
    } else if (!userProfile) {
      onNavigate('join');
    } else {
      onNavigate('dashboard');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="relative rounded-3xl overflow-hidden shadow-neon-strong">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-700 to-purple-800"></div>
          
          <div className="absolute inset-0 opacity-20">
            <div className="absolute w-96 h-96 bg-yellow-400 rounded-full blur-3xl top-0 right-0 animate-pulse"></div>
            <div className="absolute w-96 h-96 bg-pink-400 rounded-full blur-3xl bottom-0 left-0 animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-3 h-3 bg-yellow-300 rounded-full animate-pulse" style={{ top: '15%', left: '15%', animationDelay: '0s' }}></div>
            <div className="absolute w-2 h-2 bg-white rounded-full animate-pulse" style={{ top: '25%', right: '20%', animationDelay: '0.7s' }}></div>
            <div className="absolute w-3 h-3 bg-pink-300 rounded-full animate-pulse" style={{ bottom: '20%', left: '25%', animationDelay: '1.4s' }}></div>
            <div className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-pulse" style={{ bottom: '30%', right: '15%', animationDelay: '2s' }}></div>
          </div>

          <div className="relative px-8 py-16 md:py-20">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-neon-gold mb-6 glossy">
                <UserPlus className="w-10 h-10 text-purple-900" />
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 glow-text-purple">
                Bergabunglah Bersama Kami!
              </h1>

              <p className="text-lg md:text-xl text-purple-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Raih peluang penghasilan dengan bergabung di <span className="font-bold text-yellow-300 glow-text-gold">MyRepublic Network Hub</span>. 
                Dapatkan insentif profesional dari penjualan dan pengembangan tim dengan sistem yang transparan dan berbasis kinerja!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 max-w-3xl mx-auto">
                <div className="flex items-start gap-4 p-5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shrink-0 shadow-neon-gold">
                    <DollarSign className="w-6 h-6 text-purple-900" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-black text-white text-lg mb-1">Insentif Berbasis Kinerja</h3>
                    <p className="text-purple-100 text-sm">Dapatkan 25% dari penjualan pribadi plus bonus pengembangan tim dan kepemimpinan</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shrink-0 shadow-lg">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-black text-white text-lg mb-1">Bonus Sponsor 10%</h3>
                    <p className="text-purple-100 text-sm">Dapatkan bonus 10% dari penjualan anggota yang Anda sponsori</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shrink-0 shadow-neon-purple">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-black text-white text-lg mb-1">Pengembangan Tim</h3>
                    <p className="text-purple-100 text-sm">Bangun tim profesional dan dapatkan bonus dari kinerja tim Anda</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-neon-purple">
                    <Network className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-black text-white text-lg mb-1">Jaringan Modern</h3>
                    <p className="text-purple-100 text-sm">Bagian dari ekosistem internet MyRepublic yang terpercaya dan berkualitas tinggi</p>
                  </div>
                </div>
              </div>

              <Button 
                size="lg" 
                className="rounded-full px-12 py-7 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-purple-900 font-black shadow-neon-gold text-xl uppercase tracking-wide glossy pulse-glow border-2 border-yellow-300 transform hover:scale-105 transition-transform"
                onClick={handleGabung}
                disabled={disabled}
              >
                <Rocket className="w-6 h-6 mr-3" />
                {disabled ? 'Memproses...' : 'Gabung Sekarang'}
              </Button>

              <p className="text-purple-200 text-sm mt-6">
                <Sparkles className="inline w-4 h-4 mr-1" />
                Gratis bergabung • Tanpa biaya tersembunyi • Mulai hasilkan insentif hari ini
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Incentive Structure Section */}
      <section className="mb-12">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 bg-clip-text text-transparent">
            Skema Insentif MyRepublic Network Hub
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Pahami struktur insentif profesional berbasis kinerja penjualan dan pengembangan tim
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="border-2 border-purple-300 dark:border-purple-700 shadow-neon-purple overflow-hidden bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950">
            <CardContent className="p-6 md:p-10">
              {/* Detailed Explanation Cards */}
              <div className="space-y-6">
                {/* Sales Pribadi */}
                <div className="p-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl shadow-neon-gold relative overflow-hidden glossy">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-purple-900 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-yellow-300" />
                      </div>
                      <h3 className="text-2xl font-black text-purple-900">Sales Pribadi: 25%</h3>
                    </div>
                    <p className="text-purple-900 font-bold text-base md:text-lg">
                      Komisi <span className="text-3xl font-black">25%</span> dari penjualan langsung ke pelanggan yang Anda lakukan. Insentif dihitung dari harga paket yang berhasil terjual dan terpasang.
                    </p>
                    <div className="mt-4 p-4 bg-purple-900/20 rounded-xl">
                      <p className="text-sm text-purple-900 font-semibold">
                        <strong>Contoh:</strong> Jual paket PRIME (Rp555.000) → Insentif Anda: <span className="text-lg font-black">Rp138.750</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sponsor Langsung */}
                <div className="p-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg text-white relative overflow-hidden glossy">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                        <Gift className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-black">Sponsor Langsung: 10%</h3>
                    </div>
                    <p className="font-bold text-base md:text-lg">
                      Bonus <span className="text-3xl font-black">10%</span> dari penjualan yang dilakukan oleh anggota yang Anda sponsori secara langsung. Insentif ini mendorong Anda untuk membantu anggota baru berkembang.
                    </p>
                    <div className="mt-4 p-4 bg-white/20 rounded-xl">
                      <p className="text-sm font-semibold">
                        <strong>Contoh:</strong> Anggota sponsor Anda jual paket VELO (Rp277.500) → Bonus Anda: <span className="text-lg font-black">Rp27.750</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Team Builder */}
                <div className="p-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-neon-purple text-white relative overflow-hidden glossy">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-yellow-400 flex items-center justify-center">
                        <Users className="w-6 h-6 text-purple-900" />
                      </div>
                      <h3 className="text-2xl font-black">Team Builder: 7%</h3>
                    </div>
                    <p className="font-bold text-base md:text-lg">
                      Bonus <span className="text-3xl font-black">7%</span> dari pengembangan tim dan kinerja penjualan tim Anda. Insentif ini diberikan berdasarkan kontribusi Anda dalam membangun dan mengembangkan tim yang produktif.
                    </p>
                    <div className="mt-4 p-4 bg-white/20 rounded-xl">
                      <p className="text-sm font-semibold">
                        <strong>Contoh:</strong> Tim Anda jual paket NEXUS (Rp333.000) → Bonus Anda: <span className="text-lg font-black">Rp23.310</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Leadership Bonus */}
                <div className="p-6 bg-gradient-to-br from-pink-600 to-purple-600 rounded-2xl shadow-neon-purple text-white relative overflow-hidden glossy">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-yellow-400 flex items-center justify-center">
                        <Award className="w-6 h-6 text-purple-900" />
                      </div>
                      <h3 className="text-2xl font-black">Leadership Bonus: 5%</h3>
                    </div>
                    <p className="font-bold text-base md:text-lg">
                      Bonus <span className="text-3xl font-black">5%</span> untuk prestasi kepemimpinan dan pembinaan tim. Insentif ini mengapresiasi peran Anda sebagai pemimpin yang membimbing dan memotivasi tim.
                    </p>
                    <div className="mt-4 p-4 bg-white/20 rounded-xl">
                      <p className="text-sm font-semibold">
                        <strong>Contoh:</strong> Prestasi kepemimpinan dari paket WONDER (Rp721.000) → Bonus Anda: <span className="text-lg font-black">Rp36.050</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Growth & Reward Pool */}
                <div className="p-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-neon-purple text-white relative overflow-hidden glossy">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-yellow-400 flex items-center justify-center">
                        <Target className="w-6 h-6 text-purple-900" />
                      </div>
                      <h3 className="text-2xl font-black">Growth & Reward Pool: 3%</h3>
                    </div>
                    <p className="font-bold text-base md:text-lg">
                      Bonus <span className="text-3xl font-black">3%</span> dari pertumbuhan perusahaan dan pool prestasi. Insentif ini dibagikan berdasarkan kinerja keseluruhan dan kontribusi terhadap pertumbuhan bisnis.
                    </p>
                    <div className="mt-4 p-4 bg-white/20 rounded-xl">
                      <p className="text-sm font-semibold">
                        <strong>Contoh:</strong> Kontribusi pertumbuhan dari paket ULTRA (Rp943.500) → Bonus Anda: <span className="text-lg font-black">Rp28.305</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Important Note */}
                <div className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl border-2 border-purple-300 dark:border-purple-700">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-black text-lg text-purple-900 dark:text-purple-100 mb-2">Catatan Penting</h4>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base font-semibold">
                        Seluruh insentif diberikan berdasarkan kinerja penjualan dan pemasangan pelanggan yang tervalidasi. Tidak ada insentif yang berasal dari biaya pendaftaran atau aktivitas perekrutan. Semua bonus dikreditkan setelah pelanggan berhasil menyelesaikan berlangganan atau instalasi paket internet.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative rounded-3xl overflow-hidden shadow-neon-strong">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-700 to-purple-800"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute w-64 h-64 bg-yellow-400 rounded-full blur-3xl top-0 right-0 animate-pulse"></div>
          <div className="absolute w-64 h-64 bg-pink-400 rounded-full blur-3xl bottom-0 left-0 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative text-center py-16 px-8">
          <Rocket className="w-20 h-20 text-yellow-300 mx-auto mb-6 animate-bounce" />
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 glow-text-purple">Siap Memulai?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Daftar sekarang dan mulai bangun karir profesional Anda. Dapatkan insentif berbasis kinerja dari setiap penjualan dan pengembangan tim!
          </p>
          <Button 
            size="lg" 
            className="rounded-full px-12 py-7 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-purple-900 font-black shadow-neon-gold text-xl uppercase tracking-wide glossy pulse-glow border-2 border-yellow-300"
            onClick={handleGabung}
            disabled={disabled}
          >
            {disabled ? 'Memproses...' : 'Gabung Sekarang'}
          </Button>
        </div>
      </section>
    </div>
  );
}
