import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useUIStore = create(
  devtools(
    (set, get) => ({
      theme: 'light',
      sidebarCollapsed: false,
      activeModal: null,
      notifications: [],
      loadingStates: new Map(),
      focusedElement: null,
      developmentMode: import.meta.env.DEV,

      setTheme: (theme) => set({ theme }),

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      openModal: (modalConfig) =>
        set({ activeModal: modalConfig }),

      closeModal: () =>
        set({ activeModal: null }),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            ...state.notifications,
            {
              id: Date.now().toString(),
              timestamp: new Date().toISOString(),
              ...notification,
            },
          ],
        })),

      removeNotification: (notificationId) =>
        set((state) => ({
          notifications: state.notifications.filter(
            (n) => n.id !== notificationId
          ),
        })),

      clearNotifications: () =>
        set({ notifications: [] }),

      setLoading: (key, isLoading) =>
        set((state) => {
          const newLoadingStates = new Map(state.loadingStates);
          if (isLoading) {
            newLoadingStates.set(key, true);
          } else {
            newLoadingStates.delete(key);
          }
          return { loadingStates: newLoadingStates };
        }),

      isLoading: (key) => {
        const state = get();
        return key ? state.loadingStates.has(key) : state.loadingStates.size > 0;
      },

      setFocusedElement: (elementId) =>
        set({ focusedElement: elementId }),

      toggleDevelopmentMode: () =>
        set((state) => ({ developmentMode: !state.developmentMode })),

      getUIState: () => {
        const state = get();
        return {
          theme: state.theme,
          sidebarCollapsed: state.sidebarCollapsed,
          hasActiveModal: !!state.activeModal,
          notificationCount: state.notifications.length,
          isAnyLoading: state.loadingStates.size > 0,
          developmentMode: state.developmentMode,
        };
      },
    }),
    {
      name: 'UIStore',
    }
  )
);

export default useUIStore;