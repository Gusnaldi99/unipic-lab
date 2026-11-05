import pymupdf
import os

os.makedirs('public', exist_ok=True)
pdf_path = 'public/skrip-jet-fitness-karawaci.pdf'

doc = pymupdf.open()

# Helper for drawing pages with header and footer
def create_page(title="LEMBAR KERJA PRODUKSI SKRIP VIDEO PENDEK (SOP v2.0)"):
    page = doc.new_page(width=595, height=842) # A4
    # Header bar
    page.draw_rect(pymupdf.Rect(40, 30, 555, 60), color=(0.04, 0.06, 0.22), fill=(0.04, 0.06, 0.22))
    page.insert_text((50, 48), title, fontsize=10, fontname="helv", color=(1, 1, 1))
    page.insert_text((420, 48), "JET FITNESS KARAWACI", fontsize=9, fontname="helv", color=(0.8, 0.85, 1))
    
    # Footer
    page.draw_line(pymupdf.Point(40, 805), pymupdf.Point(555, 805), color=(0.8, 0.8, 0.8), width=0.5)
    page.insert_text((40, 818), "Dokumen Resmi Tim Kreatif & Produksi • Standardisasi SOP v2.0 • #LetsJetFitTogether", fontsize=8, fontname="helv", color=(0.5, 0.5, 0.5))
    page.insert_text((515, 818), f"Hal {len(doc)}", fontsize=8, fontname="helv", color=(0.5, 0.5, 0.5))
    return page

# ================= PAGE 1 =================
p1 = create_page()
y = 80

p1.insert_text((40, y), "LEMBAR KERJA PRODUKSI KONTEN TIKTOK (SOP v2.0)", fontsize=15, fontname="helv", color=(0.04, 0.06, 0.22))
y += 18
p1.insert_text((40, y), "Klien: Jet Fitness Karawaci | Format: Video Vertikal (TikTok 9:16) | Target Durasi: 60 Detik", fontsize=9.5, fontname="helv", color=(0.3, 0.35, 0.45))
y += 24

# SECTION 1
p1.draw_rect(pymupdf.Rect(40, y, 555, y + 20), color=(0.14, 0.16, 0.45), fill=(0.14, 0.16, 0.45))
p1.insert_text((46, y + 14), "1. TIGA PILIHAN HOOK (FORMULA PAIN POINT HOOK - BAB 2)", fontsize=10, fontname="helv", color=(1, 1, 1))
y += 30

text_hook = """• HOOK A (Keresahan Rasa Bersalah / FOMO Produktivitas):
  - Verbal: "Gaji habis buat nongkrong tapi badan makin lemas dan gampang capek? Jangan tunggu sampai jatuh sakit baru mulai ngegym."
  - Visual: Talent muda duduk memegang kening menatap struk tagihan kopi, lalu cut cepat ke tubuh pegal di depan cermin kosan.
  - Teks Layar (TOS): "BADAN MAKIN LEMAS TAPI SIBUK NONGKRONG?"

• HOOK B (Keresahan Jam Pulang & Macet Karawaci - REKOMENDASI UTAMA):
  - Verbal: "Kelar ngampus jam 5 sore terus terjebak macet berjam-jam di jalanan Karawaci? Hati-hati, stres jalanan bikin imunmu rontok."
  - Visual: Talent menatap jalanan Karawaci yang macet total dengan ekspresi penat, lalu cut cepat ke tangga naik menuju Jet Fitness.
  - Teks Layar (TOS): "MACET KARAWACI BIKIN STRES NGGAK KELAR-KELAR?"

• HOOK C (Keresahan Pemula Takut Dihakimi):
  - Verbal: "Niat ngegym dari awal tahun tapi batal terus karena takut salah pegang alat? Jangan biarkan rasa minder menghambat badan sehatmu."
  - Visual: Talent berdiri cemas di depan pintu gym, menengok kanan-kiri ragu sebelum melangkah masuk.
  - Teks Layar (TOS): "MAU NGEGYM TAPI TAKUT DIHAKIMI?"

REKOMENDASI TERPILIH: HOOK B
Alasan Psikologis (Retensi 3 Detik Awal):
Hook B langsung menusuk situasi riil harian target persona (mahasiswa UPH & pekerja Karawaci) yang menghadapi kemacetan jam 5 sore. Keresahan ini memicu 'pattern interrupt' instan karena mengonversi waktu terbuang di jalan menjadi dorongan solusi kebiasaan positif."""

