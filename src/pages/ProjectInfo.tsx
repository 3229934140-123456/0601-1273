import { useState, useEffect } from 'react';
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
  Save,
  Pencil,
  X,
  Plus,
  Trash2,
  Check,
} from 'lucide-react';

export default function ProjectInfo() {
  const { getCurrentProject, updateProject, updateTargetGroup, updateRegions } = useProjectStore();
  const project = getCurrentProject();

  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    targetAmount: 0,
    startDate: '',
    endDate: '',
  });
  const [targetGroupForm, setTargetGroupForm] = useState({
    description: '',
    beneficiaryCount: 0,
    needsAnalysis: '',
    demographics: '',
  });
  const [regionsForm, setRegionsForm] = useState<{ id: string; name: string; coverage: string }[]>([]);

  useEffect(() => {
    if (project) {
      setForm({
        name: project.name,
        description: project.description,
        targetAmount: project.targetAmount,
        startDate: project.startDate,
        endDate: project.endDate,
      });
      setTargetGroupForm({
        description: project.targetGroup.description,
        beneficiaryCount: project.targetGroup.beneficiaryCount,
        needsAnalysis: project.targetGroup.needsAnalysis,
        demographics: project.targetGroup.demographics,
      });
      setRegionsForm(project.regions.map((r) => ({ ...r })));
    }
  }, [project?.id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-warm-100">
        <PageHeader title="项目信息" />
        <div className="p-8 text-center text-gray-500">项目不存在</div>
      </div>
    );
  }

  const progress = Math.round((project.raisedAmount / project.targetAmount) * 100);

  const handleSave = () => {
    if (!project) return;
    updateProject(project.id, {
      name: form.name,
      description: form.description,
      targetAmount: form.targetAmount,
      startDate: form.startDate,
      endDate: form.endDate,
    });
    updateTargetGroup(targetGroupForm);
    updateRegions(regionsForm);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCancel = () => {
    setForm({
      name: project.name,
      description: project.description,
      targetAmount: project.targetAmount,
      startDate: project.startDate,
      endDate: project.endDate,
    });
    setTargetGroupForm({
      description: project.targetGroup.description,
      beneficiaryCount: project.targetGroup.beneficiaryCount,
      needsAnalysis: project.targetGroup.needsAnalysis,
      demographics: project.targetGroup.demographics,
    });
    setRegionsForm(project.regions.map((r) => ({ ...r })));
    setEditing(false);
  };

  const addRegion = () => {
    setRegionsForm([...regionsForm, { id: `r${Date.now()}`, name: '', coverage: '' }]);
  };

  const removeRegion = (id: string) => {
    setRegionsForm(regionsForm.filter((r) => r.id !== id));
  };

  const updateRegion = (id: string, field: 'name' | 'coverage', value: string) => {
    setRegionsForm(regionsForm.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  return (
    <div className="min-h-screen bg-warm-100">
      <PageHeader
        title="项目信息"
        subtitle="查看和管理项目的基本信息"
        action={
          editing ? (
            <div className="flex items-center gap-3">
              <button onClick={handleCancel} className="btn-ghost flex items-center gap-2">
                <X size={16} />
                <span>取消</span>
              </button>
              <button
                onClick={handleSave}
                className="btn-primary flex items-center gap-2"
              >
                {saved ? <Check size={16} /> : <Save size={16} />}
                <span>{saved ? '已保存' : '保存'}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Pencil size={16} />
              <span>编辑</span>
            </button>
          )
        }
      />

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
                {editing ? (
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field"
                  />
                ) : (
                  <p className="text-lg font-medium text-gray-800">{project.name}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-1.5 block">项目简介</label>
                {editing ? (
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="input-field min-h-[100px] resize-y"
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed">{project.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-500 mb-1.5 block">目标金额</label>
                  {editing ? (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">¥</span>
                      <input
                        type="number"
                        value={form.targetAmount}
                        onChange={(e) => setForm({ ...form, targetAmount: Number(e.target.value) })}
                        className="input-field"
                      />
                      <span className="text-gray-500 text-sm">元</span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-primary-500">
                        ¥{(project.targetAmount / 10000).toFixed(1)}
                      </span>
                      <span className="text-gray-500 text-sm">万元</span>
                    </div>
                  )}
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
                <div>
                  <label className="text-sm text-gray-500 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="text-primary-500" size={14} />
                    开始日期
                  </label>
                  {editing ? (
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-800">{project.startDate}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-500 mb-1.5 flex items-center gap-1.5">
                    <Target className="text-primary-500" size={14} />
                    结束日期
                  </label>
                  {editing ? (
                    <input
                      type="date"
                      value={form.endDate}
                      onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-800">{project.endDate}</p>
                  )}
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
                  {editing ? (
                    <input
                      type="number"
                      value={targetGroupForm.beneficiaryCount}
                      onChange={(e) =>
                        setTargetGroupForm({ ...targetGroupForm, beneficiaryCount: Number(e.target.value) })
                      }
                      className="input-field text-center text-2xl font-bold"
                    />
                  ) : (
                    <p className="text-3xl font-bold text-gray-800">
                      {project.targetGroup.beneficiaryCount.toLocaleString()}
                    </p>
                  )}
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
                {editing ? (
                  <textarea
                    value={targetGroupForm.description}
                    onChange={(e) => setTargetGroupForm({ ...targetGroupForm, description: e.target.value })}
                    className="input-field min-h-[80px] resize-y"
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed">{project.targetGroup.description}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-1.5 block">需求分析</label>
                {editing ? (
                  <textarea
                    value={targetGroupForm.needsAnalysis}
                    onChange={(e) => setTargetGroupForm({ ...targetGroupForm, needsAnalysis: e.target.value })}
                    className="input-field min-h-[80px] resize-y"
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed">{project.targetGroup.needsAnalysis}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-1.5 block">人口统计特征</label>
                {editing ? (
                  <textarea
                    value={targetGroupForm.demographics}
                    onChange={(e) => setTargetGroupForm({ ...targetGroupForm, demographics: e.target.value })}
                    className="input-field min-h-[80px] resize-y"
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed">{project.targetGroup.demographics}</p>
                )}
              </div>
            </div>
          </div>

          <div className="card-warm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                  <MapPin className="text-yellow-600" size={20} />
                </div>
                <h2 className="text-lg font-serif font-semibold text-gray-800">执行地区</h2>
              </div>
              {editing && (
                <button
                  onClick={addRegion}
                  className="btn-secondary flex items-center gap-1.5 text-sm py-1.5 px-4"
                >
                  <Plus size={14} />
                  <span>添加地区</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(editing ? regionsForm : project.regions).map((region) => (
                <div
                  key={region.id}
                  className="bg-warm-50 rounded-xl p-4 hover:bg-primary-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-primary-500" size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      {editing ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={region.name}
                            onChange={(e) => updateRegion(region.id, 'name', e.target.value)}
                            placeholder="地区名称"
                            className="input-field text-sm py-2"
                          />
                          <input
                            type="text"
                            value={region.coverage}
                            onChange={(e) => updateRegion(region.id, 'coverage', e.target.value)}
                            placeholder="覆盖范围"
                            className="input-field text-sm py-2"
                          />
                          <button
                            onClick={() => removeRegion(region.id)}
                            className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                          >
                            <Trash2 size={12} />
                            <span>删除</span>
                          </button>
                        </div>
                      ) : (
                        <>
                          <h3 className="font-medium text-gray-800 mb-1">{region.name}</h3>
                          <p className="text-sm text-gray-500">{region.coverage}</p>
                        </>
                      )}
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
