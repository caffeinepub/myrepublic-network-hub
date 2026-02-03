// Mocked address data for Indonesia
export interface PostalCodeData {
  postalCode: string;
  kelurahan: string;
  kecamatan: string;
  city: string;
  province: string;
}

export const countries = [
  'Indonesia',
  'Malaysia',
  'Singapura',
  'Thailand',
  'Filipina',
  'Vietnam',
  'Brunei',
  'Myanmar',
  'Kamboja',
  'Laos',
];

export const provinces = [
  'DKI Jakarta',
  'Jawa Barat',
  'Jawa Tengah',
  'Jawa Timur',
  'Banten',
  'Bali',
  'Sumatera Utara',
  'Sumatera Barat',
  'Sumatera Selatan',
  'Kalimantan Timur',
  'Kalimantan Selatan',
  'Sulawesi Selatan',
  'Sulawesi Utara',
  'Papua',
  'Aceh',
  'Riau',
  'Kepulauan Riau',
  'Jambi',
  'Bengkulu',
  'Lampung',
  'Bangka Belitung',
  'Kalimantan Barat',
  'Kalimantan Tengah',
  'Kalimantan Utara',
  'Sulawesi Tengah',
  'Sulawesi Tenggara',
  'Gorontalo',
  'Sulawesi Barat',
  'Maluku',
  'Maluku Utara',
  'Papua Barat',
  'Nusa Tenggara Barat',
  'Nusa Tenggara Timur',
  'Yogyakarta',
];

