import React, { useState, useEffect } from 'react';
import { ShieldCheck, Clock, Building2, Wifi } from 'lucide-react';

interface HeaderProps {
  activeCount: number;
  abnormalCount: number;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeCount, abnormalCount, onOpenAdmin }) => {
  const [currentDateTime, setCurrentDateTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const date = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
      const day = dayNames[now.getDay()];

      setCurrentDateTime(`${year}/${month}/${date} (${day}) ${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-slate-900 text-white shadow-md border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          {/* Southeast Cement stylized badge */}
          <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center font-black text-white text-base tracking-tighter shadow-inner shrink-0 border border-orange-400/40">
            SEC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg sm:text-xl tracking-tight text-white whitespace-nowrap">
                東南水泥
              </span>
              <span className="text-xs px-2 py-0.5 rounded font-medium bg-slate-800 text-slate-300 border border-slate-700 whitespace-nowrap">
                廠區巡檢系統
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden xs:block">
              廠區設備與工安巡檢管理平台 · 行動填報端
            </p>
          </div>
        </div>

        {/* Live Date/Time, Status Indicators & Admin Button */}
        <div className="flex flex-wrap items-center justify-between w-full sm:w-auto gap-3 text-xs text-slate-300 pt-1 sm:pt-0 border-t border-slate-800/80 sm:border-0">
          <div className="flex items-center gap-1.5 font-mono tabular-nums text-slate-200 bg-slate-800/80 px-2.5 py-1.5 rounded-md border border-slate-700/60">
            <Clock className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span className="text-xs">{currentDateTime || '2026/10/16 09:30:00'}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <div className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="hidden md:inline">即時連線</span>
            </div>
            {abnormalCount > 0 ? (
              <span className="text-red-400 font-semibold px-2 py-0.5 rounded bg-red-950/60 border border-red-800/60">
                異常: {abnormalCount}
              </span>
            ) : null}

            {/* 後台管理按鈕 */}
            <button
              onClick={onOpenAdmin}
              className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer border border-orange-500/40"
              title="登入後台管理並增加設備編號"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>後台管理</span>
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
