import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import {
  Eye,
  Users,
  DollarSign,
  Share2,
  TrendingUp,
  Calendar,
  User,
  MessageSquare,
  CheckCircle2,
  Circle,
  Award,
  AlertTriangle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PageHeader } from '../components/Layout/PageHeader';
import { useProjectStore } from '../store/useProjectStore';
import type { ReviewItem } from '../types';

type TrendType = 'views' | 'donations' | 'amount';

const trendTabs: { key: TrendType; label: string; color: string; icon: React.ReactNode }[] = [
  { key: 'views', label: '阅读量', color: '#FF8C42', icon: <Eye size={16} /> },
  { key: 'donations', label: '捐赠数', color: '#2D6A4F', icon: <Users size={16} /> },
  { key: 'amount', label: '筹款金额', color: '#FFB37A', icon: <DollarSign size={16} /> },
];

const reviewCategories = [
  { key: 'success', label: '成功经验', icon: Award, color: 'text-secondary-500', bg: 'bg-secondary-100' },
  { key: 'problem', label: '问题总结', icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  { key: 'improvement', label: '改进计划', icon: Lightbulb, color: 'text-primary-500', bg: 'bg-primary-100' },
];

export default function Results() {
  const { resultData } = useProjectStore();
  const { views, donations, amount, shares, dailyData, visitRecords, reviewItems } = resultData;

  const [trendType, setTrendType] = useState<TrendType>('views');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('success');

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toLocaleString();
  };

  const getTrendValue = (data: typeof dailyData[0]) => {
    switch (trendType) {
      case 'views':
        return data.views;
      case 'donations':
        return data.donations;
      case 'amount':
        return data.amount;
      default:
        return 0;
    }
  };

  const currentTrendConfig = trendTabs.find((t) => t.key === trendType) || trendTabs[0];

  const toggleReviewItem = (id: string) => {
    // In a real app, this would update the store
    console.log('Toggle item:', id);
  };

  const getFilteredReviewItems = (category: string) => {
    return reviewItems.filter((item) => item.category === category);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const statCards = [
    {
      label: '阅读量',
      value: views,
      icon: Eye,
      color: 'primary',
      change: '+12.5%',
      isPositive: true,
    },
    {
      label: '捐赠人数',
      value: donations,
      icon: Users,
      color: 'secondary',
      change: '+8.3%',
      isPositive: true,
    },
    {
      label: '筹款金额',
      value: amount,
      icon: DollarSign,
      color: 'primary',
      change: '+15.2%',
      isPositive: true,
      isCurrency: true,
    },
    {
      label: '转发数',
      value: shares,
      icon: Share2,
      color: 'secondary',
      change: '+5.8%',
      isPositive: true,
    },
  ];

  return (
    <div className="min-h-screen bg-warm-100">
      <PageHeader title="成效追踪" subtitle="实时监控项目数据，追踪公益影响力" />

      <main className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {statCards.map((card, index) => {
            const IconComponent = card.icon;
            const colorClasses = {
              primary: {
                bg: 'bg-primary-100',
                text: 'text-primary-500',
                gradient: 'from-primary-400 to-primary-600',
              },
              secondary: {
                bg: 'bg-secondary-100',
                text: 'text-secondary-500',
                gradient: 'from-secondary-400 to-secondary-600',
              },
            };
            const colors = colorClasses[card.color as keyof typeof colorClasses];

            return (
              <div
                key={index}
                className="card-warm relative overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colors.gradient} opacity-5 rounded-full -translate-y-8 translate-x-8`} />
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                    <IconComponent className={colors.text} size={24} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${card.isPositive ? 'text-secondary-500' : 'text-red-500'}`}>
                    <TrendingUp size={14} />
                    <span className="font-medium">{card.change}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                <p className="text-3xl font-bold text-gray-800">
                  {card.isCurrency ? '¥' : ''}
                  {formatNumber(card.value)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card-warm">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <TrendingUp size={20} className="text-primary-500" />
                  <h2 className="section-title mb-0">数据趋势</h2>
                </div>
                <div className="flex gap-1 bg-warm-50 rounded-xl p-1">
                  {trendTabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setTrendType(tab.key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
                        trendType === tab.key
                          ? 'bg-white text-gray-800 shadow-sm font-medium'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <span style={{ color: trendType === tab.key ? tab.color : undefined }}>
                        {tab.icon}
                      </span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={currentTrendConfig.color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={currentTrendConfig.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12, fill: '#999' }}
                      axisLine={{ stroke: '#f0f0f0' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: '#999' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => formatNumber(value)}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        padding: '12px 16px',
                      }}
                      labelStyle={{ fontWeight: 'bold', color: '#333', marginBottom: '4px' }}
                      formatter={(value: number) => [
                        trendType === 'amount' ? `¥${formatNumber(value)}` : formatNumber(value),
                        currentTrendConfig.label,
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey={getTrendValue}
                      stroke={currentTrendConfig.color}
                      strokeWidth={2}
                      fill="url(#colorTrend)"
                      dot={{ fill: currentTrendConfig.color, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: currentTrendConfig.color, stroke: 'white', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card-warm">
              <div className="flex items-center gap-2 mb-5">
                <Calendar size={20} className="text-primary-500" />
                <h2 className="section-title mb-0">回访记录</h2>
              </div>

              <div className="space-y-4">
                {visitRecords.map((record, index) => (
                  <div
                    key={record.id}
                    className="bg-warm-50 rounded-xl p-5 animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <User size={18} className="text-primary-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{record.visitor}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Calendar size={12} />
                            <span>{record.date}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs bg-secondary-100 text-secondary-600 px-2.5 py-1 rounded-full font-medium">
                        受益人: {record.beneficiaryName}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{record.content}</p>

                    <div className="bg-white rounded-lg p-3 border border-warm-200">
                      <div className="flex items-start gap-2">
                        <MessageSquare size={14} className="text-secondary-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 mb-1">受益人反馈</p>
                          <p className="text-sm text-gray-700">{record.feedback}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card-warm">
              <div className="flex items-center gap-2 mb-5">
                <Award size={20} className="text-primary-500" />
                <h2 className="section-title mb-0">复盘清单</h2>
              </div>

              <div className="space-y-3">
                {reviewCategories.map((category) => {
                  const IconComponent = category.icon;
                  const items = getFilteredReviewItems(category.key);
                  const completedCount = items.filter((i) => i.isCompleted).length;
                  const isExpanded = expandedCategory === category.key;

                  return (
                    <div
                      key={category.key}
                      className="border border-gray-100 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleCategory(category.key)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg ${category.bg} flex items-center justify-center`}>
                            <IconComponent className={category.color} size={16} />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-gray-800 text-sm">{category.label}</p>
                            <p className="text-xs text-gray-400">
                              {completedCount}/{items.length} 已完成
                            </p>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp size={18} className="text-gray-400" />
                        ) : (
                          <ChevronDown size={18} className="text-gray-400" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="p-3 space-y-2">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              onClick={() => toggleReviewItem(item.id)}
                              className="flex items-start gap-3 p-3 rounded-lg hover:bg-warm-50 cursor-pointer transition-colors group"
                            >
                              {item.isCompleted ? (
                                <CheckCircle2
                                  size={18}
                                  className="text-secondary-500 mt-0.5 flex-shrink-0"
                                />
                              ) : (
                                <Circle
                                  size={18}
                                  className="text-gray-300 mt-0.5 flex-shrink-0 group-hover:text-primary-300 transition-colors"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`text-sm font-medium ${
                                    item.isCompleted
                                      ? 'text-gray-400 line-through'
                                      : 'text-gray-700'
                                  }`}
                                >
                                  {item.title}
                                </p>
                                <p
                                  className={`text-xs mt-1 ${
                                    item.isCompleted ? 'text-gray-300' : 'text-gray-500'
                                  }`}
                                >
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card-warm bg-gradient-to-br from-secondary-50 to-primary-50">
              <h3 className="font-medium text-gray-800 mb-4">本月成效摘要</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">筹款完成度</span>
                  <span className="text-sm font-medium text-secondary-600">65.1%</span>
                </div>
                <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-secondary-400 to-secondary-600 rounded-full"
                    style={{ width: '65.1%' }}
                  />
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-gray-600">目标达成时间</span>
                  <span className="text-sm font-medium text-primary-600">预计还需 45 天</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">日均捐赠</span>
                  <span className="text-sm font-medium text-primary-600">¥7,235</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
