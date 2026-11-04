# DESIGN.md — SoftFire Workplace · Project Dashboard

Dokumen design system yang diekstrak dari screenshot UI "Project Dashboard" (SoftFire Workplace).
Nilai warna, ukuran, dan spacing adalah **estimasi visual** dari gambar; sesuaikan bila ada file desain asli (Figma).

---

## 1. Ringkasan & Karakter Visual

- **Jenis produk:** Dashboard manajemen proyek (SaaS, web app).
- **Gaya:** Bersih, modern, ringan. Latar putih, kartu putih dengan border tipis dan shadow lembut, satu warna aksen dominan (indigo/biru-ungu).
- **Kesan:** Profesional, ramah, mudah dipindai. Banyak angka KPI dengan ikon berwarna dan progress bar.
- **Prinsip:**
  1. Satu warna aksen (indigo) untuk aksi, state aktif, dan data utama.
  2. Warna semantik (hijau/kuning/merah) hanya untuk status dan tren.
  3. Hierarki jelas: angka besar tebal → label kecil abu-abu.
  4. Sudut membulat besar dan ruang kosong yang lega.

---

## 2. Color Tokens

### 2.1 Brand / Primary

| Token | Hex (estimasi) | Penggunaan |
|---|---|---|
| `--primary-600` | `#4338E8` | Tombol utama, progress bar, bar chart aktif, link |
| `--primary-500` | `#5B5BF0` | Gradient logo, kartu "Upgrade to Pro" |
| `--primary-100` | `#E8EAFF` | Background menu sidebar aktif |
| `--primary-50` | `#F3F4FF` | Background lembut, hover |
| `--navy-900` | `#0B1038` | Judul besar, teks utama |

### 2.2 Neutral

| Token | Hex | Penggunaan |
|---|---|---|
| `--bg-page` | `#F7F8FC` | Background area konten |
| `--bg-card` | `#FFFFFF` | Background kartu, sidebar, topbar |
| `--border` | `#ECEEF5` | Border kartu & pemisah |
| `--text-primary` | `#1A1D3A` | Judul kartu, angka |
| `--text-secondary` | `#6B7085` | Label, subteks, nama menu |
| `--text-muted` | `#9AA0B4` | Waktu, placeholder, axis chart |

### 2.3 Semantic / Status

| Token | Teks | Background | Penggunaan |
|---|---|---|---|
| `--success` | `#22A06B` | `#E6F7EE` | Selesai, tren naik, deadline aman |
| `--warning` | `#F5A524` | `#FFF4DC` | Dalam proses, deadline mendekat |
| `--danger` | `#EF4444` | `#FDECEC` | Tren turun, deadline terdekat |
| `--info` | `#4338E8` | `#EEF0FF` | To Do, informasi |

### 2.4 Warna Ikon KPI (lingkaran solid, ikon putih)

| Kartu | Warna |
|---|---|
| Active Projects | Biru `#3B6EF5` |
| Tasks Completed | Hijau `#34C77B` |
| Pending Tasks | Oranye `#F59E3F` |
| Team Workload | Ungu `#8B5CF6` |

### 2.5 Kanban Summary Tiles

| Kolom | Background | Teks |
|---|---|---|
| To Do | `#EEF1FF` | `#1A1D3A` |
| In Progress | `#FFF3D6` | `#1A1D3A` |
| Review | `#FDE9E9` | `#1A1D3A` |
| Done | `#E4F6EA` | `#1A1D3A` |

### 2.6 Gradient

- **Judul "Dashboard" & tombol CTA:** `linear-gradient(90deg, #3F2FE0 → #5B5BF0)`
- **Kartu Upgrade:** `linear-gradient(160deg, #6D6DF5 → #4F46E5)`

---

## 3. Typography

- **Font family:** Sans-serif geometris modern (mirip **Inter / Plus Jakarta Sans**).
  ```css
  font-family: "Inter", "Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", sans-serif;
  ```

