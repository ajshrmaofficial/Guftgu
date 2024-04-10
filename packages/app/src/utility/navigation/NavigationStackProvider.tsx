import React, {useRef} from 'react';
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
import TabBarIcon from '../../components/TabBarIcon';
import ChatIcon from '../../../assets/svg/chatbubble.svg';
import ChatIconOutline from '../../../assets/svg/chatbubble-outline.svg';
import GroupChatIcon from '../../../assets/svg/chatbubbles.svg';
import GroupChatIconOutline from '../../../assets/svg/chatbubbles-outline.svg';
import LocationIcon from '../../../assets/svg/location.svg';
import LocationIconOutline from '../../../assets/svg/location-outline.svg';
import {useTheme} from '@react-navigation/native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import TabHeaderModals from '../../components/TabHeaderModals';
import { bottomModalCollection } from '../definitionStore';

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
  const bottomModalRef: bottomModalCollection = {
    menuModalRef: useRef<BottomSheetModal>(null),
    addFriendModalRef: useRef<BottomSheetModal>(null),
    searchModalRef: useRef<BottomSheetModal>(null),
  };
  return (
    <>
      <AppTab.Navigator
        screenOptions={{
          header: prop => (
            <Header props={prop} bottomModalRef={bottomModalRef} />
          ),
        }}>
        <AppTab.Screen
          name="Guftgu"
          component={Guftgu}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({color, size, focused}) => (
              <TabBarIcon
                color={color}
                size={size}
                icon={focused ? ChatIcon : ChatIconOutline}
              />
            ),
          }}
        />
        <AppTab.Screen
          name="Mehfil"
          component={Mehfil}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({color, size, focused}) => (
              <TabBarIcon
                color={color}
                size={size}
                icon={focused ? GroupChatIcon : GroupChatIconOutline}
              />
            ),
          }}
        />
        <AppTab.Screen
          name="Map"
          component={Map}
          options={{
            tabBarShowLabel: false,
            tabBarIcon: ({color, size, focused}) => (
              <TabBarIcon
                color={color}
                size={size}
                icon={focused ? LocationIcon : LocationIconOutline}
              />
            ),
          }}
        />
      </AppTab.Navigator>
      <TabHeaderModals {...bottomModalRef} />
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
