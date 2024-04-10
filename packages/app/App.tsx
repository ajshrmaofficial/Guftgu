import React from 'react';
// import {AuthProvider} from './src/utility/context/AuthContext';
import Navigator from './src/utility/navigation/Navigator';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
// import {UserProvider} from './src/utility/context/UserContext';
import {Provider} from 'react-redux';
import {store} from './src/utility/redux/rootStore';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <BottomSheetModalProvider>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <Navigator />
          </QueryClientProvider>
        </Provider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

export default App;
