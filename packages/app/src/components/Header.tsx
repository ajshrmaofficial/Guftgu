import {BottomTabHeaderProps} from '@react-navigation/bottom-tabs';
import React, { useEffect, useRef, useState } from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import AddFriendModal from './AddFriendModal';
import MenuModal from './MenuModal';
import Icon from 'react-native-vector-icons/MaterialIcons'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import getThemeColors from '../utility/theme';
import SearchChatModal from './SearchChatModal';

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

  const HeaderIcon = (props: {name: string}): React.JSX.Element => {

    let onPressFn: ()=>void;

    switch(props.name){
      case 'Profile': onPressFn = ()=>navigation.navigate('Profile');
                      break;
      case 'Search': 
                     onPressFn = ()=>searchChatModalRef.current?.present();
                     break;
      case 'AddFriend': 
                        onPressFn = ()=>addFriendModalRef.current?.present();
                        break;
      case 'Menu': 
                  onPressFn = ()=>menuModalRef.current?.present();
                   break;    
      default: 
               onPressFn = ()=>{}
    }

    return(
      <TouchableOpacity onPress={onPressFn}>
        <View
          className={`rounded-full h-26 p-2 mx-2 ${background.card.tailwind}`}>
          {props.name!=='Menu' && <Icon name={props.name==='Profile' ? 'person' : props.name==='Search' ? 'search' : props.name==='AddFriend' ? 'person-add' : ''} size={24} color={icons.primary.hex}/>}
          {props.name==='Menu' && <MaterialIcon name='dots-horizontal' size={24} color={icons.primary.hex}/>}
         
        
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View
      style={{
        paddingTop: insets.top,
      }}
      className={`w-full flex-row items-center justify-between pb-2 px-2 ${routeName==='Map' ? 'absolute' : 'relative'} ${routeName==='Map' ? 'bg-transparent' : background.primary.tailwind}`}>
      <View className="flex-row">
        <HeaderIcon name='Profile'/>
        <HeaderIcon name='Search'/>
      </View>
      <Text
        className={`text-xl ${routeName === 'Map' ? 'text-white' : routeName === 'Guftgu' ? text.accent.tailwind : text.primary.tailwind} ${routeName === 'Guftgu' ? 'font-semibold' : ''}`}
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
