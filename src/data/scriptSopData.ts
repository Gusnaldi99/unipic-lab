/**
 * Standar Operasional Prosedur (SOP) Strategi Penulisan Konten Kreatif v2.0
 * Berisi dataset interaktif untuk modul Skrip Builder di Unipic Lab.
 * Mengintegrasikan dataAkun.md untuk 7 akun sosial media klien.
 */

export interface HookCategory {
  id: string;
  number: string;
  title: string;
  emoji: string;
  tagline: string;
  whenToUse: string;
  formula: string;
  examples: string[];
  avoid: string;
  suitableFor: string[];
  bestPlatform: string;
  riskLevel: 'Rendah' | 'Medium' | 'Tinggi';
  riskBadge: string;
}

export interface ScriptBeat {
  id: string;
  part: string;
  name: string;
  duration: string;
  visualGuide: string;
  audioGuide: string;
  targetEmotion: string;
  tips: string;
}

export interface QcCheckItem {
  id: string;
  section: 'HOOK' | 'BRIDGE' | 'BODY' | 'CTA' | 'UMUM';
  question: string;
  priority: 'Tinggi' | 'Sedang';
  isNew?: boolean;
}

export interface SopChapter {
  id: string;
  title: string;
  number: string;
  summary: string;
  highlights: string[];
}

export interface ScriptPreset {
  id: string;
  name: string;
  title: string;
  pillar: string;
  objective: 'awareness' | 'conversion' | 'engagement';
  hookTypeId: string;
  targetDuration: string;
  targetAudience: string;
  targetKeyword: string;
  hookAudio: string;
  hookVisual: string;
  hookEmotion: string;
  hookAlt1: string;
  hookAlt2: string;
  bridgeAudio: string;
  bridgeVisual: string;
  bridgeEmotion: string;
  bodyAudio: string;
  bodyVisual: string;
  bodyEmotion: string;
  ctaAudio: string;
  ctaVisual: string;
  ctaEmotion: string;
}

export interface BrandSopProfile {
  id: string;
  brandName: string;
  handle: string;
  category: string;
  targetAudience: string;
  usp: string[];
  voiceTone: string;
  dominantFormat: string;
  recommendedHook: string;
  targetKpi: string;
  pillars: string[];
  dos: string[];
  donts: string[];
  presets: ScriptPreset[];
}

export const HOOK_CATEGORIES: HookCategory[] = [
  {
    id: 'pain-point',
    number: '01',
    title: 'Pain Point Hook',
    emoji: '😩',
    tagline: 'Menyentuh luka paling dalam audiens',
    whenToUse: 'Gunakan saat produk/konten memecahkan masalah nyata yang dialami audiens sehari-hari.',
    formula: '[Pertanyaan/Pernyataan Masalah] + [Konsekuensi Buruk jika dibiarkan]',
    examples: [
      'Udah capek-capek bikin konten tiap hari tapi yang nonton cuma puluhan orang? Hati-hati, bisa jadi akunmu lagi kena shadowban.',
      'Gaji sudah habis sebelum tanggal 20? Ini bukan soal boros, tapi soal sistem keuangan yang salah.',
    ],
    avoid: 'Jangan terlalu melebih-lebihkan masalah sampai terasa tidak realistis atau menakut-nakuti tanpa dasar.',
    suitableFor: ['Produk solusi', 'Jasa konsultasi', 'Edukasi', 'Health & Wellness'],
    bestPlatform: 'TikTok, Reels, YouTube Shorts',
    riskLevel: 'Medium',
    riskBadge: '🟡 Medium',
  },
  {
    id: 'social-proof',
    number: '02',
    title: 'Social Proof & Result Hook',
    emoji: '📈',
    tagline: 'Tunjukkan bukti nyata di detik pertama',
    whenToUse: 'Gunakan saat kamu memiliki data, angka, atau pencapaian konkret yang bisa langsung divisualisasikan.',
    formula: '[Tunjukkan Hasil/Angka Spesifik] + [Cara/Durasi Waktu]',
    examples: [
      'Ini cara tim kami menaikkan omzet toko online dari 0 ke 50 juta dalam 30 hari tanpa iklan berbayar.',
      '87 klien kami berhasil naik kelas di TikTok dalam 60 hari. Ini strategi yang kami gunakan.',
    ],
    avoid: 'Jangan pakai angka yang tidak bisa dibuktikan. Jika tertangkap berbohong, reputasi brand runtuh seketika.',
    suitableFor: ['Brand building', 'Testimoni', 'Case study', 'Coaching / Training'],
    bestPlatform: 'Semua Platform (Instagram, TikTok, LinkedIn, YouTube)',
    riskLevel: 'Rendah',
    riskBadge: '🟢 Rendah',
  },
  {
    id: 'curiosity',
    number: '03',
    title: 'Curiosity Hook',
    emoji: '🔍',
    tagline: 'Ciptakan rasa penasaran yang tidak tertahankan',
    whenToUse: 'Gunakan untuk konten edukasi, tips & trik, atau reveal informasi yang tidak umum diketahui publik.',
    formula: '[Larangan / Rahasia Tersembunyi] + [Dampak/Alasan]',
    examples: [
      'Jangan pernah beli laptop baru di tahun ini sebelum kamu tahu trik rahasia yang satu ini.',
      'Ada fitur tersembunyi di WhatsApp yang 90% orang tidak tahu. Ini bisa selamatkan privasi kamu.',
    ],
    avoid: 'Pastikan isi konten BENAR-BENAR menjawab rasa penasaran yang dijanjikan. Jangan clickbait kosong.',
    suitableFor: ['Konten edukasi', 'Tutorial', 'Review produk', 'Info unik'],
    bestPlatform: 'TikTok, YouTube, Twitter/X',
    riskLevel: 'Medium',
    riskBadge: '🟡 Medium',
  },
  {
    id: 'myth-busting',
    number: '04',
    title: 'Kontradiktif / Myth Busting Hook',
    emoji: '💥',
    tagline: 'Lawan keyakinan umum untuk picu efek kejut',
    whenToUse: 'Gunakan saat kamu punya perspektif yang bertentangan dengan pandangan mainstream dan punya data/argumen kuat.',
    formula: '[Hal yang Dianggap Benar] + [Ternyata Salah / Menyesatkan]',
    examples: [
      'Banyak yang bilang rajin posting tiap hari itu kunci viral. Faktanya, itu justru yang membunuh growth akun kamu.',
      'Selama ini dikira diet ketat bikin langsing? Faktanya, tubuh kamu malah menyimpan lebih banyak lemak.',
    ],
    avoid: 'Jangan membantah sesuatu yang tidak bisa dibuktikan secara data. Ini bisa memicu blunder reputasi.',
    suitableFor: ['Thought leadership', 'Edukasi mendalam', 'Konten viral berdampak'],
    bestPlatform: 'TikTok, LinkedIn, Twitter/X',
    riskLevel: 'Tinggi',
    riskBadge: '🔴 Tinggi',
  },
  {
    id: 'fomo',
    number: '05',
    title: 'FOMO Hook',
    emoji: '⏰',
    tagline: 'Manfaatkan ketakutan tertinggal secara wajar',
    whenToUse: 'Gunakan untuk konten promo, informasi berbatas waktu, atau tren yang sedang naik daun.',
    formula: '[Peringatan / Batasan Waktu] + [Kesempatan Emas]',
    examples: [
      'Tool AI gratis ini bakal berbayar bulan depan! Buruan simpan sebelum terlambat.',
      'Setelah acara ini, harga naik 3x lipat. Ini kesempatan terakhirmu bergabung di harga awal.',
    ],
    avoid: 'Dilarang membuat FOMO palsu (promo terbatas fiktif yang terus diperpanjang).',
    suitableFor: ['Promo & Sales', 'Event', 'Peluncuran produk', 'Tren terkini'],
    bestPlatform: 'Semua Platform',
    riskLevel: 'Tinggi',
    riskBadge: '🔴 Tinggi',
  },
  {
    id: 'visual-action',
    number: '06',
    title: 'Visual & Action Hook',
    emoji: '🎬',
    tagline: 'Biarkan visual berbicara sebelum narasi dimulai',
    whenToUse: 'Gunakan untuk konten hiburan, lifestyle, transformasi, atau target audiens visual learner.',
    formula: '[Aksi Ekstrem / Visual Menarik] + [Narasi muncul setelah 2 detik]',
    examples: [
      '(Memotong objek besar di depan kamera) → lalu narasi: "Ini yang terjadi kalau kamu salah pilih bahan."',
      '(Sebelum-sesudah transformasi dalam 2 detik pertama) → "Ini hasil 30 hari menggunakan metode kami."',
    ],
    avoid: 'Pastikan aksi visual RELEVAN dengan isi konten, bukan cuma sensasi visual tanpa korelasi.',
    suitableFor: ['Lifestyle', 'Beauty', 'Food', 'Transformasi', 'Hiburan'],
    bestPlatform: 'TikTok, Reels, YouTube Shorts',
    riskLevel: 'Rendah',
    riskBadge: '🟢 Rendah',
  },
  {
    id: 'specificity-stakes',
    number: '07',
    title: 'Specificity & Stakes Hook',
    emoji: '🎯',
    tagline: 'Angka & taruhan spesifik membuat klaim terasa nyata',
    whenToUse: 'Saat ada angka riil, biaya nyata, atau kesalahan mahal yang benar-benar pernah terjadi.',
    formula: '[Angka/Detail Aneh yang Spesifik] + [Dampak Nyata]',
    examples: [
      'Kami hapus 8 dari 10 jenis konten kami, dan reach naik 2 kali lipat dalam 14 hari.',
      'Kesalahan 1 baris kode ini bikin perusahaan rugi 45 juta dalam semalam.',
    ],
    avoid: 'Hindari angka bulat/generik ("banyak banget") atau presisi palsu. Angka WAJIB bisa dibuktikan.',
    suitableFor: ['Case study', 'Edukasi berbasis data', 'Thought leadership'],
    bestPlatform: 'Semua Platform',
    riskLevel: 'Medium',
    riskBadge: '🟡 Medium',
  },
  {
    id: 'identity-callout',
    number: '08',
    title: 'Identity Callout Hook',
    emoji: '🙋',
    tagline: 'Sebut persis siapa yang harus berhenti scroll',
    whenToUse: 'Saat segmen audiens sangat jelas dan konten memang dikhususkan untuk mereka.',
    formula: '["Kalau kamu [peran/situasi spesifik]"] + [Instruksi/Peringatan]',
    examples: [
      'Kalau kamu pemilik UMKM yang masih ngurus admin Instagram sendirian, tonton ini sampai habis.',
      'Khusus freelancer desain yang sering di-ghosting klien setelah kasih quotation: ini solusinya.',
    ],
    avoid: 'Menyapa "semuanya/halo guys". Semakin luas sapaan, semakin lemah relevansi personal.',
    suitableFor: ['Konten niche', 'B2B', 'Komunitas', 'Edukasi profesional'],
    bestPlatform: 'LinkedIn, TikTok, Instagram Reels',
    riskLevel: 'Rendah',
    riskBadge: '🟢 Rendah',
  },
  {
    id: 'story-in-media-res',
    number: '09',
    title: 'Story In-Media-Res Hook',
    emoji: '🎞️',
    tagline: 'Lempar penonton ke tengah kejadian tanpa basa-basi',
    whenToUse: 'Saat ada momen cerita nyata (kegagalan, kejadian lucu, titik balik) yang bisa dibuka dari tengah aksi.',
    formula: '[Adegan yang sedang berjalan] + [Ketegangan belum selesai]',
    examples: [
      'Jam 11 malam, saya refresh dashboard iklan untuk keempat kalinya, dan angkanya masih nol.',
      'Baru 5 menit sebelum live streaming dimulai, kamera utama kami tiba-tiba mati total.',
    ],
    avoid: 'Membuka dengan latar belakang bertele-tele ("Jadi dulu ceritanya..."). Mulai dari momen krusial.',
    suitableFor: ['Storytelling', 'Behind-the-scenes', 'Founder content', 'Testimoni'],
    bestPlatform: 'TikTok, Reels, YouTube Shorts',
    riskLevel: 'Rendah',
    riskBadge: '🟢 Rendah',
  },
];

