import { create } from 'zustand';
import type {
  Project,
  Material,
  Copywriting,
  BudgetItem,
  Comment,
  ProjectVersion,
  ResultData,
  ComplianceIssue,
  TargetGroup,
  Region,
} from '../types';
import {
  mockProjects,
  mockMaterials,
  mockCopywritings,
  mockBudgetItems,
  mockComments,
  mockVersions,
  mockResultData,
  mockComplianceIssues,
} from '../data/mockData';

interface ProjectStore {
  projects: Project[];
  currentProjectId: string | null;
  materials: Material[];
  copywritings: Copywriting[];
  budgetItems: BudgetItem[];
  comments: Comment[];
  versions: ProjectVersion[];
  resultData: ResultData;
  complianceIssues: ComplianceIssue[];

  setCurrentProject: (id: string) => void;
  getCurrentProject: () => Project | undefined;

  updateProject: (id: string, data: Partial<Project>) => void;
  updateTargetGroup: (data: TargetGroup) => void;
  updateRegions: (regions: Region[]) => void;

  addMaterial: (material: Material) => void;
  deleteMaterial: (id: string) => void;

  updateCopywriting: (type: string, content: string) => void;

  addComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'replies'>) => void;
  resolveComment: (id: string) => void;

  resolveComplianceIssue: (id: string) => void;

  submitForReview: () => void;
  approveVersion: (versionId: string) => void;
  rejectVersion: (versionId: string, comment: string) => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: mockProjects,
  currentProjectId: '1',
  materials: mockMaterials,
  copywritings: mockCopywritings,
  budgetItems: mockBudgetItems,
  comments: mockComments,
  versions: mockVersions,
  resultData: mockResultData,
  complianceIssues: mockComplianceIssues,

  setCurrentProject: (id) => set({ currentProjectId: id }),

  getCurrentProject: () => {
    const { projects, currentProjectId } = get();
    return projects.find((p) => p.id === currentProjectId);
  },

  updateProject: (id, data) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
      ),
    })),

  updateTargetGroup: (data) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === state.currentProjectId
          ? { ...p, targetGroup: data, updatedAt: new Date().toISOString() }
          : p
      ),
    })),

  updateRegions: (regions) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === state.currentProjectId
          ? { ...p, regions, updatedAt: new Date().toISOString() }
          : p
      ),
    })),

  addMaterial: (material) =>
    set((state) => ({
      materials: [...state.materials, material],
    })),

  deleteMaterial: (id) =>
    set((state) => ({
      materials: state.materials.filter((m) => m.id !== id),
    })),

  updateCopywriting: (type, content) =>
    set((state) => {
      const existing = state.copywritings.find((c) => c.type === type);
      if (existing) {
        return {
          copywritings: state.copywritings.map((c) =>
            c.type === type
              ? { ...c, content, version: c.version + 1, createdAt: new Date().toISOString() }
              : c
          ),
        };
      }
      return {
        copywritings: [
          ...state.copywritings,
          {
            id: `c${Date.now()}`,
            type: type as Copywriting['type'],
            content,
            version: 1,
            createdAt: new Date().toISOString(),
            createdBy: '当前用户',
          },
        ],
      };
    }),

  addComment: (comment) =>
    set((state) => ({
      comments: [
        ...state.comments,
        {
          ...comment,
          id: `cm${Date.now()}`,
          createdAt: new Date().toLocaleString('zh-CN'),
          replies: [],
          isResolved: false,
        },
      ],
    })),

  resolveComment: (id) =>
    set((state) => ({
      comments: state.comments.map((c) =>
        c.id === id ? { ...c, isResolved: true } : c
      ),
    })),

  resolveComplianceIssue: (id) =>
    set((state) => ({
      complianceIssues: state.complianceIssues.map((issue) =>
        issue.id === id ? { ...issue, isResolved: true } : issue
      ),
    })),

  submitForReview: () =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === state.currentProjectId ? { ...p, status: 'reviewing' } : p
      ),
      versions: [
        {
          id: `v${Date.now()}`,
          version: state.versions.length + 1,
          description: '提交审核版本',
          createdAt: new Date().toLocaleString('zh-CN'),
          createdBy: '当前用户',
          status: 'submitted',
        },
        ...state.versions,
      ],
    })),

  approveVersion: (versionId) =>
    set((state) => ({
      versions: state.versions.map((v) =>
        v.id === versionId ? { ...v, status: 'approved' } : v
      ),
    })),

  rejectVersion: (versionId, comment) =>
    set((state) => ({
      versions: state.versions.map((v) =>
        v.id === versionId ? { ...v, status: 'rejected', reviewComments: comment } : v
      ),
    })),
}));
