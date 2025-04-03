declare module 'react-native-config' {
    export interface NativeConfig {
        DEV_SERVER_IP?: string
        PROD_SERVER_IP?: string
        ENV?:string
        VITE_SUPABASE_URL: string
        VITE_SUPABASE_ANON_KEY: string
    }

    export const Config: NativeConfig
    export default Config
}