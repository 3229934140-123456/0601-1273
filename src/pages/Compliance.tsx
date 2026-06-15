import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Hash,
  FolderOpen,
  Check,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { PageHeader } from '../components/Layout/PageHeader';
import { useProjectStore } from '../store/useProjectStore';
import type { ComplianceIssue } from '../types';

const tabs = [
  { key: 'all', label: '全部问题', icon: <FileText size={18} /> },
  { key: 'sensitive', label: '敏感表述', icon: <AlertTriangle size={18} /> },
  { key: 'number', label: '数字核验', icon: <Hash size={18} /> },
  { key: 'material', label: '材料清单', icon: <FolderOpen size={18} /> },
];

const severityConfig = {
  high: {
    label: '高风险',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    dotColor: 'bg-red-500',
  },
  medium: {
    label: '中风险',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    dotColor: 'bg-yellow-500',
  },
  low: {
    label: '低风险',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    dotColor: 'bg-blue-500',
  },
};

export default function Compliance() {
  const { complianceIssues, resolveComplianceIssue } = useProjectStore();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const totalCount = complianceIssues.length;
  const resolvedCount = complianceIssues.filter((i) => i.isResolved).length;
  const pendingCount = totalCount - resolvedCount;
  const highRiskCount = complianceIssues.filter(
    (i) => i.severity === 'high' && !i.isResolved
  ).length;

  const filteredIssues =
    activeTab === 'all'
      ? complianceIssues
      : complianceIssues.filter((issue) => issue.type === activeTab);

  const getRiskLevel = () => {
    if (highRiskCount >= 3) return { label: '高风险', color: 'text-red-600', bgColor: 'bg-red-100' };
    if (highRiskCount >= 1) return { label: '中风险', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { label: '低风险', color: 'text-secondary-600', bgColor: 'bg-secondary-100' };
  };

  const riskLevel = getRiskLevel();

  const handleResolve = (id: string) => {
    resolveComplianceIssue(id);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-warm-100">
      <PageHeader
        title="合规检查"
        subtitle="智能检测合规风险，确保募捐材料合法合规"
      />

      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">风险等级</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${riskLevel.bgColor} ${riskLevel.color}`}>
                    <Shield size={14} className="mr-1.5" />
                    {riskLevel.label}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">问题总数</p>
                  <p className="text-2xl font-bold text-gray-800">{totalCount}</p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <FileText className="text-primary-500" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">已解决</p>
                  <p className="text-2xl font-bold text-secondary-600">{resolvedCount}</p>
                </div>
                <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="text-secondary-500" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">待处理</p>
                  <p className="text-2xl font-bold text-primary-600">{pendingCount}</p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Clock className="text-primary-500" size={24} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            <div className="border-b border-gray-100 px-6">
              <div className="flex gap-1">
                {tabs.map((tab) => {
                  const count =
                    tab.key === 'all'
                      ? complianceIssues.length
                      : complianceIssues.filter((i) => i.type === tab.key).length;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                        activeTab === tab.key
                          ? 'border-primary-500 text-primary-600 font-medium'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          activeTab === tab.key
                            ? 'bg-primary-100 text-primary-600'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {filteredIssues.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    isExpanded={expandedId === issue.id}
                    onToggle={() => toggleExpand(issue.id)}
                    onResolve={() => handleResolve(issue.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface IssueCardProps {
  issue: ComplianceIssue;
  isExpanded: boolean;
  onToggle: () => void;
  onResolve: () => void;
}

function IssueCard({ issue, isExpanded, onToggle, onResolve }: IssueCardProps) {
  const severity = severityConfig[issue.severity];

  return (
    <div
      className={`rounded-xl border transition-all duration-300 ${
        issue.isResolved
          ? 'bg-gray-50 border-gray-200 opacity-70'
          : `${severity.borderColor} ${severity.bgColor} hover:shadow-md cursor-pointer`
      }`}
    >
      <div className="p-4" onClick={!issue.isResolved ? onToggle : undefined}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                issue.isResolved
                  ? 'bg-secondary-100'
                  : severity.bgColor.replace('bg-', 'bg-').replace('-50', '-100')
              }`}
            >
              {issue.isResolved ? (
                <Check size={14} className="text-secondary-600" />
              ) : (
                <div className={`w-2 h-2 rounded-full ${severity.dotColor}`} />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h4
                  className={`font-medium ${
                    issue.isResolved ? 'text-gray-400 line-through' : 'text-gray-800'
                  }`}
                >
                  {issue.title}
                </h4>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    issue.isResolved
                      ? 'bg-gray-200 text-gray-500'
                      : `${severity.bgColor} ${severity.color}`
                  }`}
                >
                  {severity.label}
                </span>
              </div>
              {issue.position && (
                <p
                  className={`text-sm ${
                    issue.isResolved ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  位置：{issue.position}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!issue.isResolved && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onResolve();
                }}
                className="px-4 py-2 text-sm text-secondary-600 bg-white border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors flex items-center gap-1.5"
              >
                <Check size={14} />
                标记已解决
              </button>
            )}
            {!issue.isResolved && (
              <ChevronRight
                size={20}
                className={`text-gray-400 transition-transform ${
                  isExpanded ? 'rotate-90' : ''
                }`}
              />
            )}
          </div>
        </div>
      </div>

      {isExpanded && !issue.isResolved && (
        <div className="px-4 pb-4 pt-0">
          <div className="ml-9 space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">问题描述</p>
              <p className="text-sm text-gray-600">{issue.description}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">修改建议</p>
              <p className="text-sm text-primary-600 bg-primary-50 p-3 rounded-lg">
                {issue.suggestion}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
