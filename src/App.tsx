import { useState, useEffect } from "react";
import { GoogleGenAI, Type } from "@google/genai";
import { motion } from "motion/react";
import { 
  BarChart3, 
  Brain, 
  ChevronRight, 
  History, 
  Lightbulb, 
  Loader2, 
  Plus, 
  Sparkles, 
  Trash2, 
  TrendingUp, 
  Youtube,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check
} from "lucide-react";
import { HistoricalData, TitleGenerationResult } from "./types";

const INITIAL_HISTORICAL_DATA: HistoricalData[] = [
  { title: "Tôi đã ở 24 giờ trong ngôi nhà rùng rợn nhất Việt Nam", ctr: 12.8 },
  { title: "Cách nấu phở bò truyền thống tại nhà", ctr: 2.4 },
  { title: "Đừng bao giờ mua iPhone cũ nếu chưa xem video này!", ctr: 15.2 },
  { title: "Review điện thoại mới ra mắt tháng này", ctr: 3.8 },
  { title: "Thử thách ăn 100 bát mì cay trong 10 phút (Cái kết bất ngờ)", ctr: 11.5 },
  { title: "Vlog đi du lịch Đà Lạt cùng gia đình", ctr: 1.9 },
  { title: "Bí mật đằng sau sự thành công của các YouTuber triệu view", ctr: 9.7 },
  { title: "Hướng dẫn sử dụng phần mềm dựng phim cơ bản", ctr: 2.1 },
  { title: "Tôi đã chi 1 tỷ đồng để mua thứ này... và tôi hối hận", ctr: 14.3 },
  { title: "Top 10 mẹo vặt cuộc sống bạn nên biết", ctr: 4.2 },
];

