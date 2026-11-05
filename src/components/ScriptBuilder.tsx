'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  FileText,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  PlusCircle,
  AlertTriangle,
  Flame,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Clock,
  Layers,
  Search,
  Eye,
  Table,
  VolumeX,
  Download,
  ChevronDown,
  ChevronUp,
  Info,
  Target,
  Activity,
  RotateCcw,
} from 'lucide-react';
import {
  HOOK_CATEGORIES,
  SCRIPT_BEATS_GUIDE,
  HOOK_RUBRIC_DIMENSIONS,
  ANTI_PATTERNS,
  QC_CHECKLIST,
  SOP_CHAPTERS,
  BRAND_SOP_PROFILES,
  BrandSopProfile,
  ScriptPreset,
  calculateScriptPacing,
  scanAntiPatterns,
  checkTripleMention,
  STANDARD_DURATION_CHOICES,
  HOOK_VISUAL_CHOICES,
  HOOK_EMOTION_CHOICES,
  BRIDGE_VISUAL_CHOICES,
  BRIDGE_EMOTION_CHOICES,
  BODY_VISUAL_CHOICES,
  BODY_EMOTION_CHOICES,
  CTA_VISUAL_CHOICES,
  CTA_EMOTION_CHOICES,
  getBrandFieldChoices,
  getHookPrimaryChoices,
  getCtaAudioChoices,
} from '@/data/scriptSopData';
import { BrandProfile, ContentCardItem } from '@/types/dashboard';

interface MultipleChoiceSelectorProps {
  options: string[];
  selectedValue: string;
  onSelect: (val: string) => void;
  layout?: 'pills' | 'stack';
  badgePrefix?: string;
}

/**
 * Komponen Pilihan Ganda Interaktif untuk mengisi form skrip video secara relevan & instan
 */
const MultipleChoiceSelector: React.FC<MultipleChoiceSelectorProps> = ({
  options,
  selectedValue,
  onSelect,
  layout = 'stack',
}) => {
  if (!options || options.length === 0) return null;

  if (layout === 'pills') {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '4px 0 6px' }}>
        {options.map((opt, i) => {
          const isSelected = selectedValue.trim().toLowerCase() === opt.trim().toLowerCase();
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(opt)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 9px',
                borderRadius: '16px',
                border: isSelected ? '1.5px solid var(--primary-600)' : '1px solid #E2E8F0',
                background: isSelected ? 'var(--primary-50)' : '#F8FAFC',
                color: isSelected ? 'var(--primary-700)' : '#334155',
                fontSize: '11px',
                fontWeight: isSelected ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {isSelected ? (
                <Check size={11} color="var(--primary-600)" strokeWidth={3} />
              ) : (
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#CBD5E1' }} />
              )}
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Stack layout: format pilihan ganda [A], [B], [C], [D]
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', margin: '4px 0 6px' }}>
      {options.map((opt, i) => {
        const isSelected = selectedValue.trim() === opt.trim();
        const letter = letters[i] || `${i + 1}`;
        return (
          <div
            key={i}
            onClick={() => onSelect(opt)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(opt);
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              padding: '6px 9px',
              borderRadius: '6px',
              border: isSelected ? '1.5px solid var(--primary-600)' : '1px solid #E2E8F0',
              background: isSelected ? 'var(--primary-50)' : '#FAFAFC',
              cursor: 'pointer',
              transition: 'all 0.12s ease',
              textAlign: 'left',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '19px',
                height: '19px',
                borderRadius: '50%',
                background: isSelected ? 'var(--primary-600)' : '#E2E8F0',
                color: isSelected ? '#FFFFFF' : '#475569',
                fontSize: '10px',
                fontWeight: 800,
                flexShrink: 0,
                marginTop: '1px',
              }}
            >
              {isSelected ? <Check size={11} strokeWidth={3} /> : letter}
            </span>
            <span
              style={{
                fontSize: '11.5px',
                color: isSelected ? 'var(--navy-900)' : '#334155',
                fontWeight: isSelected ? 600 : 400,
                lineHeight: 1.35,
                flex: 1,
              }}
            >
              {opt}
            </span>
          </div>
        );
      })}
    </div>
  );
};


interface ScriptBuilderProps {
  currentBrand: BrandProfile;
  brands: BrandProfile[];
  onSelectBrand?: (brandId: string) => void;
  onCreateCard?: (newCard: ContentCardItem) => void;
  onNavigateToCalendar?: () => void;
}