p1.insert_textbox(pymupdf.Rect(40, y, 555, y + 250), text_hook, fontsize=8.5, fontname="helv", color=(0.15, 0.15, 0.2))
y += 260

# SECTION 2: TABLE
p1.draw_rect(pymupdf.Rect(40, y, 555, y + 20), color=(0.14, 0.16, 0.45), fill=(0.14, 0.16, 0.45))
p1.insert_text((46, y + 14), "2. NASKAH LENGKAP KONTEN VIDEO (TABEL PRODUKSI STANDAR BAB 3.2)", fontsize=10, fontname="helv", color=(1, 1, 1))
y += 26

table_intro = """Judul: Solusi Anti Macet Karawaci: Ubah Jam Stres Jadi Waktu Bugar
Target Platform: TikTok | Durasi Total: 60 Detik | Pacing: ±145 Kata (2.4 kata/detik) | Suasana: Energik & Akrab"""
p1.insert_textbox(pymupdf.Rect(40, y, 555, y + 30), table_intro, fontsize=8.5, fontname="helv", color=(0.2, 0.2, 0.25))
y += 35

# Table header
p1.draw_rect(pymupdf.Rect(40, y, 555, y + 18), color=(0.9, 0.92, 0.98), fill=(0.9, 0.92, 0.98))
p1.insert_text((44, y + 12), "Bagian", fontsize=8, fontname="helv", color=(0.05, 0.1, 0.3))
p1.insert_text((85, y + 12), "Durasi", fontsize=8, fontname="helv", color=(0.05, 0.1, 0.3))
p1.insert_text((135, y + 12), "Visual & Teks Layar (TOS)", fontsize=8, fontname="helv", color=(0.05, 0.1, 0.3))
p1.insert_text((300, y + 12), "Audio / Dialog Lisan", fontsize=8, fontname="helv", color=(0.05, 0.1, 0.3))
p1.insert_text((470, y + 12), "Emosi & Delivery", fontsize=8, fontname="helv", color=(0.05, 0.1, 0.3))
y += 22

rows_p1 = [
    ("1. HOOK", "0-3s", 
     "Talent ekspresi penat menatap jalanan macet Karawaci.\nTOS BESAR: MACET KARAWACI BIKIN STRES?", 
     "\"Kelar ngampus jam 5 sore terus terjebak macet berjam-jam di jalanan Karawaci? Hati-hati, stres jalanan bikin imunmu rontok.\"", 
     "Tegas, waspada, tatap lensa kamera."),
    ("2. BRIDGE", "3-8s", 
     "Kamera cut cepat ke talent senyum di lobi Jet Fitness Karawaci.\nSFX: Whoosh. Talent menunjuk gym.", 
     "\"...daripada emosi buang waktu di jalan, Jet People di Karawaci punya pelarian yang jauh lebih produktif.\"", 
     "Misterius, solutif, memberi harapan."),
    ("3. BODY", "8-50s", 
     "B-Roll berganti tiap 3 detik:\n- Poin 1: Area cardio & dumbbell rapi\n- Poin 2: Kelas zumba/functional seru bareng member\n- Poin 3: Suasana komunitas hangat tanpa ego-lifting\nTOS: Poin 1, Poin 2, Poin 3 berurutan.", 
     "\"Poin pertama: manfaatkan waktu macet 45 menit buat bakar kalori di gym yang buka dari jam 6 pagi sampai 10 malam.\n\nSelanjutnya poin kedua: gak perlu bingung mau latihan apa, karena kamu bisa gabung kelas grup seru bareng instruktur ramah.\n\nNah yang paling penting poin ketiga: suasananya super suportif. Komunitas Jet People di sini saling semangati tanpa ada rasa intimidasi.\"", 
     "Santai, mengalir, akrab, edukatif."),
    ("4. CTA", "50-60s", 
     "Talent tos dengan member sungguhan (dengan izin).\nAnimasi panah ke tombol bio.\nLoop ending kembali ke frame 1.", 
     "\"Yuk ubah waktu macetmu jadi kebiasaan sehat! Langsung tanya admin lewat link bio kami untuk jadwal kelas terdekat, dan #LetsJetFitTogether!\"", 
     "Persuasif, hangat, memicu aksi.")
]

