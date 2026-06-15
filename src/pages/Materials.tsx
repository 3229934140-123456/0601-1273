import { useState } from 'react';
import { PageHeader } from '../components/Layout/PageHeader';
import { useProjectStore } from '../store/useProjectStore';
import type { MaterialType } from '../types';
import {
  Upload,
  Image as ImageIcon,
  FileText,
  Receipt,
  Trophy,
  Clock,
  Plus,
} from 'lucide-react';

const tabs: { key: MaterialType; label: string; icon: typeof ImageIcon }[] = [
  { key: 'image', label: '图片', icon: ImageIcon },
  { key: 'case', label: '案例', icon: FileText },
  { key: 'receipt', label: '票据', icon: Receipt },
  { key: 'achievement', label: '成果', icon: Trophy },
];

const typeLabels: Record<MaterialType, { label: string; color: string; bg: string }> = {
  image: { label: '图片', color: 'text-primary-600', bg: 'bg-primary-100' },
  case: { label: '案例', color: 'text-secondary-600', bg: 'bg-secondary-100' },
  receipt: { label: '票据', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  achievement: { label: '成果', color: 'text-green-600', bg: 'bg-green-100' },
};

export default function Materials() {
  const { materials } = useProjectStore();
  const [activeTab, setActiveTab] = useState<MaterialType>('image');

  const filteredMaterials = materials.filter((m) => m.type === activeTab);

  return (
    <div className="min-h-screen bg-warm-100">
      <PageHeader
        title="资料管理"
        subtitle="管理项目相关的图片、案例、票据和成果资料"
        action={
          <button className="btn-primary flex items-center gap-2">
            <Upload size={18} />
            <span>上传资料</span>
          </button>
        }
      />

      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="card-warm mb-6">
            <div className="flex items-center gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-500 text-white shadow-warm'
                        : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{tab.label}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {materials.filter((m) => m.type === tab.key).length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {activeTab === 'image' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredMaterials.map((material) => (
                <div
                  key={material.id}
                  className="card-warm group cursor-pointer overflow-hidden p-0"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={material.url}
                      alt={material.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {material.isCover && (
                      <div className="absolute top-2 left-2">
                        <span className="tag bg-primary-500 text-white text-xs">封面</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-gray-800 truncate">{material.title}</h3>
                      <span className={`tag ${typeLabels[material.type].bg} ${typeLabels[material.type].color} flex-shrink-0`}>
                        {typeLabels[material.type].label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                      {material.description}
                    </p>
                    <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
                      <Clock size={12} />
                      <span>{material.uploadTime}</span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="card-warm flex flex-col items-center justify-center cursor-pointer hover:border-primary-300 border-2 border-dashed border-gray-200 min-h-[280px]">
                <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center mb-3">
                  <Plus className="text-primary-400" size={28} />
                </div>
                <p className="text-sm text-gray-500">上传图片</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMaterials.map((material) => {
                const typeInfo = typeLabels[material.type];
                return (
                  <div
                    key={material.id}
                    className="card-warm flex items-center gap-5 cursor-pointer hover:shadow-warm-lg"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl ${typeInfo.bg} flex items-center justify-center flex-shrink-0`}
                    >
                      {material.type === 'case' && <FileText className={typeInfo.color} size={22} />}
                      {material.type === 'receipt' && <Receipt className={typeInfo.color} size={22} />}
                      {material.type === 'achievement' && <Trophy className={typeInfo.color} size={22} />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-medium text-gray-800 truncate">{material.title}</h3>
                        <span className={`tag ${typeInfo.bg} ${typeInfo.color}`}>
                          {typeInfo.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {material.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-400 flex-shrink-0">
                      <Clock size={14} />
                      <span>{material.uploadTime}</span>
                    </div>
                  </div>
                );
              })}

              {filteredMaterials.length === 0 && (
                <div className="card-warm text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-warm-50 flex items-center justify-center">
                    <FileText className="text-gray-300" size={32} />
                  </div>
                  <p className="text-gray-500">暂无{typeLabels[activeTab].label}资料</p>
                  <button className="btn-primary mt-4 inline-flex items-center gap-2">
                    <Plus size={16} />
                    <span>上传{typeLabels[activeTab].label}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
