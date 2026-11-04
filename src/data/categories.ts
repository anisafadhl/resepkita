import { CategoryInfo } from '../types/recipe';

export const CATEGORIES: CategoryInfo[] = [
  {
    slug: 'makanan-berat',
    nama: 'Makanan Berat',
    emoji: '🍛',
    deskripsi: 'Hidangan utama mengenyangkan untuk sarapan, makan siang, maupun makan malam.',
    pola: 'dots',
    warna: ['#D64545', '#F08C4B'],
    label: 'Hidangan Utama',
  },
  {
    slug: 'makanan-ringan',
    nama: 'Makanan Ringan',
    emoji: '🍢',
    deskripsi: 'Camilan gurih dan manis untuk teman ngopi, jajan sore, atau kudapan saat lapar.',
    pola: 'stripes',
    warna: ['#00A896', '#7BD389'],
    label: 'Camilan',
  },
  {
    slug: 'kue-dan-roti',
    nama: 'Kue dan Roti',
    emoji: '🥐',
    deskripsi: 'Aneka kue tradisional, kue modern, dan roti lembut untuk teman minum teh.',
    pola: 'check',
    warna: ['#A15C3B', '#E7B26C'],
    label: 'Bakery & Kue',
  },
  {
    slug: 'minuman',
    nama: 'Minuman',
    emoji: '🧋',
    deskripsi: 'Es segar, hangatan herbal, hingga kopi kekinian untuk menemani harimu.',
    pola: 'wave',
    warna: ['#4A69BD', '#6DC9E8'],
    label: 'Segar & Hangat',
  },
];

export const COOKING_TIPS = [
  {
    icon: '💡',
    judul: 'Gunakan nasi dingin',
    isi: 'Nasi kemarin membuat nasi goreng tidak lembek dan butirannya terpisah saat diaduk di wajan panas.',
  },
  {
    icon: '🔥',
    judul: 'Api besar saat menumis',
    isi: 'Api besar menjaga sayur tetap renyah dan memberi aroma wok yang wangi khas hidangan restoran.',
  },
  {
    icon: '🧂',
    judul: 'Cicipi sebelum diangkat',
    isi: 'Koreksi garam, gula, dan keasaman di akhir memasak agar perpaduan rasa selalu seimbang dan pas.',
  },
];
