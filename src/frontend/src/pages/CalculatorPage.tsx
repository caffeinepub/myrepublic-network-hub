import KomisiCalculator from '../components/KomisiCalculator';

export default function CalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 bg-clip-text text-transparent">
          Kalkulator Komisi
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Hitung potensi penghasilan Anda dari komisi langsung, bonus sponsor, dan bonus jaringan tanpa batas
        </p>
      </div>
      
      <KomisiCalculator />
    </div>
  );
}
