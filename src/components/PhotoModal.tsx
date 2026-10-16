import React from 'react';
import { X, Calendar, MapPin, User, Cpu, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { InspectionRecord } from '../types';

interface PhotoModalProps {
  record: InspectionRecord | null;
  onClose: () => void;
}

export const PhotoModal: React.FC<PhotoModalProps> = ({ record, onClose }) => {
  if (!record) return null;

  const isAbnormal = record.status === 'abnormal';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white">
              {record.equipmentName || record.equipmentId}
            </span>
            {record.equipmentId && record.equipmentName && (
              <span className="text-slate-400 font-mono text-xs px-2 py-0.5 rounded bg-slate-850 border border-slate-700">
                {record.equipmentId}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 max-h-[80vh] overflow-y-auto space-y-4">
          {/* Photo */}
          {record.photoUrl ? (
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-black flex items-center justify-center max-h-[380px]">
              <img
                src={record.photoUrl}
                alt="現場巡檢照片"
                className="max-h-[380px] w-auto object-contain"
              />
            </div>
          ) : (
            <div className="h-40 rounded-xl border border-slate-800 bg-slate-800/50 flex items-center justify-center text-slate-400 text-sm">
              現場未附帶相片
            </div>
          )}

          {/* Details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-750">
              <span className="text-xs text-slate-400 block mb-1">廠區位置</span>
              <span className="font-bold flex items-center gap-1.5 text-slate-100">
                <MapPin className="w-4 h-4 text-orange-400" />
                {record.plant}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-750">
              <span className="text-xs text-slate-400 block mb-1">巡檢判定</span>
              <span className={`font-bold flex items-center gap-1.5 ${isAbnormal ? 'text-red-400' : 'text-emerald-400'}`}>
                {isAbnormal ? <AlertTriangle className="w-4 h-4 text-red-500" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                {isAbnormal ? '異常 (需追蹤修護)' : '正常 (符合運行標準)'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-750">
              <span className="text-xs text-slate-400 block mb-1">巡檢工程師</span>
              <span className="font-bold flex items-center gap-1.5 text-slate-100">
                <User className="w-4 h-4 text-slate-400" />
                {record.inspectorName}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-750">
              <span className="text-xs text-slate-400 block mb-1">查驗時間</span>
              <span className="font-mono text-xs font-semibold flex items-center gap-1.5 text-slate-300">
                <Calendar className="w-4 h-4 text-slate-400" />
                {record.timestamp}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700">
            <span className="text-xs font-bold text-slate-400 block mb-1.5">現場巡檢狀況詳細說明</span>
            <p className="text-slate-100 text-sm leading-relaxed whitespace-pre-line">
              {record.description}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition-colors"
          >
            關閉檢視
          </button>
        </div>
      </div>
    </div>
  );
};
