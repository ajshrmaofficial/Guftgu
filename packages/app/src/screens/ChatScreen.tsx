import React, {useEffect, useState} from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Event, useSocketEvents} from '../utility/socket/useSocketEvents';
import {getChats, saveChat} from '../utility/dbModel/db';
import {Message as MessageModel} from '../utility/dbModel/dbModel';
import {AppNavigationProps} from '../utility/navigation/NavigationStackTypes';
import useAuth from '../utility/hooks/useAuth';
import {chatSocket} from '../utility/socket/socketConfig';
import {FlashList} from '@shopify/flash-list';
import { useTheme } from '@react-navigation/native';
import { Message } from '../utility/definitionStore'

function ChatScreen({
  navigation,
  route,
}: AppNavigationProps): React.JSX.Element {
  const myUsername = 'me';
  const {username} = useAuth();
  const friendUsername = (route.params as {username: string}).username;
  const [messages, setMessages] = useState<Message[]>([] as Message[]);
  const [currMessage, setCurrMessage] = useState<string>('');
  const [error, setError] = useState<string | null>('');
  const {colors} = useTheme();

  useEffect(() => {
    if (!friendUsername) {
      console.log('No friend username found');
      navigation.goBack();
      return;
    }

    const fetchMessages = async (user: string) => {
      try {
        const chats: MessageModel[] = (await getChats(
          user,
          0,
          10,
        )) as MessageModel[];
        chats.map(chat => {
          setMessages(prev => [
            ...prev,
            {
              message: chat.message,
              senderUsername: chat.senderUsername,
              receiverUsername: chat.receiverUsername,
            },
          ]);
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessages(friendUsername);
  }, []);

  const sendMessage = async () => {
    if (!currMessage || !username) {
      return;
    }
    chatSocket.emit('guftgu', {
      message: currMessage,
      toUsername: friendUsername,
    });
    await saveChat(myUsername, friendUsername, currMessage);
    setMessages(prev => [
        {
          message: currMessage,
          senderUsername: myUsername,
          receiverUsername: friendUsername,
        },
      ...prev,
    ]);
    setCurrMessage('');
  };

  const events: Event[] = [
    {
      name: 'guftgu',
      handler({
        message,
        fromUsername,
      }: {
        message: string;
        fromUsername: string;
      }) {
        console.log(message, fromUsername);
        saveChat(fromUsername, myUsername, message);
        setMessages(prev => [
          ...prev,
          {message, senderUsername: fromUsername, receiverUsername: myUsername},
        ]);
      },
    },
  ];
  useSocketEvents(events);

  return (
    <View className="h-full w-full">
      <View className="h-14 items-center justify-center">
        <Text style={{color: colors.text}} className="text-2xl">{friendUsername}</Text>
      </View>
        <FlashList
        data={messages}
        estimatedItemSize={60}
        inverted={true}
        renderItem={({item}) => (
          <View
            style={{backgroundColor: item.senderUsername === myUsername ? colors.primary : colors.border}}
            className={`my-2 p-2 rounded-md ${
              item.senderUsername === myUsername ? 'self-end' : 'self-start'
            }`}>
            <Text style={{color: colors.text}} className="text-base">{item.message}</Text>
          </View>
        )}
        />
      <View style={{borderTopColor: colors.primary}} className="bottom-2 border-t-2 flex-row items-center justify-around w-full h-14">
        <TextInput
          placeholder="Message"
          style={{backgroundColor: colors.primary, color: colors.text}}
          placeholderTextColor={colors.border}
          className="rounded-2xl w-3/5 p-2 text-sm h-9"
          value={currMessage}
          onChangeText={text => setCurrMessage(text)}
          multiline={true}
          returnKeyType='none'
          />
        <TouchableOpacity
          onPress={sendMessage}
          style={{backgroundColor: colors.primary}}
          className="p-2 rounded-2xl justify-center h-9">
          <Text style={{color: colors.border}}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ChatScreen;
