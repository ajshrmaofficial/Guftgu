import {BottomTabHeaderProps} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Alert, Platform, StyleSheet, Text, ToastAndroid, TouchableOpacity, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import UserProfileIcon from '../../assets/svg/person.svg';
import SearchIcon from '../../assets/svg/search.svg';
import MenuIcon from '../../assets/svg/ellipsis-horizontal.svg';
import AddPersonIcon from '../../assets/svg/person-add.svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useMenu from './MenuModal';

function Header({props, bottomModalRef}: {props: BottomTabHeaderProps, bottomModalRef: bottomModalCollection}): React.JSX.Element {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = props.navigation;
  const routeName = props.route.name;
  const {menuModalRef, addFriendModalRef, searchModalRef} = bottomModalRef;
  const {openMenuModal, closeMenuModal} = useMenu(menuModalRef);
  const {openAddFriendModal, closeAddFriendModal} = useAddFriend(addFriendModalRef);

  const styles = StyleSheet.create({
    headerSVG: {
      height: 24,
      width: 24,
    },
  });

  function WrapperView(props: {children: React.ReactNode, name: string}): React.JSX.Element {

    const onPress = () => {
        if(props.name==='Profile'){
            navigation.navigate('Profile')
        } else if(props.name==='Search'){
            if(Platform.OS==='android'){
                ToastAndroid.show('To be implemented...', ToastAndroid.SHORT);
            } else{
                Alert.alert('To be implemented...');
            }
        } else if(props.name === 'AddFriend'){
            openAddFriendModal();
        } else if(props.name==='Menu'){
            openMenuModal();
        }
    }

    return (
      <TouchableOpacity onPress={onPress}>
        <View
          style={{backgroundColor: colors.primary}}
          className="rounded-full h-26 p-2 mx-2">
          {props.children}
        </View>
      </TouchableOpacity>
    );
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
        <WrapperView name='Profile'>
          <UserProfileIcon style={styles.headerSVG} fill={colors.border} />
        </WrapperView>
        <WrapperView name='Search'>
          <SearchIcon style={styles.headerSVG} fill={colors.border} />
        </WrapperView>
      </View>
      <Text
        className="text-xl font-bold"
        style={{color: routeName === 'Map' ? 'white' : 'black'}}>
        {routeName}
      </Text>
      <View className="flex-row">
        <WrapperView name='AddFriend'>
          <AddPersonIcon style={styles.headerSVG} fill={colors.border} />
        </WrapperView>
        <WrapperView name='Menu'>
          <MenuIcon style={styles.headerSVG} fill={colors.border} />
        </WrapperView>
      </View>
    </View>
  );
}
import { bottomModalCollection } from '../utility/definitionStore';
import useAddFriend from './AddFriendModal';

export default Header;
