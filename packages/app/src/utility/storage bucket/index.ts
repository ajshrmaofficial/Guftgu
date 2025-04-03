import { createClient } from "@supabase/supabase-js";
import 'react-native-url-polyfill/auto'
import Config from 'react-native-config'

const { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } = Config;

// Create client with custom auth header
const storageClient = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false, // Since we're using custom auth
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

// Add your auth token to every request
export const updateStorageAuth = (token: string) => {
  storageClient.headers = {
    ...storageClient.headers,
    'Authorization': `Bearer ${token}`
  };
};

export default storageClient;

