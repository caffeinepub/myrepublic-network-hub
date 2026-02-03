import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ArrowDownToLine, CheckCircle2 } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { useRequestWithdrawal, useGetCallerUserProfile } from '../hooks/useQueries';

interface WithdrawalRequestModalProps {
  open: boolean;
  onClose: () => void;
  availableBalance: number;
  bankAccount: string;
}

export default function WithdrawalRequestModal({ open, onClose, availableBalance, bankAccount }: WithdrawalRequestModalProps) {
  const [amount, setAmount] = useState('');
  const [whatsappError, setWhatsappError] = useState<string | null>(null);
  const { mutate: requestWithdrawal, isPending, isSuccess, error, reset } = useRequestWithdrawal();
  const { data: userProfile } = useGetCallerUserProfile();

  const openWhatsApp = (message: string): boolean => {
    try {
      // Encode message properly for URL
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/6287720079763?text=${encodedMessage}`;
      
      // Try to open WhatsApp
      const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      
      // Check if window was blocked
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const withdrawalAmount = parseInt(amount);
    
    if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
      return;
    }

    if (withdrawalAmount > availableBalance) {
      return;
    }

    setWhatsappError(null);

    requestWithdrawal(BigInt(withdrawalAmount), {
      onSuccess: () => {
        // Generate WhatsApp message with withdrawal details
        const currentDate = new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        const memberName = userProfile?.basic.name || 'Member';
        
        const message = `Halo admin, saya ingin mengajukan penarikan saldo.\n\nNama: ${memberName}\nJumlah penarikan: Rp ${withdrawalAmount.toLocaleString('id-ID')}\nNo Rekening: ${bankAccount}\nTanggal permintaan: ${currentDate}`;
        
        // Try to open WhatsApp with error handling
        const whatsappOpened = openWhatsApp(message);
        
        if (!whatsappOpened) {
          setWhatsappError('Gagal membuka WhatsApp. Silakan hubungi admin secara manual di nomor 0877 2007 9763');
          return;
        }
        
        // Close modal after short delay
        setTimeout(() => {
          setAmount('');
          setWhatsappError(null);
          reset();
          onClose();
        }, 2000);
      },
      onError: (err) => {
        console.error('Withdrawal request error:', err);
      }
    });
  };

  const handleClose = () => {
    setAmount('');
    setWhatsappError(null);
    reset();
    onClose();
  };

  if (isSuccess && !whatsappError) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px] border-2 border-green-300 dark:border-green-700 shadow-neon-gold">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              Permintaan Berhasil!
            </DialogTitle>
            <DialogDescription className="text-base">
              Permintaan penarikan Anda telah berhasil dikirim
            </DialogDescription>
          </DialogHeader>

          <Alert className="border-2 border-green-300 dark:border-green-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200 font-semibold ml-2">
              Permintaan penarikan berhasil dikirim dan admin telah dihubungi melalui WhatsApp. Anda akan menerima notifikasi setelah permintaan disetujui.
            </AlertDescription>
          </Alert>

          <Alert className="border-2 border-purple-300 dark:border-purple-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
            <SiWhatsapp className="h-5 w-5 text-green-600" />
            <AlertDescription className="text-purple-800 dark:text-purple-200 font-semibold ml-2">
              Chat WhatsApp dengan admin telah dibuka di tab baru. Silakan lanjutkan komunikasi di sana.
            </AlertDescription>
          </Alert>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] border-2 border-yellow-300 dark:border-yellow-700 shadow-neon-gold">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black bg-gradient-to-r from-yellow-600 via-orange-600 to-yellow-700 bg-clip-text text-transparent flex items-center gap-2">
            <ArrowDownToLine className="w-6 h-6 text-yellow-600" />
            Tarik Saldo
          </DialogTitle>
          <DialogDescription className="text-base">
            Masukkan jumlah saldo yang ingin Anda tarik
          </DialogDescription>
        </DialogHeader>

        {(error || whatsappError) && (
          <Alert className="border-2 border-red-300 dark:border-red-700 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200 font-semibold ml-2">
              {whatsappError || error?.message}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 p-4 rounded-xl border-2 border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Saldo Tersedia</p>
            <p className="text-3xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Rp {availableBalance.toLocaleString('id-ID')}
            </p>
          </div>

          <div>
            <Label htmlFor="amount" className="text-base font-bold">Jumlah Penarikan *</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Masukkan jumlah yang ingin ditarik"
              required
              min="1"
              max={availableBalance}
              className="mt-2 border-2 border-yellow-200 dark:border-yellow-800 focus:border-yellow-600 rounded-xl h-12"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Maksimal: Rp {availableBalance.toLocaleString('id-ID')}
            </p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border-2 border-purple-200 dark:border-purple-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">No Rekening Bank</p>
            <p className="font-bold text-gray-800 dark:text-gray-200">{bankAccount || 'Tidak tersedia'}</p>
            {!bankAccount && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                Nomor rekening tidak ditemukan. Silakan hubungi admin.
              </p>
            )}
          </div>

          <Alert className="border-2 border-purple-300 dark:border-purple-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
            <SiWhatsapp className="h-5 w-5 text-green-600" />
            <AlertDescription className="text-purple-800 dark:text-purple-200 font-semibold ml-2">
              Setelah mengirim permintaan, Anda akan diarahkan ke WhatsApp untuk menghubungi admin secara langsung. Dana akan ditransfer ke rekening bank yang terdaftar setelah disetujui.
            </AlertDescription>
          </Alert>

          <Button 
            type="submit" 
            className="w-full rounded-full py-6 bg-gradient-to-r from-yellow-600 via-orange-600 to-yellow-700 hover:from-yellow-700 hover:via-orange-700 hover:to-yellow-800 text-white font-black shadow-neon-gold text-lg uppercase tracking-wide glossy" 
            disabled={isPending || !amount || parseInt(amount) <= 0 || parseInt(amount) > availableBalance || !bankAccount}
          >
            {isPending ? 'Mengirim Permintaan...' : 'Kirim Permintaan'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