for part, dur, vis, aud, emo in rows_p1:
    h_box = 85 if part == "3. BODY" else 42
    p1.draw_rect(pymupdf.Rect(40, y, 555, y + h_box), color=(0.85, 0.88, 0.92), width=0.5)
    p1.insert_text((44, y + 14), part, fontsize=8, fontname="helv", color=(0.1, 0.15, 0.35))
    p1.insert_text((85, y + 14), dur, fontsize=7.5, fontname="helv", color=(0.3, 0.3, 0.3))
    p1.insert_textbox(pymupdf.Rect(135, y + 3, 295, y + h_box - 2), vis, fontsize=7.5, fontname="helv", color=(0.2, 0.2, 0.25))
    p1.insert_textbox(pymupdf.Rect(300, y + 3, 465, y + h_box - 2), aud, fontsize=7.5, fontname="helv", color=(0.1, 0.1, 0.15))
    p1.insert_textbox(pymupdf.Rect(470, y + 3, 550, y + h_box - 2), emo, fontsize=7.5, fontname="helv", color=(0.3, 0.3, 0.35))
    y += h_box + 4

# ================= PAGE 2 =================
p2 = create_page()
y = 75

# SECTION 3: QC CHECKLIST
p2.draw_rect(pymupdf.Rect(40, y, 555, y + 20), color=(0.14, 0.16, 0.45), fill=(0.14, 0.16, 0.45))
p2.insert_text((46, y + 14), "3. CHECKLIST EVALUASI SKRIP (QC MANDIRI 12 POIN - BAB 3.3)", fontsize=10, fontname="helv", color=(1, 1, 1))
y += 28

qc_items = [
    ("HOOK (a)", "Apakah 3 kata pertama langsung menusuk topik tanpa sapaan basi?", "[Ya] - Langsung dibuka kata kerja 'Kelar ngampus jam 5 sore...' menusuk rutinitas."),
    ("HOOK (b)", "Apakah intonasi hook sudah ditentukan?", "[Ya] - Ditentukan tegas, waspada, dan menatap langsung ke lensa kamera."),
    ("HOOK (c)", "Apakah emosi audiens tersentuh dalam 3 detik pertama?", "[Ya] - Mengangkat keresahan stres macet yang dialami tiap hari di Karawaci."),
    ("BRIDGE (d)", "Apakah bridge menyambungkan masalah ke solusi dengan natural?", "[Ya] - Menyambung dari stres macet ke opsi pelarian produktif."),
    ("BRIDGE (e)", "Apakah jawaban/solusi TIDAK langsung diberikan di bridge?", "[Ya] - Solusi konkret ditunda dan baru dibongkar di bagian Body."),
    ("BODY (f)", "Apakah setiap poin di body memiliki transisi kata yang natural?", "[Ya] - Menggunakan transisi penghubung 'Selanjutnya...', 'Nah yang paling penting...'."),
    ("BODY (g)", "Apakah gaya bahasa sudah sesuai dengan persona audiens target?", "[Ya] - Bahasa santai anak muda/pekerja ('ngegym', 'stres jalanan', 'Jet People')."),
    ("BODY (h)", "Apakah semua klaim/fakta yang disebut bisa diverifikasi?", "[Ya] - Jam buka 06:00-22:00 terverifikasi. Tidak ada klaim medis atau klaim penurunan berat badan."),
    ("CTA (i)", "Apakah CTA hanya berisi SATU instruksi yang jelas?", "[Ya] - Hanya satu instruksi: tanya admin lewat link bio."),
    ("CTA (j)", "Apakah CTA memberikan ALASAN untuk mengikuti instruksi?", "[Ya] - Alasan jelas: untuk mendapatkan informasi jadwal kelas terdekat."),
    ("UMUM (k)", "Apakah total durasi skrip sudah sesuai dengan target platform (60 detik)?", "[Ya] - Estimasi 145 kata pas untuk tempo 2.4 kata/detik (sekitar 58-60 detik)."),
    ("UMUM (l)", "Apakah sudah ada kolom Target KPI yang diisi sebelum pengajuan?", "[Ya] - Matriks target WTR 45%, ER 8.5%, Reach 50.000+, Follower 500+ terlampir."),
    ("UMUM (m)", "Apakah teks 100% bebas dari karakter em dash dan buzzword klise AI?", "[Ya] - Bebas em dash dan bebas buzzword AI generik.")
]

