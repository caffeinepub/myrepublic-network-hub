import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wifi, Sparkles, Loader2 } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetAllProducts } from '../hooks/useQueries';
import { getProductUIMetadata } from '../lib/productCatalog';
import ProductDetailModal from '../components/ProductDetailModal';
import PreWhatsAppContactForm from '../components/PreWhatsAppContactForm';
import OnboardingStepper from '../components/OnboardingStepper';
import type { Product } from '@/backend';

interface HomePageProps {
  onNavigate: (page: 'join' | 'dashboard' | 'home') => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { login, loginStatus, identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: backendProducts, isLoading: productsLoading } = useGetAllProducts();
  
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [selectedProductForSubscription, setSelectedProductForSubscription] = useState<Product | null>(null);

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

  const calculateCommission = (price: number, rate: number): number => {
    return Math.floor((price * rate) / 100);
  };

  const handleCardClick = (product: Product) => {
    setSelectedProductForDetail(product);
  };

  const handleSubscribeClick = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation(); // Prevent card click event
    setSelectedProductForSubscription(product);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Onboarding Stepper Section */}
      <section className="mb-12">
        <OnboardingStepper onNavigate={onNavigate} />
      </section>

      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden mb-12 shadow-neon-strong">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-700 to-pink-700"></div>
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-2 h-2 bg-white rounded-full animate-pulse" style={{ top: '20%', left: '10%', animationDelay: '0s' }}></div>
          <div className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-pulse" style={{ top: '40%', left: '80%', animationDelay: '0.5s' }}></div>
          <div className="absolute w-2 h-2 bg-pink-300 rounded-full animate-pulse" style={{ top: '70%', left: '30%', animationDelay: '1s' }}></div>
          <div className="absolute w-1 h-1 bg-white rounded-full animate-pulse" style={{ top: '15%', right: '20%', animationDelay: '1.5s' }}></div>
        </div>

        <div className="relative container mx-auto px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full shadow-neon-gold">
              <span className="text-sm font-bold text-purple-900 uppercase tracking-wide">Limited Offer</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight glow-text-purple">
              MyRepublic Network Hub<br />
              <span className="text-yellow-300 glow-text-gold">Internet Cepat & Stabil</span>
            </h1>
            
            <div className="mb-8 space-y-3">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 rounded-2xl shadow-lg glossy">
                <Sparkles className="w-6 h-6 text-yellow-300" />
                <span className="text-xl md:text-2xl font-bold text-white uppercase">Gratis Instalasi</span>
              </div>
              
              <div className="space-y-2">
                <p className="text-xl md:text-3xl font-bold text-white">
                  Internet cepat & stabil,
                </p>
                <p className="text-3xl md:text-5xl font-black text-white glow-text-purple uppercase">
                  UNLIMITED
                </p>
              </div>
              
              <div className="flex items-center gap-2 mt-4">
                <Wifi className="w-8 h-8 text-yellow-300" />
                <span className="text-2xl md:text-3xl font-bold text-yellow-300 glow-text-gold">
                  Mulai 100 Mbps
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="rounded-full px-10 py-7 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-purple-900 font-black shadow-neon-gold text-lg uppercase tracking-wide glossy pulse-glow border-2 border-yellow-300"
                onClick={handleGabung}
                disabled={disabled}
              >
                {disabled ? 'Memproses...' : 'Gabung Sekarang'}
              </Button>
              
              <div className="flex items-center gap-2 text-white bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <span className="text-sm">✓ Upload = Download</span>
                <span className="text-sm">✓ 100% Fiber Optic</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Internet Packages Section */}
      <section className="mb-12">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 bg-clip-text text-transparent">
            Paket Internet MyRepublic
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Pilihan paket internet berkecepatan tinggi dengan harga terjangkau. <span className="font-bold text-yellow-600">Gratis instalasi</span> untuk semua paket!
          </p>
          <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold mt-2">
            Click "Subscribe via WhatsApp" to fill a short form, then WhatsApp will open to contact admin
          </p>
        </div>
        
        {productsLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
            <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
              Loading packages...
            </p>
          </div>
        ) : backendProducts && backendProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {backendProducts.map((product) => {
              const uiMetadata = getProductUIMetadata(product.name);
              const Icon = uiMetadata.icon;
              const price = Number(product.price);
              const commissionRate = Number(product.commissionRate);
              const commissionAmount = calculateCommission(price, commissionRate);
              
              return (
                <Card 
                  key={product.id.toString()} 
                  onClick={() => handleCardClick(product)}
                  className="border-2 border-purple-300 dark:border-purple-700 hover:shadow-neon-purple transition-all hover:scale-105 duration-300 overflow-hidden glossy bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 cursor-pointer"
                >
                  <CardHeader className={`bg-gradient-to-br ${uiMetadata.color} text-white rounded-t-lg relative overflow-hidden pb-4`}>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-10 -mb-10"></div>
                    
                    <div className="relative flex items-center justify-between mb-2">
                      <CardTitle className="text-2xl font-black tracking-wider">{product.name}</CardTitle>
                      <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <CardDescription className="text-white/90 text-lg font-bold">
                      {product.description}
                    </CardDescription>
                    
                    <div className="mt-2">
                      <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 px-3 py-1.5 rounded-full shadow-neon-gold border border-yellow-300 inline-block">
                        <span className="text-purple-900 font-black text-xs tracking-wide glow-text-gold">
                          Komisi: {commissionRate}% (Rp{commissionAmount.toLocaleString('id-ID')})
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-4 pb-4 relative">
                    <div className="absolute top-0 right-0 bg-gradient-to-br from-yellow-400 to-yellow-600 text-purple-900 px-2 py-1 rounded-bl-lg font-bold text-xs uppercase shadow-neon-gold">
                      Promo
                    </div>
                    
                    <div className="text-center mb-4 mt-2">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Harga mulai</div>
                      <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                        Rp {price.toLocaleString('id-ID')}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">per bulan (termasuk PPN)</div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-2 rounded-lg">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shrink-0">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">Internet Only</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 p-2 rounded-lg">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shrink-0">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs font-bold text-yellow-700 dark:text-yellow-300">Gratis Instalasi</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-2 rounded-lg">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shrink-0">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">100% Fiber Optic</span>
                      </div>
                    </div>

                    {/* Subscribe Button */}
                    <Button
                      onClick={(e) => handleSubscribeClick(e, product)}
                      className="w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-5 shadow-neon-purple glossy"
                    >
                      <SiWhatsapp className="w-4 h-4 mr-2" />
                      Subscribe via WhatsApp
                    </Button>

                    <div className="text-center mt-3">
                      <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                        Klik kartu untuk detail lengkap
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              No packages available at the moment.
            </p>
          </div>
        )}
        
        <div className="text-center mt-10">
          <Button 
            size="lg" 
            className="rounded-full px-10 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 text-white font-black shadow-neon-purple text-lg uppercase tracking-wide glossy pulse-glow"
            onClick={handleGabung}
            disabled={disabled}
          >
            Mulai Jual Paket Internet
          </Button>
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProductForDetail && (
        <ProductDetailModal
          product={{
            name: selectedProductForDetail.name,
            speed: selectedProductForDetail.description,
            price: Number(selectedProductForDetail.price),
            commissionRate: Number(selectedProductForDetail.commissionRate),
            icon: getProductUIMetadata(selectedProductForDetail.name).icon,
            color: getProductUIMetadata(selectedProductForDetail.name).color,
          }}
          productId={Number(selectedProductForDetail.id)}
          onClose={() => setSelectedProductForDetail(null)}
        />
      )}

      {/* Pre-WhatsApp Contact Form */}
      {selectedProductForSubscription && (
        <PreWhatsAppContactForm
          open={true}
          onClose={() => setSelectedProductForSubscription(null)}
          productId={selectedProductForSubscription.id}
        />
      )}
    </div>
  );
}
