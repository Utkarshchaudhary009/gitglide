import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SidebarState {
  isOpen: boolean
  width: number
  toggle: () => void
  setOpen: (open: boolean) => void
  setWidth: (width: number) => void
}

const RAIL_WIDTH = 64
const DEFAULT_WIDTH = 288

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      isOpen: true,
      width: RAIL_WIDTH,
      toggle: () => {
        const { width, isOpen } = get()
        if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
          // Desktop: toggle between rail and expanded
          const newWidth = width > 100 ? RAIL_WIDTH : DEFAULT_WIDTH
          set({ width: newWidth, isOpen: true })
        } else {
          // Mobile: toggle visibility
          set({ isOpen: !isOpen })
        }
      },
      setOpen: (open) => set({ isOpen: open }),
      setWidth: (width) => set({ width }),
    }),
    {
      name: 'sidebar-storage',
    }
  )
)
