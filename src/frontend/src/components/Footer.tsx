import { SiFacebook, SiInstagram, SiX, SiYoutube } from 'react-icons/si';
import { Heart, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 text-white mt-auto overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute w-64 h-64 bg-yellow-400 rounded-full blur-3xl top-0 right-0"></div>
        <div className="absolute w-64 h-64 bg-pink-400 rounded-full blur-3xl bottom-0 left-0"></div>
      </div>
      
      <div className="relative container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-yellow-300" />
              <h3 className="font-black text-xl">MyRepublic Network Hub</h3>
            </div>
            <p className="text-purple-200 text-sm leading-relaxed">
              Platform pemasaran jaringan untuk layanan internet MyRepublic. Bergabunglah dan raih penghasilan tambahan dengan sistem komisi yang menguntungkan!
            </p>
          </div>
          
          <div>
            <h3 className="font-black text-lg mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              Kontak
            </h3>
            <div className="space-y-2 text-purple-200 text-sm">
              <p className="hover:text-white transition-colors cursor-pointer">
                📧 info@myrepublic-network-hub.com
              </p>
              <p className="hover:text-white transition-colors cursor-pointer">
                📞 1500-123
              </p>
              <p className="hover:text-white transition-colors cursor-pointer">
                💬 WhatsApp: 0877 2007 9763
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="font-black text-lg mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              Ikuti Kami
            </h3>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110 hover:shadow-neon-purple"
              >
                <SiFacebook className="w-6 h-6" />
              </a>
              <a 
                href="#" 
                className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110 hover:shadow-neon-purple"
              >
                <SiInstagram className="w-6 h-6" />
              </a>
              <a 
                href="#" 
                className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110 hover:shadow-neon-purple"
              >
                <SiX className="w-6 h-6" />
              </a>
              <a 
                href="#" 
                className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110 hover:shadow-neon-purple"
              >
                <SiYoutube className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-purple-700/50 pt-6 text-center">
          <p className="flex items-center justify-center gap-2 text-sm text-purple-200">
            © 2025. Built with <Heart className="w-4 h-4 text-red-400 fill-red-400 animate-pulse" /> using{' '}
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-yellow-300 hover:text-yellow-200 font-bold hover:underline transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
