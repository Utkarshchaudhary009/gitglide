import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const RAIL_WIDTH = 64
export const DEFAULT_WIDTH = 288
export const MAX_WIDTH = 600
export const COLLAPSE_THRESHOLD = 100

interface MobileSidebarState {
  isOpen: boolean
  toggle: () => void
  setOpen: (open: boolean) => void
}

export const useMobileSidebarStore = create<MobileSidebarState>()((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (open) => set({ isOpen: open }),
}))

interface DesktopSidebarState {
  width: number
  toggle: () => void
  setWidth: (width: number) => void
}

export const useDesktopSidebarStore = create<DesktopSidebarState>()(
  persist(
    (set, get) => ({
      width: DEFAULT_WIDTH,
      toggle: () => {
        const { width } = get()
        const newWidth = width > COLLAPSE_THRESHOLD ? RAIL_WIDTH : DEFAULT_WIDTH
        set({ width: newWidth })
      },
      setWidth: (width) => set({ width }),
    }),
    {
      name: 'sidebar-desktop-storage',
      partialize: (state) => ({ width: state.width }),
    }
  )
)
