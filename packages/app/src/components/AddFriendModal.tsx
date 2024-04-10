import {BottomSheetBackdrop, BottomSheetModal, BottomSheetTextInput} from '@gorhom/bottom-sheet';
import { useTheme } from '@react-navigation/native';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import SearchIcon from '../../assets/svg/search.svg'
export type Ref = BottomSheetModal;

export function useAddFriend(bottomModalRef: React.RefObject<BottomSheetModal>) {
    const snapPoints = useMemo(() => ['25%', '50%', '70%'], []);
    const {colors} = useTheme();
    const textInputRef:any = useRef();

    const openAddFriendModal = useCallback(() => {
        bottomModalRef.current?.present();
    }, [bottomModalRef])

    const closeAddFriendModal = useCallback(()=>{
        bottomModalRef.current?.dismiss();
    }, [bottomModalRef])

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          {...props}
        />
      ),
      [],
    );

    const searchFriend = () => {
        console.log('searching username...', textInputRef.current)
    }

    const AddFriendModal = () => {
      return (
          <BottomSheetModal
            ref={bottomModalRef}
            index={2}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            handleIndicatorStyle={{backgroundColor: '#000'}}
            backgroundStyle={{backgroundColor: colors.background}}
            backdropComponent={renderBackdrop}>
            <View className='flex-1 items-center w-full rounded-md' style={{backgroundColor: colors.background}}>
              <View className='w-11/12 flex-row items-center border p-1 rounded-xl' style={{borderColor: colors.border}}>
                <SearchIcon width={20} height={20} style={{marginRight: 8}}/>
              <BottomSheetTextInput placeholder='Search username' ref={textInputRef} returnKeyType='search' onChangeText={text=>textInputRef.current = text} placeholderTextColor={colors.text} style={{color: colors.text, fontSize: 18}} onSubmitEditing={searchFriend}/>
              </View>
            </View>
          </BottomSheetModal>
      );
    }

    return {AddFriendModal, openAddFriendModal, closeAddFriendModal};
}

export default useAddFriend