export const SCRIPT_BEATS_GUIDE: ScriptBeat[] = [
  {
    id: 'beat-hook',
    part: '1. HOOK',
    name: 'The Scroll-Stopper',
    duration: '0–3 detik',
    visualGuide: 'Ekspresi wajah kaget/tegas, Text on Screen pendek & kontras besar di safe zone, visual mencolok frame pertama.',
    audioGuide: 'Kalimat hook langsung menusuk topik. DILARANG ada salam basi ("Halo guys...").',
    targetEmotion: 'Tegas, mengejutkan, mencuri perhatian, memancing rasa ingin tahu',
    tips: '3 kata pertama adalah segalanya. Mulai dengan KATA KERJA atau pain point.',
  },
  {
    id: 'beat-bridge',
    part: '2. BRIDGE',
    name: 'Curiosity Bridge',
    duration: '3–8 detik',
    visualGuide: 'Talent menunjuk layar/objek, transisi SFX (Whoosh/Swoosh), perubahan angle kamera.',
    audioGuide: 'Sambungkan masalah di hook dengan solusi/konten utama. Contoh: "...nah kuncinya bukan di X, tapi di Y."',
    targetEmotion: 'Misterius, solutif, memberi harapan, menahan drop-off',
    tips: 'Bridge adalah jembatan rasa penasaran. Jangan langsung jawab di sini — tunda jawabannya.',
  },
  {
    id: 'beat-body',
    part: '3. BODY',
    name: 'Value Delivery',
    duration: '8–50 detik',
    visualGuide: 'B-Roll / footage pendukung, poin teks muncul berurutan (1, 2, 3), ganti visual tiap ±2–4 detik.',
    audioGuide: 'Sampaikan isi utama secara santai & conversational. Transisi natural ("Selanjutnya...", "Nah yang menarik...")',
    targetEmotion: 'Edukatif, relatable, santai namun berbobot',
    tips: 'Lakukan "cut test": jika satu kalimat dibuang video tetap masuk akal, hapus kalimat itu.',
  },
  {
    id: 'beat-cta',
    part: '4. CTA',
    name: 'Action & Loop',
    duration: '50–60 detik',
    visualGuide: 'Talent menunjuk tombol/link, animasi panah, loop visual yang menyambung mulus ke frame awal.',
    audioGuide: 'Satu instruksi tegas + berikan ALASAN nyata untuk bertindak.',
    targetEmotion: 'Persuasif, tegas, mengajak, personal',
    tips: 'Hindari sekadar "like & follow". Berikan alasan: "Follow sekarang biar nggak ketinggalan part 2."',
  },
];

export const HOOK_RUBRIC_DIMENSIONS = [
  { key: 'gap', label: 'Curiosity Gap', desc: 'Membuka celah rasa penasaran/ketegangan yang perlu ditutup?' },
  { key: 'specificity', label: 'Specificity', desc: 'Ada angka, detail, atau klaim konkret (bukan teaser kosong)?' },
  { key: 'truth', label: 'Truth / Integritas (Gatekeeper ⛔)', desc: 'Isi skrip benar-benar menjawab janji hook? (Truth = 0 otomatis gugur)' },
  { key: 'fit', label: '3-Sec & Mute Fit', desc: 'Muat dalam 3 detik dan terbaca saat video dimute?' },
  { key: 'voice', label: 'Brand Voice', desc: 'Sesuai dengan persona talent/brand, bukan swipe-file mentah?' },
  { key: 'pull', label: 'Pull Power (Gatekeeper ⛔)', desc: 'Orang asing merasa butuh menonton beat berikutnya?' },
];

export const ANTI_PATTERNS = [
  { pattern: 'Sapaan / Basa-basi', example: '"Halo guys, balik lagi sama aku..."', fix: 'Langsung mulai dari masalah atau hasil konkret.' },
  { pattern: 'Throat-clearing', example: '"Hari ini aku mau bahas soal..."', fix: 'Mulai langsung dari klaim terkuat atau kontradiksi.' },
  { pattern: 'Mendeskripsikan Visual', example: '"Ini foto tim kami di acara kemarin"', fix: 'Beri insight atau konteks yang tidak terlihat oleh mata.' },
  { pattern: 'Teaser Kosong', example: '"Kamu nggak akan percaya ini"', fix: 'Tambah detail spesifik dan konteks masalah.' },
  { pattern: 'Membocorkan Jawaban', example: 'Hook sudah membeberkan solusinya di awal', fix: 'Tahan satu rahasia utama untuk dibongkar di Body.' },
  { pattern: 'Sapaan Terlalu Luas', example: '"Perhatian untuk semuanya"', fix: 'Gunakan Identity Callout yang spesifik ke persona audiens.' },
];

