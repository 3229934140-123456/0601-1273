import { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Wallet, Layers, FileText, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { PageHeader } from '../components/Layout/PageHeader';
import { useProjectStore } from '../store/useProjectStore';
import { mockBudgetMatchings } from '../data/mockData';
import type { BudgetItem } from '../types';

const COLORS = ['#FF8C42', '#FFB37A', '#FFD0AD', '#2D6A4F', '#78B792', '#A9D1B9'];

function formatCurrency(value: number): string {
  return value.toLocaleString('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

interface CategoryGroup {
  category: string;
  total: number;
  items: BudgetItem[];
}

export default function Budget() {
  const budgetItems = useProjectStore((state) => state.budgetItems);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const totalBudget = useMemo(() => {
    return budgetItems.reduce((sum, item) => sum + item.amount, 0);
  }, [budgetItems]);

  const categoryCount = useMemo(() => {
    const categories = new Set(budgetItems.map((item) => item.category));
    return categories.size;
  }, [budgetItems]);

  const pieData = useMemo(() => {
    const categoryMap = new Map<string, number>();
    budgetItems.forEach((item) => {
      const current = categoryMap.get(item.category) || 0;
      categoryMap.set(item.category, current + item.amount);
    });
    return Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));
  }, [budgetItems]);

  const groupedItems = useMemo(() => {
    const groups: CategoryGroup[] = [];
    const categoryMap = new Map<string, CategoryGroup>();

    budgetItems.forEach((item) => {
      if (!categoryMap.has(item.category)) {
        const group = { category: item.category, total: 0, items: [] };
        categoryMap.set(item.category, group);
        groups.push(group);
      }
      const group = categoryMap.get(item.category)!;
      group.total += item.amount;
      group.items.push(item);
    });

    return groups;
  }, [budgetItems]);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const renderCustomLabel = (props: {
    cx?: number;
    cy?: number;
    midAngle?: number;
    innerRadius?: number;
    outerRadius?: number;
    percent?: number;
  }) => {
    const { cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0 } = props;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent > 0.05 ? (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <div className="min-h-screen bg-warm-100">
      <PageHeader title="预算规划" subtitle="透明公开，每一分善款都用到实处" />

      <main className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">总预算金额</p>
                <p className="text-2xl font-bold text-gray-800 font-serif">
                  {formatCurrency(totalBudget)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary-50 flex items-center justify-center">
                <Layers className="w-6 h-6 text-secondary-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">费用类别数</p>
                <p className="text-2xl font-bold text-gray-800 font-serif">{categoryCount} 类</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">明细条目数</p>
                <p className="text-2xl font-bold text-gray-800 font-serif">
                  {budgetItems.length} 条
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-card">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-500" />
              费用拆分占比
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={120}
                    innerRadius={50}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="white"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => (
                      <span className="text-sm text-gray-600">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-card">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-secondary-500" />
              资金匹配说明
            </h2>
            <div className="space-y-4">
              {mockBudgetMatchings.map((match, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-warm-50 border border-warm-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      >
                        {match.source.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{match.source}</h3>
                        <p className="text-xs text-gray-500">配捐比例 {match.ratio}</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-primary-500">
                      {formatCurrency(match.amount)}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 ml-13">{match.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-500" />
            费用明细表
          </h2>

          <div className="space-y-4">
            {groupedItems.map((group, groupIndex) => {
              const isExpanded = expandedCategories.has(group.category);
              const categoryPercentage = ((group.total / totalBudget) * 100).toFixed(1);

              return (
                <div
                  key={group.category}
                  className="border border-gray-100 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleCategory(group.category)}
                    className="w-full flex items-center justify-between p-4 bg-warm-50 hover:bg-warm-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: COLORS[groupIndex % COLORS.length] }}
                      />
                      <span className="font-semibold text-gray-800">{group.category}</span>
                      <span className="text-sm text-gray-500">
                        {group.items.length} 项明细
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">
                        占比 {categoryPercentage}%
                      </span>
                      <span className="font-bold text-primary-500">
                        {formatCurrency(group.total)}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="divide-y divide-gray-50">
                      {group.items.map((item, itemIndex) => (
                        <div
                          key={item.id}
                          className={`flex items-center justify-between py-3 px-6 ${
                            itemIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          }`}
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-700">{item.item}</p>
                            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                          </div>
                          <div className="flex items-center gap-6 text-right">
                            <div>
                              <p className="text-sm text-gray-500">占比</p>
                              <p className="font-medium text-gray-700">{item.percentage}%</p>
                            </div>
                            <div className="w-28">
                              <p className="text-sm text-gray-500">金额</p>
                              <p className="font-bold text-gray-800 text-right">
                                {formatCurrency(item.amount)}
                              </p>
                            </div>
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
      </main>
    </div>
  );
}
