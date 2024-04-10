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
// import useLocation from '../utility/hooks/useLocation';

function Guftgu({navigation}: AppNavigationProps): React.JSX.Element {
  const {authToken, username} = useAuth();
  // const {setFriendLocations} = useUser();
  const setState = useAppSetState();
  const [error, setError] = useState<string | null>('');
  // const {} = useLocation();
  const {colors} = useTheme();
  
  // const Friends = ["Abhishek Kumar", "Aman Kumar", "Ankit Kumar", "Anshu Kumar", "Anurag Kumar", "Ashish Kumar", "Ayush Kumar", "Deepak Kumar", "Gaurav Kumar", "Himanshu Kumar", "Karan Kumar", "Kartik Kumar", "Keshav Kumar", "Manish Kumar", "Nikhil Kumar", "Prashant Kumar", "Rahul Kumar", "Rajat Kumar", "Rajesh Kumar", "Rohit Kumar", "Sachin Kumar", "Sahil Kumar", "Sandeep Kumar", "Saurabh Kumar", "Shivam Kumar", "Shubham Kumar", "Siddharth Kumar", "Sumit Kumar", "Sunil Kumar", "Utkarsh Kumar", "Vikas Kumar", "Vishal Kumar", "Vivek Kumar", "Yogesh Kumar"];
  const Friends: string[] = []
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
        <TouchableOpacity style={{borderBottomWidth: 1, borderColor: colors.primary}} onPress={()=>openChat("abhi")} className='w-full h-14 p-1'>
        <View className='w-full flex-row items-center'>
          <View className='h-10 w-10 justify-center items-center rounded-full bg-black'>
            <Text className='text-base font-bold'>{item[0].toLocaleUpperCase()}</Text>
          </View>
          <Text style={{color: colors.text}} className='text-base font-medium ml-3'>{item}</Text>
        </View>
      </TouchableOpacity>
      )} />
    </View>
  );
}

export default Guftgu;
