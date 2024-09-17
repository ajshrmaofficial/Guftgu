import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
// import useAuth from '../hooks/useAuth';
import {
  AppNavigationStack,
  AuthNavigationStack,
} from './NavigationStackProvider';
import {lightTheme} from '../definitionStore';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar} from 'react-native';
import useUserStore from '../store/userStore';

function Navigator(): React.JSX.Element {
  // const {authToken} = useAuth();
  const authToken = useUserStore(state => state.authToken);

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
