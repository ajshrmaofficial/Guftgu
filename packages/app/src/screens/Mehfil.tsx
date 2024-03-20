import React, {useEffect, useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useAuth} from '../utility/context/AuthContext';
import {
  chatSocket,
  connectChatSocket,
  setSocketUsername,
} from '../utility/socket/socketConfig';
import {Event, useSocketEvents} from '../utility/socket/useSocketEvents';

interface Message {
  // TODO: Temporarily made, maybe to be modified/moved later
  username: string;
  message: string;
}

function Mehfil(): React.JSX.Element {
  const {authData} = useAuth();
  const myUsername = authData.username || 'me';
  const [messages, setMessages] = useState<Message[]>([] as Message[]);
  const [currMessage, setCurrMessage] = useState<string>('');
  const [error, setError] = useState<string | null>('');

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
      name: 'mehfil',
      handler({
        message,
        fromUsername,
      }: {
        message: string;
        fromUsername: string;
      }) {
        console.log(message, fromUsername);
        setMessages(prev => [...prev, {message, username: fromUsername}]);
      },
    },
  ];
  useSocketEvents(events);

  const sendMessage = (): void => {
    if (!currMessage || !authData.username) {
      return;
    }
    chatSocket.emit('mehfil', currMessage);
    setMessages(prev => [
      ...prev,
      {message: currMessage, username: myUsername},
    ]);
    setCurrMessage('');
  };

  // useEffect(() => {
  //   if (!authData.authToken || !authData.username) {
  //     return;
  //   }
  //   setSocketUsername(authData.username);
  //   connectChatSocket();
  // }, []);

  return (
    <View className="h-full w-full">
      <Text className="text-2xl font-bold m-2">Mehfil</Text>
      {messages.map((item: Message, index) => (
        <View
          className={`w-3/4 border border-white rounded-md ${
            item.username === authData.username ? 'self-end' : 'self-start'
          }`}
          key={index}>
          <Text className="text-sm text-slate-500">{item.username}</Text>
          <Text className="text-base text-white">{item.message}</Text>
        </View>
      ))}
      <View className="absolute bottom-2 flex-row items-center justify-between w-full">
        <TextInput
          placeholder="Message"
          className="border-2 border-white rounded-md w-4/5 p-2"
          value={currMessage}
          onChangeText={text => setCurrMessage(text)}
        />
        <TouchableOpacity
          onPress={sendMessage}
          className="border-2 border-white p-2 rounded-md h-full justify-center">
          <Text>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Mehfil;
