import React, { useState } from 'react';
import { X, Copy, Check, Download, Code2 } from 'lucide-react';

interface StandaloneHtmlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const standaloneHtmlCode = `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>東南水泥 廠區設備與安全巡檢系統</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    input, select, textarea, button { font-size: 16px; }
  </style>
</head>
<body class="bg-slate-100 text-slate-800 min-h-screen font-sans pb-12">

  <!-- 頂部導覽列 -->
  <header class="sticky top-0 z-30 bg-slate-900 text-white shadow-md border-b border-slate-800">
    <div class="max-w-4xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center font-black text-white text-base tracking-tighter shrink-0 border border-orange-400/30">
          SEC
        </div>
        <div>
          <h1 class="text-lg sm:text-xl font-bold tracking-tight">東南水泥 廠區巡檢系統</h1>
          <p class="text-[11px] text-slate-400">廠區設備與安全行動化巡檢平台</p>
        </div>
      </div>
      
      <!-- 右側：即時時鐘與後台按鈕 -->
      <div class="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-start">
        <div class="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
          <span class="text-orange-400 font-bold">● 即時</span>
          <span id="current-clock">載入時間中...</span>
        </div>
        <button onclick="openAdminModal()" class="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1 shadow cursor-pointer transition-colors">
          <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
          <span>後台管理</span>
        </button>
      </div>
    </div>
  </header>

  <!-- 主內容容器 -->
  <main class="max-w-4xl mx-auto px-4 py-6 space-y-6">

    <!-- 巡檢填報表單 -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="bg-slate-800 text-white px-5 py-4 flex items-center justify-between">
        <div>
          <h2 class="font-bold text-lg">巡檢填報表單</h2>
          <p class="text-xs text-slate-300">廠區現場人員操作介面（支援大尺寸觸控）</p>
        </div>
        <span class="text-xs px-2.5 py-1 rounded bg-slate-700 text-slate-200 font-mono">現場填報</span>
      </div>

      <form id="inspection-form" class="p-4 sm:p-6 space-y-5">
        <!-- 廠區選擇 -->
        <div>
          <label class="block text-base font-bold text-slate-800 mb-2">
            巡檢廠區 <span class="text-red-500">*</span>
          </label>
          <select id="plant-select" onchange="renderEquipmentDropdown()" class="w-full h-14 px-4 text-base font-semibold text-slate-800 bg-slate-50 border-2 border-slate-300 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/20" required>
            <option value="高雄港發貨站">高雄港發貨站 (Kaohsiung Harbor Terminal)</option>
            <option value="總公司">總公司廠區 (Headquarters Plant)</option>
          </select>
        </div>

        <!-- 設備名稱 (下拉式選項 + 文字輸入) -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="block text-base font-bold text-slate-800">
              設備名稱 <span class="text-red-500">*</span>
            </label>
            <span class="text-xs text-slate-500">可由下拉選取或直接手動輸入</span>
          </div>

          <div class="space-y-2">
            <!-- 下拉式選項快速選取 -->
            <select id="equipment-select" onchange="onSelectEquipment(this.value)" class="w-full h-12 px-3 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-300 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none cursor-pointer">
              <!-- JS 動態生成選項 -->
            </select>

            <!-- 手動文字輸入框 -->
            <input type="text" id="equipment-name" placeholder="請輸入設備名稱 (如: 2號散裝水泥儲槽，亦可自行輸入新設備)" class="w-full h-14 px-4 text-base font-semibold text-slate-900 bg-slate-50 border-2 border-slate-300 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/20" required />
          </div>

          <div class="mt-2.5 text-xs flex items-center justify-between">
            <span class="text-slate-500 font-semibold">快捷點選設備：</span>
            <button type="button" onclick="loadPresets()" class="text-orange-600 hover:text-orange-700 font-medium">+ 載入廠區常用清單</button>
          </div>
          <!-- 快捷點選設備 (依需求預設先顯示空白，括弧內編號不顯示) -->
          <div id="quick-presets" class="mt-1 flex flex-wrap gap-1.5"></div>
        </div>

        <!-- 巡檢人員姓名 -->
        <div>
          <label class="block text-base font-bold text-slate-800 mb-2">
            巡檢人員姓名 <span class="text-red-500">*</span>
          </label>
          <input type="text" id="inspector-name" value="周專員" placeholder="請輸入姓名" class="w-full h-14 px-4 text-base font-semibold text-slate-900 bg-slate-50 border-2 border-slate-300 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/20" required />
        </div>

        <!-- 檢查結果 (大尺寸綠色正常、紅色異常按鈕) -->
        <div>
          <label class="block text-base font-bold text-slate-800 mb-2">
            檢查結果 <span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-2 gap-3">
            <button type="button" id="btn-normal" onclick="setStatus('normal')" class="h-20 rounded-2xl border-2 flex items-center justify-center gap-2 p-3 transition-all bg-emerald-500 text-white border-emerald-600 shadow-md">
              <i data-lucide="check-circle-2" class="w-6 h-6"></i>
              <div class="text-left">
                <div class="text-lg font-black">正常</div>
                <div class="text-xs text-emerald-100">指標符合標準</div>
              </div>
            </button>
            <button type="button" id="btn-abnormal" onclick="setStatus('abnormal')" class="h-20 rounded-2xl border-2 flex items-center justify-center gap-2 p-3 transition-all bg-red-50 text-red-700 border-red-300">
              <i data-lucide="alert-triangle" class="w-6 h-6"></i>
              <div class="text-left">
                <div class="text-lg font-black">異常</div>
                <div class="text-xs text-red-600">需通報維修</div>
              </div>
            </button>
          </div>
        </div>

        <!-- 狀況說明 -->
        <div>
          <label class="block text-base font-bold text-slate-800 mb-2">
            狀況說明 <span class="text-red-500">*</span>
          </label>
          <textarea id="description-input" rows="3" placeholder="請描述設備運轉狀況（油位、溫度、震動、聲音或異常漏風）..." class="w-full p-4 text-base text-slate-900 bg-slate-50 border-2 border-slate-300 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/20" required></textarea>
          <div class="mt-2 flex flex-wrap gap-1.5 text-xs text-slate-600">
            <button type="button" onclick="appendNote('運轉平順無異音')" class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md">+ 運轉平順無異音</button>
            <button type="button" onclick="appendNote('軸承溫度正常，油位充足')" class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md">+ 軸承溫度正常</button>
            <button type="button" onclick="appendNote('發現法蘭密封老化有些微溢灰')" class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md text-red-600">+ 法蘭些微溢灰</button>
            <button type="button" onclick="appendNote('皮帶稍微跑偏已通報排修')" class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md text-red-600">+ 皮帶跑偏通報</button>
          </div>
        </div>

        <!-- 現場照片上傳區 -->
        <div>
          <label class="block text-base font-bold text-slate-800 mb-2">
            現場照片上傳 <span class="text-xs text-slate-500 font-normal">(選填存證)</span>
          </label>
          <input type="file" id="photo-file" accept="image/*" capture="environment" class="hidden" onchange="previewPhoto(event)" />
          
          <div id="photo-box" onclick="document.getElementById('photo-file').click()" class="cursor-pointer border-2 border-dashed border-slate-300 hover:border-orange-500 bg-slate-50 hover:bg-orange-50/30 rounded-2xl p-6 text-center transition-all">
            <div class="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-2">
              <i data-lucide="camera" class="w-6 h-6"></i>
            </div>
            <p class="font-bold text-slate-800">點擊拍照或上傳現場照片</p>
            <p class="text-xs text-slate-500 mt-1">手機點擊將直接啟用相機現場拍攝存證</p>
          </div>

          <div id="photo-preview-wrap" class="hidden mt-3 relative rounded-xl overflow-hidden border border-slate-300 bg-slate-900">
            <img id="photo-preview-img" src="" alt="照片預覽" class="w-full h-48 object-cover" />
            <button type="button" onclick="removePhoto(event)" class="absolute top-2 right-2 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-lg shadow">移除照片</button>
          </div>
        </div>

        <!-- 送出按鈕 (大尺寸，顯眼) -->
        <div class="pt-2">
          <button type="submit" class="w-full h-16 rounded-2xl bg-orange-600 hover:bg-orange-700 active:scale-[0.99] text-white text-xl font-black shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer">
            <i data-lucide="send" class="w-6 h-6"></i>
            <span>送出巡檢紀錄</span>
          </button>
        </div>
      </form>
    </div>

    <!-- 歷史紀錄看板 -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
        <div>
          <h2 class="font-bold text-lg">歷史紀錄看板</h2>
          <p class="text-xs text-slate-400">最近 5 筆巡檢存證紀錄</p>
        </div>
        <!-- 篩選按鈕 (全部、僅看異常) -->
        <div class="flex items-center gap-1 bg-slate-800 p-1 rounded-xl text-xs font-bold">
          <button id="filter-all-btn" onclick="setFilter('all')" class="px-3 py-1.5 rounded-lg bg-orange-600 text-white">全部</button>
          <button id="filter-abnormal-btn" onclick="setFilter('abnormal')" class="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white">僅看異常</button>
        </div>
      </div>

      <!-- 紀錄清單容器 -->
      <div id="records-container" class="p-4 space-y-3"></div>
    </div>

  </main>

  <!-- 後台管理彈窗 (登入與增加設備編號) -->
  <div id="admin-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
    <div class="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl">
      <!-- Modal Header -->
      <div class="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
        <div class="flex items-center gap-2">
          <div class="p-1.5 rounded bg-orange-600/30 text-orange-400">
            <i data-lucide="shield-check" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="font-bold text-base">後台管理：設備與編號維護</h3>
            <p class="text-xs text-slate-400">增加設備編號並同步至前台下拉選單</p>
          </div>
        </div>
        <button onclick="closeAdminModal()" class="p-1.5 rounded text-slate-400 hover:text-white">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Login View -->
      <div id="admin-login-view" class="p-6 text-center space-y-4">
        <p class="text-xs text-slate-400">請輸入管理員授權密碼 (示範預設：sec888)</p>
        <input type="password" id="admin-password" placeholder="輸入管理密碼" class="w-full h-12 px-4 text-center bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-orange-500 focus:outline-none" />
        <div class="flex gap-2">
          <button onclick="loginAdmin()" class="flex-1 h-11 bg-orange-600 hover:bg-orange-500 rounded-xl font-bold text-sm">確認登入</button>
          <button onclick="quickLoginAdmin()" class="px-4 h-11 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs text-slate-300">快速驗證</button>
        </div>
      </div>

      <!-- Admin Add Equipment View -->
      <div id="admin-panel-view" class="hidden p-5 space-y-4 max-h-[80vh] overflow-y-auto">
        <div class="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-3">
          <h4 class="font-bold text-sm text-orange-400">+ 增加新設備編號</h4>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-slate-300 mb-1">廠區</label>
              <select id="new-eq-plant" class="w-full h-10 px-2.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white">
                <option value="高雄港發貨站">高雄港發貨站</option>
                <option value="總公司">總公司廠區</option>
              </select>
            </div>
            <div>
              <label class="block text-xs text-slate-300 mb-1">設備編號</label>
              <input type="text" id="new-eq-id" placeholder="如: KHH-SILO-03" class="w-full h-10 px-2.5 text-xs uppercase font-mono bg-slate-900 border border-slate-700 rounded-lg text-white" />
            </div>
          </div>
          <div>
            <label class="block text-xs text-slate-300 mb-1">設備名稱</label>
            <input type="text" id="new-eq-name" placeholder="如: 3號散裝水泥儲槽" class="w-full h-10 px-2.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white" />
          </div>
          <button onclick="addNewEquipment()" class="w-full h-10 bg-orange-600 hover:bg-orange-500 rounded-lg font-bold text-xs text-white">儲存並加入下拉清單</button>
        </div>

        <div>
          <h4 class="font-bold text-xs text-slate-400 mb-2">現有設備清單</h4>
          <div id="admin-eq-list" class="space-y-1.5 max-h-48 overflow-y-auto pr-1"></div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
        <button onclick="closeAdminModal()" class="px-4 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 hover:text-white">關閉</button>
      </div>
    </div>
  </div>

  <script>
    function updateClock() {
      const now = new Date();
      const str = now.getFullYear() + '/' + 
        String(now.getMonth()+1).padStart(2,'0') + '/' + 
        String(now.getDate()).padStart(2,'0') + ' ' + 
        String(now.getHours()).padStart(2,'0') + ':' + 
        String(now.getMinutes()).padStart(2,'0') + ':' + 
        String(now.getSeconds()).padStart(2,'0');
      document.getElementById('current-clock').textContent = str;
    }
    setInterval(updateClock, 1000);
    updateClock();

    let equipments = [
      { id: 'KHH-SILO-02', name: '2號散裝水泥儲槽', plant: '高雄港發貨站' },
      { id: 'KHH-CONV-05', name: '5號散裝水泥皮帶輸送機', plant: '高雄港發貨站' },
      { id: 'KHH-BAG-04', name: '袋式集塵機排風機 No.4', plant: '高雄港發貨站' },
      { id: 'KHH-SHIP-01', name: '碼頭散裝水泥船裝船機', plant: '高雄港發貨站' },
      { id: 'HQ-MILL-01', name: '1號生料立式磨機', plant: '總公司' },
      { id: 'HQ-KILN-02', name: '2號迴轉窯托輪設備', plant: '總公司' },
      { id: 'HQ-CRUSH-03', name: '石灰石二段圓錐破碎機', plant: '總公司' },
      { id: 'HQ-COOL-01', name: '熟料篦式冷卻機', plant: '總公司' },
    ];

    let currentStatus = 'normal';
    let currentFilter = 'all';
    let currentPhotoData = null;

    let records = [
      {
        id: 'SEC-1016-01',
        plant: '高雄港發貨站',
        equipmentName: '2號散裝水泥儲槽',
        equipmentId: 'KHH-SILO-02',
        inspectorName: '陳建宏',
        status: 'abnormal',
        description: '2號儲槽卸料閥法蘭有些微漏氣溢灰，氣缸作動速度稍緩，已報備保修組排修。',
        time: '2026/10/16 09:25'
      },
      {
        id: 'SEC-1016-02',
        plant: '總公司',
        equipmentName: '1號生料立式磨機',
        equipmentId: 'HQ-MILL-01',
        inspectorName: '黃志強',
        status: 'normal',
        description: '生料磨機減速箱運轉正常無雜音，潤滑油位正常，測溫48.5°C標準內。',
        time: '2026/10/16 08:42'
      },
      {
        id: 'SEC-1016-03',
        plant: '高雄港發貨站',
        equipmentName: '袋式集塵機排風機 No.4',
        equipmentId: 'KHH-BAG-04',
        inspectorName: '林冠宇',
        status: 'normal',
        description: '袋式集塵機脈衝噴吹正常，排氣壓差850Pa符合環保規範。',
        time: '2026/10/16 08:15'
      },
      {
        id: 'SEC-1015-04',
        plant: '總公司',
        equipmentName: '2號迴轉窯托輪設備',
        equipmentId: 'HQ-KILN-02',
        inspectorName: '周專員',
        status: 'abnormal',
        description: '迴轉窯托輪軸承溫度高達64.2°C偏高，冷卻水流偏小，已局部降溫並通報。',
        time: '2026/10/15 16:50'
      },
      {
        id: 'SEC-1015-05',
        plant: '高雄港發貨站',
        equipmentName: '碼頭船裝載機',
        equipmentId: 'KHH-SHIP-01',
        inspectorName: '陳建宏',
        status: 'normal',
        description: '碼頭船裝載機伸縮套管良好，皮帶無跑偏，急停開關作動正常。',
        time: '2026/10/15 14:10'
      }
    ];

    function renderEquipmentDropdown() {
      const select = document.getElementById('equipment-select');
      const curPlant = document.getElementById('plant-select').value;
      select.innerHTML = '<option value="">▼ 下拉式選項快速選取設備（點此展開）...</option>';
      
      const plantGroup = document.createElement('optgroup');
      plantGroup.label = '【' + curPlant + '】常用設備';
      equipments.filter(e => e.plant === curPlant).forEach(e => {
        const opt = document.createElement('option');
        opt.value = e.name;
        opt.textContent = e.name;
        plantGroup.appendChild(opt);
      });
      select.appendChild(plantGroup);

      const otherGroup = document.createElement('optgroup');
      otherGroup.label = '【其他廠區設備】';
      equipments.filter(e => e.plant !== curPlant).forEach(e => {
        const opt = document.createElement('option');
        opt.value = e.name;
        opt.textContent = e.name + ' (' + e.plant + ')';
        otherGroup.appendChild(opt);
      });
      select.appendChild(otherGroup);
    }

    function onSelectEquipment(val) {
      if (val) {
        document.getElementById('equipment-name').value = val;
        const matched = equipments.find(e => e.name === val);
        if (matched && matched.plant) {
          document.getElementById('plant-select').value = matched.plant;
        }
      }
    }

    function loadPresets() {
      const container = document.getElementById('quick-presets');
      container.innerHTML = '';
      equipments.forEach(eq => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold';
        btn.textContent = eq.name;
        btn.onclick = () => {
          document.getElementById('equipment-name').value = eq.name;
          document.getElementById('plant-select').value = eq.plant;
        };
        container.appendChild(btn);
      });
    }

    function setStatus(val) {
      currentStatus = val;
      const btnNormal = document.getElementById('btn-normal');
      const btnAbnormal = document.getElementById('btn-abnormal');
      if (val === 'normal') {
        btnNormal.className = 'h-20 rounded-2xl border-2 flex items-center justify-center gap-2 p-3 transition-all bg-emerald-500 text-white border-emerald-600 shadow-md';
        btnAbnormal.className = 'h-20 rounded-2xl border-2 flex items-center justify-center gap-2 p-3 transition-all bg-red-50 text-red-700 border-red-300';
      } else {
        btnNormal.className = 'h-20 rounded-2xl border-2 flex items-center justify-center gap-2 p-3 transition-all bg-emerald-50 text-emerald-700 border-emerald-300';
        btnAbnormal.className = 'h-20 rounded-2xl border-2 flex items-center justify-center gap-2 p-3 transition-all bg-red-600 text-white border-red-700 shadow-md';
      }
    }

    function appendNote(txt) {
      const el = document.getElementById('description-input');
      el.value = el.value ? el.value + '；' + txt : txt;
    }

    function previewPhoto(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          currentPhotoData = evt.target.result;
          document.getElementById('photo-preview-img').src = currentPhotoData;
          document.getElementById('photo-preview-wrap').classList.remove('hidden');
          document.getElementById('photo-box').classList.add('hidden');
        };
        reader.readAsDataURL(file);
      }
    }

    function removePhoto(e) {
      e.stopPropagation();
      currentPhotoData = null;
      document.getElementById('photo-file').value = '';
      document.getElementById('photo-preview-wrap').classList.add('hidden');
      document.getElementById('photo-box').classList.remove('hidden');
    }

    function setFilter(f) {
      currentFilter = f;
      const allBtn = document.getElementById('filter-all-btn');
      const abBtn = document.getElementById('filter-abnormal-btn');
      if (f === 'all') {
        allBtn.className = 'px-3 py-1.5 rounded-lg bg-orange-600 text-white';
        abBtn.className = 'px-3 py-1.5 rounded-lg text-slate-300 hover:text-white';
      } else {
        allBtn.className = 'px-3 py-1.5 rounded-lg text-slate-300 hover:text-white';
        abBtn.className = 'px-3 py-1.5 rounded-lg bg-red-600 text-white';
      }
      renderRecords();
    }

    function renderRecords() {
      const container = document.getElementById('records-container');
      container.innerHTML = '';
      const list = records
        .filter(r => currentFilter === 'all' || r.status === 'abnormal')
        .slice(0, 5);

      if (list.length === 0) {
        container.innerHTML = '<div class="py-8 text-center text-slate-400 text-sm">無符合條件之巡檢紀錄</div>';
        return;
      }

      list.forEach(r => {
        const isAb = r.status === 'abnormal';
        const card = document.createElement('div');
        card.className = 'p-4 rounded-xl border-2 ' + 
          (isAb ? 'border-red-200 bg-red-50/40' : 'border-slate-200 bg-white') + ' shadow-sm';
        
        card.innerHTML = \`
          <div class="flex items-center justify-between gap-2 mb-2">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold text-white \${isAb ? 'bg-red-600' : 'bg-emerald-600'}">
                \${isAb ? '異常' : '正常'}
              </span>
              <span class="text-xs px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-medium">
                \${r.plant}
              </span>
            </div>
            <span class="text-xs text-slate-400 font-mono">\${r.time}</span>
          </div>
          <div class="flex justify-between items-center mb-1">
            <span class="text-base font-bold text-slate-900">\${r.equipmentName || r.equipmentId}</span>
            <span class="text-xs text-slate-600">巡檢員：<b>\${r.inspectorName}</b></span>
          </div>
          <p class="text-sm text-slate-600 mt-1 \${isAb ? 'text-red-900 font-medium' : ''}">\${r.description}</p>
        \`;
        container.appendChild(card);
      });
      lucide.createIcons();
    }

    function openAdminModal() {
      document.getElementById('admin-modal').classList.remove('hidden');
    }
    function closeAdminModal() {
      document.getElementById('admin-modal').classList.add('hidden');
    }
    function loginAdmin() {
      const pwd = document.getElementById('admin-password').value;
      if (pwd === 'sec888' || pwd === 'admin') {
        quickLoginAdmin();
      } else {
        alert('密碼錯誤！請輸入 sec888');
      }
    }
    function quickLoginAdmin() {
      document.getElementById('admin-login-view').classList.add('hidden');
      document.getElementById('admin-panel-view').classList.remove('hidden');
      renderAdminEqList();
    }
    function renderAdminEqList() {
      const container = document.getElementById('admin-eq-list');
      container.innerHTML = '';
      equipments.forEach(e => {
        const div = document.createElement('div');
        div.className = 'flex items-center justify-between p-2 rounded bg-slate-900 text-xs border border-slate-800';
        div.innerHTML = \`<span class="font-bold">\${e.name} <span class="font-mono text-orange-400">[\${e.id}]</span></span><span class="text-slate-500">\${e.plant}</span>\`;
        container.appendChild(div);
      });
    }
    function addNewEquipment() {
      const plant = document.getElementById('new-eq-plant').value;
      const id = document.getElementById('new-eq-id').value.trim().toUpperCase();
      const name = document.getElementById('new-eq-name').value.trim();
      if (!id || !name) {
        alert('請填寫完整設備編號與設備名稱！');
        return;
      }
      equipments.unshift({ id, name, plant });
      renderEquipmentDropdown();
      renderAdminEqList();
      document.getElementById('new-eq-id').value = '';
      document.getElementById('new-eq-name').value = '';
      alert(\`已成功將設備 \${name} [\${id}] 加入後台資料庫！\`);
    }

    document.getElementById('inspection-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const now = new Date();
      const timeStr = now.getFullYear() + '/' + 
        String(now.getMonth()+1).padStart(2,'0') + '/' + 
        String(now.getDate()).padStart(2,'0') + ' ' + 
        String(now.getHours()).padStart(2,'0') + ':' + 
        String(now.getMinutes()).padStart(2,'0');

      const nameVal = document.getElementById('equipment-name').value.trim();
      const matched = equipments.find(e => e.name === nameVal);

      const newRecord = {
        id: 'SEC-' + Date.now().toString().slice(-6),
        plant: document.getElementById('plant-select').value,
        equipmentName: nameVal,
        equipmentId: matched ? matched.id : undefined,
        inspectorName: document.getElementById('inspector-name').value.trim(),
        status: currentStatus,
        description: document.getElementById('description-input').value.trim(),
        time: timeStr
      };

      records.unshift(newRecord);
      renderRecords();

      document.getElementById('equipment-name').value = '';
      document.getElementById('description-input').value = '';
      removePhoto(e);
      setStatus('normal');

      alert('巡檢紀錄已成功送出！');
    });

    renderEquipmentDropdown();
    renderRecords();
    lucide.createIcons();
  </script>
</body>
</html>`;

export const StandaloneHtmlModal: React.FC<StandaloneHtmlModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(standaloneHtmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([standaloneHtmlCode], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'southeast_cement_inspection.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div 
        className="relative bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-orange-600/30 text-orange-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">單一 HTML 完整原始碼 (Tailwind CDN + JS)</h3>
              <p className="text-xs text-slate-400">可直接另存為 .html 檔，雙擊即可在任意瀏覽器直接開啟離線使用</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar */}
        <div className="px-5 py-2.5 bg-slate-800/80 border-b border-slate-700 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '已複製全部代碼' : '一鍵複製完整 HTML'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-orange-400" />
              <span>下載 .html 檔案</span>
            </button>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {standaloneHtmlCode.split('\n').length} 行 · 無需任何編譯指令
          </span>
        </div>

        {/* Code box */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed select-all">
          <pre>{standaloneHtmlCode}</pre>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            關閉視窗
          </button>
        </div>
      </div>
    </div>
  );
};