export const citiesByProvince: Record<string, string[]> = {
  'DKI Jakarta': ['Jakarta Pusat', 'Jakarta Utara', 'Jakarta Selatan', 'Jakarta Timur', 'Jakarta Barat', 'Kepulauan Seribu'],
  'Jawa Barat': ['Bandung', 'Bekasi', 'Bogor', 'Cirebon', 'Depok', 'Sukabumi', 'Tasikmalaya', 'Cimahi', 'Banjar', 'Karawang', 'Purwakarta', 'Subang', 'Indramayu', 'Sumedang', 'Garut', 'Cianjur', 'Kuningan', 'Majalengka'],
  'Jawa Tengah': ['Semarang', 'Surakarta', 'Magelang', 'Salatiga', 'Pekalongan', 'Tegal', 'Cilacap', 'Purwokerto', 'Kudus', 'Klaten', 'Boyolali', 'Purworejo', 'Kebumen', 'Wonosobo', 'Temanggung'],
  'Jawa Timur': ['Surabaya', 'Malang', 'Kediri', 'Blitar', 'Mojokerto', 'Madiun', 'Pasuruan', 'Probolinggo', 'Batu', 'Sidoarjo', 'Gresik', 'Jember', 'Banyuwangi', 'Tulungagung', 'Lumajang'],
  'Banten': ['Tangerang', 'Tangerang Selatan', 'Serang', 'Cilegon', 'Pandeglang', 'Lebak'],
  'Bali': ['Denpasar', 'Badung', 'Gianyar', 'Tabanan', 'Klungkung', 'Bangli', 'Karangasem', 'Buleleng', 'Jembrana'],
  'Sumatera Utara': ['Medan', 'Binjai', 'Tebing Tinggi', 'Pematang Siantar', 'Tanjung Balai', 'Padang Sidempuan', 'Sibolga', 'Deli Serdang', 'Langkat', 'Karo'],
  'Sumatera Barat': ['Padang', 'Bukittinggi', 'Payakumbuh', 'Solok', 'Sawahlunto', 'Padang Panjang', 'Pariaman', 'Agam', 'Pasaman', 'Tanah Datar'],
  'Sumatera Selatan': ['Palembang', 'Prabumulih', 'Pagar Alam', 'Lubuklinggau', 'Ogan Ilir', 'Muara Enim', 'Lahat', 'Musi Banyuasin'],
  'Kalimantan Timur': ['Balikpapan', 'Samarinda', 'Bontang', 'Kutai Kartanegara', 'Kutai Timur', 'Kutai Barat', 'Berau', 'Paser', 'Penajam Paser Utara'],
  'Kalimantan Selatan': ['Banjarmasin', 'Banjarbaru', 'Tanah Laut', 'Kotabaru', 'Banjar', 'Barito Kuala', 'Tapin', 'Hulu Sungai Selatan', 'Hulu Sungai Tengah', 'Hulu Sungai Utara', 'Tabalong', 'Tanah Bumbu', 'Balangan'],
  'Sulawesi Selatan': ['Makassar', 'Parepare', 'Palopo', 'Gowa', 'Maros', 'Bone', 'Bulukumba', 'Takalar', 'Jeneponto', 'Bantaeng', 'Sinjai', 'Wajo', 'Soppeng', 'Barru', 'Pangkep', 'Enrekang', 'Luwu', 'Tana Toraja', 'Pinrang', 'Sidenreng Rappang', 'Selayar'],
  'Sulawesi Utara': ['Manado', 'Bitung', 'Tomohon', 'Kotamobagu', 'Minahasa', 'Minahasa Utara', 'Minahasa Selatan', 'Minahasa Tenggara', 'Bolaang Mongondow', 'Kepulauan Sangihe', 'Kepulauan Talaud', 'Sitaro'],
  'Papua': ['Jayapura', 'Biak', 'Merauke', 'Timika', 'Nabire', 'Wamena', 'Sorong'],
  'Aceh': ['Banda Aceh', 'Langsa', 'Lhokseumawe', 'Sabang', 'Subulussalam', 'Aceh Besar', 'Aceh Utara', 'Aceh Timur', 'Aceh Selatan', 'Aceh Barat', 'Pidie', 'Bireuen'],
  'Riau': ['Pekanbaru', 'Dumai', 'Kampar', 'Bengkalis', 'Rokan Hulu', 'Rokan Hilir', 'Siak', 'Pelalawan', 'Indragiri Hulu', 'Indragiri Hilir', 'Kuantan Singingi', 'Kepulauan Meranti'],
  'Kepulauan Riau': ['Batam', 'Tanjung Pinang', 'Bintan', 'Karimun', 'Natuna', 'Lingga', 'Kepulauan Anambas'],
  'Jambi': ['Jambi', 'Sungai Penuh', 'Batang Hari', 'Muaro Jambi', 'Tanjung Jabung Timur', 'Tanjung Jabung Barat', 'Tebo', 'Bungo', 'Merangin', 'Sarolangun', 'Kerinci'],
  'Bengkulu': ['Bengkulu', 'Bengkulu Selatan', 'Bengkulu Utara', 'Bengkulu Tengah', 'Rejang Lebong', 'Lebong', 'Kepahiang', 'Seluma', 'Kaur', 'Mukomuko'],
  'Lampung': ['Bandar Lampung', 'Metro', 'Lampung Selatan', 'Lampung Tengah', 'Lampung Utara', 'Lampung Barat', 'Lampung Timur', 'Way Kanan', 'Tulang Bawang', 'Pesawaran', 'Pringsewu', 'Mesuji', 'Tulang Bawang Barat', 'Pesisir Barat'],
  'Bangka Belitung': ['Pangkal Pinang', 'Bangka', 'Bangka Barat', 'Bangka Tengah', 'Bangka Selatan', 'Belitung', 'Belitung Timur'],
  'Kalimantan Barat': ['Pontianak', 'Singkawang', 'Sambas', 'Bengkayang', 'Landak', 'Sanggau', 'Ketapang', 'Sintang', 'Kapuas Hulu', 'Sekadau', 'Melawi', 'Kayong Utara', 'Kubu Raya'],
  'Kalimantan Tengah': ['Palangka Raya', 'Kotawaringin Barat', 'Kotawaringin Timur', 'Kapuas', 'Barito Selatan', 'Barito Utara', 'Sukamara', 'Lamandau', 'Seruyan', 'Katingan', 'Pulang Pisau', 'Gunung Mas', 'Barito Timur', 'Murung Raya'],
  'Kalimantan Utara': ['Tarakan', 'Bulungan', 'Malinau', 'Nunukan', 'Tana Tidung'],
  'Sulawesi Tengah': ['Palu', 'Donggala', 'Poso', 'Toli-Toli', 'Banggai', 'Morowali', 'Buol', 'Parigi Moutong', 'Tojo Una-Una', 'Sigi', 'Banggai Kepulauan', 'Banggai Laut', 'Morowali Utara'],
  'Sulawesi Tenggara': ['Kendari', 'Bau-Bau', 'Konawe', 'Kolaka', 'Muna', 'Buton', 'Wakatobi', 'Bombana', 'Konawe Selatan', 'Konawe Utara', 'Kolaka Utara', 'Kolaka Timur', 'Konawe Kepulauan', 'Muna Barat', 'Buton Utara', 'Buton Tengah', 'Buton Selatan'],
  'Gorontalo': ['Gorontalo', 'Boalemo', 'Gorontalo Utara', 'Bone Bolango', 'Pohuwato', 'Gorontalo Utara'],
  'Sulawesi Barat': ['Mamuju', 'Majene', 'Polewali Mandar', 'Mamasa', 'Mamuju Utara', 'Mamuju Tengah'],
  'Maluku': ['Ambon', 'Tual', 'Maluku Tengah', 'Maluku Tenggara', 'Maluku Tenggara Barat', 'Buru', 'Kepulauan Aru', 'Seram Bagian Barat', 'Seram Bagian Timur', 'Maluku Barat Daya', 'Buru Selatan'],
  'Maluku Utara': ['Ternate', 'Tidore Kepulauan', 'Halmahera Barat', 'Halmahera Tengah', 'Kepulauan Sula', 'Halmahera Selatan', 'Halmahera Utara', 'Halmahera Timur', 'Pulau Morotai', 'Pulau Taliabu'],
  'Papua Barat': ['Sorong', 'Manokwari', 'Fakfak', 'Kaimana', 'Teluk Bintuni', 'Teluk Wondama', 'Sorong Selatan', 'Maybrat', 'Tambrauw', 'Raja Ampat'],
  'Nusa Tenggara Barat': ['Mataram', 'Bima', 'Lombok Barat', 'Lombok Tengah', 'Lombok Timur', 'Sumbawa', 'Dompu', 'Sumbawa Barat', 'Lombok Utara'],
  'Nusa Tenggara Timur': ['Kupang', 'Ende', 'Manggarai', 'Timor Tengah Selatan', 'Timor Tengah Utara', 'Belu', 'Alor', 'Lembata', 'Flores Timur', 'Sikka', 'Ngada', 'Sumba Timur', 'Sumba Barat', 'Rote Ndao', 'Manggarai Barat', 'Sumba Tengah', 'Sumba Barat Daya', 'Nagekeo', 'Manggarai Timur', 'Sabu Raijua', 'Malaka'],
  'Yogyakarta': ['Yogyakarta', 'Sleman', 'Bantul', 'Kulon Progo', 'Gunung Kidul'],
};

