import { PageHeader } from '../components/Layout/PageHeader';
import { useProjectStore } from '../store/useProjectStore';
import {
  Target,
  Calendar,
  Users,
  MapPin,
  TrendingUp,
  FileText,
  UserCheck,
  BarChart3,
} from 'lucide-react';

export default function ProjectInfo() {
  const { getCurrentProject } = useProjectStore();
  const project = getCurrentProject();

  if (!project) {
    return (
      <div className="min-h-screen bg-warm-100">
        <PageHeader title="项目信息" />
        <div className="p-8 text-center text-gray-500">项目不存在</div>
      </div>
    );
  }

  const progress = Math.round((project.raisedAmount / project.targetAmount) * 100);

  return (
    <div className="min-h-screen bg-warm-100">
      <PageHeader title="项目信息" subtitle="查看和管理项目的基本信息" />

      <main className="p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="card-warm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                <FileText className="text-primary-500" size={20} />
              </div>
              <h2 className="text-lg font-serif font-semibold text-gray-800">基础信息</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-sm text-gray-500 mb-1.5 block">项目名称</label>
                <p className="text-lg font-medium text-gray-800">{project.name}</p>
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-1.5 block">项目简介</label>
                <p className="text-gray-700 leading-relaxed">{project.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-500 mb-1.5 block">目标金额</label>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary-500">
                      ¥{(project.targetAmount / 10000).toFixed(1)}
                    </span>
                    <span className="text-gray-500 text-sm">万元</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-500 mb-1.5 block">已筹金额</label>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-secondary-500">
                      ¥{(project.raisedAmount / 10000).toFixed(1)}
                    </span>
                    <span className="text-gray-500 text-sm">万元</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">筹款进度</span>
                  <span className="text-primary-600 font-medium">{progress}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full progress-bar rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
                    <Calendar className="text-primary-500" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">开始日期</p>
                    <p className="text-sm font-medium text-gray-800">{project.startDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
                    <Target className="text-primary-500" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">结束日期</p>
                    <p className="text-sm font-medium text-gray-800">{project.endDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card-warm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-secondary-100 flex items-center justify-center">
                <Users className="text-secondary-500" size={20} />
              </div>
              <h2 className="text-lg font-serif font-semibold text-gray-800">目标人群</h2>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-warm-50 rounded-xl p-4 text-center">
                  <UserCheck className="text-primary-500 mx-auto mb-2" size={28} />
                  <p className="text-3xl font-bold text-gray-800">
                    {project.targetGroup.beneficiaryCount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">受益人数</p>
                </div>

                <div className="bg-warm-50 rounded-xl p-4 text-center">
                  <TrendingUp className="text-secondary-500 mx-auto mb-2" size={28} />
                  <p className="text-3xl font-bold text-gray-800">6-12</p>
                  <p className="text-sm text-gray-500 mt-1">年龄段（岁）</p>
                </div>

                <div className="bg-warm-50 rounded-xl p-4 text-center">
                  <BarChart3 className="text-primary-500 mx-auto mb-2" size={28} />
                  <p className="text-3xl font-bold text-gray-800">1:1</p>
                  <p className="text-sm text-gray-500 mt-1">男女比例</p>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-1.5 block">人群描述</label>
                <p className="text-gray-700 leading-relaxed">
                  {project.targetGroup.description}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-1.5 block">需求分析</label>
                <p className="text-gray-700 leading-relaxed">
                  {project.targetGroup.needsAnalysis}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-1.5 block">人口统计特征</label>
                <p className="text-gray-700 leading-relaxed">
                  {project.targetGroup.demographics}
                </p>
              </div>
            </div>
          </div>

          <div className="card-warm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                <MapPin className="text-yellow-600" size={20} />
              </div>
              <h2 className="text-lg font-serif font-semibold text-gray-800">执行地区</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.regions.map((region) => (
                <div
                  key={region.id}
                  className="bg-warm-50 rounded-xl p-4 hover:bg-primary-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-primary-500" size={16} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 mb-1">{region.name}</h3>
                      <p className="text-sm text-gray-500">{region.coverage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