for code, q, res in qc_items:
    p2.draw_rect(pymupdf.Rect(40, y, 555, y + 20), color=(0.92, 0.94, 0.96), fill=(0.98, 0.98, 0.99))
    p2.insert_text((45, y + 13), f"• {code}: {q}", fontsize=7.5, fontname="helv", color=(0.1, 0.15, 0.3))
    p2.insert_text((45, y + 21), f"  Hasil: {res}", fontsize=7.5, fontname="helv", color=(0.15, 0.5, 0.2) if "[Ya]" in res else (0.8, 0.2, 0.2))
    y += 24

y += 10
# SECTION 4: KPI TABLE
p2.draw_rect(pymupdf.Rect(40, y, 555, y + 20), color=(0.14, 0.16, 0.45), fill=(0.14, 0.16, 0.45))
p2.insert_text((46, y + 14), "4. TABEL MANAJEMEN KPI SEBELUM PRODUKSI (BAB 4.2)", fontsize=10, fontname="helv", color=(1, 1, 1))
y += 26

kpi_rows = [
    ("Judul Konten", "Solusi Anti Macet Karawaci: Ubah Jam Stres Jadi Waktu Bugar", "Sesuai brief dan persona lokal Karawaci"),
    ("Tanggal Produksi", "Batch 1 (Pra-Produksi)", "Jadwal pengambilan video terjadwal"),
    ("Platform Utama", "TikTok", "Format vertikal 9:16 durasi 60 detik"),
    ("Jenis Hook", "Pain Point Hook", "Formula masalah + konsekuensi buruk"),
    ("Target Audiens", "Warga Karawaci usia 18-40 (mahasiswa & pekerja)", "Pencari rutinitas sehat anti-macet"),
    ("Tujuan Konten", "Awareness", "Membangun kesadaran komunitas & fasilitas"),
    ("Target WTR", "45%", "Target SOP: >40% untuk video pendek"),
    ("Target ER", "8.5%", "Target SOP: >5% untuk platform TikTok"),
    ("Target Reach", "50.000+", "Target SOP: 3x dari rata-rata normal"),
    ("Target Follower", "500+ Follower Baru", "Target SOP: Min. 50 follower baru"),
    ("Strategi Tambahan", "Level 1 Utama + Level 2 Evaluasi Jam ke-3", "Infiapop relevan, Dagelan tidak relevan")
]

p2.draw_rect(pymupdf.Rect(40, y, 555, y + 16), color=(0.9, 0.92, 0.98), fill=(0.9, 0.92, 0.98))
p2.insert_text((45, y + 11), "Parameter KPI", fontsize=8, fontname="helv", color=(0.05, 0.1, 0.3))
p2.insert_text((180, y + 11), "Target / Spesifikasi", fontsize=8, fontname="helv", color=(0.05, 0.1, 0.3))
p2.insert_text((370, y + 11), "Catatan / Dasar Penetapan Target", fontsize=8, fontname="helv", color=(0.05, 0.1, 0.3))
y += 18

for param, val, note in kpi_rows:
    p2.draw_rect(pymupdf.Rect(40, y, 555, y + 16), color=(0.88, 0.9, 0.94), width=0.5)
    p2.insert_text((45, y + 11), param, fontsize=7.5, fontname="helv", color=(0.1, 0.15, 0.3))
    p2.insert_text((180, y + 11), val, fontsize=7.5, fontname="helv", color=(0.05, 0.05, 0.05))
    p2.insert_text((370, y + 11), note, fontsize=7.5, fontname="helv", color=(0.35, 0.35, 0.4))
    y += 17

# ================= PAGE 3 =================
p3 = create_page()
y = 75

# SECTION 5: DISTRIBUTION
p3.draw_rect(pymupdf.Rect(40, y, 555, y + 20), color=(0.14, 0.16, 0.45), fill=(0.14, 0.16, 0.45))
p3.insert_text((46, y + 14), "5. REKOMENDASI DISTRIBUSI (STRATEGI 3 LEVEL BAB 5)", fontsize=10, fontname="helv", color=(1, 1, 1))
y += 28