export default function App() {
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>(INITIAL_HISTORICAL_DATA);
  const [newTopic, setNewTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<TitleGenerationResult | null>(null);

  const loadingSteps = [
    "Khởi tạo hệ thống phân tích AI...",
    "Đang quét dữ liệu CTR lịch sử...",
    "Xác định các mẫu tiêu đề thành công...",
    "Phân tích tâm lý người xem...",
    "Xây dựng mô hình chiến lược tối ưu...",
    "Đang tạo các tiêu đề triệu view..."
  ];

  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep(prev => (prev + 1) % loadingSteps.length);
      }, 2000);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const [error, setError] = useState<string | null>(null);

  const addHistoricalEntry = () => {
    setHistoricalData([...historicalData, { title: "", ctr: 0 }]);
  };

  const updateHistoricalEntry = (index: number, field: keyof HistoricalData, value: string | number) => {
    const newData = [...historicalData];
    if (field === "ctr") {
      newData[index].ctr = Number(value);
    } else {
      newData[index].title = String(value);
    }
    setHistoricalData(newData);
  };

  const removeHistoricalEntry = (index: number) => {
    setHistoricalData(historicalData.filter((_, i) => i !== index));
  };

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const generateTitles = async () => {
    if (!newTopic.trim()) {
      setError("Please enter a video topic.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      const prompt = `
        Bạn là một hệ thống AI tiên tiến học hỏi từ các tiêu đề YouTube có tỷ lệ click (CTR) cao và liên tục cải thiện việc tạo tiêu đề.
        Bạn mô phỏng một HỆ THỐNG HỌC HỎI THỰC TẾ để tối ưu hóa tiêu đề.
        TẤT CẢ CÁC TRƯỜNG VĂN BẢN TRONG KẾT QUẢ TRẢ VỀ PHẢI LÀ TIẾNG VIỆT.

        ---
        DỮ LIỆU ĐẦU VÀO:
        Dữ liệu tiêu đề lịch sử:
        ${historicalData.map(d => `- "${d.title}" (CTR: ${d.ctr}%)`).join("\n")}

        Chủ đề video mới: "${newTopic}"
        ---

        BƯỚC 1 — GIAI ĐOẠN HỌC HỎI
        Phân tích tiêu đề lịch sử và dữ liệu CTR.
        Nhiệm vụ:
        - Phân loại tiêu đề CTR CAO (ctr > 8%) và tiêu đề CTR THẤP (ctr < 4%)
        - Xác định các mẫu trong tiêu đề CTR CAO: số lượng từ, kích thích cảm xúc, từ khóa, định dạng (số, viết hoa, câu hỏi)
        - Xác định các mẫu trong tiêu đề CTR THẤP
        - Rút ra sự khác biệt

        BƯỚC 2 — XÂY DỰNG MÔ HÌNH CHIẾN LƯỢC TIÊU ĐỀ
        Tạo một mô hình chiến lược có thể tái sử dụng bao gồm: công thức tiêu đề thành công, các mẫu thất bại, kích thích tâm lý.

        BƯỚC 3 — GIAI ĐOẠN TẠO TIÊU ĐỀ
        Tạo 5 tiêu đề YouTube có CTR CAO cho chủ đề video mới CHỈ sử dụng các mẫu thành công.

        QUY TẮC TIÊU ĐỀ:
        - Độ dài: 40–80 ký tự
        - Sử dụng khoảng trống tò mò (curiosity gap)
        - Sử dụng kích thích cảm xúc (sợ hãi, tò mò, cấp bách, ngạc nhiên)
        - Bao gồm các con số hoặc từ ngữ mạnh mẽ nếu hiệu quả
        - Tránh các cụm từ chung chung

        ĐỊNH DẠNG ĐẦU RA (JSON NGHIÊM NGẶT):
        {
          "learning": {
            "high_ctr_patterns": "chuỗi văn bản tiếng Việt",
            "low_ctr_patterns": "chuỗi văn bản tiếng Việt",
            "winning_formulas": "chuỗi văn bản tiếng Việt",
            "psychology_triggers": "chuỗi văn bản tiếng Việt"
          },
          "title_strategy_model": "chuỗi văn bản tiếng Việt",
          "titles": [
            {
              "title": "chuỗi văn bản tiếng Việt",
              "reason": "chuỗi văn bản tiếng Việt",
              "predicted_ctr_score": số (1-10)
            }
          ]
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              learning: {
                type: Type.OBJECT,
                properties: {
                  high_ctr_patterns: { type: Type.STRING },
                  low_ctr_patterns: { type: Type.STRING },
                  winning_formulas: { type: Type.STRING },
                  psychology_triggers: { type: Type.STRING },
                },
                required: ["high_ctr_patterns", "low_ctr_patterns", "winning_formulas", "psychology_triggers"],
              },
              title_strategy_model: { type: Type.STRING },
              titles: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    reason: { type: Type.STRING },
                    predicted_ctr_score: { type: Type.NUMBER },
                  },
                  required: ["title", "reason", "predicted_ctr_score"],
                },
              },
            },
            required: ["learning", "title_strategy_model", "titles"],
          },
        },
      });

      const data = JSON.parse(response.text || "{}");
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Không thể tạo tiêu đề. Vui lòng thử lại.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] font-sans selection:bg-[#FF6B00] selection:text-black">
      {/* Header */}
      <header className="border-b border-white/5 p-6 flex items-center justify-between bg-[#0A0A0A]">
        <div className="flex items-center gap-3">
          <div className="bg-[#FF6B00]/10 p-2 rounded-sm border border-[#FF6B00]/20">
            <Youtube className="text-[#FF6B00] w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight uppercase italic font-serif">Optimizer Title</h1>
            <p className="text-[10px] uppercase tracking-widest opacity-50 font-mono text-[#FF6B00]">Công cụ Chiến lược Tiêu đề YouTube</p>
          </div>
        </div>
        <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-widest opacity-50">
          <span>v2.5.0</span>
          <div className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" />
          <span>Hệ thống Trực tuyến</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-88px)]">
        {/* Left Column: Input */}
        <div className="lg:col-span-5 border-r border-white/5 p-8 flex flex-col gap-8 bg-[#080808]">
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#FF6B00]" />
                <h2 className="text-xs uppercase tracking-widest font-bold font-mono">Dữ liệu Lịch sử</h2>
              </div>
              <button 
                onClick={addHistoricalEntry}
                className="p-1 hover:bg-[#FF6B00] hover:text-black transition-colors border border-[#FF6B00]/30"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {historicalData.map((entry, idx) => (
                <div key={idx} className="flex gap-2 group">
                  <input 
                    type="text"
                    value={entry.title}
                    onChange={(e) => updateHistoricalEntry(idx, "title", e.target.value)}
                    placeholder="Tiêu đề Video"
                    className="flex-1 bg-[#111] border border-white/5 p-2 text-xs focus:outline-none focus:border-[#FF6B00]/50 transition-colors"
                  />
                  <div className="relative w-24">
                    <input 
                      type="number"
                      value={entry.ctr}
                      onChange={(e) => updateHistoricalEntry(idx, "ctr", e.target.value)}
                      placeholder="CTR %"
                      className="w-full bg-[#111] border border-white/5 p-2 text-xs focus:outline-none focus:border-[#FF6B00]/50 transition-colors pr-6"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] opacity-50">%</span>
                  </div>
                  <button 
                    onClick={() => removeHistoricalEntry(idx)}
                    className="p-2 border border-white/5 hover:bg-red-500/80 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-auto pt-8 border-t border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-[#FF6B00]" />
              <h2 className="text-xs uppercase tracking-widest font-bold font-mono">Chủ đề Mới</h2>
            </div>
            <textarea 
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="Video của bạn nói về điều gì? (VD: 'Tôi đã ở 24 giờ trong ngôi nhà ma')"
              className="w-full bg-[#111] border border-white/5 p-4 text-sm focus:outline-none focus:border-[#FF6B00]/50 transition-colors min-h-[120px] resize-none"
            />
            
            <button 
              onClick={generateTitles}
              disabled={isGenerating}
              className="w-full mt-4 bg-[#FF6B00] text-black py-4 flex items-center justify-center gap-2 hover:bg-[#FF8533] disabled:opacity-50 transition-all group font-bold"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-xs uppercase tracking-widest font-mono">Đang Phân tích & Tạo...</span>
                </>
              ) : (
                <>
                  <span className="text-xs uppercase tracking-widest font-mono">Bắt đầu Tối ưu hóa</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            {error && (
              <div className="mt-4 flex items-center gap-2 text-red-400 text-[10px] uppercase font-mono">
                <AlertCircle className="w-3 h-3" />
                {error}
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Output */}
        <div className="lg:col-span-7 p-8 bg-[#050505] overflow-y-auto custom-scrollbar">
          {!result && !isGenerating && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
              <Brain className="w-16 h-16 mb-4 text-[#FF6B00]" />
              <h3 className="text-sm uppercase tracking-[0.2em] font-bold font-mono">Đang chờ Thông số Đầu vào</h3>
              <p className="text-xs mt-2 max-w-xs">Nhập dữ liệu lịch sử và chủ đề video để bắt đầu giai đoạn học hỏi.</p>
            </div>
          )}

          {isGenerating && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="relative mb-12">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-[#FF6B00]/20 blur-3xl rounded-full"
                />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="relative"
                >
                  <Brain className="w-16 h-16 text-[#FF6B00]" />
                </motion.div>
                <motion.div 
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0, 0.5, 0]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute -inset-4 border border-[#FF6B00]/30 rounded-full"
                />
              </div>

              <div className="space-y-8 w-full max-w-sm">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-[#FF6B00]/70">
                    <span>Tiến trình xử lý</span>
                    <span>{Math.round(((loadingStep + 1) / loadingSteps.length) * 100)}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 overflow-hidden rounded-full border border-white/5">
                    <motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-[#FF6B00]/50 to-[#FF6B00]"
                    />
                  </div>
                </div>

                <div className="relative h-6 overflow-hidden">
                  <motion.div 
                    key={loadingStep}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="text-[11px] uppercase tracking-[0.2em] font-mono text-[#FF6B00] font-bold"
                  >
                    {loadingSteps[loadingStep]}
                  </motion.div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          animate={{ 
                            x: ["-100%", "100%"] 
                          }}
                          transition={{ 
                            duration: 1 + i, 
                            repeat: Infinity, 
                            ease: "linear" 
                          }}
                          className="h-full w-1/2 bg-[#FF6B00]/30"
                        />
                      </div>
                      <div className="text-[8px] font-mono opacity-30 uppercase">Node_{i+1}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              {/* Learning Phase Section */}
              <section>
                <div className="flex items-center gap-2 mb-6 border-b border-[#FF6B00]/20 pb-2">
                  <Brain className="w-4 h-4 text-[#FF6B00]" />
                  <h2 className="text-xs uppercase tracking-widest font-bold font-mono">Giai đoạn 1: Phân tích Học hỏi</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-[#111] p-4 border-l-2 border-green-500/50">
                      <h3 className="text-[10px] uppercase font-mono font-bold text-green-400 mb-1">Mẫu CTR Cao</h3>
                      <p className="text-xs leading-relaxed opacity-80">{result.learning.high_ctr_patterns}</p>
                    </div>
                    <div className="bg-[#111] p-4 border-l-2 border-red-500/50">
                      <h3 className="text-[10px] uppercase font-mono font-bold text-red-400 mb-1">Mẫu CTR Thấp</h3>
                      <p className="text-xs leading-relaxed opacity-80">{result.learning.low_ctr_patterns}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-[#111] p-4 border-l-2 border-[#FF6B00]/50">
                      <h3 className="text-[10px] uppercase font-mono font-bold text-[#FF6B00] mb-1">Công thức Thành công</h3>
                      <p className="text-xs leading-relaxed opacity-80">{result.learning.winning_formulas}</p>
                    </div>
                    <div className="bg-[#111] p-4 border-l-2 border-[#FF6B00]/50">
                      <h3 className="text-[10px] uppercase font-mono font-bold text-[#FF6B00] mb-1">Kích thích Tâm lý</h3>
                      <p className="text-xs leading-relaxed opacity-80">{result.learning.psychology_triggers}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Strategy Model Section */}
              <section>
                <div className="flex items-center gap-2 mb-6 border-b border-[#FF6B00]/20 pb-2">
                  <Lightbulb className="w-4 h-4 text-[#FF6B00]" />
                  <h2 className="text-xs uppercase tracking-widest font-bold font-mono">Giai đoạn 2: Mô hình Chiến lược</h2>
                </div>
                <div className="bg-[#111] text-white p-6 rounded-sm font-serif italic text-sm leading-relaxed border border-[#FF6B00]/10 shadow-[0_0_20px_rgba(255,107,0,0.05)]">
                  "{result.title_strategy_model}"
                </div>
              </section>

              {/* Generated Titles Section */}
              <section>
                <div className="flex items-center gap-2 mb-6 border-b border-[#FF6B00]/20 pb-2">
                  <TrendingUp className="w-4 h-4 text-[#FF6B00]" />
                  <h2 className="text-xs uppercase tracking-widest font-bold font-mono">Giai đoạn 3: Tiêu đề đã Tạo</h2>
                </div>
                <div className="space-y-4">
                  {result.titles.map((title, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group border border-white/5 p-4 hover:bg-[#FF6B00] hover:text-black transition-all cursor-pointer relative overflow-hidden bg-[#0A0A0A]"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-mono opacity-50">0{idx + 1}</span>
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(title.title, idx);
                            }}
                            className="flex items-center gap-1.5 text-[10px] font-mono font-bold hover:underline"
                          >
                            {copiedIndex === idx ? (
                              <>
                                <Check className="w-3 h-3 text-green-500 group-hover:text-black" />
                                <span>ĐÃ SAO CHÉP</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>SAO CHÉP</span>
                              </>
                            )}
                          </button>
                          <div className="flex items-center gap-1.5 bg-[#FF6B00]/10 px-2 py-1 rounded-sm group-hover:bg-black/10 transition-colors border border-[#FF6B00]/20">
                            <BarChart3 className="w-4 h-4 text-[#FF6B00] group-hover:text-black" />
                            <span className="text-sm font-mono font-bold text-[#FF6B00] group-hover:text-black">ĐIỂM CTR: {title.predicted_ctr_score}/10</span>
                          </div>
                        </div>
                      </div>
                      <h3 className="text-base font-bold mb-2 group-hover:italic transition-all">{title.title}</h3>
                      <p className="text-[10px] opacity-60 leading-relaxed max-w-lg group-hover:text-black/80">{title.reason}</p>
                      
                      {/* Hover Effect */}
                      <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E4E3E0;
          border-radius: 10px;
        }
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
      `}} />
    </div>
  );
}
