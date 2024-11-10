import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {
  AppNavigationStack,
  AuthNavigationStack,
} from './NavigationStackProvider';
import {lightTheme} from '../definitionStore';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar} from 'react-native';
import useUserStore from '../store/userStore';
// import useAppStore from '../store/appStore';

function Navigator(): React.JSX.Element {
  // const theme = useAppStore(state => state.theme);
  const authToken = useUserStore(state => state.authToken);

  // const currPallete = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <SafeAreaProvider>
      <StatusBar
        backgroundColor="transparent"
        barStyle="dark-content"
        translucent={true}
      />
      <NavigationContainer theme={lightTheme}>
        {authToken ? <AppNavigationStack /> : <AuthNavigationStack />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default Navigator;
