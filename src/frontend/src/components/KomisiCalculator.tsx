import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, TrendingUp, Users, DollarSign, Gift, Award, Target, Sparkles, Zap } from 'lucide-react';

interface PackageOption {
  name: string;
  price: number;
  speed: string;
}

const packages: PackageOption[] = [
  { name: 'NEO', price: 233100, speed: '100 Mbps' },
  { name: 'VELO', price: 277500, speed: '300 Mbps' },
  { name: 'NEXUS', price: 333000, speed: '400 Mbps' },
  { name: 'PRIME', price: 555000, speed: '500 Mbps' },
  { name: 'WONDER', price: 721000, speed: '750 Mbps' },
  { name: 'ULTRA', price: 943500, speed: '1 Gbps' },
];

// Professional five-category incentive structure
const incentiveCategories = [
  { name: 'Sales Pribadi', rate: 25, icon: TrendingUp, color: 'from-yellow-400 to-yellow-500', description: 'Komisi dari penjualan langsung' },
  { name: 'Sponsor Langsung', rate: 10, icon: Gift, color: 'from-green-500 to-emerald-500', description: 'Bonus dari penjualan anggota sponsor' },
  { name: 'Team Builder', rate: 7, icon: Users, color: 'from-purple-600 to-pink-600', description: 'Bonus pengembangan tim' },
  { name: 'Leadership Bonus', rate: 5, icon: Award, color: 'from-pink-600 to-purple-600', description: 'Bonus prestasi kepemimpinan' },
  { name: 'Growth & Reward Pool', rate: 3, icon: Target, color: 'from-indigo-600 to-purple-600', description: 'Bonus pertumbuhan perusahaan' },
];

