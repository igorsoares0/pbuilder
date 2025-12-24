import { create } from 'zustand';
import { PreviewMode } from '@/types/preview';

interface UIStore {
  // State
  sidebarCollapsed: boolean;
  activeTab: 'thinking' | 'conversations';
  previewMode: PreviewMode;
  showExportModal: boolean;

  // Actions
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setActiveTab: (tab: 'thinking' | 'conversations') => void;
  setPreviewMode: (mode: PreviewMode) => void;
  setShowExportModal: (show: boolean) => void;
  toggleExportModal: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // Initial state
  sidebarCollapsed: false,
  activeTab: 'thinking',
  previewMode: 'desktop',
  showExportModal: false,

  // Actions
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setPreviewMode: (mode) => set({ previewMode: mode }),
  setShowExportModal: (show) => set({ showExportModal: show }),
  toggleExportModal: () => set((state) => ({ showExportModal: !state.showExportModal })),
}));
