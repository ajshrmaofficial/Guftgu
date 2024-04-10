import {BottomSheetBackdrop, BottomSheetModal, useBottomSheetModal} from '@gorhom/bottom-sheet';
import { useTheme } from '@react-navigation/native';
import React, {useCallback, useMemo} from 'react';
import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
export type Ref = BottomSheetModal;

export function useMenu(bottomModalRef: React.RefObject<BottomSheetModal>) {
    const snapPoints = useMemo(() => ['25%', '50%', '70%'], []);
    const {colors} = useTheme();

    const openMenuModal = useCallback(() => {
        bottomModalRef.current?.present();
    }, [bottomModalRef])

    const closeMenuModal = useCallback(()=>{
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

    const MenuModal = () => {
      const menuItems = ["New Chat", "Friends", "Settings"];
      return (
          <BottomSheetModal
            ref={bottomModalRef}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            handleIndicatorStyle={{backgroundColor: '#000'}}
            backgroundStyle={{backgroundColor: colors.background}}
            backdropComponent={renderBackdrop}>
            <View className='flex-1 self-center items-center w-full rounded-md divide-y' style={{backgroundColor: colors.background}}>
              {menuItems.map((items, index)=>(
                <TouchableOpacity key={index} className='w-full p-3 items-center' style={{borderBottomColor: colors.border}}>
                <Text className='text-black text-lg font-medium'>{items}</Text>
                </TouchableOpacity>
              ))}
              {/* <CloseBtn/> */}
            </View>
          </BottomSheetModal>
      );
    }

    return {MenuModal, openMenuModal, closeMenuModal};
}

export default useMenu

