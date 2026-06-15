import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Heart, Users, Calendar, ChevronRight, Sparkles } from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore';
import type { ProjectStatus } from '../types';

const statusConfig: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
  draft: { label: '草稿', color: 'text-gray-600', bg: 'bg-gray-100' },
  reviewing: { label: '审核中', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  approved: { label: '已通过', color: 'text-green-700', bg: 'bg-green-100' },
  published: { label: '已发布', color: 'text-primary-700', bg: 'bg-primary-100' },
};

export default function ProjectList() {
  const navigate = useNavigate();
  const { projects } = useProjectStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | 'all'>('all');

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalRaised = projects.reduce((sum, p) => sum + p.raisedAmount, 0);
  const totalTarget = projects.reduce((sum, p) => sum + p.targetAmount, 0);

  return (
    <div className="min-h-screen bg-warm-100">
      <header className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-warm">
                <Heart className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-serif font-bold text-gray-800">公益募捐 AI 平台</h1>
                <p className="text-xs text-gray-500">让每一份善意都被专业呈现</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="btn-primary flex items-center gap-2" onClick={() => {}}>
                <Plus size={18} />
                <span>新建项目</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="card-warm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">项目总数</p>
                <p className="text-3xl font-bold text-gray-800">{projects.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                <Heart className="text-primary-500" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-secondary-500 font-medium">+2 本月新增</span>
              <ChevronRight size={16} className="text-secondary-400" />
            </div>
          </div>

          <div className="card-warm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">累计筹款</p>
                <p className="text-3xl font-bold text-gray-800">
                  ¥{(totalRaised / 10000).toFixed(1)}万
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-secondary-100 flex items-center justify-center">
                <Sparkles className="text-secondary-500" size={24} />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>完成进度</span>
                <span className="text-secondary-600 font-medium">
                  {Math.round((totalRaised / totalTarget) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-secondary-400 to-secondary-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.round((totalRaised / totalTarget) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="card-warm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">参与捐赠</p>
                <p className="text-3xl font-bold text-gray-800">2,156 人</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                <Users className="text-yellow-600" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-primary-500 font-medium">+328 本周新增</span>
              <ChevronRight size={16} className="text-primary-400" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-serif font-semibold text-gray-800">我的项目</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="搜索项目..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all w-64 text-sm"
              />
            </div>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as ProjectStatus | 'all')}
                className="appearance-none pl-4 pr-10 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all text-sm text-gray-600 cursor-pointer"
              >
                <option value="all">全部状态</option>
                <option value="draft">草稿</option>
                <option value="reviewing">审核中</option>
                <option value="published">已发布</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => {
            const status = statusConfig[project.status];
            const progress = Math.round((project.raisedAmount / project.targetAmount) * 100);
            return (
              <div
                key={project.id}
                onClick={() => navigate(`/project/${project.id}`)}
                className="card cursor-pointer group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-40 -mx-6 -mt-6 mb-5 overflow-hidden rounded-t-2xl">
                  {project.coverImage ? (
                    <img
                      src={project.coverImage}
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-300 to-secondary-400" />
                  )}
                  <div className="absolute top-3 left-3">
                    <span className={`tag ${status.bg} ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </div>

                <h3 className="font-serif font-semibold text-lg text-gray-800 mb-2 group-hover:text-primary-600 transition-colors">
                  {project.name}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                  {project.description}
                </p>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">筹款进度</span>
                    <span className="text-primary-600 font-medium">{progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full progress-bar rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-gray-500">
                    <Calendar size={14} />
                    <span>
                      {project.startDate} ~ {project.endDate}
                    </span>
                  </div>
                  <div className="text-primary-600 font-medium">
                    ¥{(project.raisedAmount / 10000).toFixed(1)}万
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Search className="text-gray-300" size={32} />
            </div>
            <p className="text-gray-500">没有找到匹配的项目</p>
          </div>
        )}
      </main>
    </div>
  );
}
