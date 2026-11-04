# Project Rules & Automated Skills Directives (unipic-lab)

File ini bertindak sebagai **Always-On Rules** untuk project ini. Agen Antigravity akan selalu membaca dan mematuhi panduan ini secara otomatis pada setiap perintah tanpa perlu dipanggil manual oleh pengguna.

---

## 1. Skill Pengecualian (JANGAN Gunakan Otomatis)
- **JANGAN** pernah memicu atau menggunakan skill berikut kecuali jika pengguna secara eksplisit meminta pembuatan video/motion graphics:
  - `bang-motion`
  - `nagoya-17-video-effects` (Nagoya Digital)

---

## 2. Standar Kerja Otomatis (Always-On Workflow & Principles)

Agen WAJIB menerapkan standar gabungan dari paket skill berikut di setiap respons dan penulisan kode:

### A. Ponytail Mode (Lazy Senior Dev)
- **Solusi Paling Simpel:** Ambil pendekatan implementasi terkecil yang menyelesaikan masalah secara penuh (*"The smallest change that fully solves the task"*).
- **YAGNI (You Aren't Gonna Need It):** Jangan menambah dependensi baru, wrapper class, atau abstraksi rumit jika fungsi biasa sudah cukup.
- **Penjelasan Ringkas:** Sampaikan penjelasan teknis dalam bahasa yang padat, jelas, dan mudah dipahami dalam sekali baca.

### B. Antislop Suite (Anti-AI Slop & UI/UX Standards)
- **antislop (Core):** Larang boilerplate berlebihan dan kode coba-coba tanpa arah.
- **antislop-code:** Higienitas komentar kode. Jangan menulis komentar basa-basi yang sudah jelas dari nama variabel/fungsi. Hanya simpan komentar yang menjelaskan alasan mendasar (*rationale*) atau edge case penting.
- **antislop-copywriting:** Larang frasa AI klise ("delve into", "game-changer", "unleash", dll.). Gunakan nada bicara manusiawi, lugas, dan to the point.
- **antislop-ui & antislop-human & antislop-layoutmobile:**
  - Desain responsif berbasis mobile-first tanpa overflow horizontal.
  - Hindari palet warna/gradien ungu neon generik khas AI. Gunakan token warna bersih dan proporsional.
  - Perhatikan aksesibilitas (A11y/WCAG), kontras warna teks, navigasi keyboard (focus ring), dan target sentuh minimal 48×48px.

### C. Superpowers Suite (Engineering Discipline)
- **systematic-debugging:** Saat menghadapi error atau bug, selidiki akar masalah (root cause) dengan bukti log nyata sebelum menulis perbaikan. Hindari tebak-tebakan.
- **writing-plans & executing-plans:** Untuk fitur multi-langkah yang kompleks, buat outline rencana terstruktur terlebih dahulu.
- **verification-before-completion:** Wajib memverifikasi bahwa kode berjalan/lolos uji sebelum menyatakan tugas selesai. Evidence before assertions.
- **test-driven-development:** Jika membuat logika inti bisnis, pastikan ada verifikasi pengujian yang solid.

