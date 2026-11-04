import { supabase, isSupabaseConfigured } from './supabaseClient';
import { BrandProfile, ContentCardItem, ContentFormat, ContentStatus } from '@/types/dashboard';

// ============================================================================
// BRANDS REPOSITORY
// ============================================================================

export const fetchBrandsFromSupabase = async (): Promise<BrandProfile[] | null> => {
  if (!isSupabaseConfigured() || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data) {
      console.warn('Supabase fetch brands error:', error);
      return null;
    }

    return data.map((b: any): BrandProfile => ({
      id: b.id,
      name: b.name,
      code: b.code,
      category: b.category || '',
      socialUrl: b.social_url || '',
      references: b.references_text || '',
      mandatoryHashtags: b.mandatory_hashtags || [],
      quota: {
        totalTarget: b.quota_total || 15,
        videoTarget: b.quota_video || 10,
        graphicTarget: b.quota_graphic || 5,
      },
    }));
  } catch (err) {
    console.warn('Supabase fetch brands exception:', err);
    return null;
  }
};

export const upsertBrandToSupabase = async (brand: BrandProfile): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) return false;

  try {
    const row = {
      id: brand.id,
      name: brand.name,
      code: brand.code,
      category: brand.category,
      social_url: brand.socialUrl,
      references_text: brand.references,
      mandatory_hashtags: brand.mandatoryHashtags,
      quota_total: brand.quota.totalTarget,
      quota_video: brand.quota.videoTarget,
      quota_graphic: brand.quota.graphicTarget,
    };

    const { error } = await supabase.from('brands').upsert(row);
    if (error) {
      console.warn('Supabase upsert brand error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase upsert brand exception:', err);
    return false;
  }
};

export const deleteBrandFromSupabase = async (brandId: string): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) return false;

  try {
    const { error } = await supabase.from('brands').delete().eq('id', brandId);
    if (error) {
      console.warn('Supabase delete brand error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase delete brand exception:', err);
    return false;
  }
};

// ============================================================================
// CONTENT CARDS REPOSITORY
// ============================================================================

export const fetchCardsFromSupabase = async (): Promise<ContentCardItem[] | null> => {
  if (!isSupabaseConfigured() || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from('content_cards')
      .select('*')
      .order('due_date', { ascending: true });

    if (error || !data) {
      console.warn('Supabase fetch cards error:', error);
      return null;
    }

    return data.map((c: any): ContentCardItem => ({
      id: c.id,
      brandId: c.brand_id,
      title: c.title,
      week: c.week || 'Week 1',
      format: (c.format as ContentFormat) || 'Video',
      platform: c.platform || 'IG Reels & TikTok',
      pillar: c.pillar || 'Edukasi',
      caption: c.caption || '',
      captionSnippet: c.caption_snippet || (c.caption ? c.caption.slice(0, 100) + '...' : ''),
      notes: c.notes || '',
      status: (c.status as ContentStatus) || 'ide',
      dueDate: c.due_date,
      assignee: {
        name: c.assignee_name || 'Internal Team',
        role: c.assignee_role || 'Creator',
        avatarBg: c.assignee_avatar_bg || '#4338E8',
      },
      linkRef: c.link_ref || '',
      linkAsset: c.link_asset || '',
      linkHasil: c.link_hasil || '',
    }));
  } catch (err) {
    console.warn('Supabase fetch cards exception:', err);
    return null;
  }
};

export const upsertCardToSupabase = async (card: ContentCardItem): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) return false;

  try {
    const row = {
      id: card.id,
      brand_id: card.brandId,
      title: card.title,
      week: card.week,
      format: card.format,
      platform: card.platform,
      pillar: card.pillar,
      caption: card.caption || '',
      caption_snippet: card.captionSnippet || '',
      notes: card.notes || '',
      status: card.status,
      due_date: card.dueDate,
      assignee_name: card.assignee?.name || 'Internal Team',
      assignee_role: card.assignee?.role || 'Creator',
      assignee_avatar_bg: card.assignee?.avatarBg || '#4338E8',
      link_ref: card.linkRef || '',
      link_asset: card.linkAsset || '',
      link_hasil: card.linkHasil || '',
    };

    const { error } = await supabase.from('content_cards').upsert(row);
    if (error) {
      console.warn('Supabase upsert card error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase upsert card exception:', err);
    return false;
  }
};

export const deleteCardFromSupabase = async (cardId: string): Promise<boolean> => {
  if (!isSupabaseConfigured() || !supabase) return false;

  try {
    const { error } = await supabase.from('content_cards').delete().eq('id', cardId);
    if (error) {
      console.warn('Supabase delete card error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase delete card exception:', err);
    return false;
  }
};

