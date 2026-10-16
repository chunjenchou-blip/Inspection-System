import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InspectionForm } from './components/InspectionForm';
import { HistoryBoard } from './components/HistoryBoard';
import { PhotoModal } from './components/PhotoModal';
import { StandaloneHtmlModal } from './components/StandaloneHtmlModal';
import { AdminEquipmentModal } from './components/AdminEquipmentModal';
import { InspectionRecord, EquipmentItem } from './types';
import { initialRecords, defaultEquipments } from './data/mockInspections';
import { Code2, ShieldAlert, Sparkles, Building, PhoneCall, ExternalLink, Settings } from 'lucide-react';

const STORAGE_KEY = 'sec_cement_inspection_records_v1';
const INSPECTOR_STORAGE_KEY = 'sec_last_inspector_name';
const EQUIPMENT_STORAGE_KEY = 'sec_equipment_master_list_v1';

export default function App() {
  const [records, setRecords] = useState<InspectionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved inspections from localStorage', e);
    }
    return initialRecords;
  });

  const [equipments, setEquipments] = useState<EquipmentItem[]>(() => {
    try {
      const saved = localStorage.getItem(EQUIPMENT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved equipments from localStorage', e);
    }
    return defaultEquipments;
  });

  const [lastInspector, setLastInspector] = useState<string>(() => {
    try {
      return localStorage.getItem(INSPECTOR_STORAGE_KEY) || '周專員';
    } catch {
      return '周專員';
    }
  });

  const [selectedRecord, setSelectedRecord] = useState<InspectionRecord | null>(null);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Sync records to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.error('LocalStorage write failed', e);
    }
  }, [records]);

  // Sync equipments to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(EQUIPMENT_STORAGE_KEY, JSON.stringify(equipments));
    } catch (e) {
      console.error('LocalStorage write equipments failed', e);
    }
  }, [equipments]);

  // Handle Add Equipment
  const handleAddEquipment = (newEq: EquipmentItem) => {
    setEquipments((prev) => [newEq, ...prev]);
  };

  // Handle Delete Equipment
  const handleDeleteEquipment = (id: string) => {
    setEquipments((prev) => prev.filter((eq) => eq.id !== id));
  };

  // Handle Reset Equipments
  const handleResetEquipments = () => {
    setEquipments(defaultEquipments);
    try {
      localStorage.removeItem(EQUIPMENT_STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  };

  // Handle new record submitted from form
  const handleRecordSubmit = (newRecordData: Omit<InspectionRecord, 'id' | 'timestamp'>) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timestamp = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;

    const newRecord: InspectionRecord = {
      ...newRecordData,
      id: `SEC-${year}${month}${date}-${Math.floor(100 + Math.random() * 900)}`,
      timestamp,
    };

    setRecords((prev) => [newRecord, ...prev]);
    setLastInspector(newRecordData.inspectorName);
    try {
      localStorage.setItem(INSPECTOR_STORAGE_KEY, newRecordData.inspectorName);
    } catch (e) {
      // ignore
    }
  };

  // Reset to default initial records
  const handleResetDefault = () => {
    if (window.confirm('確定要還原成系統預設的示範巡檢資料嗎？')) {
      setRecords(initialRecords);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        // ignore
      }
    }
  };

  const abnormalCount = records.filter((r) => r.status === 'abnormal').length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* 頂部導覽列 */}
      <Header 
        activeCount={records.length} 
        abnormalCount={abnormalCount} 
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Industrial Safety & Plant Notice Strip */}
      <div className="bg-slate-900 border-b border-slate-800 text-slate-300 text-xs py-2 px-4 shadow-inner">
        <div className="max-w-4xl lg:max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="font-semibold text-slate-200">廠區工安守則：</span>
            <span className="text-slate-400">進入廠區請務必配戴安全帽、反光背心及防護鋼頭鞋。</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCodeModalOpen(true)}
              className="text-orange-400 hover:text-orange-300 underline font-medium flex items-center gap-1 cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>查看單一 HTML 原始碼 (CDN + JS)</span>
            </button>
            <a
              href="/standalone.html"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-slate-200 inline-flex items-center gap-1 text-[11px]"
            >
              <span>獨立網頁預覽</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl lg:max-w-6xl w-full mx-auto px-3.5 sm:px-4 py-5 sm:py-7 space-y-6">
        
        {/* Plant Status KPI quick cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] text-slate-500 font-medium block">總巡檢存證數</span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {records.length}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">高雄港發貨站 / 總公司</span>
          </div>

          <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] text-slate-500 font-medium block">運轉正常設備</span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-600 tabular-nums">
              {records.filter(r => r.status === 'normal').length}
            </span>
            <span className="text-[10px] text-emerald-700 block mt-0.5">狀態良好</span>
          </div>

          <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] text-slate-500 font-medium block">異常警示通報</span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-red-600 tabular-nums">
              {abnormalCount}
            </span>
            <span className="text-[10px] text-red-600 block mt-0.5 font-semibold">
              {abnormalCount > 0 ? '需維修保養排程' : '無異常事件'}
            </span>
          </div>

          <div className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] text-slate-500 font-medium block">目前巡檢同仁</span>
            <span className="text-base sm:text-lg font-bold text-slate-800 truncate block mt-0.5">
              {lastInspector || '巡檢小組'}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">自動記住身分</span>
          </div>
        </div>

        {/* Inspection Form Section (Top on mobile / Main work area) */}
        <section id="form-section">
          <InspectionForm 
            onSubmit={handleRecordSubmit} 
            lastInspectorName={lastInspector} 
            equipments={equipments}
          />
        </section>

        {/* History Board Section (Below Form as required) */}
        <section id="history-section">
          <HistoryBoard 
            records={records}
            onSelectRecord={(rec) => setSelectedRecord(rec)}
            onResetDefault={handleResetDefault}
          />
        </section>

      </main>

      {/* Industrial Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-6 px-4 mt-8">
        <div className="max-w-4xl lg:max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-orange-600 text-white font-black text-xs flex items-center justify-center">
              SEC
            </span>
            <span className="text-slate-300 font-semibold">東南水泥股份有限公司</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">廠區設備與安全巡檢系統 (行動版原型)</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>高雄港發貨站 / 總公司廠區</span>
            <span>·</span>
            <span>24H 工安緊急通報中心</span>
          </div>
        </div>
      </footer>

      {/* Photo & Record Detail Modal */}
      <PhotoModal 
        record={selectedRecord} 
        onClose={() => setSelectedRecord(null)} 
      />

      {/* Admin Equipment & ID Management Modal */}
      <AdminEquipmentModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        equipments={equipments}
        onAddEquipment={handleAddEquipment}
        onDeleteEquipment={handleDeleteEquipment}
        onResetEquipments={handleResetEquipments}
      />

      {/* Standalone HTML + Tailwind CDN Modal */}
      <StandaloneHtmlModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />
    </div>
  );
}