export const QC_CHECKLIST: QcCheckItem[] = [
  { id: 'qc-1', section: 'HOOK', question: 'Apakah 3 kata pertama langsung menusuk topik tanpa sapaan basi?', priority: 'Tinggi' },
  { id: 'qc-2', section: 'HOOK', question: 'Apakah intonasi hook sudah ditentukan (tegas / bisik / cemas)?', priority: 'Tinggi' },
  { id: 'qc-3', section: 'HOOK', question: 'Apakah emosi audiens tersentuh dalam 3 detik pertama?', priority: 'Tinggi' },
  { id: 'qc-4', section: 'HOOK', question: 'Apakah hook sudah lolos Rubrik (Truth & Pull = Lulus)?', priority: 'Tinggi', isNew: true },
  { id: 'qc-5', section: 'HOOK', question: 'Apakah visual + teks layar + audio bekerja serempak (Layered Hook)?', priority: 'Tinggi', isNew: true },
  { id: 'qc-6', section: 'BRIDGE', question: 'Apakah bridge menyambungkan masalah ke solusi secara natural?', priority: 'Sedang' },
  { id: 'qc-7', section: 'BRIDGE', question: 'Apakah jawaban/solusi ditunda di bridge untuk menahan penonton?', priority: 'Sedang' },
  { id: 'qc-8', section: 'BODY', question: 'Apakah transisi kata antar poin di body mengalir wajar?', priority: 'Sedang' },
  { id: 'qc-9', section: 'BODY', question: 'Apakah gaya bahasa sesuai dengan persona audiens target?', priority: 'Tinggi' },
  { id: 'qc-10', section: 'BODY', question: 'Apakah semua klaim/angka yang disebut bisa dibuktikan dan diverifikasi?', priority: 'Tinggi' },
  { id: 'qc-11', section: 'BODY', question: 'Apakah tiap kalimat lulus "cut test" (tanpa kata mubazir)?', priority: 'Sedang', isNew: true },
  { id: 'qc-12', section: 'CTA', question: 'Apakah CTA hanya berisi SATU instruksi yang jelas?', priority: 'Tinggi' },
  { id: 'qc-13', section: 'CTA', question: 'Apakah CTA memberikan ALASAN nyata untuk bertindak?', priority: 'Sedang' },
  { id: 'qc-14', section: 'CTA', question: 'Apakah akhir video dirancang menyambung ke frame pertama (loop ending)?', priority: 'Sedang', isNew: true },
  { id: 'qc-15', section: 'UMUM', question: 'Apakah total durasi skrip sudah ideal (15–35 dtk untuk short form)?', priority: 'Tinggi' },
  { id: 'qc-16', section: 'UMUM', question: 'Apakah skrip bisa dipahami saat dimute (tes versi tanpa suara)?', priority: 'Tinggi', isNew: true },
  { id: 'qc-17', section: 'UMUM', question: 'Apakah keyword utama memenuhi triple mention (lisan + teks + caption)?', priority: 'Sedang', isNew: true },
  { id: 'qc-18', section: 'UMUM', question: 'Apakah sudah lolos checklist kepatuhan (klaim, lisensi musik, disclosure)?', priority: 'Tinggi', isNew: true },
];

export const SOP_CHAPTERS: SopChapter[] = [
  {
    id: 'ch-1',
    number: 'BAB 1',
    title: 'SOP Alur Kerja Produksi Konten',
    summary: '6 Tahapan wajib: Riset & Brief → Konsep & Hook (min. 5 opsi) → Penulisan Skrip 4-Bagian → Self Review QC → CD Approval (maks 2x revisi) → Produksi & Distribusi.',
    highlights: [
      'SLA: Riset (1 hari), Konsep Hook (0.5 hari), Skrip (1 hari), QC mandiri (2 jam), Approval CD (maks 1 hari)',
      'Batch writing: tulis 5-10 skrip sekaligus per batch mingguan',
      'Bank cadangan: wajib simpan 3-5 skrip siap produksi sebagai buffer',
    ],
  },
  {
    id: 'ch-2',
    number: 'BAB 2',
    title: 'Klasifikasi Hook & Panduan Penggunaan',
    summary: '9 jenis hook (Pain Point, Social Proof, Curiosity, Myth Busting, FOMO, Visual Action, Specificity, Identity Callout, In-Media-Res) + Rubrik Skor & Anti-Pattern.',
    highlights: [
      'Layered Hook: visual frame pertama + text on screen + lisan bekerja serempak',
      'Gerbang Lulus/Gagal: Truth (anti-clickbait) dan Pull (relevansi dingin)',
      'Bank Hook tim untuk merekam formula Menang, Netral, dan Gagal',
    ],
  },
  {
    id: 'ch-3',
    number: 'BAB 3',
    title: 'Pedoman Penulisan Skenario & Retensi',
    summary: 'Struktur standar 4 bagian (Hook 0-3s, Bridge 3-8s, Body 8-50s, CTA 50-60s) dengan filosofi retensi watch-through.',
    highlights: [
      'Prinsip Muted-First: 80% audiens menonton tanpa suara',
      'Ganti visual tiap 2-4 detik, hindari dead air',
      'Loop Ending: sambungkan kalimat akhir ke frame awal untuk memicu replay',
    ],
  },
  {
    id: 'ch-4',
    number: 'BAB 4',
    title: 'Target KPI & Pengukuran Performa',
    summary: 'Hierarki KPI (Primary: 3-sec hold, WTR >40%, Replay, ER, Follower) + Tabel Diagnosis & Aturan Keputusan 7 Hari (Scale, Iterate, Arsip, Uji Ulang).',
    highlights: [
      'Target WTR: >40% untuk video pendek (<30s), >25% untuk video panjang',
      'Tabel Diagnosis: petakan metrik drop ke tindakan konkrit',
      'Sumber data native dashboard + GA4, dilarang mengarang angka',
    ],
  },
  {
    id: 'ch-5',
    number: 'BAB 5',
    title: 'Strategi Distribusi Konten & SEO Sosmed',
    summary: '3 Level Distribusi (Level 1: Utama, Level 2: Clipper & Media Promote, Level 3: WA/Komunitas) + SEO Sosmed & Checklist Publish.',
    highlights: [
      'Syarat Clipper: tayang min. 3 jam, WTR ≥ 40% atau 10.000 views organik',
      'SEO Sosmed: Triple Mention (lisan + teks layar + caption)',
      'Golden Hour: 30-60 menit pertama aktif balas komentar dengan pendekatan manusiawi',
    ],
  },
  {
    id: 'ch-7-8',
    number: 'BAB 7 & 8',
    title: 'Pilar, Riset & Kepatuhan Risiko',
    summary: 'Pemetaan 3-5 tema pilar unik, mesin ide sinyal audiens, serta kepatuhan hukum (klaim wajib ada bukti, lisensi musik komersial, label iklan/AI).',
    highlights: [
      'Rasio Kalender: 60% edukasi/hiburan, 25% kredibilitas, 15% promo',
      'Protokol Krisis 5 Langkah: Hentikan, Verifikasi, Severity, Respons, Dokumentasi',
      'Disclosure wajib untuk konten bersponsor, endorsement, atau aset AI',
    ],
  },
];

// =========================================================================
// DATA PROFIL & PRESET 7 AKUN KLIEN (Berdasarkan dataAkun.md)
// =========================================================================

