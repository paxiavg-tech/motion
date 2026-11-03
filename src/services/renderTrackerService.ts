import { RenderedDesignRecord } from '../types/motion';

const STORAGE_KEY = 'auramotion_rendered_designs_v1';

/**
 * Membaca daftar desain yang sudah dirender dari localStorage
 */
export function loadRenderedDesigns(): Record<string, RenderedDesignRecord> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, RenderedDesignRecord>;
  } catch (err) {
    console.warn('Gagal membaca riwayat render dari localStorage:', err);
    return {};
  }
}

/**
 * Menyimpan atau memperbarui status desain yang baru saja berhasil dirender
 */
export function saveRenderedDesign(record: RenderedDesignRecord): Record<string, RenderedDesignRecord> {
  const current = loadRenderedDesigns();
  current[record.templateId] = record;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (err) {
    console.warn('Gagal menyimpan status render ke localStorage:', err);
  }
  return current;
}

/**
 * Menghapus tanda render untuk desain tertentu
 */
export function removeRenderedDesign(templateId: string): Record<string, RenderedDesignRecord> {
  const current = loadRenderedDesigns();
  delete current[templateId];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (err) {
    console.warn('Gagal menghapus status render dari localStorage:', err);
  }
  return current;
}

/**
 * Menghapus semua tanda desain yang sudah dirender (reset riwayat)
 */
export function clearAllRenderedDesigns(): Record<string, RenderedDesignRecord> {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Gagal mereset status render:', err);
  }
  return {};
}

/**
 * Cek apakah template tertentu sudah pernah dirender
 */
export function isTemplateRendered(
  records: Record<string, RenderedDesignRecord>,
  templateId: string
): boolean {
  return Boolean(records[templateId]);
}

/**
 * Format timestamp ke string waktu yang manusiawi (e.g. "Hari ini 14:30" atau "23 Okt 2026")
 */
export function formatRenderedTime(timestamp: number): string {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}
