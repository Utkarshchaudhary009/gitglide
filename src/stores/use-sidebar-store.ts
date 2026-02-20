import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const RAIL_WIDTH = 64
export const DEFAULT_WIDTH = 288
export const MAX_WIDTH = 600
export const COLLAPSE_THRESHOLD = 100

interface SidebarState {
  isOpen: boolean
  width: number
  toggle: () => void
  setOpen: (open: boolean) => void
  setWidth: (width: number) => void
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      isOpen: true,
      width: RAIL_WIDTH,
      toggle: () => {
        const { width, isOpen } = get()
        if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
          const newWidth =
            width > COLLAPSE_THRESHOLD ? RAIL_WIDTH : DEFAULT_WIDTH
          set({ width: newWidth, isOpen: true })
        } else {
          set({ isOpen: !isOpen, width: !isOpen ? DEFAULT_WIDTH : width })
        }
      },
      setOpen: (open) =>
        set({ isOpen: open, width: open ? DEFAULT_WIDTH : get().width }),
      setWidth: (width) => set({ width }),
    }),
    {
      name: 'sidebar-storage',
      partialize: (state) => ({ width: state.width }),
    }
  )
)
