import { BrandProfile, ContentCardItem } from '@/types/dashboard';

/**
 * Master Data Akun Klien Unipic Lab berdasarkan dataAkun.md
 */
export const initialBrands: BrandProfile[] = [
  {
    id: 'jetfitness-kelapagading',
    name: 'Jet Fitness - Kelapa Gading',
    code: 'JFG',
    category: 'Fitness Center & Health Club',
    socialUrl: 'https://www.instagram.com/jetfitnesskelapagading/',
    references: 'Gym modern, ramah pemula & keluarga, fasilitas premium Kelapa Gading.',
    mandatoryHashtags: ['#JetFitnessKelapaGading', '#GymKelapaGading', '#FitnessJakartaUtara'],
    quota: {
      totalTarget: 12,
      videoTarget: 8,
      graphicTarget: 4,
    },
  },
  {
    id: 'jetfitness-karawaci',
    name: 'Jet Fitness - Karawaci',
    code: 'JFK',
    category: 'Fitness Center & Health Club',
    socialUrl: 'https://www.instagram.com/jetfitnesskarawaci/',
    references: 'Hub kebugaran strategis Gen Z, mahasiswa, dan profesional muda Tangerang.',
    mandatoryHashtags: ['#JetFitnessKarawaci', '#GymKarawaci', '#GymMahasiswa'],
    quota: {
      totalTarget: 12,
      videoTarget: 10,
      graphicTarget: 2,
    },
  },
  {
    id: 'jetfitness-fatmawati',
    name: 'Jet Fitness - Fatmawati',
    code: 'JFF',
    category: 'Fitness Center & Health Club',
    socialUrl: 'https://www.instagram.com/jetfitnessfatmawati/',
    references: 'Transit-oriented gym dekat MRT Haji Nawi, solusi workout komuter Jaksel.',
    mandatoryHashtags: ['#JetFitnessFatmawati', '#GymFatmawati', '#MRTHajiNawi'],
    quota: {
      totalTarget: 12,
      videoTarget: 8,
      graphicTarget: 4,
    },
  },
  {
    id: 'lithium-fire-killer',
    name: 'Lithium Fire Killer (LFK)',
    code: 'LFK',
    category: 'B2B/B2C Fire Safety & Clean Energy',
    socialUrl: 'https://www.instagram.com/lithiumfirekiller/',
    references: 'Solusi APAR spesialis thermal runaway baterai EV & lithium-ion berlisensi resmi.',
    mandatoryHashtags: ['#LithiumFireKiller', '#APARLithium', '#EVSafetyIndonesia'],
    quota: {
      totalTarget: 10,
      videoTarget: 7,
      graphicTarget: 3,
    },
  },
  {
    id: 'will-hadi',
    name: 'Will Hadi (Willy Hadiwidjaja)',
    code: 'WHD',
    category: 'Personal Branding & Executive Leader',
    socialUrl: 'https://www.instagram.com/willhadi.lfk',
    references: 'Edukasi keselamatan industri EV, leadership bisnis, & validasi teknologi lapangan.',
    mandatoryHashtags: ['#WillHadi', '#EVSafetyAdvocate', '#LeadershipIndonesia'],
    quota: {
      totalTarget: 10,
      videoTarget: 8,
      graphicTarget: 2,
    },
  },
  {
    id: 'familisakato',
    name: 'RM Famili Sakato',
    code: 'FSK',
    category: 'Authentic Minang Culinary (F&B)',
    socialUrl: 'https://www.instagram.com/familisakato.official',
    references: 'Cita rasa legendaris autentik Minang sejak 1985 dengan rempah warisan tradisi.',
    mandatoryHashtags: ['#FamiliSakato', '#KulinerMinangAutentik', '#Rendang1985'],
    quota: {
      totalTarget: 12,
      videoTarget: 8,
      graphicTarget: 4,
    },
  },
  {
    id: 'sea-familia',
    name: 'Sea Familia Phinisi',
    code: 'SFP',
    category: 'Luxury Liveaboard & Marine Tourism',
    socialUrl: 'https://www.instagram.com/sea.familia',
    references: 'Pengalaman berlayar kapal phinisi mewah di Labuan Bajo & Komodo National Park.',
    mandatoryHashtags: ['#SeaFamiliaPhinisi', '#LabuanBajoLuxury', '#KomodoLiveaboard'],
    quota: {
      totalTarget: 10,
      videoTarget: 8,
      graphicTarget: 2,
    },
  },
];

export const initialContentCards: ContentCardItem[] = [];