export const BRAND_SOP_PROFILES: Record<string, BrandSopProfile> = {
  'jetfitness-kelapagading': {
    id: 'jetfitness-kelapagading',
    brandName: 'Jet Fitness - Kelapa Gading',
    handle: '@jetfitnesskelapagading',
    category: 'Fitness & Health Club (Urban Community & Residential)',
    targetAudience: 'Warga residensial Kelapa Gading, eksekutif lokal, ibu rumah tangga aktif, pemula fitness nyaman tanpa intimidasi.',
    usp: [
      'Gym standar internasional area functional training & free weights luas',
      'Fasilitas sauna pemulihan & InBody Composition Analyzer',
      'Kelas grup variatif (Zumba, Les Mills, Pilates, Yoga) dengan PT tersertifikasi',
    ],
    voiceTone: 'Motivating, welcoming, clean, and community-driven. Ramah pemula, mengutamakan kebersamaan sehat.',
    dominantFormat: 'Reels (60%) + Carousel (40%)',
    recommendedHook: 'Pain Point Hook / Identity Callout',
    targetKpi: 'Saved Posts & DM Inquiries',
    pillars: [
      'Facility & Class Showcase',
      'Form & Movement Tips',
      'Member Transformation & Community',
      'Promosi & Membership',
    ],
    dos: [
      'Tampilkan pencahayaan terang, area gym bersih dan rapi.',
      'Sorot interaksi personal trainer yang mengayomi dan sabar koreksi form.',
      'Sertakan info alamat lengkap dan link WhatsApp pendaftaran di bio & caption.',
    ],
    donts: [
      'Jangan menampilkan visual gym yang gelap atau suram.',
      'Hindari glorifikasi toxic fitness culture (contoh: "Ga muntah ga sah latihannya").',
      'Dilarang menjanjikan klaim instan penurunan berat badan (misal: "Turun 10 kg dalam 3 hari").',
    ],
    presets: [
      {
        id: 'jfg-preset-1',
        name: 'Solusi Pemula Anti-Intimidasi',
        title: 'Baru Pertama Kali Masuk Gym? Ini 3 Alat Paling Aman di Kelapa Gading',
        pillar: 'Form & Movement Tips',
        objective: 'awareness',
        hookTypeId: 'identity-callout',
        targetDuration: '25-30 detik',
        targetAudience: 'Warga Kelapa Gading yang ragu mulai gym karena takut salah alat',
        targetKeyword: 'gym pemula Kelapa Gading',
        hookAudio: 'Kalau kamu warga Kelapa Gading yang mau mulai gym tapi takut dihakimi, tonton video ini 30 detik.',
        hookVisual: 'Talent berdiri ramah di depan pintu masuk Jet Fitness KG yang terang benderang. Teks besar: "PEMULA GYM KELAPA GADING."',
        hookEmotion: 'Hangat, welcoming, meyakinkan',
        hookAlt1: 'Mau mulai ngegym tapi bingung harus pegang alat yang mana dulu?',
        hookAlt2: 'Ini alasan kenapa pemula di Kelapa Gading nggak perlu minder saat pertama kali ngegym.',
        bridgeAudio: 'Rasa cemas itu normal banget. Makanya di Jet Fitness Kelapa Gading, kamu cukup mulai dari 2 alat ini tanpa takut cedera.',
        bridgeVisual: 'Transisi kamera mengalir ke area dumbbell rapi, trainer menyapa ramah.',
        bridgeEmotion: 'Solutif, menenangkan',
        bodyAudio: 'Pertama: Lat Pulldown, atur beban paling ringan untuk punggung. Kedua: Leg Press dengan panduan bantalan aman. Ketiga: cek komposisi tubuh gratis di InBody Analyzer bareng trainer kami.',
        bodyVisual: 'Teks poin 1, 2, 3 muncul berurutan tiap 3 dtk. Klip layar InBody dan koreksi form ramah.',
        bodyEmotion: 'Edukatif, santai namun berbobot',
        ctaAudio: 'Klaim free trial dan konsultasi InBody gratis kamu hari ini dengan klik link di bio!',
        ctaVisual: 'Talent menunjuk ke arah tombol bio, transisi loop kembali ke pintu masuk Jet Fitness.',
        ctaEmotion: 'Persuasif, mengajak ramah',
      },
    ],
  },
  'jetfitness-karawaci': {
    id: 'jetfitness-karawaci',
    brandName: 'Jet Fitness - Karawaci',
    handle: '@jetfitnesskarawaci',
    category: 'Fitness & Health Club (Suburban & Student Hub)',
    targetAudience: 'Mahasiswa (UPH dan sekitarnya), first-jobber, dan warga muda Tangerang.',
    usp: [
      'Lokasi strategis di Jl. Permata Sari Binong, lantai atas Starbucks Karawaci',
      'Jam operasional panjang (06.00 – 22.00 WIB) ramah jadwal kuliah & kantor',
      'Membership ramah kantong mahasiswa dengan fasilitas kelas lengkap',
    ],
    voiceTone: 'Energetic, youthful, trendy, and relatable. Santai, dinamis, gaya hidup aktif anak muda.',
    dominantFormat: 'Reels (80%) + Story (20%)',
    recommendedHook: 'Negative / Warning Hook / Curiosity Gap',
    targetKpi: '3-Second Retention & Share Rate',
    pillars: [
      'Student Life & Gym Routine',
      'Workout Challenges & Fun Reels',
      'Edu-Bite',
      'Promo & Bundling',
    ],
    dos: [
      'Gunakan pacing video dinamis, teks di layar yang ringkas dan terbaca jelas.',
      'Kampanyekan etika gym secara santai (re-rack dumbbell, lap keringat alat).',
      'Manfaatkan fitur interaktif (Sticker Q&A, Poll jadwal latihan favorit).',
    ],
    donts: [
      'Jangan menggunakan bahasa formal korporat yang kaku.',
      'Hindari konten tanpa musik atau dengan pacing membosankan di 3 detik pertama.',
      'Jangan membuat konten gym shaming terhadap member yang baru belajar.',
    ],
    presets: [
      {
        id: 'jfk-preset-1',
        name: 'Rutinitas Kuliah & Workout Anti-Macet',
        title: 'POV: Kelar Kelas Jam 5 Sore tapi Males Kena Macet Karawaci',
        pillar: 'Student Life & Gym Routine',
        objective: 'engagement',
        hookTypeId: 'pain-point',
        targetDuration: '20-25 detik',
        targetAudience: 'Mahasiswa Karawaci/UPH yang cari tempat produktif sore hari',
        targetKeyword: 'gym mahasiswa Karawaci',
        hookAudio: 'Jam 5 sore jalanan Karawaci macet total? Jangan cuma bengong di kosan, ini alternatifnya.',
        hookVisual: 'Klip cepat jendela jalanan Karawaci padat lalu cut ke lift naik ke lantai atas Starbucks. Teks: "KELAR KELAS NGERJAIN APA?"',
        hookEmotion: 'Relatable, santai, energetic',
        hookAlt1: 'Nongkrong di coffee shop terus dompet boncos? Cobain ganti rutinitas ini.',
        hookAlt2: 'Trik anak UPH bakar 400 kalori sambil nunggu macet Karawaci reda.',
        bridgeAudio: 'Daripada stres di jalan, langsung belok ke lantai atas Starbucks Binong buat 45 menit push day.',
        bridgeVisual: 'Transisi beat drop musik lofi/upbeat, talent re-rack dumbbell dan senyum ke cermin.',
        bridgeEmotion: 'Semangat, solutif',
        bodyAudio: 'Tempatnya luas, buka sampai jam 10 malam, dan harga membership khusus mahasiswa ramah banget di kantong bulanan.',
        bodyVisual: 'Quick cut area cardio view jendela luas, shower room bersih, kartu pelajar diskon.',
        bodyEmotion: 'Trendy, memikat',
        ctaAudio: 'Share ke temen sekelasmu yang butuh workout buddy sore ini!',
        ctaVisual: 'Talent tos dengan teman workout, loop visual kembali ke pintu masuk.',
        ctaEmotion: 'Persuasif, hangat',
      },
    ],
  },
  'jetfitness-fatmawati': {
    id: 'jetfitness-fatmawati',
    brandName: 'Jet Fitness - Fatmawati',
    handle: '@jetfitnessfatmawati',
    category: 'Fitness & Health Club (Transit-Oriented & South Jakarta Urbanites)',
    targetAudience: 'Pengguna MRT Haji Nawi, pekerja kantoran Jakarta Selatan, ekspatriat, warga Cilandak-Fatmawati.',
    usp: [
      'Pusat kebugaran ramah komuter di GF Plasa Mebel Fatmawati, beberapa langkah dari Stasiun MRT Haji Nawi',
      'Solusi workout anti-macet sebelum atau sesudah jam sibuk kantor',
      'Mesin beban modern, sauna relaksasi setelah penat bekerja, dan shower room bersih',
    ],
    voiceTone: 'Smart, urban, efficient, and healthy lifestyle. Berkelas, ringkas, solusi waktu produktif.',
    dominantFormat: 'Reels (70%) + Carousel (30%)',
    recommendedHook: 'Pain Point Hook / Specificity & Stakes',
    targetKpi: 'Profile Visits & Link Clicks',
    pillars: [
      'Commuter Workout Solution',
      'Desk-Worker Recovery',
      'InBody & Progress Tracking',
      'Trainer Expertise',
    ],
    dos: [
      'Sorot kemudahan akses (peta jalan dari MRT Haji Nawi, parkir leluasa).',
      'Tampilkan fasilitas shower dan sauna yang representatif untuk pekerja yang ingin lanjut aktivitas.',
      'Gunakan hook berbasis solusi efisiensi waktu ("Habis ngantor ga langsung pulang?").',
    ],
    donts: [
      'Hindari video yang terkesan buru-buru atau framing ruang yang sempit.',
      'Jangan memakai istilah medis rumit tanpa penjelasan sederhana.',
      'Hindari memposting foto alat statis tanpa aksi manusia di dalamnya.',
    ],
    presets: [
      {
        id: 'jff-preset-1',
        name: 'Solusi Sakit Pinggang Duduk Seharian',
        title: 'Duduk 8 Jam di Kantor Bikin Pinggang Kaku? Reset di Samping MRT Haji Nawi',
        pillar: 'Desk-Worker Recovery',
        objective: 'awareness',
        hookTypeId: 'pain-point',
        targetDuration: '25-30 detik',
        targetAudience: 'Karyawan kantoran Sudirman-Fatmawati yang sering sakit punggung/pinggang',
        targetKeyword: 'gym dekat MRT Haji Nawi',
        hookAudio: 'Pinggang kamu sering nyeri tiap jam 4 sore gara-gara duduk kelamaan di kantor? Ini penyebab aslinya.',
        hookVisual: 'Pekerja kantor memegang pinggang kaku di depan laptop, cut ke Stasiun MRT Haji Nawi. Teks: "SAKIT PINGGANG KELAR NGANTOR?"',
        hookEmotion: 'Empatik, tepat sasaran',
        hookAlt1: 'Turun MRT Haji Nawi jangan langsung rebahan, reset postur kamu dalam 20 menit.',
        hookAlt2: '3 gerakan peregangan wajib komuter Jaksel sebelum pulang ke rumah.',
        bridgeAudio: 'Otot glutes dan hip flexor kamu memendek seharian. Solusinya bukan obat oles, tapi active recovery.',
        bridgeVisual: 'Transisi kamera masuk ke Jet Fitness Fatmawati di Plasa Mebel, hanya beberapa langkah dari tangga MRT.',
        bridgeEmotion: 'Solutif, meyakinkan',
        bodyAudio: 'Cukup 25 menit: foam roll glutes, hip thrust ringan, lalu relaksasi di sauna kami biar otot kembali lentur sebelum tidur nyenyak.',
        bodyVisual: 'Demonstrasi form benar oleh trainer bersertifikat, cut ke ruang sauna hangat dan bersih.',
        bodyEmotion: 'Edukatif, profesional',
        ctaAudio: 'Simpan video ini dan coba mampir sepulang ngantor besok. Cek promo trial di link bio!',
        ctaVisual: 'Talent menunjuk link bio di smartphone, kamera panning balik ke gate MRT.',
        ctaEmotion: 'Persuasif, elegan',
      },
    ],
  },
  'lithium-fire-killer': {
    id: 'lithium-fire-killer',
    brandName: 'Lithium Fire Killer (LFK)',
    handle: '@lithiumfirekiller',
    category: 'Industrial & Automotive Fire Safety (B2B & B2C)',
    targetAudience: 'Pemilik mobil/motor listrik, pengelola gedung, teknisi pabrik baterai, operator SPKLU, praktisi K3 (HSE Officer).',
    usp: [
      'Formula APAR khusus Hartindo AF31 terbukti ilmiah hentikan thermal runaway baterai lithium-ion',
      'Agen enkapsulasi suhu ekstrem mendinginkan sel & mencegah penyalaan ulang (anti re-ignition)',
      'Media berbasis air ramah lingkungan (food grade, non-toxic) berlisensi resmi & TKDN tinggi',
    ],
    voiceTone: 'Authoritative, educational, preventive, and scientifically proven. Tegas, berbasis data, bebas hoaks.',
    dominantFormat: 'Reels Demo (70%) + Carousel Edukasi (30%)',
    recommendedHook: 'Myth Busting Hook / Social Proof',
    targetKpi: 'Watch Time & B2B Inquiry (Bio Link)',
    pillars: [
      'Live Demo & Fire Test',
      'EV Safety Education',
      'Regulatory & K3 Compliance',
      'Product Specs & Credibility',
    ],
    dos: [
      'Sertakan data konkret (penurunan suhu dalam detik, sertifikat uji lab).',
      'Utamakan visual uji coba riil di lapangan (footage api padam seketika).',
      'Cantumkan peringatan keselamatan K3 pada setiap konten peragaan api.',
    ],
    donts: [
      'Dilarang membuat konten panik atau fear-mongering tanpa memberikan edukasi solusi.',
      'Jangan meremehkan merek lain secara tidak etis (cukup bandingkan secara objektif berbasis tipe media).',
      'Hindari visual amatir yang menurunkan trust instrumen keselamatan nyawa.',
    ],
    presets: [
      {
        id: 'lfk-preset-1',
        name: 'Uji Api Thermal Runaway EV',
        title: 'Kenapa APAR Bubuk Merah Gagal Padamkan Kebakaran Baterai Mobil Listrik?',
        pillar: 'Live Demo & Fire Test',
        objective: 'awareness',
        hookTypeId: 'myth-busting',
        targetDuration: '30-35 detik',
        targetAudience: 'Pemilik EV, pengelola gedung, & petugas K3 pabrik',
        targetKeyword: 'APAR baterai lithium EV',
        hookAudio: 'Banyak yang kira semua api bisa dipadamkan pakai APAR merah biasa. Faktanya, untuk baterai lithium itu justru fatal.',
        hookVisual: 'Uji bakar sel baterai lithium meledak saat disemprot bubuk powder biasa. Teks: "APAR BIASA vs BATERAI EV."',
        hookEmotion: 'Tegas, mengejutkan, peringatan ilmiah',
        hookAlt1: 'Jangan semprot air biasa ke baterai mobil listrik yang terbakar. Ini alasan ilmiahnya.',
        hookAlt2: 'Uji laboratorium: berapa detik waktu yang dibutuhkan untuk mendinginkan thermal runaway?',
        bridgeAudio: 'Kebakaran baterai lithium menghasilkan oksigen sendiri dari dalam sel. Kuncinya ada di pendinginan instan, bukan cuma menutup permukaan.',
        bridgeVisual: 'Grafik thermo-gun menunjukkan suhu 800°C mendadak drop ke bawah 60°C dalam hitungan detik saat LFK disemprotkan.',
        bridgeEmotion: 'Solutif, berbasis data',
        bodyAudio: 'Formula Hartindo AF31 dalam Lithium Fire Killer mengisolasi sel baterai dan memutus rantai thermal runaway seketika, mencegah api menyala kembali.',
        bodyVisual: 'Footage close-up tabung LFK berlisensi resmi, sertifikasi lab terlampir, nozzle presisi.',
        bodyEmotion: 'Otoritatif, meyakinkan',
        ctaAudio: 'Konsultasikan proteksi fire safety gedung dan armada EV Anda melalui link WhatsApp di bio kami.',
        ctaVisual: 'Talent K3 tersenyum sambil membawa unit LFK, logo resmi PT FAST, loop ke frame uji api.',
        ctaEmotion: 'Persuasif, profesional B2B',
      },
    ],
  },
  'will-hadi': {
    id: 'will-hadi',
    brandName: 'Will Hadi (Willy Hadiwidjaja)',
    handle: '@willhadi.lfk',
    category: 'Personal Branding / Executive Leader & EV Safety Advocate',
    targetAudience: 'Pengusaha, investor, regulator industri EV, profesional K3, dan pegiat otomotif energi baru.',
    usp: [
      'CEO PT FAST yang memimpin advokasi standar keselamatan kebakaran baterai era elektrifikasi Indonesia',
      'Praktisi yang turun langsung menguji inovasi teknologi di lapangan & forum industri',
      'Sudut pandang kepemimpinan bisnis memadukan teknologi anak bangsa dengan regulasi modern',
    ],
    voiceTone: 'Visionary, confident, humble, authentic, and inspiring. Bicara lugas, profesional, santai berwibawa.',
    dominantFormat: 'Talking Head (80%) + Carousel (20%)',
    recommendedHook: 'Story In-Media-Res / Counter-Intuitive',
    targetKpi: 'Comments, Discussion & Saves',
    pillars: [
      'CEO Perspective / Behind The Scenes',
      'Myth-Busting EV Safety',
      'Business & Leadership Insights',
      'Keynote & Media Appearances',
    ],
    dos: [
      'Gunakan format video bicara langsung (talking head) dengan audio jernih dan hook padat.',
      'Pertahankan gaya santai namun tetap berwibawa (smart-casual/professional).',
      'Berinteraksi di kolom komentar untuk membangun diskusi bermutu dengan para pemangku kepentingan.',
    ],
    donts: [
      'Jangan menampilkan gaya hidup pamer kemewahan tanpa relevansi profesional.',
      'Hindari skrip yang terdengar hafalan kaku atau memakai istilah AI generik.',
      'Dilarang membuat klaim hukum atau teknis yang belum divalidasi tim riset internal.',
    ],
    presets: [
      {
        id: 'whd-preset-1',
        name: 'Sudut Pandang CEO Regulasi EV',
        title: 'Masa Depan Kendaraan Listrik di Indonesia Bukan Soal Baterai, tapi Regulasi K3',
        pillar: 'CEO Perspective / Behind The Scenes',
        objective: 'engagement',
        hookTypeId: 'story-in-media-res',
        targetDuration: '30-40 detik',
        targetAudience: 'Pelaku industri EV, regulator, pengusaha logistik & investor',
        targetKeyword: 'keselamatan mobil listrik Indonesia',
        hookAudio: 'Kemarin di sebuah forum industri, ada yang tanya ke saya: "Pak Will, apakah masyarakat kita siap dengan mobil listrik?"',
        hookVisual: 'Will Hadi berbicara langsung ke kamera di ruang kerja/meeting room modern. Teks: "SIAP NGGAK DENGAN MOBIL LISTRIK?"',
        hookEmotion: 'Tenang, berwibawa, memancing refleksi',
        hookAlt1: '3 pertanyaan wajib yang harus dijawab pengelola gedung sebelum pasang SPKLU di basement.',
        hookAlt2: 'Banyak orang takut beli EV karena isu kebakaran. Sebagai praktisi K3, ini pandangan jujur saya.',
        bridgeAudio: 'Jawaban saya sederhana: teknologinya sudah siap, yang belum siap adalah mitigasi risikonya.',
        bridgeVisual: 'Kamera cut angle kedua, Will Hadi gestur tangan meyakinkan, b-roll singkat di pabrik/lab.',
        bridgeEmotion: 'Visioner, analitis',
        bodyAudio: 'Kendaraan listrik itu sangat ramah lingkungan. Tapi ketika thermal runaway terjadi di basement gedung tertutup tanpa APAR bersertifikat lithium, kerugiannya bisa ratusan miliar.',
        bodyVisual: 'Cuplikan data statistik adopsi EV dan standar keselamatan internasional.',
        bodyEmotion: 'Informatif, berbobot tanpa menggurui',
        ctaAudio: 'Menurut Anda, apakah gedung-gedung di Jakarta sudah siap dengan proteksi EV? Tulis opini Anda di kolom komentar.',
        ctaVisual: 'Will Hadi mengangguk santai, teks pertanyaan muncul di layar, loop visual kembali ke frame awal.',
        ctaEmotion: 'Mengajak diskusi bermutu',
      },
    ],
  },
  'familisakato': {
    id: 'familisakato',
    brandName: 'RM Famili Sakato',
    handle: '@familisakato.official',
    category: 'Food & Beverage / Authentic Minang Heritage Culinary',
    targetAudience: 'Pecinta kuliner Minang autentik, keluarga, karyawan kantor untuk makan siang, penyelenggara acara (katering).',
    usp: [
      'Warisan rasa Minang sejati sejak 1985 dengan resep keluarga turun-temurun',
      'Komitmen rempah asli tanpa kompromi: rendang hitam legendaris, ayam pop, gulai toco Bukittinggi',
      'Higienis, bahan baku segar setiap hari, kapasitas katering & pemesanan online cepat',
    ],
    voiceTone: 'Warm, appetizing, traditional yet clean, and culturally respectful. Menggugah selera, hangat keluarga.',
    dominantFormat: 'Reels ASMR/Visual (70%) + Carousel (30%)',
    recommendedHook: 'Social Proof & Result / Sensory Hook',
    targetKpi: 'Shares & Save Location (Saves)',
    pillars: [
      'Sensory Food Appeal / ASMR',
      'Dapur & Dibalik Layar',
      'Customer Experience & Catering',
      'Informasi Cabang & Pemesanan',
    ],
    dos: [
      'Gunakan pencahayaan hangat (warm tone) alami yang menonjolkan kilau minyak rempah.',
      'Gunakan deskripsi rasa konkret ("rempah meresap sampai ke serat terdalam", bukan cuma "enak banget").',
      'Selipkan narasi budaya Minang yang otentik dan bangga akan tradisi.',
    ],
    donts: [
      'Dilarang memposting foto makanan dengan pencahayaan dingin/biru pucat.',
      'Hindari dapur yang terlihat berantakan atau tidak memenuhi standar kebersihan visual.',
      'Jangan menggunakan istilah makanan tren kekinian yang merusak citra masakan tradisional Minang.',
    ],
    presets: [
      {
        id: 'fsk-preset-1',
        name: 'Sensory ASMR Rendang Hitam 1985',
        title: 'Rahasia Kenapa Rendang Famili Sakato Dimasak 8 Jam Tanpa Pengawet',
        pillar: 'Sensory Food Appeal / ASMR',
        objective: 'engagement',
        hookTypeId: 'visual-action',
        targetDuration: '20-25 detik',
        targetAudience: 'Pecinta kuliner Minang autentik & foodies pencari makan siang',
        targetKeyword: 'rendang autentik Minang sejak 1985',
        hookAudio: '(Suara minyak rempah mendidih) Tarikan daging selembut ini butuh 8 jam kesabaran di atas kuali.',
        hookVisual: 'Close-up macro sendok membelah serat rendang hitam empuk berkilau minyak kelapa asli. Teks: "RENDANG ASLI SEJAK 1985."',
        hookEmotion: 'Menggugah selera, kagum, lapar',
        hookAlt1: 'Beda rendang restoran biasa sama rendang warisan 1985 ada di satu detail ini.',
        hookAlt2: 'Jangan tonton video ini kalau kamu belum makan siang!',
        bridgeAudio: 'Bukan sekadar pedas, tapi rasa gurih pekat dari kelapa tua dan rempah warisan Bukittinggi.',
        bridgeVisual: 'Uap panas mengepul dari gulai toco dan tumpukan piring lauk dibawa pelayan cekatan.',
        bridgeEmotion: 'Nostalgia, otentik Minang',
        bodyAudio: 'Resep ini kami jaga sejak 1985. Tanpa pewarna buatan, tanpa kompromi rasa, dimasak segar setiap subuh untuk santap siang Anda.',
        bodyVisual: 'Tampilan etalase bersih higienis, porsi nasi hangat disiram kuah gulai melimpah.',
        bodyEmotion: 'Tradisional, hangat, terpercaya',
        ctaAudio: 'Simpan video ini buat rekomendasi makan siang kantor nanti, atau pesan langsung via GrabFood dan GoFood!',
        ctaVisual: 'Teks link aplikasi antar makanan dan alamat cabang, loop kembali ke suapan rendang pertama.',
        ctaEmotion: 'Persuasif, mengajak segera makan',
      },
    ],
  },
  'sea-familia': {
    id: 'sea-familia',
    brandName: 'Sea Familia Phinisi',
    handle: '@sea.familia',
    category: 'Luxury Travel & Marine Hospitality (Labuan Bajo Liveaboard)',
    targetAudience: 'Wisatawan premium, pasangan honeymoon, keluarga mapan, pelancong mancanegara, private charter korporat.',
    usp: [
      'Kapal phinisi mewah kayu ulin & jati arsitektur kapal elegan',
      'Kabin suite privat ber-AC dengan panoramic sea view menghadap Komodo',
      'Pengalaman berlayar bintang lima: Private chef onboard, gourmet food, alat diving premium',
    ],
    voiceTone: 'Sophisticated, serene, exclusive, adventurous, and aspirational. Anggun, tenang, eksklusif.',
    dominantFormat: 'Cinematic Reels (80%) + Single/Carousel High-Res (20%)',
    recommendedHook: 'Curiosity Hook / Visual Action',
    targetKpi: 'Direct Message Booking & Saves',
    pillars: [
      'Cinematic Destination',
      'Life Onboard & Luxury Amenities',
      'Guest Stories & Private Charter',
      'Sailing Schedule & Booking Info',
    ],
    dos: [
      'Gunakan rekaman video resolusi tinggi dengan stabilizer dan color grading sinematik.',
      'Tekankan privasi, ketenangan (peace of mind), dan kenyamanan standar kapal pesiar.',
      'Sertakan edukasi pelestarian alam laut (eco-tourism: tidak menyentuh karang/manta).',
    ],
    donts: [
      'Hindari penggunaan teks atau grafis diskon yang mencolok ala promosi banting harga pasar massal.',
      'Jangan menampilkan video bergoyang (shaky) atau beresolusi rendah.',
      'Dilarang memuat konten yang berpotensi melanggar konservasi satwa langka.',
    ],
    presets: [
      {
        id: 'sfp-preset-1',
        name: 'Suite View Sunset Komodo',
        title: 'Membuka Jendela Kamar Tidur Langsung Menghadap Lautan Pink Beach',
        pillar: 'Life Onboard & Luxury Amenities',
        objective: 'conversion',
        hookTypeId: 'curiosity',
        targetDuration: '25-30 detik',
        targetAudience: 'Pasangan honeymoon & traveler premium yang mencari liveaboard eksklusif',
        targetKeyword: 'luxury phinisi Labuan Bajo',
        hookAudio: 'Bayangkan bangun pagi bukan disambut suara alarm, tapi suara ombak tenang di tengah Taman Nasional Komodo.',
        hookVisual: 'Pintu balkon kabin kayu jati dibuka perlahan menampilkan pemandangan laut toska gradasi keemasan matahari terbit. Teks: "WAKE UP LIKE THIS."',
        hookEmotion: 'Tenang, mewah, damai, eksklusif',
        hookAlt1: 'Ini yang kamu dapatkan saat memilih private charter di Sea Familia Phinisi.',
        hookAlt2: 'Bukan sekadar liburan, ini pengalaman berlayar bintang lima di Labuan Bajo.',
        bridgeAudio: 'Di Sea Familia Phinisi, setiap sudut kabin dirancang privat dengan panoramic sea view tanpa batas.',
        bridgeVisual: 'Kamera gimbal meluncur ke dek santai, private chef menyajikan sarapan gourmet segar.',
        bridgeEmotion: 'Aspirasional, mewah berkelas',
        bodyAudio: 'Lengkap dengan private chef onboard, peralatan snorkeling premium, dan rute sailing eksklusif menjelajahi pulau-pulau perawan.',
        bodyVisual: 'Footage drone sinematik kapal phinisi megah berlayar membelah laut jernih, tamu bersantai di lounge.',
        bodyEmotion: 'Serene, adventurous',
        ctaAudio: 'Slot berlayar private charter dan open trip terbatas per bulannya. Hubungi WhatsApp concierge kami di bio untuk reservasi.',
        ctaVisual: 'Pemberitahuan reservasi VIP elegan, loop kembali ke jendela suite kabin.',
        ctaEmotion: 'Persuasif, eksklusif',
      },
    ],
  },
};

