import { create } from "zustand";

interface AppState{
    theme: 'dark' | 'light',
    locationPermission: boolean 
}

interface AppStateSetter{
    setTheme: (theme: 'dark' | 'light') => void
    setLocationPermission: (isPermitted: boolean) => void
}

const useAppStore = create<AppState & AppStateSetter>()((set) => ({
    theme: 'dark',
    locationPermission: false,
    setTheme: (theme: 'dark' | 'light') => set((state) => ({theme: theme})),
    setLocationPermission: (isPermitted: boolean) => set((state) => ({locationPermission: isPermitted}))
}))

export default useAppStore;
