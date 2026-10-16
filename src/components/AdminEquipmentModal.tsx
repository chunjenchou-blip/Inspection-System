import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Lock, 
  Building2, 
  Check, 
  AlertCircle, 
  RotateCcw,
  Search,
  Cpu,
  LogOut
} from 'lucide-react';
import { EquipmentItem, PlantLocation } from '../types';

interface AdminEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipments: EquipmentItem[];
  onAddEquipment: (item: EquipmentItem) => void;
  onDeleteEquipment: (id: string) => void;
  onResetEquipments: () => void;
}

export const AdminEquipmentModal: React.FC<AdminEquipmentModalProps> = ({
  isOpen,
  onClose,
  equipments,
  onAddEquipment,
  onDeleteEquipment,
  onResetEquipments,
}) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // New Equipment Form State
  const [newPlant, setNewPlant] = useState<PlantLocation>('高雄港發貨站');
  const [newName, setNewName] = useState('');
  const [newId, setNewId] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Search filter
  const [searchFilter, setSearchFilter] = useState('');
  const [plantFilter, setPlantFilter] = useState<'全部' | PlantLocation>('全部');

  if (!isOpen) return null;

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default authorized passwords
    if (password === 'sec888' || password === 'admin' || password === '8888') {
      setIsAuthenticated(true);
      setLoginError('');
      setPassword('');
    } else {
      setLoginError('密碼錯誤，請輸入授權密碼 (示範預設：sec888 或 admin)');
    }
  };

  const handleQuickLogin = () => {
    setIsAuthenticated(true);
    setLoginError('');
  };

  // Handle Add Equipment
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setFormError('請填寫設備名稱');
      return;
    }
    if (!newId.trim()) {
      setFormError('請填寫設備編號 (如: KHH-SILO-03)');
      return;
    }

    // Check duplicate ID
    const formattedId = newId.trim().toUpperCase();
    if (equipments.some((eq) => eq.id.toUpperCase() === formattedId)) {
      setFormError(`設備編號 ${formattedId} 已存在，請使用不同編號`);
      return;
    }

    onAddEquipment({
      id: formattedId,
      name: newName.trim(),
      plant: newPlant,
      notes: newNotes.trim() || undefined,
    });

    setFormSuccess(`成功新增設備：${newName.trim()} [${formattedId}]`);
    setFormError('');
    setNewName('');
    setNewId('');
    setNewNotes('');

    setTimeout(() => {
      setFormSuccess('');
    }, 3500);
  };

  // Filtered equipment list
  const filteredEquipments = equipments.filter((eq) => {
    const matchPlant = plantFilter === '全部' || eq.plant === plantFilter;
    const matchSearch =
      searchFilter === '' ||
      eq.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      eq.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (eq.notes && eq.notes.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchPlant && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div 
        className="relative bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-orange-600/30 text-orange-400 border border-orange-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg">廠區設備與編號管理後台</h3>
                {isAuthenticated && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                    已授權管理員
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                維護設備名稱與設備編號資料庫 · 即時同步前台巡檢下拉選單
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isAuthenticated ? (
          /* Login Dialog */
          <div className="p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-orange-600/20 border border-orange-500/40 text-orange-400 flex items-center justify-center shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div className="max-w-md">
              <h4 className="text-lg font-bold text-white mb-1">管理員身分驗證</h4>
              <p className="text-xs text-slate-400">
                此功能僅提供給東南水泥廠區保修主管、工務部與具備維護權限之人員，用於新增或編輯設備編號。
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full max-w-sm space-y-3">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="請輸入管理授權密碼 (預設: sec888)"
                  className="w-full h-12 px-4 text-center text-sm font-semibold text-white bg-slate-800 border-2 border-slate-700 rounded-xl focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/20 placeholder:text-slate-500"
                  autoFocus
                />
              </div>

              {loginError && (
                <p className="text-xs text-red-400 font-medium flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{loginError}</span>
                </p>
              )}

              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>確認登入</span>
              </button>

              <button
                type="button"
                onClick={handleQuickLogin}
                className="w-full py-2 text-xs text-slate-400 hover:text-orange-400 underline transition-colors cursor-pointer"
              >
                快速示範身分直接登入 (免手動打密碼)
              </button>
            </form>
          </div>
        ) : (
          /* Authorized Admin Panel */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* Section 1: Add New Equipment Form */}
            <div className="bg-slate-800/80 rounded-xl p-4 sm:p-5 border border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-orange-400" />
                  <h4 className="font-bold text-sm text-slate-200">新增設備與編號</h4>
                </div>
                <span className="text-[11px] text-slate-400">新增後即時加入前台下拉選單</span>
              </div>

              {formSuccess && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-700 rounded-lg text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              {formError && (
                <div className="p-3 bg-red-950/80 border border-red-700 rounded-lg text-red-300 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleCreate} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Plant */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">廠區</label>
                    <select
                      value={newPlant}
                      onChange={(e) => setNewPlant(e.target.value as PlantLocation)}
                      className="w-full h-11 px-3 text-xs font-semibold bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                    >
                      <option value="高雄港發貨站">高雄港發貨站</option>
                      <option value="總公司">總公司廠區</option>
                    </select>
                  </div>

                  {/* Equipment Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      設備名稱 <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="如: 3號散裝水泥儲槽"
                      className="w-full h-11 px-3 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  {/* Equipment ID */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      設備編號 <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={newId}
                      onChange={(e) => setNewId(e.target.value)}
                      placeholder="如: KHH-SILO-03"
                      className="w-full h-11 px-3 text-xs font-mono font-bold uppercase bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-orange-500 focus:outline-none placeholder:font-sans placeholder:font-normal"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="flex flex-col sm:flex-row gap-3 items-end">
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      設備備註 / 規格說明 <span className="text-slate-500 font-normal">(選填)</span>
                    </label>
                    <input
                      type="text"
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      placeholder="如: 氣動出料閥門與下料管系統"
                      className="w-full h-11 px-3 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto h-11 px-5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>新增設備至資料庫</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Section 2: Equipment Database List */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                <div>
                  <h4 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                    <span>現有設備清單與編號</span>
                    <span className="text-xs px-2 py-0.5 rounded font-mono bg-slate-800 text-slate-300 border border-slate-700">
                      共 {equipments.length} 部設備
                    </span>
                  </h4>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={plantFilter}
                    onChange={(e) => setPlantFilter(e.target.value as any)}
                    className="h-9 px-2.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200"
                  >
                    <option value="全部">全部廠區</option>
                    <option value="高雄港發貨站">高雄港發貨站</option>
                    <option value="總公司">總公司</option>
                  </select>

                  <div className="relative flex-1 sm:w-44">
                    <input
                      type="text"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      placeholder="搜尋名稱/編號..."
                      className="w-full h-9 pl-7 pr-2.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="rounded-xl border border-slate-750 overflow-hidden bg-slate-950">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-850 text-slate-400 border-b border-slate-800 font-semibold">
                      <th className="py-2.5 px-3">廠區</th>
                      <th className="py-2.5 px-3">設備編號</th>
                      <th className="py-2.5 px-3">設備名稱</th>
                      <th className="py-2.5 px-3">備註說明</th>
                      <th className="py-2.5 px-3 text-right">管理</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredEquipments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-500">
                          無符合條件之設備資料
                        </td>
                      </tr>
                    ) : (
                      filteredEquipments.map((eq) => (
                        <tr key={eq.id} className="hover:bg-slate-900/60 transition-colors">
                          <td className="py-2.5 px-3 text-slate-300 font-medium whitespace-nowrap">
                            {eq.plant}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-orange-400 whitespace-nowrap">
                            {eq.id}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-100">
                            {eq.name}
                          </td>
                          <td className="py-2.5 px-3 text-slate-400 max-w-xs truncate">
                            {eq.notes || '—'}
                          </td>
                          <td className="py-2.5 px-3 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`確定要刪除設備「${eq.name} [${eq.id}]」嗎？`)) {
                                  onDeleteEquipment(eq.id);
                                }
                              }}
                              className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                              title="刪除此設備"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Reset to default */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>資料已本機儲存於巡檢系統資料庫</span>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('確定要將設備資料庫還原為東南水泥原廠初始設備清單嗎？')) {
                      onResetEquipments();
                    }
                  }}
                  className="text-slate-500 hover:text-slate-300 underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>還原預設設備資料庫</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          {isAuthenticated ? (
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>登出管理員身分</span>
            </button>
          ) : (
            <span className="text-xs text-slate-500">東南水泥 安全巡檢管理端</span>
          )}

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            完成並關閉
          </button>
        </div>
      </div>
    </div>
  );
};
