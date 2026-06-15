import { NavLink, useParams } from 'react-router-dom';
import {
  FileText,
  Image,
  PenTool,
  ShieldCheck,
  PieChart,
  Users,
  Send,
  BarChart3,
  Heart,
  ArrowLeft,
} from 'lucide-react';
import { useProjectStore } from '../../store/useProjectStore';

const navItems = [
  { key: 'project', label: '项目信息', icon: FileText, path: '' },
  { key: 'materials', label: '资料管理', icon: Image, path: 'materials' },
  { key: 'copywriting', label: 'AI 文案', icon: PenTool, path: 'copywriting' },
  { key: 'compliance', label: '合规检查', icon: ShieldCheck, path: 'compliance' },
  { key: 'budget', label: '预算规划', icon: PieChart, path: 'budget' },
  { key: 'collaboration', label: '协作审批', icon: Users, path: 'collaboration' },
  { key: 'publish', label: '多端发布', icon: Send, path: 'publish' },
  { key: 'results', label: '成效追踪', icon: BarChart3, path: 'results' },
];

export function Sidebar() {
  const { id } = useParams<{ id: string }>();
  const project = useProjectStore((state) =>
    state.projects.find((p) => p.id === id)
  );

  const progress = project
    ? Math.round((project.raisedAmount / project.targetAmount) * 100)
    : 0;

  const statusMap = {
    draft: { label: '草稿', color: 'bg-gray-100 text-gray-600' },
    reviewing: { label: '审核中', color: 'bg-yellow-100 text-yellow-700' },
    approved: { label: '已通过', color: 'bg-green-100 text-green-700' },
    published: { label: '已发布', color: 'bg-primary-100 text-primary-700' },
  };

  const status = project ? statusMap[project.status] : statusMap.draft;

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-gray-100">
        <NavLink to="/" className="flex items-center gap-2 text-gray-500 hover:text-primary-500 transition-colors mb-4">
          <ArrowLeft size={18} />
          <span className="text-sm">返回项目列表</span>
        </NavLink>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <Heart className="text-white" size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-gray-800 truncate text-sm">
              {project?.name || '加载中...'}
            </h2>
            <span className={`tag ${status.color} mt-1`}>
              {status.label}
            </span>
          </div>
        </div>
        {project && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
              <span>筹款进度</span>
              <span className="font-medium text-primary-600">{progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full progress-bar rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1.5">
              <span>¥{(project.raisedAmount / 10000).toFixed(1)}万</span>
              <span>目标 ¥{(project.targetAmount / 10000).toFixed(1)}万</span>
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 p-3 overflow-y-auto">
        <div className="text-xs text-gray-400 px-4 py-2 font-medium">功能模块</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const to = item.path ? `/project/${id}/${item.path}` : `/project/${id}`;
          return (
            <NavLink
              key={item.key}
              to={to}
              className={({ isActive }) =>
                `nav-item mb-1 ${isActive ? 'nav-item-active' : ''}`
              }
            >
              <Icon size={20} />
              <span className="text-sm">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center text-white text-sm font-medium">
            张
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-800 truncate">张文案</div>
            <div className="text-xs text-gray-400 truncate">文案专员</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
