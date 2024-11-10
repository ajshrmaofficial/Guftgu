import {BottomTabHeaderProps} from '@react-navigation/bottom-tabs';
import React, { useEffect, useRef, useState } from 'react';
import {Alert, Platform, StyleSheet, Text, ToastAndroid, TouchableOpacity, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import UserProfileIcon from '../../assets/svg/person.svg';
import SearchIcon from '../../assets/svg/search.svg';
import MenuIcon from '../../assets/svg/ellipsis-horizontal.svg';
import AddPersonIcon from '../../assets/svg/person-add.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import AddFriendModal from './AddFriendModal';
import MenuModal from './MenuModal';
import VIcon from 'react-native-vector-icons/MaterialIcons'

function Header({props}: {props: BottomTabHeaderProps}): React.JSX.Element {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = props.navigation;
  const routeName = props.route.name;
  const addFriendModalRef = useRef<BottomSheetModal>(null);
  const menuModalRef = useRef<BottomSheetModal>(null);
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  
  useEffect(()=>{
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () =>  unsubscribe();
  }, [])

  const styles = StyleSheet.create({
    headerSVG: {
      height: 24,
      width: 24,
    },
  });

  const HeaderIcon = (props: {name: string}): React.JSX.Element => {

    let Icon, onPressFn: ()=>void;

    switch(props.name){
      case 'Profile': Icon = <UserProfileIcon style={styles.headerSVG} fill={colors.border} />;
                      onPressFn = ()=>navigation.navigate('Profile');
                      break;
      case 'Search': 
      // Icon = <SearchIcon style={styles.headerSVG} fill={colors.border} />;
      Icon = <VIcon name="search" size={24} color={colors.border} />; // TODO: migrate completely to react-native-vector-icons
                     onPressFn = ()=>Platform.OS==='android' ? 
                                    ToastAndroid.show('To be implemented...', ToastAndroid.SHORT)
                                 :
                                    Alert.alert('To be implemented...');
                     break;
      case 'AddFriend': Icon = <AddPersonIcon style={styles.headerSVG} fill={colors.border} />;
                        // onPressFn = ()=>openAddFriendModal();
                        onPressFn = ()=>addFriendModalRef.current?.present();
                        break;
      case 'Menu': Icon = <MenuIcon style={styles.headerSVG} fill={colors.border} />;
                  //  onPressFn = ()=>openMenuModal();
                  onPressFn = ()=>menuModalRef.current?.present();
                   break;    
      default: Icon = "";
               onPressFn = ()=>{}
    }

    return(
      <TouchableOpacity onPress={onPressFn}>
        <View
          style={{backgroundColor: colors.primary}}
          className="rounded-full h-26 p-2 mx-2">
          {Icon}
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View
      style={{
        backgroundColor:
          routeName === 'Map' ? 'rgba(255, 255, 255, 0)' : '',
        position: routeName === 'Map' ? 'absolute' : 'relative',
        paddingTop: insets.top,
      }}
      className="w-full flex-row items-center justify-between px-2">
      <View className="flex-row">
        <HeaderIcon name='Profile'/>
        <HeaderIcon name='Search'/>
      </View>
      <Text
        className="text-xl"
        style={{color: routeName === 'Map' ? 'white' : 'black'}}>
        {routeName}
      </Text>
      <View className="flex-row">
        <HeaderIcon name='AddFriend'/>
        <HeaderIcon name='Menu'/>
      </View>
        <AddFriendModal navigation={navigation} bottomModalRef={addFriendModalRef} snapPointsArr={['25%', '50%', '70%']} initialIndex={2}/>
        <MenuModal navigation={navigation} addFriendModalRef={addFriendModalRef} bottomModalRef={menuModalRef} snapPointsArr={['25%']} initialIndex={0}/>
    </View>
  );
}

export default Header;
