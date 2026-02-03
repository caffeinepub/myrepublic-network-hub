import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSaveCallerUserProfile, useGetCurrentUserRole } from '../hooks/useQueries';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { countries, provinces, getCitiesByProvince, getPostalCodesByCity, getAddressDataByPostalCode, constructFullAddress } from '../lib/addressData';
import { Principal } from '@dfinity/principal';

interface ProfileSetupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProfileSetupModal({ open, onOpenChange }: ProfileSetupModalProps) {
  const [sponsorId, setSponsorId] = useState('');
  const [nikKtp, setNikKtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [country, setCountry] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [street, setStreet] = useState('');
  const [completeAddress, setCompleteAddress] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [domicileAddress, setDomicileAddress] = useState('');
  const [sameAsKtp, setSameAsKtp] = useState(false);

  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [availablePostalCodes, setAvailablePostalCodes] = useState<Array<{ code: string; label: string }>>([]);
  
  const { mutate: saveProfile, isPending, error } = useSaveCallerUserProfile();
  const { data: userRole } = useGetCurrentUserRole();

  const isAdmin = userRole === 'admin';

  // Update cities when province changes
  useEffect(() => {
    if (province) {
      const cities = getCitiesByProvince(province);
      setAvailableCities(cities);
      setCity('');
      setPostalCode('');
      setAvailablePostalCodes([]);
      setCompleteAddress('');
    } else {
      setAvailableCities([]);
    }
  }, [province]);

  // Update postal codes when city changes
  useEffect(() => {
    if (city) {
      const postalCodes = getPostalCodesByCity(city);
      setAvailablePostalCodes(
        postalCodes.map(data => ({
          code: data.postalCode,
          label: `${data.postalCode} - ${data.kelurahan}, ${data.kecamatan}`,
        }))
      );
      setPostalCode('');
      setCompleteAddress('');
    } else {
      setAvailablePostalCodes([]);
    }
  }, [city]);

  // Auto-construct address when postal code changes
  useEffect(() => {
    if (postalCode) {
      const addressData = getAddressDataByPostalCode(postalCode);
      if (addressData) {
        const fullAddr = constructFullAddress(addressData, street);
        setCompleteAddress(fullAddr);
      }
    }
  }, [postalCode, street]);

  // Auto-fill domicile address when checkbox is checked
  useEffect(() => {
    if (sameAsKtp) {
      setDomicileAddress(completeAddress);
    }
  }, [sameAsKtp, completeAddress]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Admin users: simplified profile (no KTP details required)
    if (isAdmin) {
      saveProfile({
        sponsorId: null,
        nikKtp: null,
        fullName: '',
        placeOfBirth: '',
        dateOfBirth: '',
        completeAddress: '',
        province: '',
        city: '',
        country: '',
        whatsappNumber: '',
        domicileAddress: '',
        sameAsKtp: false,
        bankAccount: null,
      }, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
      return;
    }

    // Regular members: full validation
    if (!sponsorId.trim() || !nikKtp.trim() || !fullName.trim() || !placeOfBirth.trim() || !dateOfBirth.trim() || 
        !country.trim() || !province.trim() || !city.trim() || !postalCode.trim() ||
        !completeAddress.trim() || !whatsappNumber.trim() || !bankAccount.trim() || !domicileAddress.trim()) {
      return;
    }

    let sponsor: Principal;
    try {
      sponsor = Principal.fromText(sponsorId);
    } catch {
      return;
    }

    saveProfile({
      sponsorId: sponsor,
      nikKtp: nikKtp.trim(),
      fullName: fullName.trim(),
      placeOfBirth: placeOfBirth.trim(),
      dateOfBirth: dateOfBirth.trim(),
      completeAddress: completeAddress.trim(),
      province: province.trim(),
      city: city.trim(),
      country: country.trim(),
      whatsappNumber: whatsappNumber.trim(),
      domicileAddress: domicileAddress.trim(),
      sameAsKtp,
      bankAccount: bankAccount.trim(),
    }, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  // Admin users don't need to complete profile
  if (isAdmin) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto border-2 border-purple-300 dark:border-purple-700 shadow-neon-purple">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 bg-clip-text text-transparent">
            Lengkapi Profil Anda
          </DialogTitle>
          <DialogDescription className="text-base">
            Silakan lengkapi semua informasi profil Anda untuk melanjutkan
          </DialogDescription>
        </DialogHeader>

        <Alert className="border-2 border-purple-300 dark:border-purple-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
          <AlertCircle className="h-5 w-5 text-purple-600" />
          <AlertDescription className="text-purple-800 dark:text-purple-200 font-semibold ml-2">
            <strong>Penting:</strong> Semua kolom wajib diisi untuk melengkapi profil Anda.
          </AlertDescription>
        </Alert>

        {error && (
          <Alert className="border-2 border-red-300 dark:border-red-700 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200 font-semibold ml-2">
              {error.message}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="profile-sponsorId" className="text-base font-bold text-red-600 dark:text-red-400">
              ID Sponsor (Referral) *
            </Label>
            <Input
              id="profile-sponsorId"
              value={sponsorId}
              onChange={(e) => setSponsorId(e.target.value)}
              placeholder="Masukkan Principal ID sponsor Anda"
              required
              className="mt-2 border-2 border-red-300 dark:border-red-700 focus:border-red-500 rounded-xl h-12"
            />
            <p className="text-sm text-red-600 dark:text-red-400 mt-2 font-bold flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Wajib diisi - Dapatkan ID Sponsor dari member yang merekomendasikan Anda
            </p>
          </div>

          <div>
            <Label htmlFor="profile-nikKtp" className="text-base font-bold text-purple-600 dark:text-purple-400">
              NIK KTP *
            </Label>
            <Input
              id="profile-nikKtp"
              value={nikKtp}
              onChange={(e) => setNikKtp(e.target.value)}
              placeholder="Masukkan 16 digit NIK KTP Anda"
              required
              maxLength={16}
              className="mt-2 border-2 border-purple-300 dark:border-purple-700 focus:border-purple-500 rounded-xl h-12"
            />
            <p className="text-sm text-purple-600 dark:text-purple-400 mt-2 font-bold flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Wajib diisi - NIK KTP harus unik dan belum terdaftar
            </p>
          </div>

          <div>
            <Label htmlFor="profile-fullName" className="text-base font-bold">Nama Lengkap *</Label>
            <Input
              id="profile-fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nama lengkap sesuai KTP"
              required
              className="mt-2 border-2 border-purple-200 dark:border-purple-800 focus:border-purple-600 rounded-xl h-12"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="profile-placeOfBirth" className="text-base font-bold">Tempat Lahir *</Label>
              <Input
                id="profile-placeOfBirth"
                value={placeOfBirth}
                onChange={(e) => setPlaceOfBirth(e.target.value)}
                placeholder="Kota tempat lahir"
                required
                className="mt-2 border-2 border-purple-200 dark:border-purple-800 focus:border-purple-600 rounded-xl h-12"
              />
            </div>

            <div>
              <Label htmlFor="profile-dateOfBirth" className="text-base font-bold">Tanggal Lahir *</Label>
              <Input
                id="profile-dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
                className="mt-2 border-2 border-purple-200 dark:border-purple-800 focus:border-purple-600 rounded-xl h-12"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="profile-whatsappNumber" className="text-base font-bold">Nomor WhatsApp *</Label>
            <Input
              id="profile-whatsappNumber"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="08123456789"
              required
              className="mt-2 border-2 border-purple-200 dark:border-purple-800 focus:border-purple-600 rounded-xl h-12"
            />
          </div>

          <div>
            <Label htmlFor="profile-bankAccount" className="text-base font-bold text-yellow-600 dark:text-yellow-400">
              No Rekening Bank *
            </Label>
            <Input
              id="profile-bankAccount"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              placeholder="Masukkan nomor rekening bank Anda"
              required
              className="mt-2 border-2 border-yellow-300 dark:border-yellow-700 focus:border-yellow-500 rounded-xl h-12"
            />
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2 font-bold flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Wajib diisi - Untuk penarikan komisi yang Anda dapatkan
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t-2 border-purple-200">
            <h4 className="text-base font-bold text-purple-600 dark:text-purple-400">Alamat (Sesuai KTP)</h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="profile-country" className="text-base font-bold">Negara *</Label>
                <Select value={country} onValueChange={setCountry} required>
                  <SelectTrigger className="mt-2 border-2 border-purple-200 dark:border-purple-800 focus:border-purple-600 rounded-xl h-12">
                    <SelectValue placeholder="Pilih negara" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {countries.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="profile-province" className="text-base font-bold">Provinsi *</Label>
                <Select value={province} onValueChange={setProvince} required disabled={!country}>
                  <SelectTrigger className="mt-2 border-2 border-purple-200 dark:border-purple-800 focus:border-purple-600 rounded-xl h-12">
                    <SelectValue placeholder="Pilih provinsi" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {provinces.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="profile-city" className="text-base font-bold">Kota *</Label>
                <Select value={city} onValueChange={setCity} required disabled={!province}>
                  <SelectTrigger className="mt-2 border-2 border-purple-200 dark:border-purple-800 focus:border-purple-600 rounded-xl h-12">
                    <SelectValue placeholder="Pilih kota" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {availableCities.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="profile-postalCode" className="text-base font-bold">Kode Pos *</Label>
              <Select value={postalCode} onValueChange={setPostalCode} required disabled={!city}>
                <SelectTrigger className="mt-2 border-2 border-purple-200 dark:border-purple-800 focus:border-purple-600 rounded-xl h-12">
                  <SelectValue placeholder="Pilih kode pos" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {availablePostalCodes.map((pc) => (
                    <SelectItem key={pc.code} value={pc.code}>{pc.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-2 font-medium">
                Pilih kode pos untuk mengisi alamat lengkap secara otomatis
              </p>
            </div>

            <div>
              <Label htmlFor="profile-street" className="text-base font-bold">Jalan / Nomor Rumah (Opsional)</Label>
              <Input
                id="profile-street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Contoh: Jl. Merdeka No. 123, RT 01/RW 02"
                className="mt-2 border-2 border-purple-200 dark:border-purple-800 focus:border-purple-600 rounded-xl h-12"
              />
            </div>

            <div>
              <Label htmlFor="profile-completeAddress" className="text-base font-bold">Preview Alamat Lengkap *</Label>
              <Input
                id="profile-completeAddress"
                value={completeAddress}
                readOnly
                placeholder="Alamat akan terisi otomatis setelah memilih kode pos"
                className="mt-2 border-2 border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-950/30 rounded-xl h-12 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Alamat ini dibuat otomatis berdasarkan kode pos yang dipilih
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="profile-domicileAddress" className="text-base font-bold">Alamat Domisili *</Label>
            <Input
              id="profile-domicileAddress"
              value={domicileAddress}
              onChange={(e) => {
                setDomicileAddress(e.target.value);
                if (sameAsKtp && e.target.value !== completeAddress) {
                  setSameAsKtp(false);
                }
              }}
              placeholder="Alamat tempat tinggal saat ini"
              required
              className="mt-2 border-2 border-purple-200 dark:border-purple-800 focus:border-purple-600 rounded-xl h-12"
            />
            <div className="flex items-center space-x-2 mt-3">
              <Checkbox
                id="profile-sameAsKtp"
                checked={sameAsKtp}
                onCheckedChange={(checked) => setSameAsKtp(checked as boolean)}
                className="border-purple-400"
              />
              <Label
                htmlFor="profile-sameAsKtp"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Sesuai KTP (Alamat domisili sama dengan alamat KTP)
              </Label>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full rounded-full py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 text-white font-black shadow-neon-purple text-lg uppercase tracking-wide glossy" 
            disabled={isPending || !sponsorId.trim() || !nikKtp.trim() || !fullName.trim() || !placeOfBirth.trim() || !dateOfBirth.trim() || 
              !country.trim() || !province.trim() || !city.trim() || !postalCode.trim() ||
              !completeAddress.trim() || !whatsappNumber.trim() || !bankAccount.trim() || !domicileAddress.trim()}
          >
            {isPending ? 'Menyimpan...' : 'Simpan Data'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
