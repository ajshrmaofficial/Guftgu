import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useTheme} from '@react-navigation/native';
import {Text, TouchableOpacity, View} from 'react-native';
import { withBottomSheet } from './utility/BottomSheet';
export type Ref = BottomSheetModal;

function MenuModalComponent({addFriendModalRef, bottomModalRef, navigation}: {addFriendModalRef?: React.RefObject<BottomSheetModal>, bottomModalRef: React.RefObject<BottomSheetModal>, navigation?: any}) {
  const menuItems = ['New Chat', 'Friends', 'Settings'];
  const {colors} = useTheme();
  const openAddFriendModal = () => {
    if(addFriendModalRef && bottomModalRef){
      addFriendModalRef.current?.present();
      bottomModalRef.current?.dismiss();
    }
  }
  const navigateToSettings = () => {
    navigation.navigate('Profile');
    bottomModalRef.current?.dismiss();
  }
  return (
      <View
        className="flex-1 self-center items-center w-full">
        {menuItems.map((items, index) => (
          <TouchableOpacity
            key={index}
            onPress={items === 'Friends' || items === 'New Chat' ? openAddFriendModal : navigateToSettings}
            className="w-full p-3 items-center"
            style={{borderBottomColor: colors.border}}>
            <Text className="text-black text-lg font-medium">{items}</Text>
          </TouchableOpacity>
        ))}
      </View>
  );
}

const MenuModal = withBottomSheet(MenuModalComponent);

export default MenuModal;