| Role | Ukuran | Weight | Warna | Contoh |
|---|---|---|---|---|
| Display (poster) | 96–110px | 800 | navy / gradient | "Project Dashboard" |
| KPI value | 24–28px | 700 | `--text-primary` | 24, 186, 57, 72% |
| Big metric | 24px | 700 | `--text-primary` | 28h 45m |
| Card title | 13–14px | 600 | `--text-primary` | Sprint Progress |
| Body / list item | 12px | 500 | `--text-primary` | Homepage Design |
| Caption / label | 10–11px | 400 | `--text-secondary` | vs last month |
| Micro / axis | 9–10px | 400 | `--text-muted` | Mon, Tue, May 5 |
| Link action | 11px | 500 | `--primary-600` | View Sprint → |

Aturan: angka selalu **bold**, label selalu **regular & abu-abu**. Line-height 1.3–1.5.

---

## 4. Spacing, Radius, Shadow

### Spacing (skala 4px)
`4 · 8 · 12 · 16 · 20 · 24 · 32`

- Padding kartu: **16–20px**
- Gap antar kartu: **12–16px**
- Padding item sidebar: **10px 14px**, jarak antar item ±6px

### Radius
| Elemen | Radius |
|---|---|
| Window / frame utama | 24px |
| Kartu | 12–14px |
| Tombol & badge | 8px (badge pill 6px) |
| Tombol CTA besar | 999px (pill) |
| Ikon lingkaran KPI | 50% |
| Avatar | 50% |
| Progress bar | 999px |

### Shadow
```css
--shadow-card: 0 2px 10px rgba(30, 30, 90, 0.06);
--shadow-window: 0 20px 60px rgba(60, 60, 160, 0.15);
```
Kartu juga memakai border `1px solid var(--border)`.

---

## 5. Layout

```
┌──────────────┬──────────────────────────────────────────────┐
│ Sidebar      │ Topbar (hamburger, judul, search, notif, user)│
│ ~175px       ├──────────────────────────────────────────────┤
│              │ Row 1: 4 KPI cards                            │
│              │ Row 2: Sprint | Kanban Summary | Time Tracking│
│              │ Row 3: Project Timeline (2/3) | Deadlines (1/3)│
│              │ Row 4: Recent Comments | Team | Active Projects│
└──────────────┴──────────────────────────────────────────────┘
```

- **Sidebar:** lebar tetap ±175px, background putih, border kanan tipis.
- **Topbar:** tinggi ±56px, border bawah tipis.
- **Konten:** grid 12 kolom, gap 16px.
  - Row 1: 4 kolom sama lebar (3/12 masing-masing).
  - Row 2: ±3 / 5 / 4 kolom (Kanban paling lebar).
  - Row 3: 8 / 4 kolom.
  - Row 4: 4 / 4 / 4 kolom (Active Projects sedikit lebih lebar).
- **Responsif (saran):** ≥1280 penuh; 768–1279 sidebar collapse jadi ikon, grid 2 kolom; <768 sidebar jadi drawer, grid 1 kolom.

---

## 6. Komponen

### 6.1 Sidebar
- **Header:** logo kotak gradient 36px radius 10px (huruf "S" putih) + nama "SoftFire" (bold 16px) + "Workplace" (caption).
- **Menu:** Dashboard, Projects, Tasks, Kanban, Calendar, Time Tracking, Reports, Team, Clients, Documents, Settings.
- **Item:** ikon outline 18px + label 13px, tinggi ±36px, radius 8px.
  - Default: teks `--text-secondary`.
  - **Aktif:** background `--primary-100`, teks & ikon `--primary-600`, weight 600.
- **Kartu Upgrade to Pro** (bawah): gradient indigo, radius 14px, judul putih bold, deskripsi putih 70%, ilustrasi roket di kanan, tombol putih "Upgrade Now" (teks indigo, radius 8px).

