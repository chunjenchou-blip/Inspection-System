import { InspectionRecord, EquipmentItem } from '../types';

// Pre-seeded high quality realistic records for Southeast Cement (東南水泥)
export const initialRecords: InspectionRecord[] = [
  {
    id: 'SEC-20261016-001',
    plant: '高雄港發貨站',
    equipmentId: 'KHH-SILO-02',
    equipmentName: '2號散裝水泥儲槽卸料閥',
    inspectorName: '陳建宏',
    status: 'abnormal',
    description: '卸料氣動雙偏心蝶閥法蘭處微量漏氣並有些微溢灰，氣缸作動速度稍緩，已報備保修組排修。',
    photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    timestamp: '2026-10-16 09:25:14',
    severity: 'medium',
  },
  {
    id: 'SEC-20261016-002',
    plant: '總公司',
    equipmentId: 'HQ-MILL-01',
    equipmentName: '1號生料立磨主減速箱',
    inspectorName: '黃志強',
    status: 'normal',
    description: '主馬達運轉聲音平順無異常雜音，潤滑油位正常（約3/4處），測溫48.5°C在容許範圍內。',
    photoUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
    timestamp: '2026-10-16 08:42:30',
  },
  {
    id: 'SEC-20261016-003',
    plant: '高雄港發貨站',
    equipmentId: 'KHH-BAG-04',
    equipmentName: '袋式集塵機排風機 No.4',
    inspectorName: '林冠宇',
    status: 'normal',
    description: '脈衝噴吹閥動作正常，排氣壓差850Pa符合環保規範，出風口無黑煙或肉眼可見粉塵。',
    photoUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80',
    timestamp: '2026-10-16 08:15:05',
  },
  {
    id: 'SEC-20261015-004',
    plant: '總公司',
    equipmentId: 'HQ-KILN-02',
    equipmentName: '2號迴轉窯托輪軸承座',
    inspectorName: '周專員',
    status: 'abnormal',
    description: '紅外線測溫顯示第三組托輪軸承溫度高達64.2°C（警報閾值60°C），循環油冷卻水流量疑似偏低，已先進行外部局部吹風降溫並通報工務部。',
    photoUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=600&q=80',
    timestamp: '2026-10-15 16:50:22',
    severity: 'high',
  },
  {
    id: 'SEC-20261015-005',
    plant: '高雄港發貨站',
    equipmentId: 'KHH-SHIP-01',
    equipmentName: '碼頭散裝水泥船裝船機伸臂皮帶機',
    inspectorName: '陳建宏',
    status: 'normal',
    description: '伸縮套管防塵罩完整，皮帶無跑偏，急停拉繩開關測試作動靈敏正常，準備下午裝船作業。',
    photoUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80',
    timestamp: '2026-10-15 14:10:48',
  },
];

export const defaultEquipments: EquipmentItem[] = [
  { id: 'KHH-SILO-02', name: '2號散裝水泥儲槽', plant: '高雄港發貨站', notes: '氣動卸料閥門與下料管' },
  { id: 'KHH-CONV-05', name: '5號散裝水泥皮帶輸送機', plant: '高雄港發貨站', notes: '出料口至碼頭線' },
  { id: 'KHH-BAG-04', name: '袋式集塵機排風機 No.4', plant: '高雄港發貨站', notes: '負壓袋式除塵單元' },
  { id: 'KHH-SHIP-01', name: '碼頭散裝水泥船裝船機', plant: '高雄港發貨站', notes: '伸縮裝船套管' },
  { id: 'HQ-MILL-01', name: '1號生料立式磨機', plant: '總公司', notes: '主磨減速機與磨輥' },
  { id: 'HQ-KILN-02', name: '2號迴轉窯托輪設備', plant: '總公司', notes: '窯體旋轉托輪軸承' },
  { id: 'HQ-CRUSH-03', name: '石灰石二段圓錐破碎機', plant: '總公司', notes: '二段碎石主機' },
  { id: 'HQ-COOL-01', name: '熟料篦式冷卻機', plant: '總公司', notes: '冷卻風機與傳動單元' },
];

export const samplePresetEquipments = defaultEquipments;

export const quickStatusNotes = {
  normal: [
    '設備運轉平順無異音',
    '軸承潤滑油位正常，測溫正常',
    '馬達電流與震動值符合標準',
    '安全防護罩與緊急拉繩開關定位良好',
    '法蘭接頭無漏風、無粉塵外洩',
  ],
  abnormal: [
    '運轉有金屬摩擦異音，軸承震動偏大',
    '測溫超過警報閥值，疑似散熱不良',
    '法蘭密封墊圈老化，產生漏氣溢灰',
    '皮帶有明顯跑偏及邊緣磨損現象',
    '潤滑油液位過低，油品顏色發黑需更換',
    '安全互鎖裝置作動異常，需立即停機檢修',
  ],
};