export default function KomisiCalculator() {
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [customPrice, setCustomPrice] = useState<string>('');

  // Get the price to use for calculations
  const getPrice = (): number => {
    if (selectedPackage) {
      const pkg = packages.find(p => p.name === selectedPackage);
      return pkg?.price || 0;
    }
    return parseInt(customPrice) || 0;
  };

  const price = getPrice();

  // Calculate incentives for all five categories
  const incentiveResults = incentiveCategories.map(category => ({
    ...category,
    amount: Math.floor((price * category.rate) / 100),
  }));

  const totalEarnings = incentiveResults.reduce((sum, result) => sum + result.amount, 0);

  const formatRupiah = (amount: number): string => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  return (
    <section className="mb-12 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
        <div className="absolute w-96 h-96 bg-purple-400/20 rounded-full blur-3xl top-0 left-0 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl bottom-0 right-0 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 shadow-neon-gold mb-6 glossy animate-pulse-glow">
          <Calculator className="w-12 h-12 text-purple-900" />
        </div>
        <div className="inline-block mb-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-neon-purple">
          <span className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Kalkulator Interaktif
          </span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 bg-clip-text text-transparent glow-text-purple">
          Kalkulator Insentif Profesional
        </h2>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Hitung potensi penghasilan Anda secara real-time dari lima kategori insentif profesional berbasis kinerja penjualan dan pengembangan tim
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <Card className="border-4 border-purple-400 dark:border-purple-600 shadow-neon-strong overflow-hidden bg-gradient-to-br from-white via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-pink-950 relative">
          {/* Decorative corner elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-yellow-400/30 to-transparent rounded-br-full"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-600/30 to-transparent rounded-tl-full"></div>
          
          <CardContent className="p-6 md:p-10 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-6">
                <div className="p-6 md:p-8 bg-gradient-to-br from-purple-100 via-pink-100 to-purple-100 dark:from-purple-900/40 dark:via-pink-900/40 dark:to-purple-900/40 rounded-3xl border-4 border-purple-300 dark:border-purple-700 shadow-neon-purple relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400/20 rounded-full blur-2xl"></div>
                  
                  <h3 className="text-2xl md:text-3xl font-black text-purple-900 dark:text-purple-100 mb-8 flex items-center gap-3 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-neon-purple">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    Input Data Perhitungan
                  </h3>

                  {/* Package Selection */}
                  <div className="space-y-3 mb-6 relative z-10">
                    <Label htmlFor="package" className="text-base md:text-lg font-black text-gray-800 dark:text-gray-100 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-600" />
                      Pilih Paket Internet MyRepublic
                    </Label>
                    <Select value={selectedPackage} onValueChange={(value) => {
                      setSelectedPackage(value);
                      setCustomPrice('');
                    }}>
                      <SelectTrigger 
                        id="package"
                        className="w-full bg-white dark:bg-gray-800 border-3 border-purple-400 dark:border-purple-600 focus:ring-4 focus:ring-purple-500 focus:border-purple-500 rounded-2xl h-14 text-base md:text-lg font-bold shadow-lg hover:shadow-neon-purple transition-all"
                      >
                        <SelectValue placeholder="Pilih paket internet..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {packages.map((pkg) => (
                          <SelectItem key={pkg.name} value={pkg.name} className="text-base md:text-lg font-bold py-3 rounded-lg">
                            <div className="flex items-center justify-between w-full gap-4">
                              <span className="font-black text-purple-700">{pkg.name}</span>
                              <span className="text-sm text-gray-600">{pkg.speed}</span>
                              <span className="font-bold text-yellow-700">{formatRupiah(pkg.price)}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-semibold">
                      Pilih salah satu paket untuk mengisi harga otomatis
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-4 my-6 relative z-10">
                    <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full"></div>
                    <span className="text-sm font-black text-purple-700 dark:text-purple-300 uppercase tracking-wide">atau</span>
                    <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full"></div>
                  </div>

                  {/* Custom Price Input */}
                  <div className="space-y-3 relative z-10">
                    <Label htmlFor="customPrice" className="text-base md:text-lg font-black text-gray-800 dark:text-gray-100 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      Masukkan Harga Manual (Rupiah)
                    </Label>
                    <Input
                      id="customPrice"
                      type="number"
                      placeholder="Contoh: 500000"
                      value={customPrice}
                      onChange={(e) => {
                        setCustomPrice(e.target.value);
                        setSelectedPackage('');
                      }}
                      className="bg-white dark:bg-gray-800 border-3 border-purple-400 dark:border-purple-600 focus:ring-4 focus:ring-purple-500 focus:border-purple-500 rounded-2xl h-14 text-base md:text-lg font-bold shadow-lg hover:shadow-neon-purple transition-all"
                      disabled={!!selectedPackage}
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-semibold">
                      Masukkan harga produk secara manual jika tidak memilih paket
                    </p>
                  </div>
                </div>
              </div>

              {/* Results Section */}
              <div className="space-y-4">
                <div className="p-6 md:p-8 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 rounded-3xl shadow-neon-strong text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                  
                  <div className="relative z-10">
                    <h3 className="text-2xl md:text-3xl font-black mb-8 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-neon-gold">
                        <TrendingUp className="w-6 h-6 text-purple-900" />
                      </div>
                      Hasil Perhitungan Real-Time
                    </h3>

                    {/* Five Category Incentives */}
                    <div className="space-y-3 mb-4">
                      {incentiveResults.map((result, index) => {
                        const Icon = result.icon;
                        return (
                          <div 
                            key={result.name}
                            className={`p-5 bg-gradient-to-r ${result.color} rounded-2xl shadow-lg relative overflow-hidden`}
                            style={{ 
                              animationDelay: `${index * 0.1}s`,
                              animation: 'fadeInUp 0.3s ease-out forwards'
                            }}
                          >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full -mr-12 -mt-12"></div>
                            <div className="relative z-10">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm md:text-base font-bold text-white flex items-center gap-2">
                                  <Icon className="w-5 h-5" />
                                  {result.name} ({result.rate}%)
                                </span>
                              </div>
                              <div className="text-3xl md:text-4xl font-black text-white mb-1">
                                {formatRupiah(result.amount)}
                              </div>
                              <p className="text-xs md:text-sm text-white/90 font-bold">{result.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Total Earnings - Highlighted */}
                    <div className="p-6 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl shadow-neon-gold relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine"></div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-base md:text-lg font-black text-purple-900 flex items-center gap-2">
                            <Sparkles className="w-6 h-6" />
                            Total Potensi Penghasilan
                          </span>
                        </div>
                        <div className="text-4xl md:text-5xl font-black text-purple-900 mb-2">
                          {formatRupiah(totalEarnings)}
                        </div>
                        <p className="text-xs md:text-sm text-purple-800 font-bold leading-relaxed">
                          Dari lima kategori insentif profesional berbasis kinerja
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Note */}
                <div className="p-5 bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 dark:from-purple-900/40 dark:via-pink-900/40 dark:to-purple-900/40 rounded-2xl border-3 border-purple-300 dark:border-purple-700 shadow-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shrink-0 shadow-neon-purple">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-black text-base md:text-lg text-purple-900 dark:text-purple-100 mb-2">💡 Catatan Penting</h4>
                      <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed font-semibold">
                        Seluruh insentif diberikan berdasarkan kinerja penjualan dan pemasangan pelanggan yang tervalidasi. 
                        Tidak ada insentif yang berasal dari biaya pendaftaran atau aktivitas perekrutan. 
                        Insentif aktual akan dikreditkan setelah pelanggan menyelesaikan berlangganan atau instalasi.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-shine {
          animation: shine 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