### 6.2 Topbar
- Hamburger icon + judul halaman "Dashboard" (15px, 600).
- Kanan: ikon search, ikon bell dengan **badge angka** (bulatan indigo 14px, teks putih), avatar 32px + nama (bold 12px) + role (caption) + chevron.

### 6.3 KPI Card
- Ikon lingkaran 48px (warna solid, ikon putih) di kiri.
- Kanan: label (caption) → angka besar + chip tren (`↑ 12%` hijau / `↓ 8%` merah, 10px) → "vs last month" (caption).
- Tinggi ±75px, padding 16px.

### 6.4 Sprint Progress
- Judul + persentase besar di kanan (68%, 16px bold).
- Subjudul "Sprint 12 (May 12 – May 25)".
- Progress bar tebal 6px, track `#E7E9F5`, fill indigo.
- Legenda dengan dot warna: Completed (hijau) 34, In Progress (biru) 18, To Do (oranye) 10 — angka rata kanan.
- Footer link: "View Sprint →".

### 6.5 Kanban Summary
- 4 tile angka (To Do, In Progress, Review, Done) dengan background pastel, radius 8px, angka 22px bold.
- Divider, lalu "Total Tasks 77" dan "Completion Rate 62%" dengan **donut chart** kecil (stroke indigo, track abu, ±40px).
- Footer link: "View Board →".

### 6.6 Time Tracking
- Dropdown "This Week" di kanan atas (caption + chevron).
- Metrik besar "28h 45m", label "Tracked Time".
- **Bar chart 7 hari (Mon–Sun):** bar lebar ±14px, radius atas 4px; bar hari aktif (Wed) indigo solid, lainnya `#D9DCF2`.
- Footer link: "View Time Logs →".

### 6.7 Project Timeline (Gantt)
- Legenda: garis putus-putus = Planned, garis solid = Actual.
- Header tanggal mingguan: May 5, 12, 19, 26, Jun 2.
- Baris: ikon kotak pastel 28px + nama proyek (bold 11px) + rentang tanggal (caption).
- Bar actual: indigo (radius 999px, tinggi 8px); bar planned: garis putus-putus dengan titik ujung.
- **Garis "Today"** vertikal merah tipis dengan label merah di bawah.

### 6.8 Upcoming Deadlines
- Baris: dot indigo/hijau + nama tugas (bold) + nama proyek (caption) + **badge tanggal** di kanan.
- Badge: pill radius 6px, 11px. Merah (May 20), oranye (May 22, 24), hijau (May 28).
- Footer link: "View All Deadlines →".

### 6.9 Recent Comments
- Avatar 28px, nama (bold) + waktu ("2h ago") rata kanan, isi komentar 11px, "On: Nama Proyek" caption.
- Footer link: "View All Comments →".

### 6.10 Team Members
- Avatar 28px + nama (bold) + role (caption) + badge persentase workload di kanan.
- Badge workload: ≥85% merah (`--danger`), 70% kuning (`--warning`), ≤65% hijau (`--success`).
- Footer link: "View All Team →".

### 6.11 Active Projects
- Ikon kotak pastel 36px + nama (bold) + "Due May 25" (caption) + progress bar tipis (4px) + persentase di kanan.
- Progress bar tiap proyek boleh punya warna berbeda (indigo, ungu, biru muda) dengan gradient halus.
- Header kanan: "View All →".

### 6.12 Tombol & Link
| Varian | Style |
|---|---|
| Primary (CTA besar) | Pill, gradient indigo, teks putih 28px bold, ikon panah dalam lingkaran putih |
| Secondary (di kartu Upgrade) | Putih, teks indigo, radius 8px, 12px 600 |
| Text link | Teks indigo 11px 500 + ikon panah `→` |

---

## 7. Ikonografi