export const ScriptBuilder: React.FC<ScriptBuilderProps> = ({
  currentBrand,
  brands,
  onSelectBrand,
  onCreateCard,
  onNavigateToCalendar,
}) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'builder' | 'handbook' | 'rubric' | 'kpi'>('builder');
  const [editorViewMode, setEditorViewMode] = useState<'form' | 'table' | 'muted'>('form');
  const [showBrandGuidelines, setShowBrandGuidelines] = useState(false);

  // Search & Filter State
  const [selectedHookType, setSelectedHookType] = useState<string>('pain-point');
  const [searchHookQuery, setSearchHookQuery] = useState<string>('');
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [copiedTable, setCopiedTable] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');

  // Brand Context Discovery
  const activeBrandProfile: BrandSopProfile | undefined = useMemo(() => {
    if (!currentBrand?.id) return undefined;
    return (
      BRAND_SOP_PROFILES[currentBrand.id] ||
      Object.values(BRAND_SOP_PROFILES).find(
        (b) =>
          b.brandName.toLowerCase().includes(currentBrand.name.toLowerCase()) ||
          currentBrand.name.toLowerCase().includes(b.brandName.toLowerCase())
      )
    );
  }, [currentBrand]);

  // Pilihan Ganda Relevan Klien & Format (Multiple Choice Recommendations)
  const brandChoices = useMemo(() => {
    return getBrandFieldChoices(currentBrand?.id || '');
  }, [currentBrand?.id]);

  // Content Brief Form State
  const [title, setTitle] = useState('');
  const [pillar, setPillar] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [objective, setObjective] = useState<'awareness' | 'conversion' | 'engagement'>('awareness');
  const [targetDuration, setTargetDuration] = useState('15–35 detik (Sweet spot)');
  const [targetKeyword, setTargetKeyword] = useState('');

  // 1. Hook (0–3s)
  const [hookPrimary, setHookPrimary] = useState('');
  const [hookAlt1, setHookAlt1] = useState('');
  const [hookAlt2, setHookAlt2] = useState('');
  const [hookVisualText, setHookVisualText] = useState('');
  const [hookEmotion, setHookEmotion] = useState('Tegas, menusuk masalah');

  // 2. Bridge (3–8s)
  const [bridgeVisualText, setBridgeVisualText] = useState('Talent menunjuk layar + transisi SFX whoosh');
  const [bridgeAudio, setBridgeAudio] = useState('');
  const [bridgeEmotion, setBridgeEmotion] = useState('Misterius, menahan jawaban');

  // 3. Body (8–50s)
  const [bodyVisualText, setBodyVisualText] = useState('B-roll footage pendukung + teks poin 1-2-3 muncul tiap 3 detik');
  const [bodyAudio, setBodyAudio] = useState('');
  const [bodyEmotion, setBodyEmotion] = useState('Edukatif, santai namun berbobot');

  // 4. CTA & Loop (50–60s)
  const [ctaVisualText, setCtaVisualText] = useState('Talent menunjuk tombol CTA + animasi loop ke frame 1');
  const [ctaAudio, setCtaAudio] = useState('');
  const [ctaEmotion, setCtaEmotion] = useState('Persuasif, personal');

  // Interactive QC Checklist
  const [checkedQc, setCheckedQc] = useState<Record<string, boolean>>({});

  // Rubric Interactive Scores (0, 1, 2)
  const [rubricScores, setRubricScores] = useState<Record<string, number>>({
    gap: 1,
    specificity: 1,
    truth: 2,
    fit: 2,
    voice: 1,
    pull: 2,
  });

  // Saat brand berganti, otomatis sesuaikan pilar dan target audiens jika form masih kosong
  useEffect(() => {
    if (activeBrandProfile) {
      if (!pillar || !activeBrandProfile.pillars.includes(pillar)) {
        setPillar(activeBrandProfile.pillars[0] || 'Edukasi');
      }
      if (!targetAudience) {
        setTargetAudience(activeBrandProfile.targetAudience);
      }
    }
  }, [activeBrandProfile]);

  // Hook meta info
  const activeHookMeta = useMemo(() => {
    return HOOK_CATEGORIES.find((h) => h.id === selectedHookType) || HOOK_CATEGORIES[0];
  }, [selectedHookType]);

  // Pilihan Ganda Hook Utama & CTA Audio Relevan
  const hookPrimaryChoices = useMemo(() => {
    return getHookPrimaryChoices(currentBrand?.id || '', selectedHookType);
  }, [currentBrand?.id, selectedHookType]);

  const ctaAudioChoices = useMemo(() => {
    return getCtaAudioChoices(currentBrand?.id || '', objective);
  }, [currentBrand?.id, objective]);

  // Filtered hooks in handbook tab
  const filteredHooks = useMemo(() => {
    if (!searchHookQuery.trim()) return HOOK_CATEGORIES;
    const q = searchHookQuery.toLowerCase();
    return HOOK_CATEGORIES.filter(
      (h) =>
        h.title.toLowerCase().includes(q) ||
        h.tagline.toLowerCase().includes(q) ||
        h.formula.toLowerCase().includes(q) ||
        h.suitableFor.some((s) => s.toLowerCase().includes(q))
    );
  }, [searchHookQuery]);

  // Combined Spoken Script Text for Word Count & Pacing
  const combinedSpokenText = useMemo(() => {
    return `${hookPrimary} ${bridgeAudio} ${bodyAudio} ${ctaAudio}`.trim();
  }, [hookPrimary, bridgeAudio, bodyAudio, ctaAudio]);

  const pacingInfo = useMemo(() => {
    return calculateScriptPacing(combinedSpokenText);
  }, [combinedSpokenText]);

  // Combined Screen Text for Muted & SEO checks
  const combinedScreenText = useMemo(() => {
    return `${hookVisualText} ${bridgeVisualText} ${bodyVisualText} ${ctaVisualText}`.trim();
  }, [hookVisualText, bridgeVisualText, bodyVisualText, ctaVisualText]);

  // Anti-Pattern Scanner on Hook
  const antiPatternResult = useMemo(() => {
    return scanAntiPatterns(hookPrimary);
  }, [hookPrimary]);

  // Triple Mention SEO Checker
  const seoCheck = useMemo(() => {
    return checkTripleMention(targetKeyword, combinedSpokenText, combinedScreenText, ctaAudio);
  }, [targetKeyword, combinedSpokenText, combinedScreenText, ctaAudio]);

  // QC Stats
  const qcTotal = QC_CHECKLIST.length;
  const qcPassedCount = Object.values(checkedQc).filter(Boolean).length;
  const qcPercentage = Math.round((qcPassedCount / qcTotal) * 100);

  const handleToggleQc = (id: string) => {
    setCheckedQc((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCheckAllQc = () => {
    const allChecked: Record<string, boolean> = {};
    QC_CHECKLIST.forEach((item) => {
      allChecked[item.id] = true;
    });
    setCheckedQc(allChecked);
  };

  const handleResetQc = () => {
    setCheckedQc({});
  };

  // Rubric Gatekeeper evaluation
  const truthScore = rubricScores['truth'] ?? 0;
  const pullScore = rubricScores['pull'] ?? 0;
  const totalRubricScore = Object.values(rubricScores).reduce((a, b) => a + b, 0);
  const isRubricPass = truthScore > 0 && pullScore > 0 && totalRubricScore >= 8;

  // Load Preset Blueprint into Form
  const handleLoadPreset = (preset: ScriptPreset) => {
    setTitle(preset.title);
    setPillar(preset.pillar);
    setObjective(preset.objective);
    setSelectedHookType(preset.hookTypeId);
    setTargetDuration(preset.targetDuration);
    setTargetAudience(preset.targetAudience);
    setTargetKeyword(preset.targetKeyword || '');

    setHookPrimary(preset.hookAudio);
    setHookVisualText(preset.hookVisual);
    setHookEmotion(preset.hookEmotion);
    setHookAlt1(preset.hookAlt1);
    setHookAlt2(preset.hookAlt2);

    setBridgeAudio(preset.bridgeAudio);
    setBridgeVisualText(preset.bridgeVisual);
    setBridgeEmotion(preset.bridgeEmotion);

    setBodyAudio(preset.bodyAudio);
    setBodyVisualText(preset.bodyVisual);
    setBodyEmotion(preset.bodyEmotion);

    setCtaAudio(preset.ctaAudio);
    setCtaVisualText(preset.ctaVisual);
    setCtaEmotion(preset.ctaEmotion);

    // Otomatis centang QC dasar
    handleCheckAllQc();
  };

  // Generate Standard Text Script
  const generateFormattedScript = () => {
    return `=== SKRIP KONTEN VIDEO PENDEK (SOP v2.0) ===
Klien: ${currentBrand?.name || 'Umum'} (${activeBrandProfile?.handle || ''})
Judul: ${title || 'Untitled Script'}
Pilar: ${pillar || 'Edukasi'} | Tujuan: ${objective.toUpperCase()} | Durasi Target: ${targetDuration}
SEO Keyword: ${targetKeyword || '-'}
Jenis Hook: ${activeHookMeta.title} (${activeHookMeta.number})
Estimasi Pacing: ±${pacingInfo.totalWords} kata (~${pacingInfo.estimatedSeconds} detik)

[1. HOOK (0–3 detik)]
• Visual & Teks Layar (Muted-First): ${hookVisualText || activeHookMeta.tagline}
• Audio / Lisan: "${hookPrimary || activeHookMeta.examples[0]}"
• Cadangan A/B: ${hookAlt1 ? `[Cadangan 1] ${hookAlt1}` : '-'} ${hookAlt2 ? `| [Cadangan 2] ${hookAlt2}` : ''}
• Emosi Target: ${hookEmotion}

[2. BRIDGE (3–8 detik)]
• Visual & Teks Layar: ${bridgeVisualText}
• Audio / Lisan: "${bridgeAudio || '...kuncinya ada di satu langkah ini.'}"
• Emosi Target: ${bridgeEmotion}

[3. BODY (8–50 detik)]
• Visual & Teks Layar: ${bodyVisualText}
• Audio / Lisan:
${bodyAudio || 'Poin 1: ...\nPoin 2: ...\nPoin 3: ...'}
• Emosi Target: ${bodyEmotion}

[4. CTA & LOOP (50–60 detik)]
• Visual & Loop Ending: ${ctaVisualText}
• Audio / Lisan: "${ctaAudio || 'Follow untuk kelanjutan tips praktis berikutnya!'}"
• Emosi Target: ${ctaEmotion}

[QC Mandiri Penulis: ${qcPassedCount}/${qcTotal} poin lolos (${qcPercentage}%)]
Status: Siap Review Creative Director (SLA: Maks. 1 Hari Kerja)
`;
  };

  // Generate Markdown Table format (BAB 3.2)
  const generateMarkdownTable = () => {
    return `### Naskah Konten: ${title || 'Untitled'}
**Klien:** ${currentBrand?.name || 'Umum'} | **Pilar:** ${pillar} | **Durasi:** ${targetDuration}

| Bagian | Durasi | Visual & Teks Layar | Audio / Dialog / VO | Catatan Emosi |
|---|---|---|---|---|
| **1. HOOK** | 0–3 dtk | ${hookVisualText || '-'} | "${hookPrimary || '-'}" | ${hookEmotion} |
| **2. BRIDGE** | 3–8 dtk | ${bridgeVisualText || '-'} | "${bridgeAudio || '-'}" | ${bridgeEmotion} |
| **3. BODY** | 8–50 dtk | ${bodyVisualText || '-'} | "${bodyAudio.replace(/\n/g, ' ') || '-'}" | ${bodyEmotion} |
| **4. CTA** | 50–60 dtk | ${ctaVisualText || '-'} | "${ctaAudio || '-'}" | ${ctaEmotion} |

*Estimasi Pacing:* ${pacingInfo.totalWords} kata (~${pacingInfo.estimatedSeconds} dtk) | *QC Check:* ${qcPassedCount}/${qcTotal} poin.
`;
  };

  // Generate Master AI Prompt (Dynamic for ANY Selected Brand & Content Brief)
  const generateAiMasterPrompt = () => {
    const brandName = currentBrand?.name || activeBrandProfile?.brandName || 'Brand Klien';
    const brandCategory = activeBrandProfile?.category || currentBrand?.category || 'Kategori Industri Klien';
    const brandPositioning = activeBrandProfile?.usp?.join('; ') || currentBrand?.references || 'Positioning dan keunggulan kompetitif brand';
    const brandVoice = activeBrandProfile?.voiceTone || 'Santai, akrab, solutif, dan profesional sesuai target audiens';
    const brandAudience = targetAudience || activeBrandProfile?.targetAudience || 'Target audiens spesifik brand';
    const brandDos = activeBrandProfile?.dos?.join(', ') || 'Gunakan sapaan persona yang akrab, cantumkan CTA jelas, buka dengan situasi relatable';
    const brandDonts = activeBrandProfile?.donts?.join(', ') || 'Jangan overclaim, dilarang menyerang kompetitor, hindari bahasa kaku';
    const brandHandle = activeBrandProfile?.handle || currentBrand?.socialUrl || '@brandklien';

    return `# PERAN & IDENTITAS
Kamu adalah Senior Content Writer dan Short-Form Video Strategist yang bekerja dengan Standar Operasional Prosedur (SOP) Strategi Penulisan Konten Kreatif. Tugasmu adalah menulis skrip video pendek yang dirancang khusus untuk mempertahankan retensi audiens tinggi (Watch-Through Rate) dan memicu aksi nyata.

Kamu wajib mematuhi seluruh aturan SOP di bawah ini secara ketat. Dilarang menambahkan angka fiktif, klaim ilmiah tanpa dasar, atau data statistik yang tidak tercantum dalam input saya.

---

# DATA PROFIL BRAND (BRAND PROFILE)
Tulis seluruh naskah mengikuti karakter dan batasan brand berikut:
- Nama Brand: ${brandName}
- Kategori Industri: ${brandCategory}
- Positioning & Nilai Unik: ${brandPositioning}
- Tone of Voice: ${brandVoice}
- Target Persona Audiens: ${brandAudience}
- Kata Kunci / Hal Wajib Dilakukan (Brand Do's): ${brandDos}
- Kata Terlarang / Hal Dilarang (Brand Don'ts): ${brandDonts}
- Akun Media Sosial: ${brandHandle}

---

# DATA KONTEN BRIEF
- Judul / Topik: ${title || '[Topik Konten Belum Diisi]'}
- Platform Utama: TikTok / Instagram Reels (Format Vertikal 9:16)
- Target Total Durasi: ${targetDuration || '60 detik'}
- Kategori / Pilar Konten: ${pillar || 'Edukasi / Tutorial'}
- Tujuan Konten: ${objective.toUpperCase()}
- Target Audiens Spesifik: ${brandAudience}
- Keyword SEO (Triple Mention): ${targetKeyword || '[Keyword SEO Belum Diisi]'}
- Draft Hook Utama: "${hookPrimary || activeHookMeta.examples[0] || '[Draft Hook Belum Diisi]'}"
- Draft Visual Hook: "${hookVisualText || 'Ekspresi kaget/tegas + Text on Screen kapital di safe zone'}"
- Intonasi Delivery Hook: ${hookEmotion || 'Tegas, waspada, tatap lensa dengan percaya diri'}
- Draft Bridge: "${bridgeAudio || '...kuncinya ada di satu langkah ini.'}"
- Draft Body:
${bodyAudio || 'Poin 1: ...\nPoin 2: ...\nPoin 3: ...'}
- Draft CTA: "${ctaAudio || 'Follow / Hubungi kami sekarang melalui link di bio!'}"

---

# ATURAN WAJIB STRUKTUR SKRIP (FORMULA 4 BAGIAN - BAB 3.1)
1. Hook (0-3s): 3 kata pertama menusuk keresahan/masalah tanpa salam basi. Jenis Hook: ${activeHookMeta.title} (${activeHookMeta.number}). Formula: ${activeHookMeta.formula}.
2. Bridge (3-8s): Sambungkan masalah di hook dengan solusi secara natural, tunda jawaban untuk tahan drop-off penonton.
3. Body (8-50s): Sampaikan poin terstruktur (Poin 1, Poin 2, Poin 3) dengan transisi percakapan mengalir (conversational). Pacing 2.2-2.5 kata/detik.
4. CTA (50-60s): SATU instruksi jelas + alasan bernilai + loop visual yang memancing replay.

---

# STANDAR INTEGRITAS DATA & ANTI-SLOP (HUMAN-FIRST)
- Larangan Halusinasi: Dilarang mengarang angka statistik yang tidak ada di input. Jika butuh pembuktian yang belum disediakan, tulis [DATA PERLU DIVERIFIKASI].
- Larangan Karakter Em Dash: Dilarang menggunakan karakter em dash. Gunakan koma, titik dua, tanda kurung, atau titik.
- Bebas Buzzword Kosong: Hindari kata klise AI seperti 'solusi revolusioner', 'game-changer', 'cutting-edge', 'seamless', 'unlock potensi'.
- Rhythm Percakapan: Tulis kalimat yang enak dibaca bersuara dengan variasi panjang pendek yang wajar.

---

# TARGET KPI SEBELUM PRODUKSI (BAB 4 MODUL SOP)
- Target Watch-Through Rate (WTR): 45% (Target minimum SOP: >40% video pendek)
- Target Engagement Rate (ER): 8.5% (Target minimum SOP: >5% di TikTok)
- Target Reach: 50.000+ (3x dari rata-rata normal)
- Target Follower Growth: 500+ follower baru per video viral

---

# FORMAT OUTPUT YANG WAJIB DIBERIKAN (7 BAGIAN LENGKAP SECARA BERURUTAN)
Sajikan hasil akhir secara berurutan dalam 7 bagian terstruktur berikut:
1. Tiga Pilihan Hook (Alternatif A/B/C) dengan formula ${activeHookMeta.title} + 1 Pilihan Terbaik + Alasan Psikologis Retensi 3 Detik Awal.
2. Skrip Lengkap Format Tabel Produksi Standar BAB 3.2 (5 Kolom: Bagian, Durasi, Visual & TOS, Audio/Dialog/VO, Catatan Emosi & Delivery).
3. Checklist Evaluasi Skrip QC Mandiri 12 Poin (a sampai m) dengan format [Ya/Tidak] + Catatan Evaluasi.
4. Tabel Manajemen KPI Sebelum Produksi Format Standar BAB 4.2.
5. Rekomendasi Distribusi Strategi 3 Level BAB 5 (Level 1 Prime Time, Level 2 Clipper & Media Promote, Level 3 WhatsApp & Komunitas, Pinned Comment, Cover Thumbnail).
6. Caption Siap Posting TikTok/Reels (Opsi A Ringkas & Opsi B Storytelling/Interaktif + Hashtag Relevan).
7. Dokumen Berkas Siap Produksi (Sertakan format berkas PDF / dokumen utuh untuk tim produksi).
`;
  };

  const handleCopyAiPrompt = () => {
    const promptText = generateAiMasterPrompt();
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2200);
  };

  const handleCopyScript = () => {
    const text = generateFormattedScript();
    navigator.clipboard.writeText(text);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2200);
  };

  const handleCopyTable = () => {
    const tableText = generateMarkdownTable();
    navigator.clipboard.writeText(tableText);
    setCopiedTable(true);
    setTimeout(() => setCopiedTable(false), 2200);
  };

  const handleDownloadScript = () => {
    const element = document.createElement('a');
    const file = new Blob([generateFormattedScript()], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `skrip-${(title || 'konten').toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSaveToCalendar = () => {
    if (!title.trim()) {
      alert('Mohon masukkan judul konten terlebih dahulu.');
      return;
    }
    if (!onCreateCard || !currentBrand?.id) {
      alert('Fitur penyimpanan aktif saat brand dipilih.');
      return;
    }

    const scriptText = generateFormattedScript();
    const newCard: ContentCardItem = {
      id: `card-${Date.now()}`,
      brandId: currentBrand.id,
      title: title.trim(),
      week: 'Week 1',
      format: 'Video',
      platform: 'TikTok & Reels',
      pillar: pillar || 'Edukasi',
      caption: scriptText,
      captionSnippet: hookPrimary || scriptText.slice(0, 120),
      notes: `Hook: ${activeHookMeta.title} (${activeHookMeta.number}). Estimasi: ${pacingInfo.estimatedSeconds}s. QC: ${qcPassedCount}/${qcTotal}.`,
      status: 'copywriting',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assignee: {
        name: 'Senior Writer',
        role: 'Script Writer',
        avatarBg: '#4338E8',
      },
    };

    onCreateCard(newCard);
    setSaveSuccessMsg('Skrip berhasil didaftarkan ke Pipeline & Kalender!');
    setTimeout(() => {
      setSaveSuccessMsg('');
      if (onNavigateToCalendar) {
        onNavigateToCalendar();
      }
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* =========================================================================
          TOP COMMAND BANNER (SOP STRATEGI PENULISAN KONTEN KREATIF v2.0)
          ========================================================================= */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0B1038 0%, #161A42 50%, #232258 100%)',
          borderRadius: 'var(--radius-md)',
          padding: '22px 26px',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: '0 4px 20px rgba(11, 16, 56, 0.15)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  padding: '3px 9px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}
              >
                SOP KONTEN v2.0 & DATA AKUN MASTER
              </span>
              <span style={{ fontSize: '12px', color: '#B4B9DC' }}>Senior Writer & Creative Director</span>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0, letterSpacing: '-0.3px', color: '#FFFFFF' }}>
              Skrip Builder — Mesin Retensi Video Pendek
            </h2>
            <p style={{ fontSize: '13px', color: '#B4B9DC', margin: '6px 0 0', maxWidth: '640px', lineHeight: 1.5 }}>
              Standardisasi penulisan skenario video <strong>Formula 4-Bagian</strong> (Hook, Bridge, Body, CTA), 
              <strong> 9 Klasifikasi Hook</strong>, evaluasi retensi 3 detik pertama, dan panduan Do&apos;s & Don&apos;ts klien.
            </p>
          </div>

          {/* Quick Client Switcher */}
          <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '12px 16px', borderRadius: '8px', minWidth: '240px' }}>
            <label style={{ display: 'block', fontSize: '11px', color: '#9AA0B4', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 600 }}>
              Klien Aktif
            </label>
            <select
              value={currentBrand?.id || ''}
              onChange={(e) => onSelectBrand && onSelectBrand(e.target.value)}
              style={{
                width: '100%',
                background: '#FFFFFF',
                color: '#1A1D3A',
                border: 'none',
                borderRadius: '6px',
                padding: '7px 10px',
                fontSize: '13px',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
            {activeBrandProfile && (
              <span style={{ display: 'block', fontSize: '11px', color: '#B4B9DC', marginTop: '4px' }}>
                {activeBrandProfile.handle} • {activeBrandProfile.category.split('(')[0]}
              </span>
            )}
          </div>
        </div>

        {/* Brand Context & Guidelines Accordion Bar */}
        {activeBrandProfile && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              padding: '12px 14px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', flexWrap: 'wrap' }}>
                <span style={{ background: 'var(--primary-600)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '11px' }}>
                  BRAND INTELLIGENCE
                </span>
                <span><strong>Voice & Tone:</strong> {activeBrandProfile.voiceTone.split('.')[0]}</span>
                <span style={{ color: '#B4B9DC' }}>•</span>
                <span><strong>Format:</strong> {activeBrandProfile.dominantFormat}</span>
                <span style={{ color: '#B4B9DC' }}>•</span>
                <span><strong>Hook Rekomendasi:</strong> {activeBrandProfile.recommendedHook}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* 1-Click Load Preset */}
                {activeBrandProfile.presets.length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleLoadPreset(activeBrandProfile.presets[0])}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'rgba(255, 255, 255, 0.18)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      color: '#FFFFFF',
                      padding: '4px 10px',
                      borderRadius: '5px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Sparkles size={12} color="#F59E3F" />
                    <span>Muat Blueprint: {activeBrandProfile.presets[0].name}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowBrandGuidelines(!showBrandGuidelines)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'none',
                    border: 'none',
                    color: '#B4B9DC',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <span>{showBrandGuidelines ? 'Tutup Panduan' : 'Lihat Do’s & Don’ts'}</span>
                  {showBrandGuidelines ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>
              </div>
            </div>

            {/* Expanded Brand Guidelines (Do's & Don'ts from dataAkun.md) */}
            {showBrandGuidelines && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '12px',
                  paddingTop: '8px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  marginTop: '4px',
                }}
              >
                <div style={{ background: 'rgba(34, 160, 107, 0.12)', padding: '10px 12px', borderRadius: '6px', borderLeft: '3px solid #22A06B' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#34C77B', display: 'block', marginBottom: '4px' }}>
                    ✅ BRAND DO&apos;S ({activeBrandProfile.brandName})
                  </span>
                  <ul style={{ margin: 0, paddingLeft: '14px', fontSize: '11px', color: '#E8EAFF', lineHeight: 1.4 }}>
                    {activeBrandProfile.dos.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ background: 'rgba(239, 68, 68, 0.12)', padding: '10px 12px', borderRadius: '6px', borderLeft: '3px solid #EF4444' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#F87171', display: 'block', marginBottom: '4px' }}>
                    ❌ BRAND DON&apos;TS (Wajib Dihindari)
                  </span>
                  <ul style={{ margin: 0, paddingLeft: '14px', fontSize: '11px', color: '#E8EAFF', lineHeight: 1.4 }}>
                    {activeBrandProfile.donts.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* =========================================================================
          MAIN NAVIGATION SUB-TABS
          ========================================================================= */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '4px',
          overflowX: 'auto',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('builder')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            background: activeTab === 'builder' ? 'var(--primary-600)' : 'transparent',
            color: activeTab === 'builder' ? '#FFFFFF' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <FileText size={16} />
          <span>Editor Skrip & Pacing SOP</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('handbook')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            background: activeTab === 'handbook' ? 'var(--primary-600)' : 'transparent',
            color: activeTab === 'handbook' ? '#FFFFFF' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <BookOpen size={16} />
          <span>9 Klasifikasi Hook & SOP Handbook</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rubric')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            background: activeTab === 'rubric' ? 'var(--primary-600)' : 'transparent',
            color: activeTab === 'rubric' ? '#FFFFFF' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <ShieldCheck size={16} />
          <span>Rubrik Skor Hook & Anti-Pattern</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('kpi')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            background: activeTab === 'kpi' ? 'var(--primary-600)' : 'transparent',
            color: activeTab === 'kpi' ? '#FFFFFF' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <Target size={16} />
          <span>Target KPI & Diagnosis (BAB 4)</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: SCRIPT BUILDER WORKSPACE
          ========================================================================= */}
      {activeTab === 'builder' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '20px', alignItems: 'start' }}>
          {/* Main Content Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* View Mode Toolbar: Form / Table / Muted Preview */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '8px',
                padding: '10px 14px',
                border: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setEditorViewMode('form')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '5px',
                    border: 'none',
                    background: editorViewMode === 'form' ? 'var(--primary-50)' : 'transparent',
                    color: editorViewMode === 'form' ? 'var(--primary-600)' : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  <FileText size={14} />
                  <span>Formulir Editor 4-Bagian</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditorViewMode('table')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '5px',
                    border: 'none',
                    background: editorViewMode === 'table' ? 'var(--primary-50)' : 'transparent',
                    color: editorViewMode === 'table' ? 'var(--primary-600)' : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  <Table size={14} />
                  <span>Tabel Standar SOP (BAB 3.2)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditorViewMode('muted')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '5px',
                    border: 'none',
                    background: editorViewMode === 'muted' ? 'var(--primary-50)' : 'transparent',
                    color: editorViewMode === 'muted' ? 'var(--primary-600)' : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  <VolumeX size={14} />
                  <span>Simulasi Muted-First (BAB 3.4)</span>
                </button>
              </div>

              {/* Word Count & Duration Indicator in Toolbar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '12px',
                    background: pacingInfo.status === 'ideal' ? '#E6F7EE' : '#FFF4DC',
                    color: pacingInfo.status === 'ideal' ? '#22A06B' : '#F5A524',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Clock size={12} />
                  {pacingInfo.totalWords} kata (~{pacingInfo.estimatedSeconds} dtk)
                </span>
              </div>
            </div>

            {/* ===================================================================
                VIEW MODE 1: FORMULIR EDITOR 4-BAGIAN
                =================================================================== */}
            {editorViewMode === 'form' && (
              <>
                {/* Step 1: Content Brief & Sasaran Video */}
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary-600)', background: 'var(--primary-50)', padding: '2px 8px', borderRadius: '4px' }}>
                      LANGKAH 01
                    </span>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--navy-900)' }}>
                      Content Brief & Pilar Sasaran
                    </h3>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          Judul Konten / Topik Utama *
                        </label>
                        <span style={{ fontSize: '11px', color: 'var(--primary-600)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Sparkles size={11} /> Pilihan Ganda Judul:
                        </span>
                      </div>
                      <MultipleChoiceSelector
                        options={brandChoices.titles}
                        selectedValue={title}
                        onSelect={(val) => setTitle(val)}
                        layout="stack"
                      />
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Atau sesuaikan / ketik judul manual di sini..."
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid var(--border)',
                          fontSize: '13px',
                          outline: 'none',
                          marginTop: '4px',
                        }}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          Pilar Konten (SOP BAB 7)
                        </label>
                        <span style={{ fontSize: '11px', color: 'var(--primary-600)', fontWeight: 600 }}>
                          Pilih Pilar:
                        </span>
                      </div>
                      <MultipleChoiceSelector
                        options={activeBrandProfile?.pillars || ['Edukasi & Tips', 'Problem Solving', 'Social Proof', 'Promosi']}
                        selectedValue={pillar}
                        onSelect={(val) => setPillar(val)}
                        layout="pills"
                      />
                      <select
                        value={pillar}
                        onChange={(e) => setPillar(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '7px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--border)',
                          fontSize: '12px',
                          background: '#FFFFFF',
                          marginTop: '4px',
                        }}
                      >
                        {activeBrandProfile?.pillars.map((pil) => (
                          <option key={pil} value={pil}>
                            {pil}
                          </option>
                        )) || (
                          <>
                            <option value="Edukasi & Tips">Edukasi & Tips</option>
                            <option value="Problem Solving">Problem Solving</option>
                            <option value="Social Proof">Social Proof & Case Study</option>
                            <option value="Behind The Scenes">Behind The Scenes</option>
                            <option value="Promosi">Promosi & Penawaran</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '5px' }}>
                        Tujuan Konten (Wajib SATU Tujuan)
                      </label>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {(['awareness', 'engagement', 'conversion'] as const).map((obj) => (
                          <button
                            key={obj}
                            type="button"
                            onClick={() => setObjective(obj)}
                            style={{
                              flex: 1,
                              padding: '7px 4px',
                              borderRadius: '6px',
                              border: objective === obj ? '1.5px solid var(--primary-600)' : '1px solid var(--border)',
                              background: objective === obj ? 'var(--primary-50)' : '#FFFFFF',
                              color: objective === obj ? 'var(--primary-600)' : 'var(--text-secondary)',
                              fontSize: '11px',
                              fontWeight: 700,
                              textTransform: 'capitalize',
                              cursor: 'pointer',
                            }}
                          >
                            {obj}
                          </button>
                        ))}
                      </div>
                      <div style={{ marginTop: '8px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '2px' }}>
                          Target Durasi Video:
                        </label>
                        <MultipleChoiceSelector
                          options={STANDARD_DURATION_CHOICES}
                          selectedValue={targetDuration}
                          onSelect={(val) => setTargetDuration(val)}
                          layout="pills"
                        />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          Target Audiens Spesifik (Persona)
                        </label>
                        <span style={{ fontSize: '11px', color: 'var(--primary-600)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Sparkles size={11} /> Pilihan Persona:
                        </span>
                      </div>
                      <MultipleChoiceSelector
                        options={brandChoices.audiences}
                        selectedValue={targetAudience}
                        onSelect={(val) => setTargetAudience(val)}
                        layout="stack"
                      />
                      <input
                        type="text"
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        placeholder="Atau ketik persona spesifik di sini..."
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid var(--border)',
                          fontSize: '13px',
                          outline: 'none',
                          marginTop: '4px',
                        }}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          Keyword Utama (SEO Sosmed Triple Mention)
                        </label>
                        <span style={{ fontSize: '11px', color: 'var(--primary-600)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Sparkles size={11} /> Pilihan Keyword:
                        </span>
                      </div>
                      <MultipleChoiceSelector
                        options={brandChoices.keywords}
                        selectedValue={targetKeyword}
                        onSelect={(val) => setTargetKeyword(val)}
                        layout="pills"
                      />
                      <input
                        type="text"
                        value={targetKeyword}
                        onChange={(e) => setTargetKeyword(e.target.value)}
                        placeholder="Atau ketik keyword SEO manual..."
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid var(--border)',
                          fontSize: '13px',
                          outline: 'none',
                          marginTop: '4px',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Step 2: Hook Selection & Layered Hook (0-3 detik) */}
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#F59E3F', background: '#FFF4DC', padding: '2px 8px', borderRadius: '4px' }}>
                        LANGKAH 02
                      </span>
                      <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--navy-900)' }}>
                        Pilih Mekanisme Hook (SOP BAB 2)
                      </h3>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Tulis 5 opsi, pilih 1 terbaik + 2 cadangan
                    </span>
                  </div>

                  {/* Hook selector chips */}
                  <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '14px' }}>
                    {HOOK_CATEGORIES.map((hook) => (
                      <button
                        key={hook.id}
                        type="button"
                        onClick={() => setSelectedHookType(hook.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          border: selectedHookType === hook.id ? '1px solid var(--primary-600)' : '1px solid var(--border)',
                          background: selectedHookType === hook.id ? 'var(--primary-50)' : '#F7F8FC',
                          color: selectedHookType === hook.id ? 'var(--primary-600)' : 'var(--text-primary)',
                          fontSize: '12px',
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                          cursor: 'pointer',
                        }}
                      >
                        <span>{hook.emoji}</span>
                        <span>{hook.number}. {hook.title}</span>
                      </button>
                    ))}
                  </div>

                  {/* Active Hook Formula Banner */}
                  <div
                    style={{
                      background: '#F7F8FC',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      borderLeft: '4px solid var(--primary-600)',
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary-600)' }}>
                        Formula: {activeHookMeta.formula}
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        Tingkat Risiko: {activeHookMeta.riskBadge}
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 6px' }}>
                      {activeHookMeta.tagline} — {activeHookMeta.whenToUse}
                    </p>
                    <div style={{ fontSize: '11px', color: 'var(--navy-900)', background: '#FFFFFF', padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                      <strong>Contoh SOP:</strong> &ldquo;{activeHookMeta.examples[0]}&rdquo;
                    </div>
                  </div>

                  {/* Anti-Pattern Alert if Detected */}
                  {antiPatternResult.found && (
                    <div
                      style={{
                        background: '#FDECEC',
                        borderRadius: '6px',
                        padding: '10px 14px',
                        border: '1px solid #FCA5A5',
                        marginBottom: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <AlertTriangle size={16} color="#EF4444" />
                      <span style={{ fontSize: '12px', color: '#991B1B', fontWeight: 600 }}>
                        Peringatan Anti-Pattern (SOP BAB 2.8): Terdeteksi frasa terlarang &ldquo;{antiPatternResult.matches.join(', ')}&rdquo;. Hapus basa-basi dan langsung masuk ke poin utama!
                      </span>
                    </div>
                  )}

                  {/* Layered Hook Inputs (0-3 detik) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--navy-900)' }}>
                          1. Hook Utama (Audio / Lisan) *
                        </label>
                        <span style={{ fontSize: '11px', color: 'var(--primary-600)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Sparkles size={11} /> Pilihan Ganda Hook {activeHookMeta.title}:
                        </span>
                      </div>
                      <MultipleChoiceSelector
                        options={hookPrimaryChoices}
                        selectedValue={hookPrimary}
                        onSelect={(val) => setHookPrimary(val)}
                        layout="stack"
                      />
                      <input
                        type="text"
                        value={hookPrimary}
                        onChange={(e) => setHookPrimary(e.target.value)}
                        placeholder={`Atau sesuaikan formula ${activeHookMeta.formula}`}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid var(--border)',
                          fontSize: '13px',
                          outline: 'none',
                          marginTop: '4px',
                        }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                            Visual & Text on Screen (Muted-First)
                          </label>
                          <span style={{ fontSize: '10px', color: 'var(--primary-600)', fontWeight: 600 }}>
                            Pilihan Visual:
                          </span>
                        </div>
                        <MultipleChoiceSelector
                          options={HOOK_VISUAL_CHOICES}
                          selectedValue={hookVisualText}
                          onSelect={(val) => setHookVisualText(val)}
                          layout="stack"
                        />
                        <input
                          type="text"
                          value={hookVisualText}
                          onChange={(e) => setHookVisualText(e.target.value)}
                          placeholder="Atau tulis arahan visual manual..."
                          style={{
                            width: '100%',
                            padding: '7px 10px',
                            borderRadius: '6px',
                            border: '1px solid var(--border)',
                            fontSize: '12px',
                            outline: 'none',
                            marginTop: '4px',
                          }}
                        />
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                            Emosi Target & Intonasi
                          </label>
                          <span style={{ fontSize: '10px', color: 'var(--primary-600)', fontWeight: 600 }}>
                            Pilih Emosi:
                          </span>
                        </div>
                        <MultipleChoiceSelector
                          options={HOOK_EMOTION_CHOICES}
                          selectedValue={hookEmotion}
                          onSelect={(val) => setHookEmotion(val)}
                          layout="pills"
                        />
                        <input
                          type="text"
                          value={hookEmotion}
                          onChange={(e) => setHookEmotion(e.target.value)}
                          placeholder="Atau ketik emosi target manual..."
                          style={{
                            width: '100%',
                            padding: '7px 10px',
                            borderRadius: '6px',
                            border: '1px solid var(--border)',
                            fontSize: '12px',
                            outline: 'none',
                            marginTop: '4px',
                          }}
                        />
                      </div>
                    </div>

                    {/* Candidate Hooks for A/B Testing */}
                    <div style={{ background: '#F7F8FC', padding: '14px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '10px', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--navy-900)', textTransform: 'uppercase' }}>
                          Kandidat Hook Cadangan (A/B Testing - SOP BAB 1.1)
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Klik opsi untuk memilih cadangan</span>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                          Cadangan 1:
                        </label>
                        {hookPrimaryChoices.length > 1 && (
                          <MultipleChoiceSelector
                            options={hookPrimaryChoices.slice(1, 4)}
                            selectedValue={hookAlt1}
                            onSelect={(val) => setHookAlt1(val)}
                            layout="pills"
                          />
                        )}
                        <input
                          type="text"
                          value={hookAlt1}
                          onChange={(e) => setHookAlt1(e.target.value)}
                          placeholder="Kandidat Hook Cadangan 1 (Mekanisme berbeda)"
                          style={{
                            width: '100%',
                            padding: '6px 10px',
                            borderRadius: '4px',
                            border: '1px solid var(--border)',
                            fontSize: '12px',
                            background: '#FFFFFF',
                            outline: 'none',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '3px' }}>
                          Cadangan 2:
                        </label>
                        {hookPrimaryChoices.length > 2 && (
                          <MultipleChoiceSelector
                            options={hookPrimaryChoices.slice(2, 5)}
                            selectedValue={hookAlt2}
                            onSelect={(val) => setHookAlt2(val)}
                            layout="pills"
                          />
                        )}
                        <input
                          type="text"
                          value={hookAlt2}
                          onChange={(e) => setHookAlt2(e.target.value)}
                          placeholder="Kandidat Hook Cadangan 2"
                          style={{
                            width: '100%',
                            padding: '6px 10px',
                            borderRadius: '4px',
                            border: '1px solid var(--border)',
                            fontSize: '12px',
                            background: '#FFFFFF',
                            outline: 'none',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3: Beat 2, 3, 4 (Bridge, Body, CTA) */}
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '18px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary-600)', background: 'var(--primary-50)', padding: '2px 8px', borderRadius: '4px' }}>
                      LANGKAH 03
                    </span>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--navy-900)' }}>
                      Penulisan Bridge, Body & CTA (SOP BAB 3)
                    </h3>
                  </div>

                  {/* BEAT 2: BRIDGE (3-8 dtk) */}
                  <div style={{ borderLeft: '3px solid #3B6EF5', paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy-900)' }}>
                        2. BRIDGE | 3–8 detik (Jembatan Rasa Penasaran)
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tunda jawaban, tahan drop-off penonton</span>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                          Dialog / Audio Lisan (Bridge)
                        </label>
                        <span style={{ fontSize: '10px', color: 'var(--primary-600)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Sparkles size={10} /> Pilihan Ganda Bridge:
                        </span>
                      </div>
                      <MultipleChoiceSelector
                        options={brandChoices.bridgeAudios || []}
                        selectedValue={bridgeAudio}
                        onSelect={(val) => setBridgeAudio(val)}
                        layout="stack"
                      />
                      <textarea
                        rows={2}
                        value={bridgeAudio}
                        onChange={(e) => setBridgeAudio(e.target.value)}
                        placeholder='Atau ketik dialog bridge manual...'
                        style={{ width: '100%', padding: '8px 10px', fontSize: '12px', borderRadius: '4px', border: '1px solid var(--border)', resize: 'vertical', marginTop: '4px' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                          <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            Visual & Text on Screen
                          </label>
                          <span style={{ fontSize: '10px', color: 'var(--primary-600)', fontWeight: 600 }}>
                            Pilih Visual:
                          </span>
                        </div>
                        <MultipleChoiceSelector
                          options={BRIDGE_VISUAL_CHOICES}
                          selectedValue={bridgeVisualText}
                          onSelect={(val) => setBridgeVisualText(val)}
                          layout="stack"
                        />
                        <input
                          type="text"
                          value={bridgeVisualText}
                          onChange={(e) => setBridgeVisualText(e.target.value)}
                          style={{ width: '100%', padding: '6px 10px', fontSize: '12px', borderRadius: '4px', border: '1px solid var(--border)', marginTop: '4px' }}
                        />
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                          <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            Emosi Target
                          </label>
                          <span style={{ fontSize: '10px', color: 'var(--primary-600)', fontWeight: 600 }}>
                            Pilih Emosi:
                          </span>
                        </div>
                        <MultipleChoiceSelector
                          options={BRIDGE_EMOTION_CHOICES}
                          selectedValue={bridgeEmotion}
                          onSelect={(val) => setBridgeEmotion(val)}
                          layout="pills"
                        />
                        <input
                          type="text"
                          value={bridgeEmotion}
                          onChange={(e) => setBridgeEmotion(e.target.value)}
                          style={{ width: '100%', padding: '6px 10px', fontSize: '12px', borderRadius: '4px', border: '1px solid var(--border)', marginTop: '4px' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* BEAT 3: BODY (8-50 dtk) */}
                  <div style={{ borderLeft: '3px solid #8B5CF6', paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy-900)' }}>
                        3. BODY | 8–50 detik (Penyampaian Nilai Utama)
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Ganti visual tiap 2–4 dtk, lulus &apos;cut test&apos;</span>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                          Isi Skrip Lisan (Body - Poin 1, 2, 3)
                        </label>
                        <span style={{ fontSize: '10px', color: 'var(--primary-600)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Sparkles size={10} /> Pilihan Ganda Struktur Body:
                        </span>
                      </div>
                      <MultipleChoiceSelector
                        options={brandChoices.bodyAudios || []}
                        selectedValue={bodyAudio}
                        onSelect={(val) => setBodyAudio(val)}
                        layout="stack"
                      />
                      <textarea
                        rows={4}
                        value={bodyAudio}
                        onChange={(e) => setBodyAudio(e.target.value)}
                        placeholder="Atau tulis skrip body secara manual..."
                        style={{ width: '100%', padding: '8px 10px', fontSize: '12px', borderRadius: '4px', border: '1px solid var(--border)', resize: 'vertical', marginTop: '4px' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                          <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            Arahan Visual / B-Roll / Teks Poin
                          </label>
                          <span style={{ fontSize: '10px', color: 'var(--primary-600)', fontWeight: 600 }}>
                            Pilih Visual:
                          </span>
                        </div>
                        <MultipleChoiceSelector
                          options={BODY_VISUAL_CHOICES}
                          selectedValue={bodyVisualText}
                          onSelect={(val) => setBodyVisualText(val)}
                          layout="stack"
                        />
                        <input
                          type="text"
                          value={bodyVisualText}
                          onChange={(e) => setBodyVisualText(e.target.value)}
                          style={{ width: '100%', padding: '6px 10px', fontSize: '12px', borderRadius: '4px', border: '1px solid var(--border)', marginTop: '4px' }}
                        />
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                          <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            Emosi Target
                          </label>
                          <span style={{ fontSize: '10px', color: 'var(--primary-600)', fontWeight: 600 }}>
                            Pilih Emosi:
                          </span>
                        </div>
                        <MultipleChoiceSelector
                          options={BODY_EMOTION_CHOICES}
                          selectedValue={bodyEmotion}
                          onSelect={(val) => setBodyEmotion(val)}
                          layout="pills"
                        />
                        <input
                          type="text"
                          value={bodyEmotion}
                          onChange={(e) => setBodyEmotion(e.target.value)}
                          style={{ width: '100%', padding: '6px 10px', fontSize: '12px', borderRadius: '4px', border: '1px solid var(--border)', marginTop: '4px' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* BEAT 4: CTA & LOOP (50-60 dtk) */}
                  <div style={{ borderLeft: '3px solid #34C77B', paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy-900)' }}>
                        4. CTA & LOOP ENDING | 50–60 detik
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>1 Instruksi jelas + alasan + loop balik ke frame 1</span>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                          Kalimat CTA (Tujuan: {objective.toUpperCase()})
                        </label>
                        <span style={{ fontSize: '10px', color: 'var(--primary-600)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Sparkles size={10} /> Pilihan Ganda CTA ({objective}):
                        </span>
                      </div>
                      <MultipleChoiceSelector
                        options={ctaAudioChoices}
                        selectedValue={ctaAudio}
                        onSelect={(val) => setCtaAudio(val)}
                        layout="stack"
                      />
                      <textarea
                        rows={2}
                        value={ctaAudio}
                        onChange={(e) => setCtaAudio(e.target.value)}
                        placeholder='Atau ketik kalimat CTA manual...'
                        style={{ width: '100%', padding: '8px 10px', fontSize: '12px', borderRadius: '4px', border: '1px solid var(--border)', resize: 'vertical', marginTop: '4px' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                          <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            Visual & Loop Transition
                          </label>
                          <span style={{ fontSize: '10px', color: 'var(--primary-600)', fontWeight: 600 }}>
                            Pilih Visual:
                          </span>
                        </div>
                        <MultipleChoiceSelector
                          options={CTA_VISUAL_CHOICES}
                          selectedValue={ctaVisualText}
                          onSelect={(val) => setCtaVisualText(val)}
                          layout="stack"
                        />
                        <input
                          type="text"
                          value={ctaVisualText}
                          onChange={(e) => setCtaVisualText(e.target.value)}
                          style={{ width: '100%', padding: '6px 10px', fontSize: '12px', borderRadius: '4px', border: '1px solid var(--border)', marginTop: '4px' }}
                        />
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                          <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            Emosi Target
                          </label>
                          <span style={{ fontSize: '10px', color: 'var(--primary-600)', fontWeight: 600 }}>
                            Pilih Emosi:
                          </span>
                        </div>
                        <MultipleChoiceSelector
                          options={CTA_EMOTION_CHOICES}
                          selectedValue={ctaEmotion}
                          onSelect={(val) => setCtaEmotion(val)}
                          layout="pills"
                        />
                        <input
                          type="text"
                          value={ctaEmotion}
                          onChange={(e) => setCtaEmotion(e.target.value)}
                          style={{ width: '100%', padding: '6px 10px', fontSize: '12px', borderRadius: '4px', border: '1px solid var(--border)', marginTop: '4px' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Primary Actions: Copy, Download, & Save to Pipeline */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={handleCopyAiPrompt}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: copiedPrompt ? '#22A06B' : 'linear-gradient(135deg, #4338E8 0%, #6366F1 100%)',
                      color: '#FFFFFF',
                      padding: '10px 18px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(67, 56, 232, 0.3)',
                      transition: 'all 0.2s',
                    }}
                  >
                    {copiedPrompt ? <Check size={16} /> : <Sparkles size={16} />}
                    <span>{copiedPrompt ? 'Prompt AI Tersalin!' : 'Salin Master Prompt AI (SOP 7 Bagian)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyScript}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: copiedScript ? '#22A06B' : 'var(--navy-900)',
                      color: '#FFFFFF',
                      padding: '10px 18px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                  >
                    {copiedScript ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copiedScript ? 'Naskah Tersalin!' : 'Salin Format Skrip Lengkap'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadScript}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#FFFFFF',
                      color: 'var(--navy-900)',
                      border: '1px solid var(--border)',
                      padding: '10px 16px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <Download size={16} />
                    <span>Unduh TXT</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveToCalendar}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'var(--primary-600)',
                      color: '#FFFFFF',
                      padding: '10px 18px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <PlusCircle size={16} />
                    <span>Simpan ke Kalender & Pipeline Konten</span>
                  </button>

                  {saveSuccessMsg && (
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#22A06B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={15} />
                      {saveSuccessMsg}
                    </span>
                  )}
                </div>
              </>
            )}

            {/* ===================================================================
                VIEW MODE 2: TABEL STANDAR SOP (BAB 3.2)
                =================================================================== */}
            {editorViewMode === 'table' && (
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--navy-900)' }}>
                      Tabel Format Standar Skrip Video (BAB 3.2)
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                      Format resmi penyerahan naskah tim kreatif ke Creative Director dan tim produksi video.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyTable}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: copiedTable ? '#22A06B' : 'var(--navy-900)',
                      color: '#FFFFFF',
                      padding: '7px 14px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {copiedTable ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedTable ? 'Tabel Markdown Tersalin!' : 'Salin Tabel Markdown'}</span>
                  </button>
                </div>

                {/* The 5-Column SOP Table */}
                <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '6px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: '#F7F8FC', borderBottom: '1px solid var(--border)' }}>
                        <th style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--navy-900)', width: '15%' }}>Bagian</th>
                        <th style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--navy-900)', width: '12%' }}>Durasi</th>
                        <th style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--navy-900)', width: '30%' }}>Visual & Teks Layar</th>
                        <th style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--navy-900)', width: '30%' }}>Audio / Dialog / VO</th>
                        <th style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--navy-900)', width: '13%' }}>Emosi</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: '#F59E3F' }}>1. HOOK</td>
                        <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>0–3 dtk</td>
                        <td style={{ padding: '10px 12px', color: 'var(--text-primary)' }}>{hookVisualText || '-'}</td>
                        <td style={{ padding: '10px 12px', color: 'var(--navy-900)', fontWeight: 600 }}>&ldquo;{hookPrimary || '-'}&rdquo;</td>
                        <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{hookEmotion}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: '#3B6EF5' }}>2. BRIDGE</td>
                        <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>3–8 dtk</td>
                        <td style={{ padding: '10px 12px', color: 'var(--text-primary)' }}>{bridgeVisualText || '-'}</td>
                        <td style={{ padding: '10px 12px', color: 'var(--navy-900)' }}>&ldquo;{bridgeAudio || '-'}&rdquo;</td>
                        <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{bridgeEmotion}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: '#8B5CF6' }}>3. BODY</td>
                        <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>8–50 dtk</td>
                        <td style={{ padding: '10px 12px', color: 'var(--text-primary)' }}>{bodyVisualText || '-'}</td>
                        <td style={{ padding: '10px 12px', color: 'var(--navy-900)', whiteSpace: 'pre-line' }}>{bodyAudio || '-'}</td>
                        <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{bodyEmotion}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: '#34C77B' }}>4. CTA & LOOP</td>
                        <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>50–60 dtk</td>
                        <td style={{ padding: '10px 12px', color: 'var(--text-primary)' }}>{ctaVisualText || '-'}</td>
                        <td style={{ padding: '10px 12px', color: 'var(--navy-900)', fontWeight: 600 }}>&ldquo;{ctaAudio || '-'}&rdquo;</td>
                        <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{ctaEmotion}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ===================================================================
                VIEW MODE 3: SIMULASI MUTED-FIRST (BAB 3.4)
                =================================================================== */}
            {editorViewMode === 'muted' && (
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <VolumeX size={18} color="var(--primary-600)" />
                    <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--navy-900)' }}>
                      Simulasi Tampilan Tanpa Suara (Muted-First Preview)
                    </h3>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                    SOP BAB 3.4: ±80% audiens media sosial menonton video dalam kondisi mute. Pastikan visual dan teks layar di bawah ini mampu menyampaikan 100% inti pesan tanpa suara.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                  {/* Frame 1: Hook */}
                  <div style={{ border: '2px solid #F59E3F', borderRadius: '8px', padding: '14px', background: '#FFFDF9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#F59E3F' }}>FRAME 1: 0–3 DETIK</span>
                      <span style={{ fontSize: '10px', background: '#FFF4DC', color: '#D97706', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>HOOK</span>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy-900)', minHeight: '44px', marginBottom: '8px' }}>
                      {hookVisualText || '[Belum diisi: Tulis teks layar besar di safe zone]'}
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Emosi: {hookEmotion}
                    </span>
                  </div>

                  {/* Frame 2: Bridge */}
                  <div style={{ border: '2px solid #3B6EF5', borderRadius: '8px', padding: '14px', background: '#F8FAFF' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#3B6EF5' }}>FRAME 2: 3–8 DETIK</span>
                      <span style={{ fontSize: '10px', background: '#EBF2FE', color: '#2563EB', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>BRIDGE</span>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy-900)', minHeight: '44px', marginBottom: '8px' }}>
                      {bridgeVisualText || '[Belum diisi: Transisi visual & gerakan tangan]'}
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Emosi: {bridgeEmotion}
                    </span>
                  </div>

                  {/* Frame 3: Body */}
                  <div style={{ border: '2px solid #8B5CF6', borderRadius: '8px', padding: '14px', background: '#FAF8FF' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#8B5CF6' }}>FRAME 3: 8–50 DETIK</span>
                      <span style={{ fontSize: '10px', background: '#F3E8FF', color: '#7C3AED', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>BODY</span>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy-900)', minHeight: '44px', marginBottom: '8px' }}>
                      {bodyVisualText || '[Belum diisi: B-roll dan teks poin bertahap]'}
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Emosi: {bodyEmotion}
                    </span>
                  </div>

                  {/* Frame 4: CTA */}
                  <div style={{ border: '2px solid #34C77B', borderRadius: '8px', padding: '14px', background: '#F8FDF9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#34C77B' }}>FRAME 4: 50–60 DETIK</span>
                      <span style={{ fontSize: '10px', background: '#E6F7EE', color: '#22A06B', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>CTA & LOOP</span>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy-900)', minHeight: '44px', marginBottom: '8px' }}>
                      {ctaVisualText || '[Belum diisi: Animasi tombol CTA & loop ke awal]'}
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Emosi: {ctaEmotion}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ===================================================================
              RIGHT SIDEBAR: PACING, SEO & QC CHECKLIST (SOP BAB 3.3)
              =================================================================== */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Pacing & Duration Calculator Card */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                padding: '18px',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, margin: 0, color: 'var(--navy-900)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Activity size={15} color="var(--primary-600)" />
                  <span>Kalkulator Pacing (BAB 3.4)</span>
                </h4>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    background: pacingInfo.status === 'ideal' ? '#E6F7EE' : '#FFF4DC',
                    color: pacingInfo.badgeColor,
                  }}
                >
                  {pacingInfo.estimatedSeconds}s / {pacingInfo.totalWords} kata
                </span>
              </div>

              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '0 0 10px', lineHeight: 1.4 }}>
                SOP Sweet spot: <strong>15–35 detik</strong> (±75 kata ≈ 30 dtk dengan tempo 2.5 kata/detik).
              </p>

              {/* Pacing Status Bar */}
              <div style={{ width: '100%', height: '6px', background: '#ECEEF5', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
                <div
                  style={{
                    width: `${Math.min(100, (pacingInfo.estimatedSeconds / 50) * 100)}%`,
                    height: '100%',
                    background: pacingInfo.badgeColor,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 600, color: pacingInfo.badgeColor }}>
                Status: {pacingInfo.statusLabel}
              </span>
            </div>

            {/* Triple Mention SEO Sosmed Card (BAB 5.2) */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                padding: '18px',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, margin: 0, color: 'var(--navy-900)' }}>
                  SEO Sosmed Triple Mention
                </h4>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: seoCheck.isTripleMentionMet ? '#E6F7EE' : '#FFF4DC',
                    color: seoCheck.isTripleMentionMet ? '#22A06B' : '#F5A524',
                  }}
                >
                  {seoCheck.isTripleMentionMet ? '3/3 TERPENUHI' : 'BELUM LENGKAP'}
                </span>
              </div>

              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '0 0 10px', lineHeight: 1.4 }}>
                SOP BAB 5.2: Sebut keyword utama di 3 tempat sekaligus untuk memicu algoritma pencarian.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>1. Audio / Lisan:</span>
                  <span style={{ fontWeight: 700, color: seoCheck.inAudio ? '#22A06B' : '#EF4444' }}>
                    {seoCheck.inAudio ? '✅ Ada' : '❌ Belum'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>2. Teks Layar:</span>
                  <span style={{ fontWeight: 700, color: seoCheck.inScreen ? '#22A06B' : '#EF4444' }}>
                    {seoCheck.inScreen ? '✅ Ada' : '❌ Belum'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>3. CTA / Caption:</span>
                  <span style={{ fontWeight: 700, color: seoCheck.inCaption ? '#22A06B' : '#EF4444' }}>
                    {seoCheck.inCaption ? '✅ Ada' : '❌ Belum'}
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive QC Checklist (BAB 3.3) */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                padding: '18px',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, margin: 0, color: 'var(--navy-900)' }}>
                  Checklist QC Mandiri
                </h4>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    background: qcPercentage >= 80 ? '#E6F7EE' : '#FFF4DC',
                    color: qcPercentage >= 80 ? '#22A06B' : '#F5A524',
                  }}
                >
                  {qcPassedCount}/{qcTotal} ({qcPercentage}%)
                </span>
              </div>

              {/* Progress Bar */}
              <div style={{ width: '100%', height: '6px', background: '#ECEEF5', borderRadius: '3px', overflow: 'hidden', marginBottom: '10px' }}>
                <div
                  style={{
                    width: `${qcPercentage}%`,
                    height: '100%',
                    background: qcPercentage >= 80 ? '#22A06B' : 'var(--primary-600)',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <button
                  type="button"
                  onClick={handleCheckAllQc}
                  style={{ background: 'none', border: 'none', color: 'var(--primary-600)', fontSize: '11px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                >
                  Centang Semua
                </button>
                <button
                  type="button"
                  onClick={handleResetQc}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '11px', cursor: 'pointer', padding: 0 }}
                >
                  Reset
                </button>
              </div>

              {/* Checklist items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
                {QC_CHECKLIST.map((item) => (
                  <label
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      fontSize: '11px',
                      color: checkedQc[item.id] ? 'var(--text-muted)' : 'var(--text-primary)',
                      textDecoration: checkedQc[item.id] ? 'line-through' : 'none',
                      cursor: 'pointer',
                      padding: '3px 0',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={!!checkedQc[item.id]}
                      onChange={() => handleToggleQc(item.id)}
                      style={{ marginTop: '2px', accentColor: 'var(--primary-600)' }}
                    />
                    <span style={{ lineHeight: 1.35 }}>
                      <strong style={{ color: 'var(--primary-600)' }}>[{item.section}]</strong> {item.question}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: HOOK DIRECTORY & SOP HANDBOOK
          ========================================================================= */}
      {activeTab === 'handbook' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Search & Filter Hooks */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: 'var(--navy-900)' }}>
                Direktori 9 Jenis Hook & Formula (BAB 2)
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                Gunakan formula ini untuk merancang 5+ variasi hook dengan mekanisme berbeda sebelum memilih 1 terbaik.
              </p>
            </div>

            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={searchHookQuery}
                onChange={(e) => setSearchHookQuery(e.target.value)}
                placeholder="Cari jenis hook / formula..."
                style={{
                  width: '100%',
                  padding: '7px 10px 7px 32px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  fontSize: '12px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* 9 Hooks Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {filteredHooks.map((h) => (
              <div
                key={h.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px',
                  border: selectedHookType === h.id ? '2px solid var(--primary-600)' : '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>{h.emoji}</span>
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--primary-600)' }}>HOOK {h.number}</span>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: 'var(--navy-900)' }}>{h.title}</h4>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: h.riskLevel === 'Rendah' ? '#E6F7EE' : h.riskLevel === 'Medium' ? '#FFF4DC' : '#FDECEC',
                      color: h.riskLevel === 'Rendah' ? '#22A06B' : h.riskLevel === 'Medium' ? '#F5A524' : '#EF4444',
                    }}
                  >
                    {h.riskLevel}
                  </span>
                </div>

                <div style={{ background: '#F7F8FC', padding: '10px 12px', borderRadius: '6px', borderLeft: '3px solid var(--primary-600)' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '2px' }}>
                    Formula SOP
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--navy-900)' }}>
                    {h.formula}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Kapan Digunakan:
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>
                    {h.whenToUse}
                  </p>
                </div>

                <div style={{ background: '#FFFFFF', border: '1px dashed var(--border)', padding: '8px 10px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '2px' }}>
                    CONTOH SKRIP:
                  </div>
                  <div style={{ fontSize: '11px', fontStyle: 'italic', color: 'var(--navy-900)' }}>
                    &ldquo;{h.examples[0]}&rdquo;
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {h.bestPlatform.split('(')[0]}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedHookType(h.id);
                      setActiveTab('builder');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary-600)',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <span>Gunakan di Editor</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* SOP Chapters Overview */}
          <div style={{ marginTop: '12px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 14px', color: 'var(--navy-900)' }}>
              Ringkasan Standar Operasional Prosedur (BAB 1 – 11)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
              {SOP_CHAPTERS.map((chap) => (
                <div
                  key={chap.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '8px',
                    padding: '16px',
                    border: '1px solid var(--border)',
                  }}
                >
                  <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--primary-600)', background: 'var(--primary-50)', padding: '2px 6px', borderRadius: '4px' }}>
                    {chap.number}
                  </span>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '6px 0 6px', color: 'var(--navy-900)' }}>
                    {chap.title}
                  </h4>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '0 0 10px', lineHeight: 1.4 }}>
                    {chap.summary}
                  </p>
                  <ul style={{ margin: 0, paddingLeft: '14px', fontSize: '11px', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {chap.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: RUBRIC SCORING & ANTI-PATTERNS
          ========================================================================= */}
      {activeTab === 'rubric' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Left: Rubric Simulator */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary-600)' }}>SOP BAB 2.8</span>
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '2px 0 4px', color: 'var(--navy-900)' }}>
                Rubrik Skor Hook (Kandidat Evaluasi)
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                Tulis 5+ kandidat hook dari mekanisme berbeda, lalu nilai dengan rubrik 0–2.
              </p>
            </div>

            {/* Gatekeeper Alert */}
            <div
              style={{
                background: isRubricPass ? '#E6F7EE' : '#FFF4DC',
                borderRadius: '8px',
                padding: '12px 16px',
                border: isRubricPass ? '1px solid #22A06B' : '1px solid #F5A524',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: isRubricPass ? '#22A06B' : '#F5A524' }}>
                  {isRubricPass ? '✅ HOOK LOLOS GERBANG QC' : '⚠️ HOOK BELUM LOLOS QC'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {truthScore === 0 ? '⛔ Truth = 0 (Gugur otomatis: overpromise/clickbait palsu).' : pullScore === 0 ? '⛔ Pull = 0 (Gugur: audiens tidak butuh beat berikutnya).' : 'Skor minimal: 8/12 dengan Truth & Pull lolos.'}
                </div>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: isRubricPass ? '#22A06B' : '#F5A524' }}>
                {totalRubricScore}/12
              </div>
            </div>

            {/* Rubric Dimensions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {HOOK_RUBRIC_DIMENSIONS.map((dim) => (
                <div
                  key={dim.key}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    background: '#F7F8FC',
                    gap: '12px',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--navy-900)' }}>
                      {dim.label}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {dim.desc}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[0, 1, 2].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setRubricScores((prev) => ({ ...prev, [dim.key]: val }))}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '4px',
                          border: rubricScores[dim.key] === val ? '1px solid var(--primary-600)' : '1px solid var(--border)',
                          background: rubricScores[dim.key] === val ? 'var(--primary-600)' : '#FFFFFF',
                          color: rubricScores[dim.key] === val ? '#FFFFFF' : 'var(--text-primary)',
                          fontWeight: 700,
                          fontSize: '11px',
                          cursor: 'pointer',
                        }}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Anti-Patterns List */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#EF4444' }}>ANTI-PATTERNS (HAPUS SAAT TERLIHAT)</span>
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '2px 0 4px', color: 'var(--navy-900)' }}>
                Daftar Kesalahan Fatal Penulisan Hook
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                Jika menemukan pola ini pada skrip, langsung perbaiki sebelum diajukan ke Creative Director.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {ANTI_PATTERNS.map((ap, i) => (
                <div
                  key={i}
                  style={{
                    border: '1px solid #FDECEC',
                    background: '#FFFAFA',
                    borderRadius: '6px',
                    padding: '10px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#EF4444' }}>
                      ❌ {ap.pattern}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Hindari</span>
                  </div>
                  <div style={{ fontSize: '11px', fontStyle: 'italic', color: '#6B7085' }}>
                    Contoh: {ap.example}
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#22A06B', marginTop: '2px' }}>
                    ✅ Perbaikan: {ap.fix}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: TARGET KPI & DIAGNOSIS PERFORMA (BAB 4)
          ========================================================================= */}
      {activeTab === 'kpi' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top KPI Hierarchy Card */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 4px', color: 'var(--navy-900)' }}>
              Hierarki Metrik KPI Konten (BAB 4.1)
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 16px' }}>
              Sebelum video diproduksi, tetapkan 1 metrik primer utama sesuai tujuan konten.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              <div style={{ border: '1px solid #3B6EF5', borderRadius: '8px', padding: '14px', background: '#F8FAFF' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#3B6EF5', display: 'block', marginBottom: '6px' }}>
                  1. PRIMARY METRICS (Kualitas Inti)
                </span>
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: 'var(--navy-900)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li><strong>3-Second Hold Rate:</strong> &gt; Median akun</li>
                  <li><strong>Watch Through Rate (WTR):</strong> &gt; 40% (video pendek) / &gt; 25% (panjang)</li>
                  <li><strong>Rewatch / Replay Rate:</strong> Loop ending</li>
                  <li><strong>Engagement Rate:</strong> &gt; 5% (TikTok) / &gt; 3% (Reels)</li>
                </ul>
              </div>

              <div style={{ border: '1px solid #34C77B', borderRadius: '8px', padding: '14px', background: '#F8FDF9' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#22A06B', display: 'block', marginBottom: '6px' }}>
                  2. SECONDARY METRICS (Jangkauan & Nilai)
                </span>
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: 'var(--navy-900)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li><strong>Reach & Impression:</strong> 3x rata-rata akun</li>
                  <li><strong>Share / Send Rate:</strong> &gt; 2% views (konten bernilai tinggi)</li>
                  <li><strong>Save Rate:</strong> &gt; 3% views (edukasi & rujukan praktis)</li>
                </ul>
              </div>

              <div style={{ border: '1px solid #8B5CF6', borderRadius: '8px', padding: '14px', background: '#FAF8FF' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#8B5CF6', display: 'block', marginBottom: '6px' }}>
                  3. TERTIARY METRICS (Konversi Lanjutan)
                </span>
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: 'var(--navy-900)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li><strong>Profile Visit Rate:</strong> &gt; 1% total tayangan</li>
                  <li><strong>Link Click Rate (CTR):</strong> &gt; 1.5%</li>
                  <li><strong>Kualitas Komentar:</strong> &gt; 20 komentar organik berkualitas</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tabel Diagnosis Performa Konten (BAB 4.5) */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 6px', color: 'var(--navy-900)' }}>
              Tabel Diagnosis Masalah & Tindakan Solutif (BAB 4.5)
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 14px' }}>
              Jika konten tidak mencapai target KPI pasca-tayang 24 jam, cocokkan metrik drop dengan tindakan berikut:
            </p>

            <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: '6px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#F7F8FC', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--navy-900)' }}>Gejala Metrik</th>
                    <th style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--navy-900)' }}>Akar Masalah</th>
                    <th style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--navy-900)' }}>Tindakan Solusi Penulis</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#EF4444' }}>3-Sec Hold Rendah (&lt; 50%)</td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>Hook lemah, frame 1 hambar, ada sapaan basi</td>
                    <td style={{ padding: '10px 12px', color: '#22A06B', fontWeight: 600 }}>Tulis ulang hook dengan Specificity/Identity Callout, ganti visual frame pertama.</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#F5A524' }}>Hold Bagus, WTR Anjlok di Tengah</td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>Body bertele-tele, pacing lambat, overpromise</td>
                    <td style={{ padding: '10px 12px', color: '#22A06B', fontWeight: 600 }}>Terapkan cut test (potong kalimat mubazir), ganti visual tiap 2–4 dtk, tepati janji hook.</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#3B6EF5' }}>WTR Tinggi, Share/Save Rendah</td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>Menghibur tapi kurang nilai praktis untuk disimpan</td>
                    <td style={{ padding: '10px 12px', color: '#22A06B', fontWeight: 600 }}>Tambahkan practical step-by-step dan berikan alasan nyata pada CTA untuk simpan/share.</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#8B5CF6' }}>Views Tinggi, Konversi / DM Rendah</td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>CTA ambigu atau audiens terlalu luas</td>
                    <td style={{ padding: '10px 12px', color: '#22A06B', fontWeight: 600 }}>Gunakan SATU instruksi CTA tegas dengan trigger alasan yang relevan.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Aturan Keputusan 7 Hari */}
            <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
              <div style={{ background: '#E6F7EE', padding: '10px 12px', borderRadius: '6px', borderLeft: '3px solid #22A06B' }}>
                <strong style={{ color: '#22A06B', fontSize: '11px', display: 'block' }}>SCALE</strong>
                <span style={{ fontSize: '11px', color: 'var(--text-primary)' }}>Penuhi &gt; 2 metrik primer: jadikan acuan formula, alokasikan ke ads / clipper.</span>
              </div>
              <div style={{ background: '#FFF4DC', padding: '10px 12px', borderRadius: '6px', borderLeft: '3px solid #F5A524' }}>
                <strong style={{ color: '#F5A524', fontSize: '11px', display: 'block' }}>ITERATE</strong>
                <span style={{ fontSize: '11px', color: 'var(--text-primary)' }}>Mendekati target tapi 1 metrik drop: ubah 1 variabel (hook atau visual frame 1).</span>
              </div>
              <div style={{ background: '#FDECEC', padding: '10px 12px', borderRadius: '6px', borderLeft: '3px solid #EF4444' }}>
                <strong style={{ color: '#EF4444', fontSize: '11px', display: 'block' }}>ARSIP</strong>
                <span style={{ fontSize: '11px', color: 'var(--text-primary)' }}>Jauh di bawah target: catat di Bank Hook sebagai formula gagal, jangan diulang.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