// =========================================================================
// HELPER LOGIC: PACING, RETENTION & ANTI-PATTERN DETECTION
// =========================================================================

export interface PacingCalculation {
  totalWords: number;
  estimatedSeconds: number;
  status: 'ideal' | 'warning-long' | 'too-long' | 'too-short';
  statusLabel: string;
  badgeColor: string;
}

/**
 * Menghitung estimasi durasi bicara berdasarkan rata-rata tempo bicara Indonesia (~2.5 kata/detik)
 * SOP BAB 3.4: "Sweet spot: 15–35 detik (±75 kata ≈ 30 detik)"
 */
export function calculateScriptPacing(text: string): PacingCalculation {
  const words = text
    .trim()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 0);

  const totalWords = words.length;
  // Perhitungan: 1 kata ≈ 0.4 detik (2.5 kata per detik)
  const estimatedSeconds = Math.round(totalWords / 2.5);

  if (totalWords === 0) {
    return {
      totalWords: 0,
      estimatedSeconds: 0,
      status: 'too-short',
      statusLabel: 'Belum ada naskah',
      badgeColor: '#9AA0B4',
    };
  }

  if (estimatedSeconds < 12) {
    return {
      totalWords,
      estimatedSeconds,
      status: 'too-short',
      statusLabel: 'Terlalu singkat (< 12 dtk)',
      badgeColor: '#F5A524',
    };
  }

  if (estimatedSeconds <= 35) {
    return {
      totalWords,
      estimatedSeconds,
      status: 'ideal',
      statusLabel: 'Ideal Retensi (Sweet Spot 15–35 dtk)',
      badgeColor: '#22A06B',
    };
  }

  if (estimatedSeconds <= 50) {
    return {
      totalWords,
      estimatedSeconds,
      status: 'warning-long',
      statusLabel: 'Cukup panjang (35–50 dtk)',
      badgeColor: '#F5A524',
    };
  }

  return {
    totalWords,
    estimatedSeconds,
    status: 'too-long',
    statusLabel: 'Terlalu panjang (> 50 dtk, rawan drop-off)',
    badgeColor: '#EF4444',
  };
}

