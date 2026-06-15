import { useState, useEffect } from 'react';
import { Sparkles, Save, FileText, Heart, RefreshCw, Mail } from 'lucide-react';
import { PageHeader } from '../components/Layout/PageHeader';
import { useProjectStore } from '../store/useProjectStore';
import type { CopywritingType } from '../types';

const copywritingNavItems: { type: CopywritingType; label: string; icon: React.ReactNode }[] = [
  { type: 'intro', label: '项目简介', icon: <FileText size={18} /> },
  { type: 'reason', label: '募捐理由', icon: <Heart size={18} /> },
  { type: 'update', label: '进展更新', icon: <RefreshCw size={18} /> },
  { type: 'thanks', label: '感谢信', icon: <Mail size={18} /> },
];

const styleOptions = [
  { value: 'warm', label: '温暖感人' },
  { value: 'professional', label: '专业严谨' },
  { value: 'lively', label: '活泼生动' },
  { value: 'concise', label: '简洁有力' },
];

export default function Copywriting() {
  const { copywritings, updateCopywriting } = useProjectStore();
  const [activeType, setActiveType] = useState<CopywritingType>('intro');
  const [content, setContent] = useState('');
  const [style, setStyle] = useState('warm');
  const [isGenerating, setIsGenerating] = useState(false);
  const [displayedText, setDisplayedText] = useState('');

  const currentCopywriting = copywritings.find((c) => c.type === activeType);

  useEffect(() => {
    if (currentCopywriting) {
      setContent(currentCopywriting.content);
      setDisplayedText(currentCopywriting.content);
    }
  }, [activeType, currentCopywriting]);

  const handleGenerate = () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setDisplayedText('');

    const sampleTexts: Record<CopywritingType, string> = {
      intro:
        '在我国西部的大山深处，有这样一群孩子——他们有着清澈的眼睛和对知识的渴望，却因为家庭贫困，每天只能就着咸菜吃白米饭。生长发育关键期的他们，亟需一顿热腾腾、有营养的午餐。\n\n「山区儿童营养午餐计划」旨在为云南、贵州、四川等地的1200名留守儿童提供营养均衡的午餐。我们与当地学校合作，确保每一分善款都用到实处，让每个孩子都能吃上热饭、健康成长。\n\n您的一份爱心，就是孩子们的一顿午餐。让我们一起，为山里的孩子点亮希望之光。',
      reason:
        '为什么我们需要营养午餐？\n\n1. **生长发育必需**：6-12岁是孩子生长发育的黄金时期，充足的营养是身体健康和智力发展的基础。\n\n2. **现实令人担忧**：调研显示，超过60%的山区儿童午餐营养不达标，蛋白质摄入量仅为推荐量的50%。\n\n3. **影响深远**：营养不良不仅影响孩子的身体发育，还会导致注意力不集中、学习能力下降，影响他们的未来。\n\n4. **您的帮助很重要**：每天只需10元，就能为一个孩子提供一份营养均衡的午餐。您的善举，可能改变一个孩子的一生。',
      update:
        '【项目进展 | 三月份报告】\n\n亲爱的捐赠人：\n\n感谢您一直以来对「山区儿童营养午餐计划」的支持！以下是三月份的项目进展：\n\n✅ **完成情况**\n- 本月共为1200名孩子提供了22天营养午餐\n- 新增凉山州4所学校加入项目\n- 完成春季食材招标工作\n\n📊 **数据速览**\n- 累计供餐：105,600人次\n- 食材采购：花费26.4万元\n- 学生体检：身高体重达标率提升15%\n\n💬 **孩子们的话**\n「我最喜欢周三的鸡腿！奶奶说我长高了。」—— 小明，8岁\n\n下个月，我们将开展「亲子开放日」活动，邀请家长们来学校一起用餐。敬请期待！',
      thanks:
        '亲爱的捐赠人：\n\n展信佳！\n\n春暖花开的三月，我们怀着感恩的心，向您道一声：谢谢！\n\n因为有您，1200名山区孩子每天都能吃上热腾腾的营养午餐。他们的小脸圆润了，笑声更响亮了，课堂上也更有精神了。\n\n您的每一分善款，都化作了孩子们碗里的饭菜、脸上的笑容、眼中的光芒。\n\n我们郑重承诺：\n- 每一笔善款都将公开透明，定期公示\n- 每一顿午餐都有专人监督，确保营养卫生\n- 每一份心意都将被珍视，转化为实实在在的帮助\n\n再次感谢您的爱心与支持。愿善意的种子，在您我心中生根发芽，开出最美的花。\n\n 山区儿童营养午餐项目组\n 2024年3月',
    };

    const targetText = sampleTexts[activeType];
    let index = 0;
    const speed = 30;

    const typeWriter = () => {
      if (index < targetText.length) {
        setDisplayedText(targetText.slice(0, index + 1));
        index++;
        setTimeout(typeWriter, speed);
      } else {
        setIsGenerating(false);
        setContent(targetText);
      }
    };

    setTimeout(typeWriter, 500);
  };

  const handleSave = () => {
    updateCopywriting(activeType, content);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-warm-100">
      <PageHeader
        title="AI 文案生成"
        subtitle="智能生成公益募捐文案，让爱心更有力量"
      />
      <div className="flex h-[calc(100vh-80px)]">
        <aside className="w-64 bg-white border-r border-gray-100 p-4 flex-shrink-0">
          <nav className="space-y-2">
            {copywritingNavItems.map((item) => (
              <button
                key={item.type}
                onClick={() => setActiveType(item.type)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeType === item.type
                    ? 'bg-primary-100 text-primary-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 bg-white"
                  >
                    {styleOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-full font-medium transition-all duration-200 hover:shadow-warm-lg hover:from-primary-600 hover:to-primary-500 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <Sparkles size={18} className={isGenerating ? 'animate-spin' : ''} />
                    <span>{isGenerating ? '生成中...' : 'AI 生成'}</span>
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white text-primary-500 border border-primary-200 rounded-full font-medium transition-all duration-200 hover:bg-primary-50 hover:border-primary-300 active:scale-95"
                  >
                    <Save size={18} />
                    <span>保存</span>
                  </button>
                </div>
              </div>

              <div className="p-8">
                {isGenerating ? (
                  <div className="min-h-[400px] text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {displayedText}
                    <span className="typing-cursor" />
                  </div>
                ) : (
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full min-h-[400px] p-0 text-gray-700 leading-relaxed resize-none focus:outline-none border-none bg-transparent"
                    placeholder="点击「AI 生成」按钮开始创作..."
                  />
                )}
              </div>

              {currentCopywriting && (
                <div className="px-6 py-4 bg-warm-50 border-t border-warm-100 flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-6">
                    <span>版本号：v{currentCopywriting.version}</span>
                    <span>创建时间：{formatDate(currentCopywriting.createdAt)}</span>
                    <span>创建者：{currentCopywriting.createdBy}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
