export interface TargetGroup {
  description: string;
  beneficiaryCount: number;
  needsAnalysis: string;
  demographics: string;
}

export interface Region {
  id: string;
  name: string;
  coverage: string;
}

export type ProjectStatus = 'draft' | 'reviewing' | 'approved' | 'published';

export interface Project {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  targetGroup: TargetGroup;
  regions: Region[];
  createdAt: string;
  updatedAt: string;
  coverImage?: string;
}

export type MaterialType = 'image' | 'case' | 'receipt' | 'achievement';

export interface Material {
  id: string;
  type: MaterialType;
  title: string;
  description: string;
  url: string;
  uploadTime: string;
  isCover?: boolean;
}

export type CopywritingType = 'intro' | 'reason' | 'update' | 'thanks';

export interface Copywriting {
  id: string;
  type: CopywritingType;
  content: string;
  version: number;
  createdAt: string;
  createdBy: string;
}

export interface BudgetItem {
  id: string;
  category: string;
  item: string;
  amount: number;
  percentage: number;
  description: string;
}

export interface BudgetMatching {
  source: string;
  ratio: string;
  description: string;
  amount: number;
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  avatar?: string;
  position?: {
    section: string;
    offset: number;
  };
  createdAt: string;
  replies: Comment[];
  isResolved?: boolean;
}

export type VersionStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

export interface ProjectVersion {
  id: string;
  version: number;
  description: string;
  createdAt: string;
  createdBy: string;
  status: VersionStatus;
  reviewComments?: string;
}

export interface VisitRecord {
  id: string;
  date: string;
  visitor: string;
  content: string;
  beneficiaryName: string;
  feedback: string;
  images: string[];
}

export interface ReviewItem {
  id: string;
  title: string;
  category: 'success' | 'problem' | 'improvement';
  description: string;
  isCompleted: boolean;
}

export interface ResultData {
  views: number;
  donations: number;
  amount: number;
  shares: number;
  dailyData: { date: string; views: number; donations: number; amount: number }[];
  visitRecords: VisitRecord[];
  reviewItems: ReviewItem[];
}

export interface ComplianceIssue {
  id: string;
  type: 'sensitive' | 'number' | 'material';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  suggestion: string;
  position?: string;
  isResolved: boolean;
}

export interface PlatformConfig {
  id: string;
  name: string;
  icon: string;
  maxTitleLength: number;
  maxContentLength: number;
  coverRatio: string;
}

export type TabKey = 'project' | 'materials' | 'copywriting' | 'compliance' | 'budget' | 'collaboration' | 'publish' | 'results';