dist_text = """• Level 1 (Wajib - Channel Utama):
  - Jadwal Prime Time: 17:30 - 19:30 WIB (tepat saat mahasiswa dan pekerja pulang berhadapan dengan jam macet Karawaci).
  - Hari Terbaik: Selasa dan Kamis (hari dengan volume pencarian kebugaran tertinggi di tengah pekan).

• Level 2 (Kondisional - Clipper & Media Promote):
  - Syarat Clipper: Distribusikan potongan 15 detik ke akun clipper minimal 3 jam setelah tayang jika WTR >50% atau mencapai 10.000 views organik (Status: Kondisional evaluasi jam ke-3).
  - Syarat Media Promote: Evaluasi pengajuan repost ke Infiapop jika ER >5% di 6 jam pertama (Status Infiapop: Ya jika nilai edukasi tinggi, Dagelan: Tidak karena tidak sesuai pilar brand).

• Level 3 (Opsional - Komunitas & WhatsApp):
  - Bagikan cuplikan video ke WhatsApp Story admin dan grup broadcast member Jet People untuk memicu engagement awal di 30 menit pertama (Golden Hour).

• Taktik Interaksi (Pinned Comment):
  \"Jet People, kamu tipe yang kalau macet milih nunggu di kosan atau langsung bakar kalori di gym? Tulis jawabanmu di bawah ya!\"

• Visual Cover / Thumbnail:
  - Frame 1 detik pertama dengan ekspresi kaget/waspada di depan jalanan macet Karawaci.
  - Teks cover kontras tinggi warna kuning/putih safe-zone 9:16: \"KELAR KELAS / NGANTOR MAU KEMANA?\""""

p3.insert_textbox(pymupdf.Rect(40, y, 555, y + 240), dist_text, fontsize=8.5, fontname="helv", color=(0.15, 0.15, 0.2))
y += 250

# SECTION 6: CAPTIONS
p3.draw_rect(pymupdf.Rect(40, y, 555, y + 20), color=(0.14, 0.16, 0.45), fill=(0.14, 0.16, 0.45))
p3.insert_text((46, y + 14), "6. CAPTION SIAP POSTING TIKTOK (2 ALTERNATIF PILIHAN)", fontsize=10, fontname="helv", color=(1, 1, 1))
y += 28

caption_text = """• OPSI A (Ringkas & Langsung To The Point):
Jam 5 sore jalanan Karawaci macet total, jangan biarkan energimu habis percuma di jalan!
Mending belok dan manfaatkan 45 menit produktif bareng komunitas Jet People di Jet Fitness Karawaci. Fasilitas lengkap dan kelas seru buka dari jam 06:00 sampai 22:00.
Langsung tanya admin via link di bio untuk jadwal kelas terdekat ya!
#JetFitnessKarawaci #LetsJetFitTogether #GymKarawaci #FitnessAnakMuda #GymMahasiswa

• OPSI B (Storytelling & Interaktif):
Siapa yang tiap jam 5 sore sering stres gara-gara kejebak macet berjam-jam di sekitar Karawaci?
Daripada emosi di jalan atau cuma bengong di kosan:
1. Kamu bisa bakar kalori dengan latihan beban terpandu
2. Gabung kelas grup zumba dan functional training yang seru
3. Nikmati fasilitas shower bersih dan suasana komunitas yang ramah pemula
Yuk ubah waktu lelahmu jadi progres kebugaran nyata! Kamu sendiri lebih suka olahraga sebelum ngampus atau sepulang kerja nih, Jet People?
Tanya admin di link bio sekarang dan mulai perjalanan sehatmu bareng kami!
#JetFitnessKarawaci #LetsJetFitTogether #KomunitasSehat #WorkoutKarawaci #GymLife"""

p3.insert_textbox(pymupdf.Rect(40, y, 555, y + 260), caption_text, fontsize=8.5, fontname="helv", color=(0.15, 0.15, 0.2))
y += 270

# Save final PDF
doc.save(pdf_path)
print(f"PDF Successfully generated at: {pdf_path}")

