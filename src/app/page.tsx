'use client';

import React, { useState, useEffect } from 'react';
import { Columns3, CalendarDays, Sparkles, CheckCircle2 } from 'lucide-react';
import { WindowHeader } from '@/components/WindowHeader';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { BrandHeader } from '@/components/BrandHeader';
import { ContentKanbanBoard } from '@/components/ContentKanbanBoard';
import { ContentCalendarMonthView } from '@/components/ContentCalendarMonthView';
import { CsvImportModal } from '@/components/CsvImportModal';
import { ContentDetailModal } from '@/components/ContentDetailModal';
import { CreateContentModal } from '@/components/CreateContentModal';
import { ClientProgressOverview } from '@/components/ClientProgressOverview';
import { ClientModal } from '@/components/ClientModal';
import {
  initialBrands,
  initialContentCards,
} from '@/data/mockAgencyData';
import { BrandProfile, ContentCardItem, ContentStatus } from '@/types/dashboard';
import {
  fetchBrandsFromSupabase,
  upsertBrandToSupabase,
  deleteBrandFromSupabase,
  fetchCardsFromSupabase,
  upsertCardToSupabase,
  deleteCardFromSupabase,
} from '@/lib/supabaseService';
import { isSupabaseConfigured } from '@/lib/supabaseClient';

