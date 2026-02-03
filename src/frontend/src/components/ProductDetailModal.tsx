import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, X } from 'lucide-react';

interface ProductDetailModalProps {
  product: {
    name: string;
    speed: string;
    price: number;
    commissionRate: number;
    icon: any;
    color: string;
  };
  productId: number;
  onClose: () => void;
}

export default function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const Icon = product.icon;
  const commissionAmount = Math.floor((product.price * product.commissionRate) / 100);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 border-2 border-purple-300 dark:border-purple-700 shadow-neon-purple">
        <DialogHeader>
          <DialogTitle className="text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 bg-clip-text text-transparent">
            Detail Paket {product.name}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            Informasi lengkap tentang paket internet MyRepublic
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Product Header */}
          <div className={`bg-gradient-to-br ${product.color} text-white rounded-2xl p-6 relative overflow-hidden shadow-neon-purple`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            
            <div className="relative flex items-center justify-between mb-4">
              <div>
                <h3 className="text-4xl font-black tracking-wider mb-2">{product.name}</h3>
                <p className="text-2xl font-bold text-white/90">{product.speed}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                <Icon className="w-12 h-12" />
              </div>
            </div>

            <div className="mt-4">
              <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 px-5 py-3 rounded-full shadow-neon-gold border-2 border-yellow-300 inline-block">
                <span className="text-purple-900 font-black text-lg tracking-wide glow-text-gold">
                  Komisi: {product.commissionRate}% (Rp{commissionAmount.toLocaleString('id-ID')})
                </span>
              </div>
            </div>
          </div>

          {/* Price Section */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-6 border-2 border-purple-300 dark:border-purple-700">
            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-semibold">Harga Berlangganan</div>
              <div className="text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Rp {product.price.toLocaleString('id-ID')}
              </div>
              <div className="text-base text-gray-600 dark:text-gray-400 font-medium">per bulan (termasuk PPN)</div>
            </div>
          </div>

          {/* Features Section */}
          <div className="space-y-3">
            <h4 className="text-xl font-black text-purple-700 dark:text-purple-300 mb-3">Keunggulan Paket</h4>
            
            <div className="flex items-start gap-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="font-bold text-gray-800 dark:text-gray-200 mb-1">Internet Only</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Paket internet murni tanpa bundling, fokus pada kecepatan maksimal</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-bold text-yellow-700 dark:text-yellow-300 mb-1">Gratis Instalasi</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tidak ada biaya pemasangan, langsung aktif setelah instalasi</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="font-bold text-gray-800 dark:text-gray-200 mb-1">100% Fiber Optic</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Teknologi fiber optik untuk koneksi stabil dan kecepatan konsisten</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="font-bold text-gray-800 dark:text-gray-200 mb-1">Upload = Download</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Kecepatan upload sama dengan download untuk produktivitas maksimal</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="font-bold text-gray-800 dark:text-gray-200 mb-1">Unlimited Kuota</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tanpa batasan kuota, gunakan sepuasnya tanpa khawatir FUP</p>
              </div>
            </div>
          </div>

          {/* Commission Info */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-5 border-2 border-purple-300 dark:border-purple-700">
            <h4 className="text-lg font-black text-purple-700 dark:text-purple-300 mb-3 flex items-center gap-2">
              <span className="text-2xl">💰</span> Informasi Komisi
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
              Sebagai member MyRepublic Network Hub, Anda akan mendapatkan komisi <strong className="text-purple-700 dark:text-purple-300">{product.commissionRate}%</strong> dari setiap pelanggan yang berlangganan paket ini melalui referral Anda.
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              <strong className="text-purple-700 dark:text-purple-300">Bonus dikreditkan</strong> setelah pelanggan berhasil menyelesaikan berlangganan atau instalasi.
            </p>
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="rounded-full border-2 border-purple-300 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/50 py-6 px-8"
            >
              <X className="w-5 h-5 mr-2" />
              Tutup
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
