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
  GitCompare,
  X,
} from 'lucide-react';
import { PageHeader } from '../components/Layout/PageHeader';
import { useProjectStore } from '../store/useProjectStore';
import type { VersionStatus, Comment, ProjectVersion } from '../types';

const statusConfig: Record<
  VersionStatus,
  { label: string; color: string; bgColor: string; icon: typeof CheckCircle }
> = {
  draft: { label: '草稿', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: FileText },
  submitted: { label: '已提交', color: 'text-primary-600', bgColor: 'bg-primary-50', icon: Send },
  approved: { label: '已通过', color: 'text-secondary-600', bgColor: 'bg-secondary-50', icon: CheckCircle },
  rejected: { label: '已拒绝', color: 'text-red-600', bgColor: 'bg-red-50', icon: XCircle },
};

function StatusBadge({ status }: { status: VersionStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color} ${config.bgColor}`}>
      <Icon size={12} />
      {config.label}
    </span>
  );
}

function CommentBubble({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) {
  return (
    <div className={`${isReply ? 'ml-8 mt-3' : ''}`}>
      <div className={`p-4 rounded-2xl ${comment.isResolved ? 'bg-gray-50 opacity-70' : 'bg-warm-50'} border border-warm-100`}>
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
          {comment.isResolved && (
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
  const copywritings = useProjectStore((state) => state.copywritings);
  const addComment = useProjectStore((state) => state.addComment);
  const resolveComment = useProjectStore((state) => state.resolveComment);
  const submitForReview = useProjectStore((state) => state.submitForReview);
  const approveVersion = useProjectStore((state) => state.approveVersion);
  const rejectVersion = useProjectStore((state) => state.rejectVersion);

  const [selectedVersionId, setSelectedVersionId] = useState<string>(versions[0]?.id || '');
  const [newComment, setNewComment] = useState('');
  const [submitDesc, setSubmitDesc] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [compareMode, setCompareMode] = useState(false);
  const [compareVersionId, setCompareVersionId] = useState<string>('');

  const selectedVersion = versions.find((v) => v.id === selectedVersionId);
  const compareVersion = versions.find((v) => v.id === compareVersionId);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    addComment({ content: newComment, author: '当前用户' });
    setNewComment('');
  };

  const handleSubmitReview = () => {
    submitForReview(submitDesc || undefined);
    setShowSubmitModal(false);
    setSubmitDesc('');
  };

  const handleApprove = (versionId: string) => {
    approveVersion(versionId);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) return;
    rejectVersion(selectedVersionId, rejectReason);
    setShowRejectModal(false);
    setRejectReason('');
  };

  const getVersionSnapshot = (v: ProjectVersion) => {
    const copyAtVersion = copywritings.map((c) => ({
      type: c.type,
      version: Math.min(c.version, v.version),
      content: c.content.slice(0, 80) + '...',
    }));
    return copyAtVersion;
  };

  return (
    <div className="min-h-screen bg-warm-100">
      <PageHeader title="协作审批" subtitle="团队协作，高效审核，共同完善项目" />

      <main className="p-8">
        <div className="flex gap-6 h-[calc(100vh-180px)]">
          <div className="w-80 flex-shrink-0 bg-white rounded-2xl shadow-card overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-500" />
                版本历史
              </h2>
              {compareMode && (
                <button
                  onClick={() => { setCompareMode(false); setCompareVersionId(''); }}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <X size={14} />
                  退出对比
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="relative">
                <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-gray-200" />
                <div className="space-y-2">
                  {versions.map((version, index) => {
                    const isSelected = version.id === selectedVersionId;
                    const isCompare = version.id === compareVersionId;
                    const isLatest = index === 0;

                    return (
                      <button
                        key={version.id}
                        onClick={() => {
                          if (compareMode) {
                            setCompareVersionId(version.id);
                          } else {
                            setSelectedVersionId(version.id);
                          }
                        }}
                        className={`relative w-full text-left pl-10 pr-3 py-3 rounded-xl transition-all ${
                          isSelected
                            ? 'bg-primary-50 border border-primary-200'
                            : isCompare
                            ? 'bg-secondary-50 border border-secondary-200'
                            : 'hover:bg-gray-50 border border-transparent'
                        }`}
                      >
                        <div className={`absolute left-1.5 top-4 w-4 h-4 rounded-full border-2 ${
                          isSelected ? 'bg-primary-500 border-primary-500' : isCompare ? 'bg-secondary-500 border-secondary-500' : 'bg-white border-gray-300'
                        }`}>
                          {(isSelected || isCompare) && (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${isSelected ? 'text-primary-600' : isCompare ? 'text-secondary-600' : 'text-gray-800'}`}>
                              V{version.version}
                            </span>
                            {isLatest && <span className="text-xs px-1.5 py-0.5 rounded bg-primary-100 text-primary-600 font-medium">当前</span>}
                            {isCompare && <span className="text-xs px-1.5 py-0.5 rounded bg-secondary-100 text-secondary-600 font-medium">对比</span>}
                          </div>
                          {isSelected && <ChevronRight className="w-4 h-4 text-primary-500" />}
                        </div>

                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{version.description}</p>
                        <div className="flex items-center justify-between">
                          <StatusBadge status={version.status} />
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                          <User size={12} />
                          <span>{version.createdBy}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 pl-4">{version.createdAt}</p>
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
                      <span className="flex items-center gap-1"><User size={14} />{selectedVersion.createdBy}</span>
                      <span className="flex items-center gap-1"><Clock size={14} />{selectedVersion.createdAt}</span>
                    </div>
                    {selectedVersion.reviewComments && (
                      <div className="mt-4 p-4 bg-warm-50 rounded-xl border border-warm-200">
                        <p className="text-sm font-medium text-gray-700 mb-1">审核意见：</p>
                        <p className="text-sm text-gray-600">{selectedVersion.reviewComments}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {!compareMode && (
                      <button
                        onClick={() => setCompareMode(true)}
                        className="px-4 py-2.5 bg-white text-gray-600 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
                      >
                        <GitCompare size={16} />
                        版本对比
                      </button>
                    )}
                    {selectedVersion.status === 'draft' && (
                      <button
                        onClick={() => setShowSubmitModal(true)}
                        className="px-5 py-2.5 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors flex items-center gap-2 shadow-warm"
                      >
                        <Send size={16} />
                        提交审核
                      </button>
                    )}
                    {selectedVersion.status === 'submitted' && (
                      <>
                        <button
                          onClick={() => handleApprove(selectedVersionId)}
                          className="px-5 py-2.5 bg-secondary-500 text-white rounded-xl font-medium hover:bg-secondary-600 transition-colors flex items-center gap-2"
                        >
                          <CheckCircle size={16} />
                          审批通过
                        </button>
                        <button
                          onClick={() => setShowRejectModal(true)}
                          className="px-5 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
                        >
                          <XCircle size={16} />
                          驳回
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {compareMode && compareVersion && (
                  <div className="mt-6 border-t border-gray-100 pt-6">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <GitCompare size={18} className="text-primary-500" />
                      版本对比：V{selectedVersion.version} vs V{compareVersion.version}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border border-primary-200 rounded-xl p-4 bg-primary-50/30">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="tag bg-primary-100 text-primary-600">V{selectedVersion.version}</span>
                          <span className="text-sm text-gray-500">{selectedVersion.status === 'approved' ? '已通过' : selectedVersion.status === 'submitted' ? '审核中' : '草稿'}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{selectedVersion.description}</p>
                        <div className="text-xs text-gray-500 space-y-1">
                          <p>提交人：{selectedVersion.createdBy}</p>
                          <p>时间：{selectedVersion.createdAt}</p>
                          {selectedVersion.reviewComments && <p className="text-secondary-600">审核意见：{selectedVersion.reviewComments}</p>}
                        </div>
                      </div>
                      <div className="border border-secondary-200 rounded-xl p-4 bg-secondary-50/30">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="tag bg-secondary-100 text-secondary-600">V{compareVersion.version}</span>
                          <span className="text-sm text-gray-500">{compareVersion.status === 'approved' ? '已通过' : compareVersion.status === 'submitted' ? '审核中' : '草稿'}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{compareVersion.description}</p>
                        <div className="text-xs text-gray-500 space-y-1">
                          <p>提交人：{compareVersion.createdBy}</p>
                          <p>时间：{compareVersion.createdAt}</p>
                          {compareVersion.reviewComments && <p className="text-secondary-600">审核意见：{compareVersion.reviewComments}</p>}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                      <p className="text-sm text-yellow-700">
                        <strong>差异说明：</strong>
                        {selectedVersion.version !== compareVersion.version
                          ? `V${selectedVersion.version} 与 V${compareVersion.version} 存在版本差异，描述、审核状态和审核意见可能不同。`
                          : '选择了同一版本，无差异。'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex-1 bg-white rounded-2xl shadow-card overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary-500" />
                  批注列表
                  <span className="text-sm font-normal text-gray-500">({comments.length} 条)</span>
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
                              onClick={() => resolveComment(comment.id)}
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

      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-warm-lg p-6 w-full max-w-md">
            <h3 className="font-serif font-bold text-lg text-gray-800 mb-4">提交审核</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 mb-1.5 block">版本说明</label>
                <textarea
                  value={submitDesc}
                  onChange={(e) => setSubmitDesc(e.target.value)}
                  placeholder="请描述本次提交的主要变更内容..."
                  className="input-field min-h-[100px] resize-y"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowSubmitModal(false)} className="btn-ghost">取消</button>
                <button onClick={handleSubmitReview} className="btn-primary flex items-center gap-2">
                  <Send size={16} />
                  <span>确认提交</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-warm-lg p-6 w-full max-w-md">
            <h3 className="font-serif font-bold text-lg text-gray-800 mb-4">驳回审核</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 mb-1.5 block">驳回原因 *</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="请说明驳回原因和修改建议..."
                  className="input-field min-h-[100px] resize-y"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowRejectModal(false)} className="btn-ghost">取消</button>
                <button
                  onClick={handleReject}
                  disabled={!rejectReason.trim()}
                  className="px-5 py-2.5 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <XCircle size={16} />
                  <span>确认驳回</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
