declare module 'react-native-config' {
    export interface NativeConfig {
        DEV_SERVER_IP?: string
        PROD_SERVER_IP?: string
        ENV?:string
    }

    export const Config: NativeConfig
    export default Config
}