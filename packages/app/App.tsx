import React from 'react';
import Navigator from './src/utility/navigation/Navigator';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { PortalProvider } from '@gorhom/portal';
import './global.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
});

function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PortalProvider>
          <BottomSheetModalProvider>
            <Navigator />
          </BottomSheetModalProvider>
        </PortalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

export default App;
