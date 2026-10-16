export type PlantLocation = '總公司' | '高雄港發貨站';

export type InspectionStatus = 'normal' | 'abnormal';

export interface InspectionRecord {
  id: string;
  plant: PlantLocation;
  equipmentName: string;
  equipmentId?: string;
  inspectorName: string;
  status: InspectionStatus;
  description: string;
  photoUrl?: string;
  timestamp: string; // ISO or formatted date string
  severity?: 'low' | 'medium' | 'high'; // For abnormal cases
}

export interface EquipmentItem {
  id: string; // 設備編號
  name: string; // 設備名稱
  plant: PlantLocation;
  category?: string;
  notes?: string;
}


