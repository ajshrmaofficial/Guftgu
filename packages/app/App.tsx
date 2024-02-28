import React from 'react';
import {AuthProvider} from './src/utility/context/AuthContext';
import Navigator from './src/utility/navigation/Navigator';
import {AppThemeProvider} from './src/utility/context/ThemeContext';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

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
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <AuthProvider>
          <Navigator />
        </AuthProvider>
      </AppThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
