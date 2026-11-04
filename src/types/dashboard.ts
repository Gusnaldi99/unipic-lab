export type ContentStatus =
  | 'ide'
  | 'copywriting'
  | 'production'
  | 'review'
  | 'ready'
  | 'published';

export type ContentFormat = 'Video' | 'Foto + Grafis' | 'Carousel' | 'Story';

export interface Assignee {
  name: string;
  role: string;
  avatarBg: string;
}

export interface TeamMember {
  id?: string;
  name: string;
  role: string;
  avatarBg?: string;
  email?: string;
}

export interface ContentCardItem {
  id: string;
  brandId: string;
  title: string;
  week: string;
  format: ContentFormat;
  platform: string;
  pillar: string;
  captionSnippet?: string;
  caption?: string;
  notes?: string;
  status: ContentStatus;
  dueDate: string;
  assignee: Assignee;
  linkRef?: string;
  linkAsset?: string;
  linkHasil?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface BrandProfile {
  id: string;
  name: string;
  code: string;
  category: string;
  socialUrl: string;
  references: string;
  mandatoryHashtags: string[];
  quota: {
    totalTarget: number;
    videoTarget: number;
    graphicTarget: number;
  };
}
