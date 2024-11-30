import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../../screens/Login';
import Register from '../../screens/Register';
import Guftgu from '../../screens/Guftgu';
import Mehfil from '../../screens/Mehfil';
import {
  AppStackParamList,
  AppTabParamList,
  AuthStackParamList,
} from './NavigationStackTypes';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Map from '../../screens/Map';
import ChatScreen from '../../screens/ChatScreen';
import Profile from '../../screens/Profile';
import Header from '../../components/Header';
import TabBarIcon from '../../components/utility/TabBarIcon';
// import ChatIcon from '../../../assets/svg/chatbubble.svg';
// import ChatIconOutline from '../../../assets/svg/chatbubble-outline.svg';
// import GroupChatIcon from '../../../assets/svg/chatbubbles.svg';
// import GroupChatIconOutline from '../../../assets/svg/chatbubbles-outline.svg';
// import LocationIcon from '../../../assets/svg/location.svg';
// import LocationIconOutline from '../../../assets/svg/location-outline.svg';
import { PortalHost } from '@gorhom/portal';
import { SCREEN_HEIGHT } from '@gorhom/bottom-sheet';
import getThemeColors from '../theme';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();
const AppTab = createBottomTabNavigator<AppTabParamList>();

function AuthNavigationStack(): React.JSX.Element {
  return (
    <AuthStack.Navigator screenOptions={{headerShown: false}}>
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Register" component={Register} />
    </AuthStack.Navigator>
  );
}

function AppTabs(): React.JSX.Element {
  const {text, background} = getThemeColors();
  return (
    <>
      <AppTab.Navigator
        screenOptions={{
          header: prop => (
            <Header props={prop}/>
          ),
          tabBarStyle: {
            height: SCREEN_HEIGHT * 0.1,
            backgroundColor: background.primary.hex,
            elevation: 0,
            borderTopWidth: 0,
            shadowOffset: {
              width: 0,
              height: 0,
            },
          },
          tabBarLabelStyle: {
            fontSize: 12,
            color: text.primary.hex,
            fontWeight: 'bold',
          },
        }}>
        <AppTab.Screen
          name="Guftgu"
          component={Guftgu}
          options={{
            tabBarIcon: ({size, focused}) => (
              <TabBarIcon
                size={size}
                isFocused={focused}
                name='Guftgu'
              />
            ),
          }}
        />
        <AppTab.Screen
          name="Mehfil"
          component={Mehfil}
          options={{
            tabBarIcon: ({size, focused}) => (
              <TabBarIcon
                size={size}
                isFocused={focused}
                name='Mehfil'
              />
            ),
          }}
        />
        <AppTab.Screen
          name="Map"
          component={Map}
          options={{
            tabBarIcon: ({size, focused}) => (
              <TabBarIcon
                size={size}
                isFocused={focused}
                name='Map'
              />
            ),
          }}
        />
      </AppTab.Navigator>
      <PortalHost name='bottomSheetPortal'/>
    </>
  );
}

function AppNavigationStack(): React.JSX.Element {
  return (
    <AppStack.Navigator screenOptions={{headerShown: false}}>
      <AppStack.Screen name="AppTabs" component={AppTabs} />
      <AppStack.Screen name="ChatScreen" component={ChatScreen} />
      <AppStack.Screen name="Profile" component={Profile} />
    </AppStack.Navigator>
  );
}

export {AuthNavigationStack, AppNavigationStack};