const STORAGE_KEY = 'unipic_agency_content_cards_v1';
const BRANDS_STORAGE_KEY = 'unipic_agency_brands_v1';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Agency Specific State
  const [brands, setBrands] = useState<BrandProfile[]>(initialBrands);
  const [selectedBrandId, setSelectedBrandId] = useState<string>('');
  const [allCards, setAllCards] = useState<ContentCardItem[]>(initialContentCards);
  const [activeViewMode, setActiveViewMode] = useState<'calendar' | 'kanban'>('calendar');

  // Modals Content State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createInitialStatus, setCreateInitialStatus] = useState<ContentStatus>('ide');
  const [selectedCardForDetail, setSelectedCardForDetail] = useState<ContentCardItem | null>(null);

  // Modals Client State (CRUD Client)
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [brandToEdit, setBrandToEdit] = useState<BrandProfile | null>(null);

  // Load from Supabase (Cloud) with fallback to localStorage
  useEffect(() => {
    const initData = async () => {
      // 1. Jika Supabase dikonfigurasi, coba ambil data cloud
      if (isSupabaseConfigured()) {
        const [cloudBrands, cloudCards] = await Promise.all([
          fetchBrandsFromSupabase(),
          fetchCardsFromSupabase(),
        ]);

        if (cloudBrands !== null) {
          setBrands(cloudBrands);
          if (cloudBrands.length > 0) {
            setSelectedBrandId((prev) => prev || cloudBrands[0].id);
          } else {
            setSelectedBrandId('');
          }
          try {
            localStorage.setItem(BRANDS_STORAGE_KEY, JSON.stringify(cloudBrands));
          } catch (e) {}
        }

        if (cloudCards !== null) {
          setAllCards(cloudCards);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudCards));
          } catch (e) {}
        }
        return;
      }

      // 2. Mode Offline / LocalStorage Fallback
      try {
        const savedCards = localStorage.getItem(STORAGE_KEY);
        if (savedCards) {
          const parsed = JSON.parse(savedCards);
          if (Array.isArray(parsed)) {
            setAllCards(parsed);
          }
        }

        const savedBrands = localStorage.getItem(BRANDS_STORAGE_KEY);
        if (savedBrands) {
          const parsedB = JSON.parse(savedBrands);
          if (Array.isArray(parsedB)) {
            setBrands(parsedB);
            if (parsedB.length > 0) {
              setSelectedBrandId((prev) => prev || parsedB[0].id);
            }
          }
        }
      } catch (e) {
        console.warn('Could not read from localStorage', e);
      }
    };

    initData();
  }, []);

  // Save Cards to state, localStorage, and Supabase
  const saveCardsAndSync = (newCards: ContentCardItem[]) => {
    setAllCards(newCards);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCards));
    } catch (e) {
      console.warn('Could not write cards to localStorage', e);
    }
  };

  // Save Brands to state, localStorage, and Supabase
  const saveBrandsAndSync = (newBrands: BrandProfile[]) => {
    setBrands(newBrands);
    try {
      localStorage.setItem(BRANDS_STORAGE_KEY, JSON.stringify(newBrands));
    } catch (e) {
      console.warn('Could not write brands to localStorage', e);
    }
  };

  const defaultEmptyBrand: BrandProfile = {
    id: '',
    name: 'Belum Ada Klien',
    code: '---',
    category: 'Belum ada klien terdaftar',
    socialUrl: '',
    references: '',
    mandatoryHashtags: [],
    quota: {
      totalTarget: 0,
      videoTarget: 0,
      graphicTarget: 0,
    },
  };

  const currentBrand =
    (selectedBrandId ? brands.find((b) => b.id === selectedBrandId) : null) ||
    brands[0] ||
    defaultEmptyBrand;

  // Cards for current active brand
  const brandCards = currentBrand.id ? allCards.filter((c) => c.brandId === currentBrand.id) : [];

  // Quota metrics calculation
  const totalCards = brandCards.length;
  const publishedCount = brandCards.filter((c) => c.status === 'published').length;
  const videoCount = brandCards.filter((c) =>
    c.format.toLowerCase().includes('video')
  ).length;
  const graphicCount = brandCards.filter(
    (c) =>
      c.format.toLowerCase().includes('foto') ||
      c.format.toLowerCase().includes('grafis')
  ).length;

  // =========================================================================
  // CRUD HANDLERS: CLIENT / BRAND
  // =========================================================================

  const openCreateClientModal = () => {
    setBrandToEdit(null);
    setIsClientModalOpen(true);
  };

  const openEditClientModal = (brand: BrandProfile) => {
    setBrandToEdit(brand);
    setIsClientModalOpen(true);
  };

  const handleSaveBrand = (savedBrand: BrandProfile) => {
    const existingIndex = brands.findIndex((b) => b.id === savedBrand.id);
    let updatedList: BrandProfile[];

    if (existingIndex >= 0) {
      updatedList = brands.map((b) => (b.id === savedBrand.id ? savedBrand : b));
    } else {
      updatedList = [...brands, savedBrand];
      setSelectedBrandId(savedBrand.id);
    }

    saveBrandsAndSync(updatedList);
    // Sync ke Supabase secara asinkron
    upsertBrandToSupabase(savedBrand);
  };

  const handleDeleteBrand = (brandId: string) => {
    const updatedBrands = brands.filter((b) => b.id !== brandId);
    saveBrandsAndSync(updatedBrands);

    const updatedCards = allCards.filter((c) => c.brandId !== brandId);
    saveCardsAndSync(updatedCards);

    if (selectedBrandId === brandId && updatedBrands.length > 0) {
      setSelectedBrandId(updatedBrands[0].id);
    }

    // Sync hapus ke Supabase
    deleteBrandFromSupabase(brandId);
  };

  // =========================================================================
  // CRUD HANDLERS: CONTENT CARDS
  // =========================================================================

  const handleCreateCard = (newCard: ContentCardItem) => {
    saveCardsAndSync([newCard, ...allCards]);
    upsertCardToSupabase(newCard);
  };

  const handleUpdateCard = (updatedCard: ContentCardItem) => {
    const updatedList = allCards.map((c) =>
      c.id === updatedCard.id ? updatedCard : c
    );
    saveCardsAndSync(updatedList);
    setSelectedCardForDetail(updatedCard);
    upsertCardToSupabase(updatedCard);
  };

  const handleUpdateCardStatus = (cardId: string, newStatus: ContentStatus) => {
    const targetCard = allCards.find((c) => c.id === cardId);
    const updatedList = allCards.map((card) =>
      card.id === cardId ? { ...card, status: newStatus } : card
    );
    saveCardsAndSync(updatedList);

    if (targetCard) {
      upsertCardToSupabase({ ...targetCard, status: newStatus });
    }
  };

  const handleDeleteCard = (cardId: string) => {
    const updatedList = allCards.filter((c) => c.id !== cardId);
    saveCardsAndSync(updatedList);
    setSelectedCardForDetail(null);
    deleteCardFromSupabase(cardId);
  };

  const handleResetDefaultData = async () => {
    if (confirm('Bersihkan semua data agar aplikasi fresh dan kosong?')) {
      saveCardsAndSync([]);
      saveBrandsAndSync([]);
      setSelectedBrandId('');

      if (isSupabaseConfigured()) {
        try {
          const { supabase } = await import('@/lib/supabaseClient');
          if (supabase) {
            await supabase.from('content_cards').delete().neq('id', '');
            await supabase.from('brands').delete().neq('id', '');
          }
        } catch (e) {
          console.warn('Gagal membersihkan database:', e);
        }
      }
    }
  };

  const handleImportSuccess = (imported: ContentCardItem[]) => {
    saveCardsAndSync([...imported, ...allCards]);
    // Sync batch ke Supabase
    if (isSupabaseConfigured()) {
      imported.forEach((card) => upsertCardToSupabase(card));
    }
  };

  const openImportModal = () => {
    if (!currentBrand.id) {
      alert('Silakan tambahkan Klien terlebih dahulu sebelum mengimpor CSV.');
      openCreateClientModal();
      return;
    }
    setIsImportModalOpen(true);
  };

  const openCreateModal = (initialStatus: ContentStatus = 'ide') => {
    if (!currentBrand.id) {
      alert('Silakan tambahkan Klien terlebih dahulu sebelum membuat kartu konten.');
      openCreateClientModal();
      return;
    }
    setCreateInitialStatus(initialStatus);
    setIsCreateModalOpen(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  const getPageTitle = () => {
    switch (activeMenu) {
      case 'calendar':
        return `Konten Kalender · ${currentBrand.name}`;
      case 'kanban':
        return `Pipeline Produksi (Drag & Drop) · ${currentBrand.name}`;
      case 'scripts':
        return 'Skrip Builder (Coming Soon)';
      case 'captions':
        return 'Caption Builder (Coming Soon)';
      case 'reports':
        return 'Report Performa Klien (Coming Soon)';
      default:
        return 'Dashboard Overview · Unipic Lab';
    }
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <div
        className={`sidebar-backdrop ${sidebarOpen ? 'active' : ''}`}
        id="sidebarBackdrop"
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Client Brand Modal (C, U, D in CRUD Client) */}
      <ClientModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        brandToEdit={brandToEdit}
        onSaveBrand={handleSaveBrand}
        onDeleteBrand={handleDeleteBrand}
      />

      {/* CSV Import Modal */}
      <CsvImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        brandId={currentBrand.id}
        onImportSuccess={handleImportSuccess}
      />

      {/* Create Content Modal (C in CRUD Content) */}
      <CreateContentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        brandId={currentBrand.id}
        initialStatus={createInitialStatus}
        onCreateCard={handleCreateCard}
      />

      {/* Content Detail Modal (R, U, D in CRUD Content) */}
      <ContentDetailModal
        card={selectedCardForDetail}
        isOpen={!!selectedCardForDetail}
        onClose={() => setSelectedCardForDetail(null)}
        onSaveCard={handleUpdateCard}
        onDeleteCard={handleDeleteCard}
      />

      <div className="window-container">
        {/* Window Bar Header */}
        <WindowHeader />

        {/* Layout Grid Shell */}
        <div className="app-shell">
          {/* Sidebar Navigation */}
          <Sidebar
            isOpen={sidebarOpen}
            activeMenu={activeMenu}
            onSelectMenu={(menu) => {
              setActiveMenu(menu);
              if (menu === 'calendar') {
                setActiveViewMode('calendar');
              } else if (menu === 'kanban') {
                setActiveViewMode('kanban');
              }
            }}
            onClose={() => setSidebarOpen(false)}
          />

          {/* Main Dashboard Area */}
          <div className="main-wrapper">
            <Topbar
              title={getPageTitle()}
              searchQuery={searchQuery}
              onSearchChange={(q) => setSearchQuery(q)}
              onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
            />

            <main className="content-area">
              {/* ========================================================
                  TAB 1: KONTEN KALENDER & PIPELINE PRODUKSI
                  ======================================================== */}
              {(activeMenu === 'calendar' || activeMenu === 'kanban') && (
                <>
                  {/* Brand Profile & Deliverables Quota Banner */}
                  <BrandHeader
                    currentBrand={currentBrand}
                    brands={brands.filter((b) => b.id !== 'brand-kosong')}
                    onSelectBrand={(id) => setSelectedBrandId(id)}
                    onOpenImportModal={openImportModal}
                    onAddNewCard={() => openCreateModal('ide')}
                    onAddNewBrand={openCreateClientModal}
                    onEditBrand={() => {
                      if (currentBrand.id) {
                        openEditClientModal(currentBrand);
                      } else {
                        openCreateClientModal();
                      }
                    }}
                    onResetDefault={handleResetDefaultData}
                    totalCards={totalCards}
                    publishedCount={publishedCount}
                    videoCount={videoCount}
                    graphicCount={graphicCount}
                  />

                  {/* View Mode Switcher: Kalender Bulanan vs Pipeline Drag & Drop */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px',
                      marginTop: '4px',
                    }}
                  >
                    <div className="view-mode-tabs">
                      <button
                        type="button"
                        className={`tab-mode-btn ${activeViewMode === 'calendar' ? 'active' : ''}`}
                        onClick={() => setActiveViewMode('calendar')}
                      >
                        <CalendarDays size={14} />
                        <span>Kalender Bulanan (November 2026)</span>
                      </button>
                      <button
                        type="button"
                        className={`tab-mode-btn ${activeViewMode === 'kanban' ? 'active' : ''}`}
                        onClick={() => setActiveViewMode('kanban')}
                      >
                        <Columns3 size={14} />
                        <span>Pipeline Progres (Drag & Drop)</span>
                      </button>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '11px',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <Sparkles size={13} color="var(--primary-600)" />
                      <span>
                        {activeViewMode === 'calendar'
                          ? 'Klik kartu konten di kalender untuk melihat caption & link deliverable.'
                          : 'Tarik dan geser kartu konten untuk mengubah progres status tim.'}
                      </span>
                    </div>
                  </div>

                  {/* Render Calendar Month View or Kanban Pipeline */}
                  {activeViewMode === 'calendar' ? (
                    <ContentCalendarMonthView
                      cards={brandCards}
                      brandName={currentBrand.name}
                      onCardClick={(card) => setSelectedCardForDetail(card)}
                    />
                  ) : (
                    <ContentKanbanBoard
                      cards={brandCards}
                      onUpdateCardStatus={handleUpdateCardStatus}
                      onCardClick={(card) => setSelectedCardForDetail(card)}
                      onAddNewCard={(status) => openCreateModal(status)}
                      searchQuery={searchQuery}
                    />
                  )}
                </>
              )}

              {/* ========================================================
                  TAB 2: EXECUTIVE DASHBOARD OVERVIEW (COMMAND CENTER)
                  ======================================================== */}
              {activeMenu === 'dashboard' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Agency Lintas-Client Progress Overview with Segmented Bars & Client CRUD */}
                  <ClientProgressOverview
                    brands={brands}
                    allCards={allCards}
                    onSelectBrandAndOpenCalendar={(brandId) => {
                      setSelectedBrandId(brandId);
                      setActiveMenu('calendar');
                      setActiveViewMode('calendar');
                    }}
                    onAddNewBrand={openCreateClientModal}
                    onEditBrand={openEditClientModal}
                  />
                </div>
              )}

              {/* ========================================================
                  TAB 3: COMING SOON MODULES
                  ======================================================== */}
              {(activeMenu === 'scripts' || activeMenu === 'captions' || activeMenu === 'reports') && (
                <div
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '48px 24px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'var(--primary-50)',
                      color: 'var(--primary-600)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy-900)' }}>
                    Modul {activeMenu === 'scripts' ? 'Skrip Builder' : activeMenu === 'captions' ? 'Caption Builder' : 'Report Klien'} (Coming Soon)
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '420px', lineHeight: 1.5 }}>
                    Fitur ini sedang dalam antrean rilis untuk automasi penulisan skrip video, penyusunan caption berbasis pilar, dan analitik laporan klien.
                  </p>
                  <button
                    type="button"
                    className="btn-brand-action btn-primary-action"
                    onClick={() => setActiveMenu('calendar')}
                    style={{ marginTop: '6px' }}
                  >
                    Kembali ke Konten Kalender
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
