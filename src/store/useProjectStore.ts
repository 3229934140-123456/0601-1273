import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  initialized: boolean;

  setCurrentProject: (id: string) => void;
  getCurrentProject: () => Project | undefined;

  updateProject: (id: string, data: Partial<Project>) => void;
  updateTargetGroup: (data: TargetGroup) => void;
  updateRegions: (regions: Region[]) => void;

  addMaterial: (material: Omit<Material, 'id' | 'uploadTime'>) => void;
  deleteMaterial: (id: string) => void;

  updateCopywriting: (type: string, content: string) => void;

  addComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'replies' | 'isResolved'>) => void;
  resolveComment: (id: string) => void;

  resolveComplianceIssue: (id: string) => void;

  submitForReview: (description?: string) => void;
  approveVersion: (versionId: string) => void;
  rejectVersion: (versionId: string, comment: string) => void;

  toggleReviewItem: (id: string) => void;
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: mockProjects,
      currentProjectId: '1',
      materials: mockMaterials,
      copywritings: mockCopywritings,
      budgetItems: mockBudgetItems,
      comments: mockComments,
      versions: mockVersions,
      resultData: mockResultData,
      complianceIssues: mockComplianceIssues,
      initialized: true,

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
          materials: [
            ...state.materials,
            {
              ...material,
              id: `m${Date.now()}`,
              uploadTime: new Date().toLocaleDateString('zh-CN'),
            },
          ],
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

      submitForReview: (description) =>
        set((state) => {
          const newVersionNum = Math.max(...state.versions.map((v) => v.version), 0) + 1;
          return {
            projects: state.projects.map((p) =>
              p.id === state.currentProjectId ? { ...p, status: 'reviewing' as const } : p
            ),
            versions: [
              {
                id: `v${Date.now()}`,
                version: newVersionNum,
                description: description || '提交审核版本',
                createdAt: new Date().toLocaleString('zh-CN'),
                createdBy: '当前用户',
                status: 'submitted' as const,
              },
              ...state.versions,
            ],
          };
        }),

      approveVersion: (versionId) =>
        set((state) => ({
          versions: state.versions.map((v) =>
            v.id === versionId
              ? { ...v, status: 'approved' as const, reviewComments: '审核通过' }
              : v
          ),
          projects: state.versions.find((v) => v.id === versionId)?.status === 'submitted'
            ? state.projects.map((p) =>
                p.id === state.currentProjectId ? { ...p, status: 'approved' as const } : p
              )
            : state.projects,
        })),

      rejectVersion: (versionId, comment) =>
        set((state) => ({
          versions: state.versions.map((v) =>
            v.id === versionId
              ? { ...v, status: 'rejected' as const, reviewComments: comment }
              : v
          ),
          projects: state.versions.find((v) => v.id === versionId)?.status === 'submitted'
            ? state.projects.map((p) =>
                p.id === state.currentProjectId ? { ...p, status: 'draft' as const } : p
              )
            : state.projects,
        })),

      toggleReviewItem: (id) =>
        set((state) => ({
          resultData: {
            ...state.resultData,
            reviewItems: state.resultData.reviewItems.map((item) =>
              item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
            ),
          },
        })),
    }),
    {
      name: 'charity-ai-platform-storage',
    }
  )
);
