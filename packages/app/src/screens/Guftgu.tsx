import React, {useEffect, useState} from 'react';
import { Text, TouchableOpacity, View} from 'react-native';
import {
  connectChatSocket,
} from '../utility/socket/socketConfig';
import { AppNavigationProps } from '../utility/navigation/NavigationStackTypes';
import { FlashList } from '@shopify/flash-list';
import { chatPersonalEvent, connectionErrorEvent, connectionEvent, friendRequestAcceptedEvent, friendRequestReceivedEvent } from '../utility/socket/socketEvents';
import { useSocketEvents } from '../utility/socket/useSocketEvents';
import { getChatListFromDB } from '../utility/dbModel/db';
import getThemeColors from '../utility/theme';
import { useNotifications } from '../utility/hooks/useNotification';
import ProfilePic from '../components/utility/ProfilePic';
// import useLocation from '../utility/hooks/useLocation';

interface ChatListItemType{
  name: string; 
  username: string;
  lastMessage: string;
  updatedAt: string;
}

function Guftgu({navigation}: AppNavigationProps): React.JSX.Element {
  connectChatSocket();
  // const [error, setError] = useState<string | null>('');
  // const {} = useLocation();
  const [ChatList, setChatList] = useState<ChatListItemType[]>([]);
  const {text, background} = getThemeColors();
  const {} = useNotifications();

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
    // If message is greater than 40 characters, trim it
    if(message.length > 40){
      return message.slice(0, 40) + '...';
    }
    return message;
  }

  const trimDate = (date: any) => {
    // If date is today, return time, else return date
    if(date.toDateString() === new Date().toDateString()){
      return date.toLocaleTimeString();
    } else {
      return date.toLocaleDateString();
    }
  }

  // Keeping location event for future use
  //   {
  //     name: 'location',
  //     handler({location, fromUsername}) {
  //       // setState(setFriendLocations({location, fromUsername}));
  //     },
  //   },
  useSocketEvents([connectionEvent, connectionErrorEvent, friendRequestAcceptedEvent, friendRequestReceivedEvent, chatPersonalEvent, ]);

  const openChat = (friendUsername: string, friendName: string) => {
    navigation.navigate("ChatScreen", {username: friendUsername, name: friendName});
  }


  function EmptyChatComponent(): React.JSX.Element {
    return (
      <View className='min-h-screen items-center justify-center'>
        <Text className='text-black font-semibold text-base'>Looking very empty...</Text>
        <TouchableOpacity>
          <Text className={`${text.accent.tailwind} font-semibold`}>
            Start a new chat
          </Text>
        </TouchableOpacity>
      </View>
    )
  } 

  return (
    <View className='flex-1 bg-gray-50'>
      <View className='flex-row gap-2 ml-2'>
        {['All', 'Favourites'].map((item, index) => (
          <TouchableOpacity key={index} className={`p-2 rounded-2xl ${background.card.tailwind}`}>
            <Text className={`${text.secondary.tailwind} font-semibold`}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlashList contentContainerStyle={{paddingTop: 16}} data={ChatList} estimatedItemSize={70} ListEmptyComponent={EmptyChatComponent} renderItem={({item})=>(
        <TouchableOpacity onPress={()=>openChat(item.username, item.name)} className='w-full items-center mb-4'>
          <View className='w-11/12 flex-row'>
            <ProfilePic username={item.username}/>
            <View className='flex-grow'>
              <View className='flex-row justify-between'>
                <Text className={`text-base ${text.primary.tailwind}`}>{item.name}</Text>
                <Text className={`${text.secondary.tailwind} text-xs font-medium`}>{trimDate(item.updatedAt)}</Text>
              </View>
              <View>
                <Text className={`${text.secondary.tailwind} text-sm font-medium`}>{trimMessage(item.lastMessage) || 'No messages yet'}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )} />
    </View>
  );
}

export default Guftgu;
