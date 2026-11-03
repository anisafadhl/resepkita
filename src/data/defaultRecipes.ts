import { Recipe } from '../types/recipe';

export const defaultRecipes: Recipe[] = [
  {
    id: 'r1',
    title: 'Ayam Kecap Manis Gurih Rumahan',
    tags: ['ayam', 'kecap', 'gurih', 'lauk', 'rumahan'],
    time: 25,
    difficulty: 'Mudah',
    author: 'Ibu Ratna',
    rating: 4.9,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=700&auto=format&fit=crop&q=80',
    desc: 'Olahan ayam favorit keluarga. Daging empuk berbalut kuah manis legit kecap dengan aroma bawang bombay harum.',
    portionBase: 3,
    ingredients: [
      { name: 'Daging ayam (potong kecil)', qty: 500, unit: 'gram' },
      { name: 'Bawang bombay (iris memanjang)', qty: 0.5, unit: 'buah' },
      { name: 'Bawang putih (cincang)', qty: 3, unit: 'siung' },
      { name: 'Kecap manis gurih', qty: 4, unit: 'sdm' },
      { name: 'Saus tiram', qty: 1, unit: 'sdm' },
      { name: 'Air bersih', qty: 150, unit: 'ml' }
    ],
    steps: [
      'Goreng ayam sebentar hingga berkulit kuning kecokelatan, lalu tiriskan.',
      'Tumis bawang putih cincang dan bawang bombay hingga mengeluarkan bau harum.',
      'Masukkan potongan ayam, tambahkan kecap manis, saus tiram, dan sedikit lada.',
      'Tuang air secukupnya, ungkep dengan api kecil sampai kuah mengental dan bumbu meresap ke serat ayam.'
    ],
    tips: 'Jangan menggoreng ayam terlalu kering di awal agar daging bagian dalam tetap lembut dan manis meresap.'
  },
  {
    id: 'r2',
    title: 'Sayur Bening Bayam Jagung Manis',
    tags: ['sayur', 'sup', 'sehat', 'kuah', 'bening', 'jagung'],
    time: 15,
    difficulty: 'Mudah',
    author: 'Dapur Sehat Nenek',
    rating: 4.8,
    reviewsCount: 110,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&auto=format&fit=crop&q=80',
    desc: 'Sayur bening segar tanpa minyak. Kuah segar dengan rempah temu kunci yang menenangkan lambung dan lezat.',
    portionBase: 3,
    ingredients: [
      { name: 'Daun bayam hijau segar', qty: 2, unit: 'ikat' },
      { name: 'Jagung manis (potong bulat)', qty: 1, unit: 'tongkol' },
      { name: 'Bawang merah (iris tipis)', qty: 3, unit: 'butir' },
      { name: 'Temu kunci (memarkan)', qty: 1, unit: 'ruas' },
      { name: 'Garam & gula secukupnya', qty: 1, unit: 'sdt' }
    ],
    steps: [
      'Didihkan 800ml air di dalam panci bersama irisan bawang merah dan temu kunci.',
      'Masukkan potongan jagung manis, rebus hingga jagung mulai empuk dan manisnya keluar.',
      'Tambahkan garam dan sedikit gula, aduk rata lalu cicipi rasa kuahnya.',
      'Masukkan daun bayam, masak sebentar saja sekitar 1-2 menit agar warna tetap hijau segar.'
    ],
    tips: 'Bayam dimasukkan paling terakhir agar zat gizi dan kesegarannya tetap terjaga optimal.'
  },
  {
    id: 'r3',
    title: 'Orek Tempe Basah Manis Gurih',
    tags: ['tempe', 'hemat', 'murah', 'lauk', 'manis', 'kos'],
    time: 15,
    difficulty: 'Mudah',
    author: 'Kak Dimas',
    rating: 4.7,
    reviewsCount: 195,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700&auto=format&fit=crop&q=80',
    desc: 'Menu hemat tinggi protein nabati. Tekstur tempe tetap lembut basah dengan paduan rasa gurih, manis, dan sedikit pedas.',
    portionBase: 2,
    ingredients: [
      { name: 'Tempe papan (potong dadu kecil)', qty: 1, unit: 'papan' },
      { name: 'Bawang merah & putih', qty: 4, unit: 'siung' },
      { name: 'Cabai merah keriting (iris)', qty: 2, unit: 'buah' },
      { name: 'Kecap manis pilihan', qty: 3, unit: 'sdm' },
      { name: 'Air matang', qty: 50, unit: 'ml' }
    ],
    steps: [
      'Goreng tempe setengah matang saja (jangan sampai garing keras).',
      'Tumis irisan bawang dan cabai sampai layu dan harum.',
      'Masukkan kecap manis dan tuang air sedikit sampai saus tampak berbuih.',
      'Campurkan tempe goreng, aduk rata sampai saus kecap terserap sempurna ke seluruh tempe.'
    ],
    tips: 'Pastikan bumbu kecap berbusa mendidih sebelum tempe dimasukkan agar karamelisasi merata.'
  },
  {
    id: 'r4',
    title: 'Pancake Cokelat Pisang Lembut',
    tags: ['dessert', 'pancake', 'manis', 'pisang', 'cokelat', 'camilan', 'kue'],
    time: 15,
    difficulty: 'Mudah',
    author: 'Chef Sisca',
    rating: 4.9,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=700&auto=format&fit=crop&q=80',
    desc: 'Dessert manis favorit keluarga. Dibuat dari pisang matang lembut dengan lelehan saus cokelat tanpa perlu mixer.',
    portionBase: 2,
    ingredients: [
      { name: 'Pisang matang (lumatkan)', qty: 2, unit: 'buah' },
      { name: 'Telur ayam', qty: 2, unit: 'butir' },
      { name: 'Tepung terigu / oat', qty: 4, unit: 'sdm' },
      { name: 'Saus cokelat / choco chips', qty: 2, unit: 'sdm' }
    ],
    steps: [
      'Hancurkan pisang matang menggunakan garpu di dalam mangkuk.',
      'Masukkan telur dan tepung, aduk rata perlahan hingga menjadi adonan kental.',
      'Panaskan teflon anti lengket dengan api kecil dan oleskan sedikit mentega.',
      'Tuang 1 centong adonan, tunggu sampai timbul gelembung lalu balik perlahan hingga matang keemasan.'
    ],
    tips: 'Gunakan api kecil agar pancake matang lembut merata tanpa gosong.'
  },
  {
    id: 'r5',
    title: 'Puding Cokelat Lumer Susu Dingin',
    tags: ['dessert', 'puding', 'cokelat', 'manis', 'dingin', 'segar'],
    time: 20,
    difficulty: 'Mudah',
    author: 'Dapur Manis',
    rating: 4.9,
    reviewsCount: 204,
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=700&auto=format&fit=crop&q=80',
    desc: 'Dessert lembut manis yang lumer di mulut. Sangat menyegarkan dinikmati dingin saat cuaca terik.',
    portionBase: 4,
    ingredients: [
      { name: 'Bubuk agar-agar cokelat', qty: 1, unit: 'bungkus' },
      { name: 'Susu cair cokelat', qty: 700, unit: 'ml' },
      { name: 'Dark chocolate (cincang)', qty: 50, unit: 'gram' },
      { name: 'Gula pasir', qty: 4, unit: 'sdm' }
    ],
    steps: [
      'Campurkan bubuk agar-agar, gula, dan susu cair dalam panci, aduk rata.',
      'Masak dengan api sedang sambil diaduk perlahan hingga mulai panas.',
      'Masukkan cokelat cincang, aduk cepat hingga cokelat meleleh sempurna dan mendidih.',
      'Tuang ke cetakan, dinginkan di suhu ruang lalu masukkan ke dalam kulkas.'
    ],
    tips: 'Saring adonan sebelum dituang ke cetakan agar tekstur puding sehalus sutra.'
  },
  {
    id: 'r6',
    title: 'Ayam Suwir Pedas Kemangi Gurih',
    tags: ['ayam', 'pedas', 'kemangi', 'sambal', 'lauk'],
    time: 30,
    difficulty: 'Sedang',
    author: 'Bu Tejo',
    rating: 4.8,
    reviewsCount: 175,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=700&auto=format&fit=crop&q=80',
    desc: 'Ayam suwir dengan bumbu balado pedas gurih serta keharuman daun kemangi segar yang menggugah nafsu makan.',
    portionBase: 3,
    ingredients: [
      { name: 'Dada ayam (rebus & suwir)', qty: 400, unit: 'gram' },
      { name: 'Daun kemangi segar', qty: 2, unit: 'ikat' },
      { name: 'Cabai rawit & merah', qty: 10, unit: 'buah' },
      { name: 'Bawang merah & putih', qty: 6, unit: 'siung' },
      { name: 'Serai & daun jeruk', qty: 2, unit: 'lembar' }
    ],
    steps: [
      'Haluskan cabai dan bawang, lalu tumis bersama serai dan daun jeruk hingga harum matang.',
      'Beri garam, gula, dan penyedap rasa secukupnya.',
      'Masukkan suwiran ayam, aduk rata hingga bumbu meresap sempurna.',
      'Sesaat sebelum diangkat, masukkan daun kemangi dan aduk sebentar hingga layu.'
    ],
    tips: 'Masukkan daun kemangi di langkah terakhir dan matikan kompor agar wanginya tidak menguap.'
  }
];
