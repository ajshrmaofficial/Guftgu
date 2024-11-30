import {BottomSheetModal, BottomSheetTextInput, TouchableOpacity} from '@gorhom/bottom-sheet';
import React, {useEffect, useRef} from 'react';
import {FlatList, Text, View} from 'react-native';
// import SearchIcon from '../../assets/svg/search.svg';
import Loader from './utility/Loader';
import {withBottomSheet} from './utility/BottomSheet';
import { useMutation } from '@tanstack/react-query';
import { FriendType } from '../utility/definitionStore';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { addFriendRequestToDB, getFriendListFromDB, updateFriendEntryInDB } from '../utility/dbModel/db';
import { friendRequestAcceptEmit, friendRequestSendEmit } from '../utility/socket/socketEvents';
import { acceptFriendRequestApiFn, searchUserApiFn, sendFriendRequestApiFn } from '../utility/api/endpointFunctions';
import getThemeColors from '../utility/theme';
export type Ref = BottomSheetModal;

function AddFriendModalComponent({navigation, bottomModalRef}: {navigation?:any, bottomModalRef: React.RefObject<BottomSheetModal>}) {
  const textInputRef: any = useRef();
  const {icons, border, text} = getThemeColors();
  const [friendListArr, setFriendListArr] = React.useState<Array<FriendType>>([]);
  
  const searchFriendMutation = useMutation({mutationFn: searchUserApiFn, onError: (err)=>console.log(err)});
  
  const friendListObserver = React.useMemo(
    () => getFriendListFromDB().observe(),
    []
  )
  
  useEffect(()=>{
    const friendListSubscription = friendListObserver.subscribe((data: any) => {
      setFriendListArr(data);
    });
    
    return () => friendListSubscription.unsubscribe();
  }, [friendListObserver]);
  
  // const FakeUsers: Array<FriendType> = [
  //     {
  //         username: 'abhishek',
  //         name: 'Abhishek Kumar',
  //         status: 'accepted',
  //         party: '1'
  //       },
  //       {
  //           username: 'abhi',
  //           name: 'Abhishek Kumar',
  //           status: 'pending',
  //           party: '1'
  //   },
  //   {
  //       username: 'abhishek',
  //       name: 'Abhishek Kumar',
  //       status: 'accepted',
  //       party: '2'
  //     },
  //     {
  //         username: 'abhishek',
  //         name: 'Abhishek Kumar',
  //         status: 'accepted',
  //         party: '1' 
  //       },
  //     ];
      
      const FriendTile = ({friend}: {friend: FriendType}) => {
        const sendFriendReqMutation = useMutation({mutationFn: sendFriendRequestApiFn, onSuccess: ()=>{
          addFriendRequestToDB(friend.username, friend.name, '2');
          friendRequestSendEmit({friendUsername: friend.username});
        }});
        const acceptFriendRequestMutation = useMutation({mutationFn: acceptFriendRequestApiFn, onSuccess: ()=>{
          updateFriendEntryInDB(friend.username, 'accepted');
          friendRequestAcceptEmit({friendUsername: friend.username})
        }});

        let onIconPress;
        if(friend.status === 'notFriend'){
          onIconPress = ()=>sendFriendReqMutation.mutate(friend.username);
        } else if(friend.status === 'pending' && friend.party === '1'){
          onIconPress = ()=>acceptFriendRequestMutation.mutate(friend.username);
        } else {
          onIconPress = ()=>{};
        }

        const getIconName = () => {
          if (friend.status === 'notFriend') {
            return 'person-add';
          }
          if (friend.status === 'pending') {
            return friend.party === '1' ? 'person-add' : 'history-toggle-off';
          }
          return 'person';
        };

        const iconName = getIconName();

        const onTilePress = () => {
          if(friend.status === 'accepted'){
            bottomModalRef.current?.dismiss();
            navigation.navigate('ChatScreen', {username: friend.username, name: friend.name});
          }
        }
    return(
      <TouchableOpacity onPress={onTilePress}>
      <View className='flex-row justify-between items-center mb-3 p-2'>
        <View className='flex-row items-center gap-2'>
          <View className='h-12 w-12 rounded-full border border-gray-900'/>
          <View>
            <Text className={`${text.primary.tailwind}`}>{friend.name}</Text>
            <Text className={`${text.secondary.tailwind}`}>@{friend.username}</Text>
          </View>
        </View>
        {friend.status!=='accepted' && <TouchableOpacity onPress={onIconPress}>
          <Icon name={iconName} size={24} color={icons.accent.hex} />
        </TouchableOpacity>}
      </View>
      </TouchableOpacity>
    )
  }

  const ListEmptyComponent = () => {
    return(
      <View className='items-center justify-center'>
        <Text className='text-gray-800'>No friends found</Text>
      </View>
    )
  }

  const FriendList = ({data}: {data: Array<FriendType>}) => {
    return(
        <FlatList
          data={data}
          ListEmptyComponent={ListEmptyComponent}
          renderItem={({item})=>(
            <FriendTile friend={item} />
          )}
        />
    )
  }

  return (
    <View className='flex-1 items-center'>
        <View
          className={`w-11/12 flex-row items-center border p-1 rounded-xl mb-3 ${border.primary.tailwind}`}>
          <Icon name='search' size={24} color={icons.secondary.hex}/>
          <BottomSheetTextInput
            placeholder="Search username"
            ref={textInputRef}
            returnKeyType="search"
            onChangeText={text => (textInputRef.current = text)}
            placeholderTextColor={text.secondary.hex}
            style={{color: text.primary.hex, fontSize: 18, flex: 1}}
            onSubmitEditing={() => searchFriendMutation.mutate(textInputRef.current)}
          />
        </View>
      {searchFriendMutation.isPending && <Loader/>}
      {searchFriendMutation.error && <Text className='text-red-500'>Something went wrong</Text>}
      {(searchFriendMutation.data && !searchFriendMutation.isPending) && <View className='w-11/12'>
        <FriendTile friend={searchFriendMutation.data} />
      </View>}
      <View className='w-11/12'>
        <FriendList data={friendListArr} />
      </View>
    </View>
  );
}

const AddFriendModal = withBottomSheet(AddFriendModalComponent);

export default AddFriendModal;
