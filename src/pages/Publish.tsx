import { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import {
  MessageCircle,
  Twitter,
  Video,
  BookOpen,
  Heart,
  Download,
  Palette,
  Image as ImageIcon,
  Type,
  Layout,
  QrCode,
  Upload,
} from 'lucide-react';
import { PageHeader } from '../components/Layout/PageHeader';
import { useProjectStore } from '../store/useProjectStore';
import { mockPlatformConfigs } from '../data/mockData';
import type { PlatformConfig } from '../types';

const platformIcons: Record<string, React.ReactNode> = {
  'message-circle': <MessageCircle size={20} />,
  'twitter': <Twitter size={20} />,
  'video': <Video size={20} />,
  'book-open': <BookOpen size={20} />,
  'heart': <Heart size={20} />,
};

const coverTemplates = [
  { id: 't1', name: '温暖橙色', gradient: 'from-primary-400 to-primary-600', textColor: 'text-white' },
  { id: 't2', name: '森林绿意', gradient: 'from-secondary-400 to-secondary-600', textColor: 'text-white' },
  { id: 't3', name: '暖阳米白', gradient: 'from-warm-200 to-warm-400', textColor: 'text-primary-700' },
];

const qrColors = [
  { id: 'c1', name: '暖橙色', value: '#FF8C42' },
  { id: 'c2', name: '森林绿', value: '#2D6A4F' },
  { id: 'c3', name: '深灰色', value: '#333333' },
];

export default function Publish() {
  const { getCurrentProject, copywritings } = useProjectStore();
  const project = getCurrentProject();
  const introCopy = copywritings.find((c) => c.type === 'intro');

  const [selectedPlatform, setSelectedPlatform] = useState<string>('p1');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('t1');
  const [selectedQrColor, setSelectedQrColor] = useState<string>('c1');
  const [titleText, setTitleText] = useState<string>(project?.name || '');
  const qrRef = useRef<HTMLDivElement>(null);

  const currentPlatform = mockPlatformConfigs.find((p) => p.id === selectedPlatform) || mockPlatformConfigs[0];
  const currentTemplate = coverTemplates.find((t) => t.id === selectedTemplate) || coverTemplates[0];
  const currentQrColor = qrColors.find((c) => c.id === selectedQrColor) || qrColors[0];

  const previewTitle = titleText.slice(0, currentPlatform.maxTitleLength || titleText.length);
  const previewContent = introCopy?.content.slice(0, currentPlatform.maxContentLength || introCopy?.content.length) || '';

  const handleDownloadQr = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `${project?.name || '公益项目'}-二维码.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const renderPlatformPreview = (platform: PlatformConfig) => {
    switch (platform.id) {
      case 'p1':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <MessageCircle size={20} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">公益项目公众号</p>
                <p className="text-xs text-gray-400">刚刚</p>
              </div>
            </div>
            {project?.coverImage && (
              <div className="aspect-[2.35/1] overflow-hidden">
                <img src={project.coverImage} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">{previewTitle}</h3>
              <p className="text-sm text-gray-600 line-clamp-3">{previewContent}</p>
            </div>
          </div>
        );
      case 'p2':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                <Twitter size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-800 text-sm">公益项目官方</span>
                  <span className="text-xs text-gray-400">@gongyi</span>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  {previewContent.slice(0, 140)}
                  {previewContent.length > 140 && '...'}
                </p>
                {project?.coverImage && (
                  <div className="aspect-video rounded-lg overflow-hidden mb-3">
                    <img src={project.coverImage} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex items-center gap-6 text-gray-400 text-xs">
                  <span>转发 128</span>
                  <span>评论 56</span>
                  <span>赞 320</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'p3':
        return (
          <div className="bg-black rounded-lg overflow-hidden mx-auto" style={{ width: '200px', height: '356px' }}>
            <div className="relative w-full h-full">
              {project?.coverImage ? (
                <img src={project.coverImage} alt="" className="w-full h-full object-cover opacity-80" />
              ) : (
                <div className="w-full h-full bg-gradient-to-b from-primary-400 to-primary-700" />
              )}
              <div className="absolute bottom-16 left-3 right-12 text-white">
                <p className="font-medium text-sm mb-2">@公益项目官方</p>
                <p className="text-xs line-clamp-3 opacity-90">{previewTitle}</p>
              </div>
              <div className="absolute right-2 bottom-20 flex flex-col items-center gap-4 text-white">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Heart size={18} />
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle size={18} />
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Download size={18} />
                </div>
              </div>
            </div>
          </div>
        );
      case 'p4':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mx-auto" style={{ width: '240px' }}>
            <div className="aspect-[3/4] overflow-hidden relative">
              {project?.coverImage ? (
                <img src={project.coverImage} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-b from-primary-300 to-secondary-400" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="font-bold text-sm line-clamp-2">{previewTitle}</p>
              </div>
            </div>
            <div className="p-3">
              <p className="text-xs text-gray-500 line-clamp-2">{previewContent.slice(0, 80)}</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 rounded-full bg-primary-200" />
                  <span className="text-xs text-gray-500">公益小助手</span>
                </div>
                <span className="text-xs text-gray-400">❤️ 2.3k</span>
              </div>
            </div>
          </div>
        );
      case 'p5':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            {project?.coverImage && (
              <div className="aspect-square overflow-hidden">
                <img src={project.coverImage} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-4">
              <h3 className="text-base font-bold text-gray-800 mb-2">{previewTitle}</h3>
              <p className="text-xs text-gray-500 line-clamp-2 mb-3">{previewContent.slice(0, 100)}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-primary-600">¥{(project?.raisedAmount || 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-400">已筹金额</p>
                </div>
                <button className="px-4 py-1.5 bg-primary-500 text-white text-sm rounded-full">
                  立即捐赠
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-warm-100">
      <PageHeader title="多端发布" subtitle="一键生成多平台适配内容，扩大公益影响力" />

      <main className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card-warm">
              <div className="flex items-center gap-2 mb-5">
                <Layout size={20} className="text-primary-500" />
                <h2 className="section-title mb-0">选择发布平台</h2>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {mockPlatformConfigs.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => setSelectedPlatform(platform.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                      selectedPlatform === platform.id
                        ? 'bg-primary-500 text-white shadow-warm'
                        : 'bg-warm-50 text-gray-600 hover:bg-warm-100'
                    }`}
                  >
                    {platformIcons[platform.icon]}
                    <span className="text-sm font-medium">{platform.name}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-warm-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Type size={16} className="text-primary-500" />
                    <span className="text-sm font-medium text-gray-700">标题字数</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {currentPlatform.maxTitleLength > 0 ? (
                      <>
                        <span className={previewTitle.length > currentPlatform.maxTitleLength ? 'text-red-500' : 'text-primary-500'}>
                          {previewTitle.length}
                        </span>
                        <span className="text-sm text-gray-400 font-normal"> / {currentPlatform.maxTitleLength}</span>
                      </>
                    ) : (
                      <span className="text-gray-400 text-base">无限制</span>
                    )}
                  </p>
                </div>

                <div className="bg-warm-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Type size={16} className="text-secondary-500" />
                    <span className="text-sm font-medium text-gray-700">正文字数</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {currentPlatform.maxContentLength > 0 ? (
                      <>
                        <span className={previewContent.length > currentPlatform.maxContentLength ? 'text-red-500' : 'text-secondary-500'}>
                          {previewContent.length}
                        </span>
                        <span className="text-sm text-gray-400 font-normal"> / {currentPlatform.maxContentLength}</span>
                      </>
                    ) : (
                      <span className="text-gray-400 text-base">无限制</span>
                    )}
                  </p>
                </div>

                <div className="bg-warm-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ImageIcon size={16} className="text-primary-500" />
                    <span className="text-sm font-medium text-gray-700">封面比例</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {currentPlatform.coverRatio}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">内容预览</h3>
                <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-center min-h-[400px]">
                  {renderPlatformPreview(currentPlatform)}
                </div>
              </div>
            </div>

            <div className="card-warm">
              <div className="flex items-center gap-2 mb-5">
                <ImageIcon size={20} className="text-primary-500" />
                <h2 className="section-title mb-0">封面制作</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">封面预览</p>
                  <div className="relative">
                    <div className="aspect-video rounded-xl overflow-hidden shadow-lg border-4 border-white">
                      <div className={`w-full h-full bg-gradient-to-br ${currentTemplate.gradient} flex items-center justify-center p-6`}>
                        <div className="text-center">
                          <h3 className={`text-xl font-bold ${currentTemplate.textColor} line-clamp-2`}>
                            {previewTitle || '项目标题'}
                          </h3>
                          <p className={`text-sm mt-2 ${currentTemplate.textColor} opacity-80`}>
                            公益募捐项目
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white rounded-lg shadow-md flex items-center justify-center">
                      <Heart size={24} className="text-primary-500" />
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">封面模板</p>
                    <div className="grid grid-cols-3 gap-2">
                      {coverTemplates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => setSelectedTemplate(template.id)}
                          className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                            selectedTemplate === template.id
                              ? 'border-primary-500 ring-2 ring-primary-200'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`w-full h-full bg-gradient-to-br ${template.gradient}`} />
                          <p className="absolute bottom-1 left-0 right-0 text-center text-xs text-white drop-shadow">
                            {template.name}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">标题文字</p>
                    <input
                      type="text"
                      value={titleText}
                      onChange={(e) => setTitleText(e.target.value)}
                      placeholder="输入封面标题"
                      className="input-field text-sm"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">上传封面图</p>
                    <button className="w-full border-2 border-dashed border-gray-200 rounded-xl py-6 flex flex-col items-center gap-2 hover:border-primary-300 hover:bg-primary-50/50 transition-all">
                      <Upload size={24} className="text-gray-400" />
                      <span className="text-sm text-gray-500">点击或拖拽上传图片</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card-warm">
              <div className="flex items-center gap-2 mb-5">
                <QrCode size={20} className="text-primary-500" />
                <h2 className="section-title mb-0">二维码生成</h2>
              </div>

              <div className="flex flex-col items-center" ref={qrRef}>
                <div className="bg-white p-4 rounded-xl shadow-card mb-5">
                  <QRCodeCanvas
                    value={window.location.href || 'https://gongyi.example.com/project/1'}
                    size={180}
                    level="H"
                    fgColor={currentQrColor.value}
                    bgColor="#ffffff"
                  />
                </div>

                <p className="text-sm text-gray-500 mb-4 text-center">
                  扫码查看项目详情并参与捐赠
                </p>

                <button
                  onClick={handleDownloadQr}
                  className="btn-primary flex items-center gap-2 w-full justify-center"
                >
                  <Download size={18} />
                  <span>下载二维码</span>
                </button>
              </div>
            </div>

            <div className="card-warm">
              <div className="flex items-center gap-2 mb-4">
                <Palette size={18} className="text-primary-500" />
                <h3 className="text-sm font-medium text-gray-700">二维码样式</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-2">颜色选择</p>
                  <div className="flex gap-3">
                    {qrColors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedQrColor(color.id)}
                        className={`relative w-10 h-10 rounded-full transition-all ${
                          selectedQrColor === color.id
                            ? 'ring-2 ring-offset-2 ring-primary-400 scale-110'
                            : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-2">Logo设置</p>
                  <button className="w-full border-2 border-dashed border-gray-200 rounded-lg py-4 flex flex-col items-center gap-1 hover:border-primary-300 transition-all">
                    <ImageIcon size={18} className="text-gray-400" />
                    <span className="text-xs text-gray-400">上传Logo</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="card-warm bg-gradient-to-br from-primary-50 to-secondary-50">
              <h3 className="font-medium text-gray-800 mb-3">发布提示</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-primary-500 mt-0.5">•</span>
                  <span>发布前请检查各平台字数限制</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500 mt-0.5">•</span>
                  <span>确保封面图片清晰且符合平台规范</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500 mt-0.5">•</span>
                  <span>建议在不同时间段发布以获得更多曝光</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