/**
 * Mendeteksi frasa anti-pattern terlarang dari SOP BAB 2.8
 */
export function scanAntiPatterns(text: string): { found: boolean; matches: string[] } {
  if (!text) return { found: false, matches: [] };
  const lower = text.toLowerCase();
  const bannedPhrases = [
    'halo guys',
    'halo gaes',
    'balik lagi sama',
    'balik lagi dengan',
    'hari ini aku mau',
    'hari ini saya mau',
    'di video kali ini',
    'kalian pasti belum tahu',
    'kalian wajib tahu',
    'perhatian untuk semuanya',
    'perhatian semuanya',
    'siapa nih yang',
    'siapa disini yang',
    'penasaran kan',
  ];

  const matches = bannedPhrases.filter((phrase) => lower.includes(phrase));
  return {
    found: matches.length > 0,
    matches,
  };
}

/**
 * Validasi Triple Mention SEO Sosmed (SOP BAB 5.2 & Checklist QC #17)
 */
export function checkTripleMention(keyword: string, audio: string, screenText: string, caption: string) {
  if (!keyword || !keyword.trim()) {
    return {
      inAudio: false,
      inScreen: false,
      inCaption: false,
      isTripleMentionMet: false,
    };
  }

  const k = keyword.toLowerCase().trim();
  const inAudio = audio.toLowerCase().includes(k);
  const inScreen = screenText.toLowerCase().includes(k);
  const inCaption = caption.toLowerCase().includes(k);

  return {
    inAudio,
    inScreen,
    inCaption,
    isTripleMentionMet: inAudio && inScreen && inCaption,
  };
}