// Mocked postal code database
export const postalCodeDatabase: Record<string, PostalCodeData[]> = {
  'Jakarta Pusat': [
    { postalCode: '10110', kelurahan: 'Gambir', kecamatan: 'Gambir', city: 'Jakarta Pusat', province: 'DKI Jakarta' },
    { postalCode: '10120', kelurahan: 'Petojo Utara', kecamatan: 'Gambir', city: 'Jakarta Pusat', province: 'DKI Jakarta' },
    { postalCode: '10130', kelurahan: 'Kebon Kelapa', kecamatan: 'Gambir', city: 'Jakarta Pusat', province: 'DKI Jakarta' },
    { postalCode: '10140', kelurahan: 'Petojo Selatan', kecamatan: 'Gambir', city: 'Jakarta Pusat', province: 'DKI Jakarta' },
    { postalCode: '10150', kelurahan: 'Duri Pulo', kecamatan: 'Gambir', city: 'Jakarta Pusat', province: 'DKI Jakarta' },
    { postalCode: '10160', kelurahan: 'Cideng', kecamatan: 'Gambir', city: 'Jakarta Pusat', province: 'DKI Jakarta' },
    { postalCode: '10210', kelurahan: 'Gelora', kecamatan: 'Tanah Abang', city: 'Jakarta Pusat', province: 'DKI Jakarta' },
    { postalCode: '10220', kelurahan: 'Bendungan Hilir', kecamatan: 'Tanah Abang', city: 'Jakarta Pusat', province: 'DKI Jakarta' },
    { postalCode: '10230', kelurahan: 'Karet Tengsin', kecamatan: 'Tanah Abang', city: 'Jakarta Pusat', province: 'DKI Jakarta' },
    { postalCode: '10240', kelurahan: 'Petamburan', kecamatan: 'Tanah Abang', city: 'Jakarta Pusat', province: 'DKI Jakarta' },
  ],
  'Jakarta Selatan': [
    { postalCode: '12110', kelurahan: 'Tebet Barat', kecamatan: 'Tebet', city: 'Jakarta Selatan', province: 'DKI Jakarta' },
    { postalCode: '12120', kelurahan: 'Tebet Timur', kecamatan: 'Tebet', city: 'Jakarta Selatan', province: 'DKI Jakarta' },
    { postalCode: '12130', kelurahan: 'Menteng Dalam', kecamatan: 'Tebet', city: 'Jakarta Selatan', province: 'DKI Jakarta' },
    { postalCode: '12140', kelurahan: 'Kebon Baru', kecamatan: 'Tebet', city: 'Jakarta Selatan', province: 'DKI Jakarta' },
    { postalCode: '12150', kelurahan: 'Bukit Duri', kecamatan: 'Tebet', city: 'Jakarta Selatan', province: 'DKI Jakarta' },
    { postalCode: '12160', kelurahan: 'Manggarai', kecamatan: 'Tebet', city: 'Jakarta Selatan', province: 'DKI Jakarta' },
    { postalCode: '12170', kelurahan: 'Manggarai Selatan', kecamatan: 'Tebet', city: 'Jakarta Selatan', province: 'DKI Jakarta' },
  ],
  'Bandung': [
    { postalCode: '40111', kelurahan: 'Babakan Ciamis', kecamatan: 'Sumur Bandung', city: 'Bandung', province: 'Jawa Barat' },
    { postalCode: '40112', kelurahan: 'Braga', kecamatan: 'Sumur Bandung', city: 'Bandung', province: 'Jawa Barat' },
    { postalCode: '40113', kelurahan: 'Kebon Pisang', kecamatan: 'Sumur Bandung', city: 'Bandung', province: 'Jawa Barat' },
    { postalCode: '40114', kelurahan: 'Merdeka', kecamatan: 'Sumur Bandung', city: 'Bandung', province: 'Jawa Barat' },
    { postalCode: '40115', kelurahan: 'Citarum', kecamatan: 'Bandung Wetan', city: 'Bandung', province: 'Jawa Barat' },
    { postalCode: '40116', kelurahan: 'Tamansari', kecamatan: 'Bandung Wetan', city: 'Bandung', province: 'Jawa Barat' },
    { postalCode: '40117', kelurahan: 'Cihapit', kecamatan: 'Bandung Wetan', city: 'Bandung', province: 'Jawa Barat' },
  ],
  'Surabaya': [
    { postalCode: '60111', kelurahan: 'Embong Kaliasin', kecamatan: 'Genteng', city: 'Surabaya', province: 'Jawa Timur' },
    { postalCode: '60112', kelurahan: 'Ketabang', kecamatan: 'Genteng', city: 'Surabaya', province: 'Jawa Timur' },
    { postalCode: '60113', kelurahan: 'Kapasari', kecamatan: 'Genteng', city: 'Surabaya', province: 'Jawa Timur' },
    { postalCode: '60114', kelurahan: 'Peneleh', kecamatan: 'Genteng', city: 'Surabaya', province: 'Jawa Timur' },
    { postalCode: '60115', kelurahan: 'Genteng', kecamatan: 'Genteng', city: 'Surabaya', province: 'Jawa Timur' },
  ],
  'Semarang': [
    { postalCode: '50131', kelurahan: 'Kauman', kecamatan: 'Semarang Tengah', city: 'Semarang', province: 'Jawa Tengah' },
    { postalCode: '50132', kelurahan: 'Kranggan', kecamatan: 'Semarang Tengah', city: 'Semarang', province: 'Jawa Tengah' },
    { postalCode: '50133', kelurahan: 'Pekunden', kecamatan: 'Semarang Tengah', city: 'Semarang', province: 'Jawa Tengah' },
    { postalCode: '50134', kelurahan: 'Pindrikan Lor', kecamatan: 'Semarang Tengah', city: 'Semarang', province: 'Jawa Tengah' },
  ],
  'Medan': [
    { postalCode: '20111', kelurahan: 'Kesawan', kecamatan: 'Medan Barat', city: 'Medan', province: 'Sumatera Utara' },
    { postalCode: '20112', kelurahan: 'Petisah Tengah', kecamatan: 'Medan Petisah', city: 'Medan', province: 'Sumatera Utara' },
    { postalCode: '20113', kelurahan: 'Sei Sikambing B', kecamatan: 'Medan Petisah', city: 'Medan', province: 'Sumatera Utara' },
  ],
  'Denpasar': [
    { postalCode: '80111', kelurahan: 'Dangin Puri', kecamatan: 'Denpasar Timur', city: 'Denpasar', province: 'Bali' },
    { postalCode: '80112', kelurahan: 'Penatih', kecamatan: 'Denpasar Timur', city: 'Denpasar', province: 'Bali' },
    { postalCode: '80113', kelurahan: 'Kesiman', kecamatan: 'Denpasar Timur', city: 'Denpasar', province: 'Bali' },
  ],
};

export function getCitiesByProvince(province: string): string[] {
  return citiesByProvince[province] || [];
}

export function getPostalCodesByCity(city: string): PostalCodeData[] {
  return postalCodeDatabase[city] || [];
}

export function getAddressDataByPostalCode(postalCode: string): PostalCodeData | null {
  for (const cityData of Object.values(postalCodeDatabase)) {
    const found = cityData.find(data => data.postalCode === postalCode);
    if (found) return found;
  }
  return null;
}

export function constructFullAddress(data: PostalCodeData, street?: string): string {
  const parts: string[] = [];
  if (street) parts.push(street);
  parts.push(`Kelurahan ${data.kelurahan}`);
  parts.push(`Kecamatan ${data.kecamatan}`);
  parts.push(data.city);
  parts.push(data.province);
  parts.push(data.postalCode);
  return parts.join(', ');
}
