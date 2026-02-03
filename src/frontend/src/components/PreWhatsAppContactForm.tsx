import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, MapPin, Navigation, Loader2, CheckCircle, Package, XCircle, RefreshCw } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { useSubmitPreWhatsAppContactForm, useGetProduct } from '@/hooks/useQueries';
import type { Coordinates } from '@/backend';

interface PreWhatsAppContactFormProps {
  open: boolean;
  onClose: () => void;
  productId: bigint;
}

export default function PreWhatsAppContactForm({ open, onClose, productId }: PreWhatsAppContactFormProps) {
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitFormMutation = useSubmitPreWhatsAppContactForm();
  
  // Fetch product data from backend with retry support
  const { 
    data: productData, 
    isLoading: productLoading, 
    isError: productError,
    error: productErrorObj,
    refetch: refetchProduct,
    isFetching: productFetching
  } = useGetProduct(productId);

  // Reset form state when modal opens or product changes
  useEffect(() => {
    if (open) {
      detectCurrentLocation();
      setCustomerName('');
      setPhoneNumber('');
      setCustomerAddress('');
      setCoordinates(null);
      setLocationError(null);
      setSuccessMessage(null);
      setIsSubmitting(false);
    }
  }, [open, productId]);

  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolokasi tidak didukung oleh browser Anda. Silakan masukkan koordinat secara manual.');
      return;
    }

    setIsLoadingLocation(true);
    setLocationError(null);

    // Set timeout for location detection with retry mechanism
    const timeoutId = setTimeout(() => {
      setIsLoadingLocation(false);
      setLocationError('Waktu permintaan lokasi habis. Silakan klik "Deteksi Ulang" untuk mencoba lagi.');
    }, 20000); // 20 second timeout

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId);
        const coords: Coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setCoordinates(coords);
        setIsLoadingLocation(false);
        setLocationError(null);
      },
      (error) => {
        clearTimeout(timeoutId);
        console.error('Error getting location:', error);
        setIsLoadingLocation(false);
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Akses lokasi ditolak. Silakan izinkan akses lokasi di browser Anda atau klik "Deteksi Ulang".');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Lokasi tidak tersedia. Silakan periksa pengaturan GPS Anda dan klik "Deteksi Ulang".');
            break;
          case error.TIMEOUT:
            setLocationError('Waktu permintaan lokasi habis. Silakan klik "Deteksi Ulang" untuk mencoba lagi.');
            break;
          default:
            setLocationError('Terjadi kesalahan saat mengambil lokasi. Silakan klik "Deteksi Ulang" untuk mencoba lagi.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    );
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required fields
    if (!customerName.trim()) {
      setLocationError('Nama lengkap wajib diisi.');
      return;
    }

    if (!phoneNumber.trim()) {
      setLocationError('Nomor HP wajib diisi.');
      return;
    }

    if (!customerAddress.trim()) {
      setLocationError('Alamat lengkap wajib diisi.');
      return;
    }

    if (!coordinates) {
      setLocationError('Lokasi saat ini wajib terdeteksi. Silakan klik tombol "Deteksi Ulang" untuk mencoba lagi.');
      return;
    }

    // Validate product data is loaded
    if (!productData) {
      setLocationError('Paket belum dimuat. Silakan klik tombol "Retry" di bagian atas untuk memuat ulang data paket.');
      return;
    }

    setLocationError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      // Submit contact form to backend with validated product ID
      const result = await submitFormMutation.mutateAsync({
        customerName: customerName.trim(),
        phoneNumber: phoneNumber.trim(),
        customerAddress: customerAddress.trim(),
        coordinates,
        productId,
      });

      // Check if submission was successful
      if (result.__kind__ === 'Error') {
        setLocationError(result.Error);
        setIsSubmitting(false);
        return;
      }

      // Show success message
      setSuccessMessage('Formulir berhasil dikirim');

      // Generate Google Maps link
      const googleMapsLink = `https://maps.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`;

      // Use validated product data from backend
      const validatedProductName = productData.name;
      const validatedProductPrice = Number(productData.price);
      const priceText = `Rp ${validatedProductPrice.toLocaleString('id-ID')}`;

      // Generate WhatsApp message with all required information including validated product name and price
      const message = `Halo admin, saya tertarik berlangganan paket ${validatedProductName} seharga ${priceText} dari MyRepublic Network Hub.\n\nNama: ${customerName}\nNomor HP: ${phoneNumber}\nAlamat: ${customerAddress}\nLokasi saat ini: ${googleMapsLink}`;
      
      // Try to open WhatsApp with comprehensive error handling
      const whatsappOpened = openWhatsApp(message);
      
      if (!whatsappOpened) {
        setLocationError('Gagal membuka WhatsApp. Silakan hubungi admin secara manual di nomor 0877 2007 9763');
        setIsSubmitting(false);
        return;
      }
      
      // Close modal after short delay to show success message
      setTimeout(() => {
        setCustomerName('');
        setPhoneNumber('');
        setCustomerAddress('');
        setCoordinates(null);
        setLocationError(null);
        setSuccessMessage(null);
        setIsSubmitting(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setLocationError('Gagal mengirim formulir. Silakan periksa koneksi internet Anda dan coba lagi.');
      setIsSubmitting(false);
    }
  };

  const formatCoordinates = (coords: Coordinates | null): string => {
    if (!coords) return 'Belum terdeteksi';
    return `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`;
  };

  const getGoogleMapsPreviewUrl = (coords: Coordinates | null): string => {
    if (!coords) return '';
    return `https://maps.google.com/maps?q=${coords.latitude},${coords.longitude}&output=embed`;
  };

  const formatPrice = (price: number): string => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  // Use validated product data if available
  const displayProductName = productData ? productData.name : 'Loading...';
  const displayProductPrice = productData ? Number(productData.price) : 0;

  // Check if form is ready to submit
  const isFormValid = customerName.trim() && phoneNumber.trim() && customerAddress.trim() && coordinates && productData;

  const handleRetryProduct = () => {
    refetchProduct();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 border-2 border-purple-300 dark:border-purple-700 shadow-neon-purple">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 bg-clip-text text-transparent">
            Subscription Contact Form
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            <strong>Step 1:</strong> Fill in your details below<br />
            <strong>Step 2:</strong> Click "Continue to WhatsApp" to contact admin
          </DialogDescription>
        </DialogHeader>

        {/* Product Loading State */}
        {productLoading && !productData && (
          <Alert className="border-2 border-purple-300 dark:border-purple-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
            <Loader2 className="h-5 w-5 text-purple-600 animate-spin" />
            <AlertDescription className="text-purple-800 dark:text-purple-200 font-semibold ml-2">
              Loading package information...
            </AlertDescription>
          </Alert>
        )}

        {/* Product Error State with Retry */}
        {productError && !productData && (
          <Alert className="border-2 border-red-300 dark:border-red-700 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div className="flex-1 ml-2">
              <AlertDescription className="text-red-800 dark:text-red-200 font-semibold mb-3">
                Failed to load package information. Please retry.
              </AlertDescription>
              <Button
                onClick={handleRetryProduct}
                disabled={productFetching}
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white rounded-full"
              >
                {productFetching ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry
                  </>
                )}
              </Button>
            </div>
          </Alert>
        )}

        {/* Selected Product Display - Non-editable */}
        {productData && (
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-4 border-2 border-purple-300 dark:border-purple-700 shadow-neon-purple">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-2 rounded-lg">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wide">Selected Package</p>
                <p className="text-xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {displayProductName}
                </p>
              </div>
            </div>
            
            {/* Product Name Field - Non-editable */}
            <div className="mb-3">
              <Label htmlFor="selectedProduct" className="text-sm font-bold text-gray-700 dark:text-gray-300">Package Name</Label>
              <Input
                id="selectedProduct"
                value={displayProductName}
                readOnly
                className="mt-1 border-2 border-purple-300 dark:border-purple-700 bg-white dark:bg-gray-800 rounded-xl h-11 cursor-not-allowed font-bold text-purple-700 dark:text-purple-300"
              />
            </div>

            {/* Package Price Display - Non-editable */}
            <div>
              <Label htmlFor="packagePrice" className="text-sm font-bold text-gray-700 dark:text-gray-300">Package Price</Label>
              <div className="relative mt-1">
                <Input
                  id="packagePrice"
                  value={formatPrice(displayProductPrice)}
                  readOnly
                  className="border-2 border-yellow-300 dark:border-yellow-700 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-xl h-11 cursor-not-allowed font-black text-yellow-700 dark:text-yellow-300"
                />
              </div>
            </div>
          </div>
        )}

        <Alert className="border-2 border-purple-300 dark:border-purple-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
          <AlertCircle className="h-5 w-5 text-purple-600" />
          <AlertDescription className="text-purple-800 dark:text-purple-200 font-semibold ml-2">
            This data will be sent to admin via WhatsApp for subscription processing
          </AlertDescription>
        </Alert>

        {successMessage && (
          <Alert className="border-2 border-green-300 dark:border-green-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200 font-semibold ml-2">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {locationError && (
          <Alert className="border-2 border-red-300 dark:border-red-700 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200 font-semibold ml-2">
              {locationError}
            </AlertDescription>
          </Alert>
        )}

        {/* Why can't I continue? Checklist */}
        {!isFormValid && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 border-2 border-yellow-300 dark:border-yellow-700 rounded-xl p-4">
            <h3 className="font-bold text-yellow-900 dark:text-yellow-100 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Why can't I continue?
            </h3>
            <div className="space-y-2">
              <div className={`flex items-center gap-2 text-sm ${customerName.trim() ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'}`}>
                {customerName.trim() ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span>Full name entered</span>
              </div>
              <div className={`flex items-center gap-2 text-sm ${phoneNumber.trim() ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'}`}>
                {phoneNumber.trim() ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span>Phone number entered</span>
              </div>
              <div className={`flex items-center gap-2 text-sm ${customerAddress.trim() ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'}`}>
                {customerAddress.trim() ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span>Full address entered</span>
              </div>
              <div className={`flex items-center gap-2 text-sm ${coordinates ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'}`}>
                {coordinates ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span>Location detected</span>
              </div>
              <div className={`flex items-center gap-2 text-sm ${productData ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'}`}>
                {productData ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span>Package loaded</span>
              </div>
              {!productData && (
                <p className="text-xs text-red-700 dark:text-red-300 mt-2 font-semibold">
                  ⚠️ Package could not be loaded. Please click the "Retry" button above.
                </p>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Customer Name */}
          <div>
            <Label htmlFor="customerName" className="text-base font-bold">Full Name *</Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="mt-2 border-2 border-purple-200 dark:border-purple-800 focus:border-purple-600 rounded-xl h-12"
            />
          </div>

          {/* Phone Number */}
          <div>
            <Label htmlFor="phoneNumber" className="text-base font-bold">Phone Number *</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Example: 081234567890"
              required
              className="mt-2 border-2 border-purple-200 dark:border-purple-800 focus:border-purple-600 rounded-xl h-12"
            />
          </div>

          {/* Customer Address */}
          <div>
            <Label htmlFor="customerAddress" className="text-base font-bold">Full Address *</Label>
            <Textarea
              id="customerAddress"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="Enter complete address for installation"
              required
              rows={3}
              className="mt-2 border-2 border-purple-200 dark:border-purple-800 focus:border-purple-600 rounded-xl resize-none"
            />
          </div>

          {/* Location Detection Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-bold">Current Location *</Label>
              <Button
                type="button"
                onClick={detectCurrentLocation}
                disabled={isLoadingLocation}
                variant="outline"
                size="sm"
                className="border-2 border-purple-300 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-full"
              >
                {isLoadingLocation ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Detecting...
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4 mr-2" />
                    Detect Again
                  </>
                )}
              </Button>
            </div>

            {/* Interactive Map Preview */}
            <div className="relative w-full h-80 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl border-2 border-purple-300 dark:border-purple-700 overflow-hidden shadow-neon-purple">
              {isLoadingLocation ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                  <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
                  <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                    Detecting your location...
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Please allow location access in your browser
                  </p>
                </div>
              ) : coordinates ? (
                <>
                  {/* Google Maps Embed */}
                  <iframe
                    src={getGoogleMapsPreviewUrl(coordinates)}
                    className="w-full h-full"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Your Location"
                  />
                  
                  {/* Location Marker Overlay */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full pointer-events-none">
                    <div className="relative">
                      <MapPin className="w-12 h-12 text-red-600 drop-shadow-2xl animate-pulse" fill="currentColor" />
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-600 rounded-full opacity-50 animate-ping"></div>
                    </div>
                  </div>

                  {/* Coordinate Display */}
                  <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-xl shadow-neon-purple backdrop-blur-sm">
                    <p className="text-xs font-semibold mb-1">Detected Coordinates:</p>
                    <p className="text-sm font-black">{formatCoordinates(coordinates)}</p>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <MapPin className="w-16 h-16 text-purple-400 mb-4" />
                  <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                    Location not detected yet
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Click "Detect Again" button to try again
                  </p>
                </div>
              )}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-600" />
              Your location will be detected automatically using browser GPS
            </p>
          </div>

          {/* Coordinates Display (Read-only) */}
          <div>
            <Label htmlFor="coordinates" className="text-base font-bold">Location Coordinates *</Label>
            <Input
              id="coordinates"
              value={formatCoordinates(coordinates)}
              readOnly
              placeholder="Coordinates will be filled automatically"
              required
              className="mt-2 border-2 border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-950/30 rounded-xl h-12 cursor-not-allowed font-mono"
            />
            {coordinates && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Google Maps Link: https://maps.google.com/maps?q={coordinates.latitude},{coordinates.longitude}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="flex-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-6 text-lg shadow-neon-purple glossy disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <SiWhatsapp className="w-5 h-5 mr-2" />
                  Continue to WhatsApp
                </>
              )}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={isSubmitting}
              className="rounded-full border-2 border-purple-300 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/50 py-6 px-8"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
