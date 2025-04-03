import {BottomTabHeaderProps} from '@react-navigation/bottom-tabs';
import React, { useEffect, useRef, useState } from 'react';
import {Text, TouchableOpacity, View, Image} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import AddFriendModal from './AddFriendModal';
import MenuModal from './MenuModal';
import Icon from 'react-native-vector-icons/MaterialIcons'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import getThemeColors from '../utility/theme';
import SearchChatModal from './SearchChatModal';
import useUserStore from '../utility/store/userStore';

function Header({props}: {props: BottomTabHeaderProps}): React.JSX.Element {
  const {background, text, icons} = getThemeColors();
  const insets = useSafeAreaInsets();
  const navigation = props.navigation;
  const routeName = props.route.name;
  const addFriendModalRef = useRef<BottomSheetModal>(null);
  const searchChatModalRef = useRef<BottomSheetModal>(null);
  const menuModalRef = useRef<BottomSheetModal>(null);
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  
  useEffect(()=>{
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () =>  unsubscribe();
  }, [])

  const ICON_MAPPING = {
    Profile: 'person',
    Search: 'search',
    AddFriend: 'person-add',
  } as const;

  const HeaderIcon = (props: {name: string}): React.JSX.Element => {
    const profilePic = useUserStore(state=>state.profilePic);
    const isProfile = props.name === 'Profile';
    const isMenu = props.name === 'Menu';

    const handlePress = () => {
      switch(props.name) {
        case 'Profile': return navigation.navigate('Profile');
        case 'Search': return searchChatModalRef.current?.present();
        case 'AddFriend': return addFriendModalRef.current?.present();
        case 'Menu': return menuModalRef.current?.present();
        default: return;
      }
    };

    const showProfilePic = isProfile && profilePic;

    return (
      <TouchableOpacity onPress={handlePress}>
        <View
          className={`rounded-full mx-2 ${background.card.tailwind} ${
            showProfilePic ? '' : 'p-2'
          }`}>
          {showProfilePic ? (
            <Image 
              source={{uri: profilePic}} 
              className="w-10 h-10 rounded-full"
            />
          ) : isMenu ? (
            <MaterialIcon 
              name="dots-horizontal" 
              size={24} 
              color={icons.primary.hex}
            />
          ) : (
            <Icon 
              name={ICON_MAPPING[props.name as keyof typeof ICON_MAPPING] || ''} 
              size={24} 
              color={icons.primary.hex}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        paddingTop: insets.top,
      }}
      className={`w-full flex-row items-center justify-between pb-2 px-2 ${routeName==='Map' ? 'bg-transparent' : background.primary.tailwind}`}>
      <View className="flex-row">
        <HeaderIcon name='Profile'/>
        <HeaderIcon name='Search'/>
      </View>
      <Text
        className={`text-xl ${routeName === 'Map' ? 'text-black' : routeName === 'Guftgu' ? text.accent.tailwind : text.primary.tailwind} ${routeName === 'Guftgu' ? 'font-semibold' : ''}`}
        >
        {routeName}
      </Text>
      <View className="flex-row">
        <HeaderIcon name='AddFriend'/>
        <HeaderIcon name='Menu'/>
      </View>
        <AddFriendModal navigation={navigation} bottomModalRef={addFriendModalRef} snapPointsArr={['25%', '50%', '70%']} initialIndex={2}/>
        <SearchChatModal navigation={navigation} bottomModalRef={searchChatModalRef} snapPointsArr={['25%', '50%', '70%']} initialIndex={2}/>
        <MenuModal navigation={navigation} addFriendModalRef={addFriendModalRef} bottomModalRef={menuModalRef} snapPointsArr={['25%']} initialIndex={0}/>
    </View>
  );
}

export default Header;
