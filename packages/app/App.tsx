import React from 'react';
import { AuthProvider } from './src/utility/context/AuthContext';
import Navigator from './src/utility/navigation/Navigator';
import { AppThemeProvider } from './src/utility/context/ThemeContext';

function App(): React.JSX.Element {
  return (
    <AppThemeProvider>
      <AuthProvider>
      <Navigator/>
    </AuthProvider>
    </AppThemeProvider>
  )
}

export default App;
