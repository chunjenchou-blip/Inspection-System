import React, { useState } from 'react';
import { 
  ClipboardList, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  Filter, 
  Download, 
  Calendar, 
  User, 
  MapPin, 
  ChevronRight,
  Layers,
  Table as TableIcon
} from 'lucide-react';
import { InspectionRecord } from '../types';

interface HistoryBoardProps {
  records: InspectionRecord[];
  onSelectRecord: (record: InspectionRecord) => void;
  onResetDefault: () => void;
}

export const HistoryBoard: React.FC<HistoryBoardProps> = ({ 
  records, 
  onSelectRecord,
  onResetDefault 
}) => {
  const [filter, setFilter] = useState<'all' | 'abnormal' | 'normal'>('all');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [showAllCount, setShowAllCount] = useState(false);

  // Filter records
  const filteredRecords = records.filter((rec) => {
    if (filter === 'abnormal') return rec.status === 'abnormal';
    if (filter === 'normal') return rec.status === 'normal';
    return true;
  });

  // Limit to recent 5 or all
  const displayedRecords = showAllCount ? filteredRecords : filteredRecords.slice(0, 5);

  const abnormalTotal = records.filter((r) => r.status === 'abnormal').length;
  const normalTotal = records.filter((r) => r.status === 'normal').length;

  // Export records to CSV
  const handleExportCSV = () => {
    const headers = ['紀錄編號', '廠區', '設備名稱', '設備編號', '巡檢人員', '狀態', '巡檢時間', '狀況說明'];
    const rows = filteredRecords.map((r) => [
      `"${r.id}"`,
      `"${r.plant}"`,
      `"${r.equipmentName || r.equipmentId || ''}"`,
      `"${r.equipmentId || ''}"`,
      `"${r.inspectorName}"`,
      `"${r.status === 'normal' ? '正常' : '異常'}"`,
      `"${r.timestamp}"`,
      `"${r.description.replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `東南水泥_設備巡檢紀錄_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 text-white px-5 py-4 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-orange-600/30 text-orange-400 border border-orange-500/30">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg tracking-tight flex items-center gap-2">
              <span>歷史紀錄看板</span>
              <span className="text-xs px-2 py-0.5 rounded font-normal bg-slate-800 text-slate-300 border border-slate-700">
                最近 {displayedRecords.length} 筆
              </span>
            </h2>
            <p className="text-xs text-slate-400">廠區現場各站即時同步巡檢日誌</p>
          </div>
        </div>

        {/* View mode & CSV actions */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
          <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700 text-xs">
            <button
              onClick={() => setViewMode('card')}
              className={`px-2.5 py-1 rounded flex items-center gap-1 font-medium transition-colors ${
                viewMode === 'card' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>卡片</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded flex items-center gap-1 font-medium transition-colors ${
                viewMode === 'table' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>表格</span>
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="匯出目前列表為 CSV 檔"
          >
            <Download className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden xs:inline">匯出</span>報表
          </button>
        </div>
      </div>

      {/* Filter Segmented Controls */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            全部紀錄 ({records.length})
          </button>

          <button
            onClick={() => setFilter('abnormal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              filter === 'abnormal'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-red-700 hover:text-red-800 hover:bg-red-100/60'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>僅看異常</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${filter === 'abnormal' ? 'bg-red-800 text-white' : 'bg-red-200 text-red-900'}`}>
              {abnormalTotal}
            </span>
          </button>

          <button
            onClick={() => setFilter('normal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              filter === 'normal'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100/60'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>正常項目</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${filter === 'normal' ? 'bg-emerald-800 text-white' : 'bg-emerald-200 text-emerald-900'}`}>
              {normalTotal}
            </span>
          </button>
        </div>

        {records.length > 5 && (
          <button
            onClick={() => setShowAllCount(!showAllCount)}
            className="text-xs text-orange-600 hover:text-orange-700 font-semibold underline cursor-pointer"
          >
            {showAllCount ? '折疊為最近 5 筆' : `展開顯示全部 (${filteredRecords.length} 筆)`}
          </button>
        )}
      </div>

      {/* Record Content: Card View vs Table View */}
      {displayedRecords.length === 0 ? (
        <div className="p-10 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Filter className="w-6 h-6" />
          </div>
          <p className="text-slate-600 font-medium">目前無符合條件的巡檢紀錄</p>
          <p className="text-xs text-slate-400 mt-1">
            {filter === 'abnormal' ? '太棒了！無異常通報事件。' : '請切換篩選條件或透過上方表單新增紀錄。'}
          </p>
        </div>
      ) : viewMode === 'card' ? (
        /* Card View (Mobile Optimized) */
        <div className="p-4 sm:p-5 space-y-3.5">
          {displayedRecords.map((rec) => {
            const isAbnormal = rec.status === 'abnormal';
            return (
              <div
                key={rec.id}
                onClick={() => onSelectRecord(rec)}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${
                  isAbnormal
                    ? 'border-red-200 bg-red-50/30 hover:border-red-400'
                    : 'border-slate-200 bg-white hover:border-emerald-300'
                }`}
              >
                {/* Card Top Row: Status Tag & Plant */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    {/* Status Badge */}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 shadow-xs ${
                        isAbnormal
                          ? 'bg-red-600 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {isAbnormal ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>{isAbnormal ? '異常' : '正常'}</span>
                    </span>

                    {/* Plant */}
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-orange-600" />
                      {rec.plant}
                    </span>
                  </div>

                  <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {rec.timestamp}
                  </span>
                </div>

                {/* Equipment & Inspector Row */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                      {rec.equipmentName || rec.equipmentId}
                    </h3>
                    {rec.equipmentId && rec.equipmentName && (
                      <p className="text-xs font-mono text-slate-500 font-medium">
                        編號: {rec.equipmentId}
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs text-slate-500 block">巡檢員</span>
                    <span className="text-xs font-bold text-slate-800 flex items-center justify-end gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      {rec.inspectorName}
                    </span>
                  </div>
                </div>

                {/* Description and Thumbnail Layout */}
                <div className="flex items-start gap-3 mt-2 pt-2 border-t border-slate-100">
                  {rec.photoUrl && (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-300">
                      <img
                        src={rec.photoUrl}
                        alt="縮圖"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-80">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs sm:text-sm line-clamp-2 ${isAbnormal ? 'text-red-950 font-medium' : 'text-slate-600'}`}>
                      {rec.description}
                    </p>
                    <span className="text-[11px] text-orange-600 font-semibold mt-1 inline-flex items-center gap-0.5 hover:underline">
                      點擊查看完整相片與存證資訊
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View (Tablet & Desktop Optimized) */
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">狀態</th>
                <th className="py-3 px-4">廠區</th>
                <th className="py-3 px-4">設備名稱</th>
                <th className="py-3 px-4">巡檢人員</th>
                <th className="py-3 px-4">狀況說明</th>
                <th className="py-3 px-4">相片</th>
                <th className="py-3 px-4">查驗時間</th>
                <th className="py-3 px-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {displayedRecords.map((rec) => {
                const isAbnormal = rec.status === 'abnormal';
                return (
                  <tr 
                    key={rec.id}
                    onClick={() => onSelectRecord(rec)}
                    className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                      isAbnormal ? 'bg-red-50/20' : ''
                    }`}
                  >
                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          isAbnormal
                            ? 'bg-red-600 text-white'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {isAbnormal ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        {isAbnormal ? '異常' : '正常'}
                      </span>
                    </td>

                    {/* Plant */}
                    <td className="py-3.5 px-4 font-medium text-slate-800 whitespace-nowrap">
                      {rec.plant}
                    </td>

                    {/* Equipment */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">
                        {rec.equipmentName || rec.equipmentId}
                      </span>
                      {rec.equipmentId && rec.equipmentName && (
                        <span className="text-[11px] font-mono text-slate-500">
                          {rec.equipmentId}
                        </span>
                      )}
                    </td>

                    {/* Inspector */}
                    <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap font-medium">
                      {rec.inspectorName}
                    </td>

                    {/* Description */}
                    <td className="py-3.5 px-4 max-w-xs text-slate-600 truncate">
                      {rec.description}
                    </td>

                    {/* Photo thumbnail */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {rec.photoUrl ? (
                        <div className="w-10 h-10 rounded border border-slate-300 overflow-hidden bg-slate-900">
                          <img src={rec.photoUrl} alt="縮圖" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">無相片</span>
                      )}
                    </td>

                    {/* Timestamp */}
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-500 whitespace-nowrap">
                      {rec.timestamp}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectRecord(rec);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3 text-orange-600" />
                        檢視
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer info & Reset */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <span>顯示最近 {displayedRecords.length} / 共 {filteredRecords.length} 筆巡檢存證紀錄</span>
        <button
          onClick={onResetDefault}
          className="text-slate-500 hover:text-slate-800 underline transition-colors cursor-pointer"
        >
          還原預設示範資料
        </button>
      </div>
    </div>
  );
};