- Gaya **outline** (stroke ±1.5px), sudut membulat — setara Lucide / Feather / Phosphor Regular.
- Ukuran: 18px (sidebar), 16px (topbar), 20–24px (dalam lingkaran KPI).
- Ikon proyek memakai kotak pastel (`primary-50` / hijau muda / ungu muda) dengan ikon berwarna di dalamnya.

---

## 8. Data Visualization

| Chart | Aturan |
|---|---|
| Progress bar | Track `#E7E9F5`, fill indigo, radius penuh |
| Donut | Stroke 6px, fill indigo, track abu terang |
| Bar chart | 1 bar highlight (indigo), sisanya abu-ungu muda |
| Gantt | Actual = solid indigo, Planned = dashed |
| Tren | Panah ↑ hijau / ↓ merah + persentase |

Selalu tampilkan nilai numerik di samping visual; jangan hanya mengandalkan warna.

---

## 9. Elemen Dekoratif (Poster / Marketing)

- Blob organik indigo di pojok kiri atas & kanan bawah.
- Pola titik-titik (dot grid) indigo transparan.
- Ring/lingkaran outline indigo sebagai aksen.
- Garis bawah kuas (swoosh) di bawah kata "Dashboard".
- Tagline: "Plan tasks, teams, and timelines" (abu-abu, ±32px, regular).
- CTA pill: "Explore the UI" + URL `softfireinfotech.com` di kapsul putih dengan ikon globe.
- Mockup dibungkus window browser dengan tiga dot (merah, kuning, hijau).

---

## 10. State & Interaksi (Rekomendasi)

| Elemen | Hover | Active/Focus |
|---|---|---|
| Menu sidebar | bg `primary-50` | bg `primary-100`, teks indigo |
| Kartu | shadow naik sedikit | — |
| Tombol | gelapkan 6% | ring 3px `primary-600` 30% |
| Link | underline | — |
| Baris list | bg `#F9FAFF` | — |

- Transisi: `150–200ms ease-out`.
- Fokus keyboard wajib terlihat (outline indigo).

---

## 11. Aksesibilitas

- Kontras teks utama di atas putih ≥ 7:1; teks sekunder ≥ 4.5:1.
- Badge teks kuning/oranye di background pastel perlu diperiksa (bisa < 4.5:1) → gelapkan warna teks bila perlu.
- Jangan hanya bergantung pada warna untuk status; sertakan teks/angka.
- Teks micro 9–10px sebaiknya dinaikkan ke minimal 11–12px untuk produksi.
- Beri `aria-label` pada ikon tanpa teks (search, notifikasi, hamburger).

---

## 12. CSS Variables (Starter)

```css
:root {
  /* Brand */
  --primary-600: #4338E8;
  --primary-500: #5B5BF0;
  --primary-100: #E8EAFF;
  --primary-50:  #F3F4FF;
  --navy-900:    #0B1038;

  /* Neutral */
  --bg-page: #F7F8FC;
  --bg-card: #FFFFFF;
  --border:  #ECEEF5;
  --text-primary:   #1A1D3A;
  --text-secondary: #6B7085;
  --text-muted:     #9AA0B4;

  /* Semantic */
  --success: #22A06B;  --success-bg: #E6F7EE;
  --warning: #F5A524;  --warning-bg: #FFF4DC;
  --danger:  #EF4444;  --danger-bg:  #FDECEC;

  /* Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 14px;
  --radius-xl: 24px;
  --radius-pill: 999px;

  /* Shadow */
  --shadow-card: 0 2px 10px rgba(30, 30, 90, 0.06);

  /* Type */
  --font-sans: "Inter", "Plus Jakarta Sans", system-ui, sans-serif;
}
```

---

## 13. Catatan

- Semua nilai diperkirakan dari gambar; verifikasi dengan color picker atau file sumber.
- Data (nama, angka, tanggal) dalam screenshot adalah **contoh/placeholder**.
- Foto avatar dan ilustrasi roket bersifat dekoratif.