// =========================================================================
// DATASET PILIHAN GANDA RELEVAN (MULTIPLE CHOICE RECOMMENDATIONS)
// =========================================================================

export interface BrandFieldChoices {
  titles: string[];
  audiences: string[];
  keywords: string[];
  hooksByCategory?: Record<string, string[]>;
  bridgeAudios?: string[];
  bodyAudios?: string[];
  ctaAudiosByObjective?: Record<'awareness' | 'conversion' | 'engagement', string[]>;
}

export const STANDARD_DURATION_CHOICES = [
  '15–25 detik (Sweet spot TikTok/Reels)',
  '25–35 detik (Edukasi padat SOP)',
  '35–50 detik (Storytelling / Demo mendalam)',
  '50–60 detik (Maksimum short-form)',
];

export const HOOK_VISUAL_CHOICES = [
  'Talent berdiri ramah di safe zone + Teks layar HURUF BESAR kontras tinggi',
  'Ekspresi kaget / heran menunjuk ke kamera + transisi SFX beat drop',
  'Close-up macro produk / demonstrasi aksi dramatis di 1 detik pertama',
  'Split screen Sebelum vs Sesudah (Perbandingan visual instan)',
  'B-roll lanskap sinematik / suasana estetik + teks safe-zone 9:16',
];

export const HOOK_EMOTION_CHOICES = [
  'Tegas, menusuk masalah',
  'Hangat, welcoming & meyakinkan',
  'Mengejutkan, memicu keheranan',
  'Empatik, relatable & tepat sasaran',
  'Misterius, memancing penasaran',
  'Otoritatif, profesional berbasis data',
];

export const BRIDGE_VISUAL_CHOICES = [
  'Talent menunjuk layar + transisi SFX whoosh / swoosh',
  'Kamera cut angle kedua + gestur menahan jawaban (open loop)',
  'Transisi cepat ke b-roll fasilitas / demonstrasi pendukung',
  'Grafik data / thermo-gun / stopwatch muncul di layar',
];

export const BRIDGE_EMOTION_CHOICES = [
  'Solutif & menenangkan',
  'Misterius, menahan jawaban',
  'Semangat & meyakinkan',
  'Visioner & analitis',
  'Nostalgia, otentik & hangat',
];

export const BODY_VISUAL_CHOICES = [
  'B-roll footage pendukung + teks poin 1-2-3 muncul tiap 2–4 detik',
  'Quick cut footage fasilitas bersih, demonstrasi form benar, & layar data',
  'Demonstrasi produk close-up + grafik perbandingan sebelum/sesudah',
  'Footage sinematik drone / suasana estetik dengan pencahayaan hangat',
  'Talking head dinamis + cut b-roll tiap 2–4 detik (lulus cut-test)',
];

export const BODY_EMOTION_CHOICES = [
  'Edukatif, santai namun berbobot',
  'Otoritatif, profesional & meyakinkan',
  'Trendy, enerjik & relatable',
  'Hangat, menggugah selera & terpercaya',
  'Serene, aspirasional & mewah',
];

export const CTA_VISUAL_CHOICES = [
  'Talent menunjuk ke arah tombol bio/link + transisi loop kembali ke frame pertama',
  'Teks ajakan komentar besar di safe zone + talent mengangguk santai',
  'Animasi panah & ikon simpan/share + transisi mulus ke logo brand',
  'Pemberitahuan reservasi / promo VIP elegan + kamera panning balik ke frame 1',
];

export const CTA_EMOTION_CHOICES = [
  'Persuasif, personal & hangat',
  'Tegas, solutif & mengajak segera bertindak',
  'Mengajak diskusi bermutu',
  'Eksklusif & berkelas',
];

