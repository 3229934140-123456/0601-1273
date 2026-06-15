import { useState } from 'react';
import {
  Clock,
  User,
  Send,
  MessageSquare,
  CheckCircle,
  XCircle,
  FileText,
  SendHorizonal,
  ChevronRight,
  Check,
} from 'lucide-react';
import { PageHeader } from '../components/Layout/PageHeader';
import { useProjectStore } from '../store/useProjectStore';
import type { VersionStatus, Comment, ProjectVersion } from '../types';

const statusConfig: Record<
  VersionStatus,
  { label: string; color: string; bgColor: string; icon: typeof CheckCircle }
> = {
  draft: {
    label: '草稿',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    icon: FileText,
  },
  submitted: {
    label: '已提交',
    color: 'text-primary-600',
    bgColor: 'bg-primary-50',
    icon: Send,
  },
  approved: {
    label: '已通过',
    color: 'text-secondary-600',
    bgColor: 'bg-secondary-50',
    icon: CheckCircle,
  },
  rejected: {
    label: '已拒绝',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    icon: XCircle,
  },
};

function StatusBadge({ status }: { status: VersionStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color} ${config.bgColor}`}
    >
      <Icon size={12} />
      {config.label}
    </span>
  );
}

function CommentBubble({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) {
  const isResolved = comment.isResolved;

  return (
    <div className={`${isReply ? 'ml-8 mt-3' : ''}`}>
      <div
        className={`p-4 rounded-2xl ${
          isResolved ? 'bg-gray-50 opacity-70' : 'bg-warm-50'
        } border border-warm-100`}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <User size={16} className="text-primary-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{comment.author}</p>
              <p className="text-xs text-gray-500">{comment.createdAt}</p>
            </div>
          </div>
          {isResolved && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs text-secondary-600 bg-secondary-50">
              <Check size={12} />
              已解决
            </span>
          )}
        </div>
        <p className="text-sm text-gray-700 leading-relaxed pl-10">{comment.content}</p>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3 mt-3">
          {comment.replies.map((reply) => (
            <CommentBubble key={reply.id} comment={reply} isReply />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Collaboration() {
  const versions = useProjectStore((state) => state.versions);
  const comments = useProjectStore((state) => state.comments);
  const addComment = useProjectStore((state) => state.addComment);
  const resolveComment = useProjectStore((state) => state.resolveComment);

  const [selectedVersionId, setSelectedVersionId] = useState<string>(versions[0]?.id || '');
  const [newComment, setNewComment] = useState('');

  const selectedVersion = versions.find((v) => v.id === selectedVersionId);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    addComment({
      content: newComment,
      author: '当前用户',
    });
    setNewComment('');
  };

  const handleResolveComment = (id: string) => {
    resolveComment(id);
  };

  return (
    <div className="min-h-screen bg-warm-100">
      <PageHeader title="协作审批" subtitle="团队协作，高效审核，共同完善项目" />

      <main className="p-8">
        <div className="flex gap-6 h-[calc(100vh-180px)]">
          <div className="w-80 flex-shrink-0 bg-white rounded-2xl shadow-card overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-500" />
                版本历史
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="relative">
                <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-gray-200" />

                <div className="space-y-2">
                  {versions.map((version, index) => {
                    const isSelected = version.id === selectedVersionId;
                    const isLatest = index === 0;
                    const StatusIcon = statusConfig[version.status].icon;

                    return (
                      <button
                        key={version.id}
                        onClick={() => setSelectedVersionId(version.id)}
                        className={`relative w-full text-left pl-10 pr-3 py-3 rounded-xl transition-all ${
                          isSelected
                            ? 'bg-primary-50 border border-primary-200'
                            : 'hover:bg-gray-50 border border-transparent'
                        }`}
                      >
                        <div
                          className={`absolute left-1.5 top-4 w-4 h-4 rounded-full border-2 ${
                            isSelected
                              ? 'bg-primary-500 border-primary-500'
                              : 'bg-white border-gray-300'
                          }`}
                        >
                          {isSelected && (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-bold ${
                                isSelected ? 'text-primary-600' : 'text-gray-800'
                              }`}
                            >
                              V{version.version}
                            </span>
                            {isLatest && (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-primary-100 text-primary-600 font-medium">
                                当前
                              </span>
                            )}
                          </div>
                          {isSelected && (
                            <ChevronRight className="w-4 h-4 text-primary-500" />
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {version.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <StatusBadge status={version.status} />
                        </div>

                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                          <User size={12} />
                          <span>{version.createdBy}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 pl-4">
                          {version.createdAt}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-6">
            {selectedVersion && (
              <div className="bg-white rounded-2xl shadow-card p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-gray-800 font-serif">
                        版本 {selectedVersion.version}
                      </h2>
                      <StatusBadge status={selectedVersion.status} />
                    </div>
                    <p className="text-gray-600 mb-3">{selectedVersion.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <User size={14} />
                        {selectedVersion.createdBy}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {selectedVersion.createdAt}
                      </span>
                    </div>
                    {selectedVersion.reviewComments && (
                      <div className="mt-4 p-4 bg-warm-50 rounded-xl border border-warm-200">
                        <p className="text-sm font-medium text-gray-700 mb-1">审核意见：</p>
                        <p className="text-sm text-gray-600">
                          {selectedVersion.reviewComments}
                        </p>
                      </div>
                    )}
                  </div>

                  {selectedVersion.status === 'draft' && (
                    <button className="px-6 py-2.5 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors flex items-center gap-2 shadow-warm">
                      <Send size={18} />
                      提交审核
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="flex-1 bg-white rounded-2xl shadow-card overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary-500" />
                  批注列表
                  <span className="text-sm font-normal text-gray-500">
                    ({comments.length} 条)
                  </span>
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {comments.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <MessageSquare size={48} className="mb-4 opacity-30" />
                    <p>暂无批注</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {comments.map((comment) => (
                      <div key={comment.id}>
                        <CommentBubble comment={comment} />
                        {!comment.isResolved && (
                          <div className="mt-2 ml-10">
                            <button
                              onClick={() => handleResolveComment(comment.id)}
                              className="text-xs text-secondary-600 hover:text-secondary-700 flex items-center gap-1"
                            >
                              <Check size={14} />
                              标记为已解决
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-100 bg-warm-50">
                <div className="flex items-end gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <User size={20} className="text-primary-500" />
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="添加批注或建议..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 bg-white text-sm"
                      rows={2}
                    />
                  </div>
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="p-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    <SendHorizonal size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
