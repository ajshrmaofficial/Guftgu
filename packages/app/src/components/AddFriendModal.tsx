import {BottomSheetModal, BottomSheetTextInput, TouchableOpacity} from '@gorhom/bottom-sheet';
import React, {useEffect, useRef} from 'react';
import {FlatList, Text, View} from 'react-native';
import SearchIcon from '../../assets/svg/search.svg';
import Loader from './utility/Loader';
import {useTheme} from '@react-navigation/native';
import {withBottomSheet} from './utility/BottomSheet';
import { useMutation } from '@tanstack/react-query';
import { FriendType } from '../utility/definitionStore';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { addFriendRequestToDB, getFriendListFromDB, updateFriendEntryInDB } from '../utility/dbModel/db';
import { friendRequestAcceptEmit, friendRequestSendEmit } from '../utility/socket/socketEvents';
import { acceptFriendRequestApiFn, searchUserApiFn, sendFriendRequestApiFn } from '../utility/api/endpointFunctions';
export type Ref = BottomSheetModal;

function AddFriendModalComponent({navigation}: {navigation?:any}) {
  const textInputRef: any = useRef();
  const {colors} = useTheme();
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
    //   {
      //     username: 'abhishek',
      //     name: 'Abhishek Kumar',
      //     status: 'accepted',
      //     party: 1
      //   },
      //   {
        //     username: 'abhi',
        //     name: 'Abhishek Kumar',
        //     status: 'pending',
        //     party: 1
  //   },
  //   {
    //     username: 'abhishek',
    //     name: 'Abhishek Kumar',
    //     status: 'accepted',
    //     party: 2
    //   },
    //   {
      //     username: 'abhishek',
      //     name: 'Abhishek Kumar',
      //     status: 'accepted',
      //     party: 1 
      //   },
      // ];
      
      const FriendTile = ({friend}: {friend: FriendType}) => {
        const sendFriendReqMutation = useMutation({mutationFn: sendFriendRequestApiFn, onSuccess: ()=>{
          addFriendRequestToDB(friend.username, friend.name);
          friendRequestSendEmit({friendUsername: friend.username});
        }});
        const acceptFriendRequestMutation = useMutation({mutationFn: acceptFriendRequestApiFn, onSuccess: ()=>{
          updateFriendEntryInDB(friend.username, 'accepted');
          friendRequestAcceptEmit({friendUsername: friend.username})
        }});

        let onIconPress;
        if(friend.status === 'notFriend'){
          onIconPress = ()=>sendFriendReqMutation.mutate(friend.username);
        } else if(friend.status === 'pending' && friend.party === 1){
          onIconPress = ()=>acceptFriendRequestMutation.mutate(friend.username);
        } else {
          onIconPress = ()=>{};
        }

        const onTilePress = () => {
          if(friend.status === 'accepted')
            navigation.navigate('ChatScreen', {username: friend.username, name: friend.name});
        }
    return(
      <TouchableOpacity onPress={onTilePress}>
      <View className='flex-row justify-between items-center mb-3 p-2'>
        <View className='flex-row items-center gap-2'>
          <View className='h-12 w-12 rounded-full border border-gray-900'/>
          <View>
            <Text className='text-gray-800'>{friend.name}</Text>
            <Text className='text-gray-500'>@{friend.username}</Text>
          </View>
        </View>
        {friend.status!=='accepted' && <TouchableOpacity onPress={onIconPress}>
          <Icon name={`${friend.status === 'pending' ? 'history-toggle-off' : 'person-add'}`} size={24} color={colors.primary} />
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
          className="w-11/12 flex-row items-center border p-1 rounded-xl mb-3"
          style={{borderColor: colors.border}}>
          <SearchIcon width={20} height={20} style={{marginRight: 8}} />
          <BottomSheetTextInput
            placeholder="Search username"
            ref={textInputRef}
            returnKeyType="search"
            onChangeText={text => (textInputRef.current = text)}
            placeholderTextColor={colors.text}
            style={{color: colors.text, fontSize: 18}}
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
