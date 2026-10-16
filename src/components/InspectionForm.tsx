import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Upload, 
  X, 
  RefreshCw, 
  Sparkles,
  MapPin,
  Cpu,
  User,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { PlantLocation, InspectionStatus, InspectionRecord, EquipmentItem } from '../types';
import { samplePresetEquipments, quickStatusNotes } from '../data/mockInspections';
import { getEquipmentFallbackImage } from '../utils/imageFallback';

interface InspectionFormProps {
  onSubmit: (record: Omit<InspectionRecord, 'id' | 'timestamp'>) => void;
  lastInspectorName?: string;
  equipments?: EquipmentItem[];
}

export const InspectionForm: React.FC<InspectionFormProps> = ({ 
  onSubmit, 
  lastInspectorName = '', 
  equipments = [] 
}) => {
  const [plant, setPlant] = useState<PlantLocation>('高雄港發貨站');
  const [equipmentName, setEquipmentName] = useState('');
  const [equipmentId, setEquipmentId] = useState('');
  const [inspectorName, setInspectorName] = useState(lastInspectorName || '周專員');
  const [status, setStatus] = useState<InspectionStatus>('normal');
  const [description, setDescription] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  // 快捷點選設備預設先顯示空白
  const [quickPresets, setQuickPresets] = useState<{ id?: string; name: string; plant?: PlantLocation }[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync saved inspector name
  useEffect(() => {
    if (lastInspectorName && !inspectorName) {
      setInspectorName(lastInspectorName);
    }
  }, [lastInspectorName]);

  // Handle Photo selection from camera/gallery
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Preset equipment selection
  const handleSelectPreset = (item: { id?: string; name: string; plant?: PlantLocation }) => {
    setEquipmentName(item.name);
    if (item.id) setEquipmentId(item.id);
    if (item.plant) setPlant(item.plant);
    if (errors.equipmentName) {
      setErrors((prev) => ({ ...prev, equipmentName: '' }));
    }
  };

  // Add quick note snippet
  const handleAddQuickNote = (note: string) => {
    if (!description.trim()) {
      setDescription(note);
    } else {
      setDescription((prev) => `${prev}；${note}`);
    }
  };

  // Use sample demonstration photo
  const handleUseSamplePhoto = () => {
    const fallback = getEquipmentFallbackImage(equipmentName || 'SEC-EQUIP-01', status);
    setPhotoPreview(fallback);
  };

  // Validate and submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!plant) newErrors.plant = '請選擇巡檢廠區';
    if (!equipmentName.trim()) newErrors.equipmentName = '請輸入設備名稱';
    if (!inspectorName.trim()) newErrors.inspectorName = '請填寫巡檢人員姓名';
    if (!description.trim()) newErrors.description = '請簡要說明現場巡檢狀況';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to error on mobile
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      onSubmit({
        plant,
        equipmentName: equipmentName.trim(),
        equipmentId: equipmentId.trim() || undefined,
        inspectorName: inspectorName.trim(),
        status,
        description: description.trim(),
        photoUrl: photoPreview || undefined,
        severity: status === 'abnormal' ? 'medium' : undefined,
      });

      setIsSubmitting(false);
      setToastMessage('巡檢紀錄已成功送出！');
      
      // Reset form partially (keep plant & inspector name for next round)
      setEquipmentName('');
      setEquipmentId('');
      setDescription('');
      setPhotoPreview(null);
      setStatus('normal');

      setTimeout(() => setToastMessage(null), 3500);
    }, 400);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Card Header */}
      <div className="bg-slate-800 text-white px-5 py-4 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-orange-600/30 text-orange-400 border border-orange-500/30">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg tracking-tight">巡檢填報表單</h2>
            <p className="text-xs text-slate-300">廠區現場人員操作介面（支援大尺寸觸控）</p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-slate-700 font-mono text-slate-200 border border-slate-600">
          現場即時上傳
        </span>
      </div>

      {toastMessage && (
        <div className="mx-4 mt-4 p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-2 text-emerald-800 text-sm font-semibold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
        {/* 1. 廠區選擇 */}
        <div>
          <label className="flex items-center gap-1.5 text-base font-bold text-slate-800 mb-2">
            <MapPin className="w-5 h-5 text-orange-600" />
            <span>巡檢廠區</span>
            <span className="text-red-500 text-sm">*</span>
          </label>
          <div className="relative">
            <select
              value={plant}
              onChange={(e) => setPlant(e.target.value as PlantLocation)}
              className="w-full h-14 px-4 text-base font-semibold text-slate-800 bg-slate-50 border-2 border-slate-300 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all appearance-none cursor-pointer"
            >
              <option value="高雄港發貨站">高雄港發貨站 (Kaohsiung Harbor Terminal)</option>
              <option value="總公司">總公司廠區 (Headquarters Plant)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {errors.plant && <p className="mt-1 text-sm font-medium text-red-600">{errors.plant}</p>}
        </div>

        {/* 2. 設備名稱 (具備下拉式選項快速選取 + 手動文字輸入) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-1.5 text-base font-bold text-slate-800">
              <Cpu className="w-5 h-5 text-orange-600" />
              <span>設備名稱</span>
              <span className="text-red-500 text-sm">*</span>
            </label>
            <span className="text-xs text-slate-500">可由下拉選取或直接手動輸入</span>
          </div>

          <div className="space-y-2">
            {/* 下拉式選項快速選取 */}
            <div className="relative">
              <select
                value={equipmentName}
                onChange={(e) => {
                  const val = e.target.value;
                  setEquipmentName(val);
                  const matched = equipments.find((eq) => eq.name === val);
                  if (matched) {
                    setEquipmentId(matched.id);
                    if (matched.plant) setPlant(matched.plant);
                  }
                  if (errors.equipmentName) setErrors((prev) => ({ ...prev, equipmentName: '' }));
                }}
                className="w-full h-12 px-3.5 pr-10 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-300 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer appearance-none transition-all"
              >
                <option value="">▼ 下拉式選項快速選擇設備（點此展開清單）...</option>
                <optgroup label={`【${plant}】常用設備資料庫`}>
                  {equipments
                    .filter((eq) => eq.plant === plant)
                    .map((eq) => (
                      <option key={eq.id} value={eq.name}>
                        {eq.name}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="【其他廠區設備】">
                  {equipments
                    .filter((eq) => eq.plant !== plant)
                    .map((eq) => (
                      <option key={eq.id} value={eq.name}>
                        {eq.name} ({eq.plant})
                      </option>
                    ))}
                </optgroup>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* 手動文字輸入框 */}
            <div className="relative">
              <input
                type="text"
                value={equipmentName}
                onChange={(e) => {
                  const val = e.target.value;
                  setEquipmentName(val);
                  const matched = equipments.find((eq) => eq.name === val.trim());
                  if (matched) {
                    setEquipmentId(matched.id);
                  }
                  if (errors.equipmentName) setErrors((prev) => ({ ...prev, equipmentName: '' }));
                }}
                placeholder="文字輸入設備名稱 (如: 2號散裝水泥儲槽，亦可自行輸入新設備)"
                className="w-full h-14 px-4 pr-24 text-base font-semibold text-slate-900 bg-slate-50 border-2 border-slate-300 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/20 placeholder:text-slate-400 placeholder:text-sm sm:placeholder:text-base transition-all"
              />
              {equipmentId && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold border border-slate-300">
                  {equipmentId}
                </span>
              )}
            </div>
          </div>
          {errors.equipmentName && <p className="mt-1 text-sm font-medium text-red-600">{errors.equipmentName}</p>}

          {/* 快捷點選設備 (依需求預設先顯示空白，括弧內編號不顯示) */}
          <div className="mt-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-500">快捷點選設備：</span>
              {quickPresets.length === 0 && (
                <button
                  type="button"
                  onClick={() => setQuickPresets(equipments.length > 0 ? equipments : samplePresetEquipments)}
                  className="text-xs text-orange-600 hover:text-orange-700 font-medium cursor-pointer"
                >
                  + 載入廠區常用清單
                </button>
              )}
            </div>
            {quickPresets.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {quickPresets.map((item, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handleSelectPreset(item)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all text-left cursor-pointer ${
                      equipmentName === item.name
                        ? 'bg-orange-600 text-white border-orange-600 font-bold shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                    }`}
                  >
                    {/* 括弧內編號不顯示，僅顯示設備名稱 */}
                    <span className="font-semibold">{item.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 3. 巡檢人員姓名 */}
        <div>
          <label className="flex items-center gap-1.5 text-base font-bold text-slate-800 mb-2">
            <User className="w-5 h-5 text-orange-600" />
            <span>巡檢人員姓名</span>
            <span className="text-red-500 text-sm">*</span>
          </label>
          <input
            type="text"
            value={inspectorName}
            onChange={(e) => {
              setInspectorName(e.target.value);
              if (errors.inspectorName) setErrors((prev) => ({ ...prev, inspectorName: '' }));
            }}
            placeholder="請輸入巡檢人員姓名 (如: 陳建宏)"
            className="w-full h-14 px-4 text-base font-semibold text-slate-900 bg-slate-50 border-2 border-slate-300 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/20 placeholder:text-slate-400 placeholder:font-normal transition-all"
          />
          {errors.inspectorName && <p className="mt-1 text-sm font-medium text-red-600">{errors.inspectorName}</p>}
        </div>

        {/* 4. 檢查結果 (綠色「正常」、紅色「異常」大尺寸單選按鈕) */}
        <div>
          <label className="flex items-center gap-1.5 text-base font-bold text-slate-800 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span>檢查結果</span>
            <span className="text-red-500 text-sm">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Normal Button (Green) */}
            <button
              type="button"
              onClick={() => setStatus('normal')}
              className={`h-20 sm:h-24 rounded-2xl border-3 flex flex-col sm:flex-row items-center justify-center gap-2 p-3 transition-all cursor-pointer ${
                status === 'normal'
                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/30 scale-[1.01]'
                  : 'bg-emerald-50/60 hover:bg-emerald-100/60 text-emerald-800 border-emerald-300'
              }`}
            >
              <CheckCircle2 className={`w-7 h-7 sm:w-8 sm:h-8 ${status === 'normal' ? 'text-white' : 'text-emerald-600'}`} />
              <div className="text-center sm:text-left">
                <div className="text-lg sm:text-xl font-black tracking-wide">正常</div>
                <div className={`text-xs ${status === 'normal' ? 'text-emerald-100' : 'text-emerald-700'}`}>
                  運轉指標符合標準
                </div>
              </div>
            </button>

            {/* Abnormal Button (Red) */}
            <button
              type="button"
              onClick={() => setStatus('abnormal')}
              className={`h-20 sm:h-24 rounded-2xl border-3 flex flex-col sm:flex-row items-center justify-center gap-2 p-3 transition-all cursor-pointer ${
                status === 'abnormal'
                  ? 'bg-red-600 text-white border-red-700 shadow-md shadow-red-600/30 scale-[1.01]'
                  : 'bg-red-50/60 hover:bg-red-100/60 text-red-800 border-red-300'
              }`}
            >
              <AlertTriangle className={`w-7 h-7 sm:w-8 sm:h-8 ${status === 'abnormal' ? 'text-white' : 'text-red-600'}`} />
              <div className="text-center sm:text-left">
                <div className="text-lg sm:text-xl font-black tracking-wide">異常</div>
                <div className={`text-xs ${status === 'abnormal' ? 'text-red-100' : 'text-red-700'}`}>
                  需通報維修或追蹤
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* 5. 狀況說明 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-1.5 text-base font-bold text-slate-800">
              <FileText className="w-5 h-5 text-orange-600" />
              <span>狀況說明</span>
              <span className="text-red-500 text-sm">*</span>
            </label>
            <span className="text-xs text-slate-500">可點選下方常用語快速填寫</span>
          </div>

          <textarea
            rows={3}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
            }}
            placeholder={
              status === 'normal'
                ? '請描述運轉狀況，如：油位正常、無異音、震動與溫度正常...'
                : '請詳細填寫異常細節，如：法蘭漏氣、軸承過熱、異音部位、是否已通報保修組...'
            }
            className="w-full p-4 text-base text-slate-900 bg-slate-50 border-2 border-slate-300 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/20 placeholder:text-slate-400 transition-all resize-y"
          />
          {errors.description && <p className="mt-1 text-sm font-medium text-red-600">{errors.description}</p>}

          {/* Quick status phrase buttons */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(status === 'normal' ? quickStatusNotes.normal : quickStatusNotes.abnormal).map((note, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => handleAddQuickNote(note)}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer"
              >
                + {note}
              </button>
            ))}
          </div>
        </div>

        {/* 6. 現場照片上傳區 (有相機圖示的點擊按鈕) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-1.5 text-base font-bold text-slate-800">
              <Camera className="w-5 h-5 text-orange-600" />
              <span>現場照片上傳</span>
              <span className="text-xs text-slate-500 font-normal">(選填存證)</span>
            </label>
            <button
              type="button"
              onClick={handleUseSamplePhoto}
              className="text-xs text-orange-600 hover:text-orange-700 font-medium underline flex items-center gap-1 cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>使用示範照片</span>
            </button>
          </div>

          {/* Hidden native camera/file input */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            capture="environment"
            onChange={handlePhotoChange}
            className="hidden"
          />

          {!photoPreview ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full min-h-[120px] sm:min-h-[140px] border-2 border-dashed border-slate-300 hover:border-orange-500 bg-slate-50 hover:bg-orange-50/40 rounded-2xl flex flex-col items-center justify-center p-4 transition-all group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-inner">
                <Camera className="w-7 h-7" />
              </div>
              <span className="text-base font-bold text-slate-800 group-hover:text-orange-600">
                點擊拍照或上傳現場照片
              </span>
              <span className="text-xs text-slate-500 mt-1">
                手機點擊可直接啟動相機現場拍攝 · 支援 JPG / PNG
              </span>
            </button>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border-2 border-slate-300 bg-slate-900 group">
              <img
                src={photoPreview}
                alt="現場巡檢照片預覽"
                className="w-full h-56 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-3 p-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-white text-slate-900 text-sm font-bold rounded-xl shadow flex items-center gap-1.5 hover:bg-slate-100"
                >
                  <RefreshCw className="w-4 h-4 text-orange-600" />
                  重新拍攝
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoPreview(null)}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-xl shadow flex items-center gap-1.5 hover:bg-red-700"
                >
                  <X className="w-4 h-4" />
                  刪除照片
                </button>
              </div>

              {/* Mobile always visible action overlay */}
              <div className="absolute top-2 right-2 flex items-center gap-2 sm:hidden">
                <button
                  type="button"
                  onClick={() => setPhotoPreview(null)}
                  className="p-2 bg-black/70 text-white rounded-full hover:bg-black"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/70 rounded-md text-white text-xs font-mono">
                已準備就緒照片
              </div>
            </div>
          )}
        </div>

        {/* 7. 送出按鈕 (大尺寸，顯眼) */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-16 sm:h-18 rounded-2xl bg-orange-600 hover:bg-orange-700 active:scale-[0.98] text-white text-xl font-black tracking-wide shadow-lg shadow-orange-600/30 flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-75 disabled:pointer-events-none border border-orange-500/40"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-6 h-6 animate-spin text-white" />
                <span>資料上傳存證中...</span>
              </>
            ) : (
              <>
                <Send className="w-6 h-6" />
                <span>確認送出巡檢紀錄</span>
              </>
            )}
          </button>
          <p className="text-center text-xs text-slate-400 mt-2">
            送出後紀錄將即時寫入歷史看板，並提供高雄港與總公司廠區主管查閱
          </p>
        </div>
      </form>
    </div>
  );
};