export const GENERAL_FIELD_CHOICES: BrandFieldChoices = {
  titles: [
    '3 Kesalahan Paling Fatal yang Sering Dilakukan Pemula (dan Cara Menghindarinya)',
    'Jangan Lakukan Ini Sebelum Kamu Tahu 1 Rahasia Tersembunyi Ini',
    'Cara Mencapai Hasil Maksimal Tanpa Harus Buang Banyak Waktu & Biaya',
    'Bongkar Rahasia di Balik Layar: Kenapa Metode Ini Jauh Lebih Efektif',
    'Panduan Praktis Step-by-Step: Dari Nol Sampai Berhasil',
  ],
  audiences: [
    'Pemula yang baru ingin memulai dan takut melakukan kesalahan fatal',
    'Karyawan / Profesional sibuk yang mencari solusi cepat & efisien',
    'Pemilik bisnis / Pelaku usaha yang butuh strategi terbukti dan terpercaya',
    'Masyarakat umum / Konsumen yang mencari rekomendasi terbaik & hemat',
  ],
  keywords: [
    'tips pemula praktis',
    'solusi masalah harian',
    'rekomendasi terpercaya',
    'cara mudah tanpa ribet',
    'tutorial step by step',
  ],
  bridgeAudios: [
    '...rasa bingung itu wajar banget, kuncinya bukan memaksakan diri, tapi mulai dari 2 langkah paling aman ini.',
    '...nah ternyata masalahnya bukan di seberapa keras usahamu, tapi di 1 kesalahan mendasar yang sering terlewat.',
    '...daripada buang-buang waktu dan biaya coba-coba sendiri, ini jalan pintas yang paling masuk akal.',
    '...faktanya solusinya jauh lebih simpel dari yang kamu bayangkan, cukup perhatikan poin ini.',
  ],
  bodyAudios: [
    'Langkah 1: Identifikasi akar masalahnya dan hentikan kebiasaan salah. Langkah 2: Terapkan metode terarah ini secara konsisten tiap hari. Langkah 3: Evaluasi progresmu secara bertahap tanpa terburu-buru.',
    'Mitosnya: kamu harus punya pengalaman banyak atau modal besar. Faktanya: dengan memahami fondasi intinya, siapa pun bisa langsung praktik dan merasakan perbedaannya.',
    'Masalah utamanya sering terjadi karena salah strategi di awal. Setelah dianalisis, solusinya bukan menambah kerumitan, tapi menyederhanakan prosesnya menjadi 3 tahap praktis ini.',
  ],
  ctaAudiosByObjective: {
    awareness: [
      'Follow akun ini sekarang untuk tips praktis dan edukasi bermanfaat lainnya setiap hari!',
      'Follow kami agar kamu tidak ketinggalan update wawasan dan panduan terbaru berikutnya!',
    ],
    engagement: [
      'Pernah ngalamin hal yang sama? Tulis pengalaman atau pendapatmu di kolom komentar!',
      'Simpan video ini biar nggak lupa saat kamu butuh nanti, dan bagikan ke temanmu!',
      'Kira-kira dari poin tadi, mana yang paling relate sama kamu? Yuk diskusi di bawah!',
    ],
    conversion: [
      'Klik link di bio sekarang untuk konsultasi gratis dan informasi promo penawaran terbatas!',
      'Hubungi kami lewat tautan di bio hari ini untuk amankan penawaran dan slot spesial!',
      'Dapatkan akses / panduan lengkapnya sekarang dengan klik tautan resmi di bio kami!',
    ],
  },
};

export const GENERAL_HOOKS_BY_CATEGORY: Record<string, string[]> = {
  'pain-point': [
    'Udah capek-capek coba berbagai cara tapi hasilnya masih nihil? Hati-hati, masalahnya bukan di usahamu, tapi di satu kesalahan ini.',
    'Sering ngerasa frustrasi karena masalah ini ga kelar-kelar? Tonton video ini 30 detik untuk tahu solusinya.',
    'Kalau kamu masih terus abaikan tanda-tanda ini, dampaknya bakal jauh lebih fatal ke depannya.',
  ],
  'social-proof': [
    'Ini cara kami membantu ratusan orang mencapai hasil nyata hanya dalam waktu 30 hari tanpa trik rumit.',
    'Dari nol pengalaman sampai berhasil tembus target: ini 3 langkah rahasia yang kami terapkan.',
    'Data membuktikan metode ini berhasil meningkatkan hasil hingga 2 kali lipat secara konsisten.',
  ],
  'curiosity': [
    'Jangan pernah mulai langkah ini sebelum kamu tahu 1 rahasia penting yang jarang diungkap ke publik.',
    'Ada satu detail kecil yang sering disepelekan 90% orang, padahal ini penentu keberhasilannya.',
    'Ternyata ada cara tersembunyi yang bikin semuanya jauh lebih gampang dan hemat waktu.',
  ],
  'myth-busting': [
    'Banyak yang bilang cara konvensional itu yang paling benar. Faktanya, itu justru yang bikin kamu jalan di tempat.',
    'Selama ini kamu dikira harus keluar modal dan usaha ekstra? Faktanya justru sebaliknya.',
    'Stop lakukan kebiasaan ini sekarang juga, karena efek buruknya sudah terbukti secara nyata.',
  ],
  'fomo': [
    'Tips berharga ini jarang banget dibahas gratis! Pastikan kamu simpan video ini sebelum terlewat.',
    'Kesempatan langka ini cuma berlaku terbatas, jangan sampai kamu menyesal belakangan.',
    'Sebelum tren ini lewat dan kamu ketinggalan jauh, pelajari polanya sekarang juga.',
  ],
  'visual-action': [
    '(Aksi demonstrasi langsung di 1 detik pertama) → "Ini yang terjadi kalau kamu salah langkah dari awal."',
    '(Perbandingan sebelum vs sesudah instan) → "Lihat perbedaannya hanya dengan satu perubahan sederhana ini."',
    '(Close-up detail produk/aksi) → "Bukan sulap, tapi ini formula praktis yang bisa kamu tiru sekarang."',
  ],
  'specificity-stakes': [
    'Kami memangkas 80% hal yang tidak perlu, dan performanya justru melonjak 2 kali lipat dalam 14 hari.',
    'Satu kesalahan kecil bernilai mahal ini bisa dicegah cukup dengan 3 langkah sederhana ini.',
    'Hanya butuh 15 menit sehari untuk mengubah total kebiasaan yang sudah berjalan bertahun-tahun.',
  ],
  'identity-callout': [
    'Kalau kamu orang yang mau berkembang tapi masih sering bingung harus mulai dari mana: video ini buat kamu.',
    'Khusus buat kamu yang butuh solusi cepat tanpa harus pusing belajar dari nol: tonton sampai habis.',
    'Buat siapa pun yang ingin hasil maksimal dengan usaha yang lebih cerdas dan terarah.',
  ],
  'story-in-media-res': [
    'Di momen ketika semuanya terasa buntu dan hampir menyerah, satu ide sederhana ini mengubah segalanya.',
    'Saat pertama kali menghadapi situasi ini, saya sempat ragu apakah cara ini benar-benar bakal berhasil.',
    'Tepat sebelum keputusan akhir diambil, kami menemukan solusi yang tidak terduga ini.',
  ],
};

export const BRAND_FIELD_CHOICES: Record<string, BrandFieldChoices> = {};

/**
 * Helper untuk mengambil daftar opsi pilihan ganda general/universal yang relevan untuk setiap brand
 */
export function getBrandFieldChoices(_brandId?: string): BrandFieldChoices {
  return GENERAL_FIELD_CHOICES;
}

/**
 * Mengambil daftar pilihan ganda Audio Hook Utama universal berdasarkan Kategori Hook
 */
export function getHookPrimaryChoices(_brandId: string, hookTypeId: string): string[] {
  if (GENERAL_HOOKS_BY_CATEGORY[hookTypeId]) {
    return GENERAL_HOOKS_BY_CATEGORY[hookTypeId];
  }

  const hookMeta = HOOK_CATEGORIES.find((h) => h.id === hookTypeId) || HOOK_CATEGORIES[0];
  return hookMeta.examples || [];
}

/**
 * Mengambil daftar pilihan ganda CTA Audio universal berdasarkan Objective (Awareness, Engagement, Conversion)
 */
export function getCtaAudioChoices(
  _brandId: string,
  objective: 'awareness' | 'conversion' | 'engagement'
): string[] {
  return GENERAL_FIELD_CHOICES.ctaAudiosByObjective?.[objective] || [
    'Follow akun ini sekarang untuk tips praktis dan edukasi bermanfaat lainnya setiap hari!',
    'Simpan video ini biar nggak lupa saat kamu butuh nanti, dan bagikan ke temanmu!',
    'Klik link di bio sekarang untuk konsultasi gratis dan informasi promo selengkapnya!',
  ];
}


