import React, {useEffect, useRef, useState} from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import useAuth from '../utility/hooks/useAuth';
import {
  chatSocket,
  connectChatSocket,
  setSocketUsername,
} from '../utility/socket/socketConfig';
import {Event, useSocketEvents} from '../utility/socket/useSocketEvents';
import {useUser} from '../utility/context/UserContext';
import { AppNavigationProps } from '../utility/navigation/NavigationStackTypes';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '@react-navigation/native';
import { useAppSetState } from '../utility/redux/useAppState';
import { setFriendLocations } from '../utility/redux/userSlice';
import useFetch from '../utility/hooks/useFetch';
// import useLocation from '../utility/hooks/useLocation';

interface Friend{
  friendUsername: string;
  friendName: string; 
}

function Guftgu({navigation}: AppNavigationProps): React.JSX.Element {
  const {authToken, username} = useAuth();
  // const {setFriendLocations} = useUser();
  useFetch(authToken, username)
  const setState = useAppSetState();
  const [error, setError] = useState<string | null>('');
  // const {} = useLocation();
  const {colors} = useTheme();
  
  // const Friends: Friend[] = [{friendName: "Abhishek Kumar", friendUsername: "abhi"}];
  const Friends: Friend[] = [];
  const events: Event[] = [
    {
      name: 'connect_error',
      handler(err: any) {
        setError('Connection Error...');
      },
    },
    {
      name: 'connect',
      handler() {
        setError(null);
        console.log('Connected to chat server...🥳');
      },
    },
    {
      name: 'location',
      handler({location, fromUsername}) {
        setState(setFriendLocations({location, fromUsername}));
      },
    },
  ];
  useSocketEvents(events);

  const openChat = (friendUsername: string) => {
    navigation.navigate("ChatScreen", {username: friendUsername});
  }

  useEffect(() => {
    if (!authToken || !username) {
      return;
    }
    setSocketUsername(username);
    connectChatSocket();
  }, []);

  function EmptyChatComponent(): React.JSX.Element {
    return (
      <View className='min-h-screen items-center justify-center'>
        <Text className='text-black font-semibold text-base'>Looking very empty...</Text>
        <TouchableOpacity>
          <Text className='text-blue-700 font-semibold'>
            Start a new chat
          </Text>
        </TouchableOpacity>
      </View>
    )
  } 

  return (
    <View className='h-full w-full mt-3'>
      <FlashList data={Friends} estimatedItemSize={70} ListEmptyComponent={EmptyChatComponent} renderItem={({item})=>(
        <TouchableOpacity style={{borderBottomWidth: 1, borderColor: colors.primary}} onPress={()=>openChat(item.friendUsername)} className='w-full h-14 p-1'>
        <View className='w-full flex-row items-center'>
          <View className='h-10 w-10 justify-center items-center rounded-full bg-black'>
            <Text className='text-base font-bold'>{item.friendName[0].toLocaleUpperCase()}</Text>
          </View>
          <Text style={{color: colors.text}} className='text-base font-medium ml-3'>{item.friendName}</Text>
        </View>
      </TouchableOpacity>
      )} />
    </View>
  );
}

export default Guftgu;
