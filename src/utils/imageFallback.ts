// Robust industrial equipment SVG data URIs for zero-broken image assurance

export function getEquipmentFallbackImage(equipmentId: string, status: 'normal' | 'abnormal'): string {
  const isAbnormal = status === 'abnormal';
  const badgeColor = isAbnormal ? '#ef4444' : '#10b981';
  const badgeText = isAbnormal ? '異常紀錄' : '設備正常';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none">
    <rect width="600" height="400" fill="#1e2430"/>
    <defs>
      <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#2d3748" stroke-width="0.8"/>
      </pattern>
    </defs>
    <rect width="600" height="400" fill="url(#grid)" />
    
    <!-- Industrial Silo / Machine Silhouette -->
    <rect x="220" y="90" width="160" height="180" rx="8" fill="#334155" stroke="#475569" stroke-width="2"/>
    <ellipse cx="300" cy="90" rx="80" ry="24" fill="#475569" stroke="#64748b" stroke-width="2"/>
    <polygon points="220,270 300,340 380,270" fill="#1e293b" stroke="#475569" stroke-width="2"/>
    
    <!-- Pipes and flanges -->
    <path d="M 380 180 L 480 180 L 480 290" stroke="#64748b" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="480" cy="290" r="14" fill="#f97316"/>
    
    <path d="M 120 220 L 220 220" stroke="#64748b" stroke-width="10" stroke-linecap="round"/>
    <rect x="110" y="200" width="20" height="40" rx="3" fill="#94a3b8"/>
    
    <!-- Status Banner -->
    <rect x="24" y="24" width="140" height="36" rx="6" fill="${badgeColor}" />
    <text x="94" y="47" fill="#ffffff" font-size="14" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" text-anchor="middle">${badgeText}</text>
    
    <!-- Equipment Label -->
    <rect x="24" y="336" width="300" height="40" rx="6" fill="#0f172a" fill-opacity="0.85" stroke="#334155" stroke-width="1"/>
    <text x="36" y="361" fill="#f8fafc" font-size="15" font-family="monospace" font-weight="bold">${equipmentId}</text>
    <text x="180" y="361" fill="#94a3b8" font-size="12" font-family="sans-serif">現場巡檢紀錄存證</text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
