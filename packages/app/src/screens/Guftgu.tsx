import React, {useEffect, useState} from 'react';
import { Text, TouchableOpacity, View} from 'react-native';
import {
  connectChatSocket,
} from '../utility/socket/socketConfig';
// import {ReceiveEvent, useSocketReceiveEvents} from '../utility/socket/useSocketEvents';
import { AppNavigationProps } from '../utility/navigation/NavigationStackTypes';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '@react-navigation/native';
import useFetchUserData from '../utility/hooks/useFetch';
import { connectionErrorEvent, connectionEvent, friendRequestAcceptedEvent, friendRequestReceivedEvent } from '../utility/socket/socketEvents';
import { useSocketEvents } from '../utility/socket/useSocketEvents';
import { useNotifications } from '../utility/hooks/useNotification';
import { getChatListFromDB } from '../utility/dbModel/db';
// import useLocation from '../utility/hooks/useLocation';

interface ChatListItemType{
  friendName: string; 
  friendUsername: string;
  lastMessage: string;
  lastMessageTime: string;
}

function Guftgu({navigation}: AppNavigationProps): React.JSX.Element {
  connectChatSocket();
  useFetchUserData();
  // const [error, setError] = useState<string | null>('');
  // const {} = useLocation();
  const [ChatList, setChatList] = useState<ChatListItemType[]>([]);
  const {colors} = useTheme();

  const chatListObserver = React.useMemo(
    () => getChatListFromDB().observe(),
    []
  )

  useEffect(()=>{
    const chatListSubscription = chatListObserver.subscribe((data: any) => {
      setChatList(data);
    });

    return () => chatListSubscription.unsubscribe();
  }, [chatListObserver]);
  
  // const FakeChatList: ChatListItemType[] = [
  //   {friendName: "Abhishek Kumar", friendUsername: "abhi", lastMessage: "Hello", lastMessageTime: "10:00 AM"},
  //   {friendName: "Abhishek Kumar", friendUsername: "abhi", lastMessage: "Hello Abhishek Kumar, how are you? I hope you are doing fine and doing good", lastMessageTime: "10:00 AM"},
  //   {friendName: "Abhishek Kumar", friendUsername: "abhi", lastMessage: "Hello", lastMessageTime: "10:00 AM"},
  //   {friendName: "Abhishek Kumar", friendUsername: "abhi", lastMessage: "Hello", lastMessageTime: "10:00 AM"},
  //   {friendName: "Abhishek Kumar", friendUsername: "abhi", lastMessage: "Hello", lastMessageTime: "10:00 AM"},
  //   {friendName: "Abhishek Kumar", friendUsername: "abhi", lastMessage: "Hello", lastMessageTime: "10:00 AM"},
  // ];

  const trimMessage = (message: string) => {
    if(message.length > 40){
      return message.slice(0, 40) + '...';
    }
    return message;
  }

  // const events: ReceiveEvent[] = [
  //   {
  //     name: 'connect_error',
  //     handler(err: any) {
  //       setError('Connection Error...');
  //     },
  //   },
  //   {
  //     name: 'connect',
  //     handler() {
  //       setError(null);
  //       console.log('Connected to chat server...🥳');
  //     },
  //   },
  //   {
  //     name: 'location',
  //     handler({location, fromUsername}) {
  //       // setState(setFriendLocations({location, fromUsername}));
  //     },
  //   },
  // ];
  useSocketEvents([connectionEvent, connectionErrorEvent, friendRequestAcceptedEvent, friendRequestReceivedEvent]);

  const openChat = (friendUsername: string, friendName: string) => {
    navigation.navigate("ChatScreen", {username: friendUsername, name: friendName});
  }


  function EmptyChatComponent(): React.JSX.Element {
    const {sendLocalNotification} = useNotifications();
    const displayNotification = () => {
      sendLocalNotification({
        title: 'New Chat',
        body: 'Start a new chat with your friend',
        data: {type: 'chat'},
      });
    }


    return (
      <View className='min-h-screen items-center justify-center'>
        <Text className='text-black font-semibold text-base'>Looking very empty...</Text>
        <TouchableOpacity onPress={displayNotification}>
          <Text className='text-blue-700 font-semibold'>
            Start a new chat
          </Text>
        </TouchableOpacity>
      </View>
    )
  } 

  return (
    <View className='h-full w-full mt-4'>
      <View className='flex-row gap-2 ml-2'>
        {['All', 'Favourites'].map((item, index) => (
          <TouchableOpacity key={index} style={{backgroundColor: colors.primary}} className='p-2 rounded-2xl'>
            <Text style={{color: colors.border}} className='font-semibold'>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlashList data={ChatList} estimatedItemSize={70} ListEmptyComponent={EmptyChatComponent} renderItem={({item})=>(
        <TouchableOpacity onPress={()=>openChat(item.friendUsername, item.friendName)} className='w-full items-center mb-4'>
          <View className='w-11/12 flex-row'>
            <View className='h-12 w-12 border rounded-full mr-2'/>
            <View className='flex-grow'>
              <View className='flex-row justify-between'>
                <Text className='text-black text-base'>{item.friendName}</Text>
                <Text className='text-gray-400 text-xs font-medium'>{item.lastMessageTime}</Text>
              </View>
              <View>
                <Text className='text-gray-400 text-sm font-medium'>{trimMessage(item.lastMessage)}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )} />
    </View>
  );
}

export default Guftgu;
