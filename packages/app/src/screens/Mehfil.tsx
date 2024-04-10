import React, {useEffect, useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import useAuth from '../utility/hooks/useAuth';
import {chatSocket} from '../utility/socket/socketConfig';
import {Event, useSocketEvents} from '../utility/socket/useSocketEvents';
import {useTheme} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import {Message} from '../utility/definitionStore';

function Mehfil(): React.JSX.Element {
  const {username} = useAuth();
  const myUsername = 'me';
  const [messages, setMessages] = useState<Message[]>([] as Message[]);
  const [currMessage, setCurrMessage] = useState<string>('');
  const [error, setError] = useState<string | null>('');
  const {colors} = useTheme();

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
        setMessages(prev => [
          ...prev,
          {message, senderUsername: fromUsername, receiverUsername: myUsername},
        ]);
      },
    },
  ];
  useSocketEvents(events);

  const sendMessage = (): void => {
    if (!currMessage || !username) {
      return;
    }
    chatSocket.emit('mehfil', currMessage);
    setMessages(prev => [
      {
        message: currMessage,
        senderUsername: myUsername,
        receiverUsername: 'others',
      },
      ...prev,
    ]);
    setCurrMessage('');
  };

  return (
    <View className="h-full w-full">
      <FlashList
        data={messages}
        estimatedItemSize={60}
        inverted={true}
        renderItem={({item}) => (
          <View
            style={{
              backgroundColor:
                item.senderUsername === myUsername
                  ? colors.primary
                  : colors.border,
            }}
            className={`my-2 p-2 rounded-md ${
              item.senderUsername === myUsername ? 'self-end' : 'self-start'
            }`}>
            <Text style={{color: colors.text}} className="text-base">
              {item.message}
            </Text>
          </View>
        )}
      />
      <View
        style={{borderTopColor: colors.primary}}
        className="bottom-2 border-t-2 flex-row items-center justify-around w-full h-14">
        <TextInput
          placeholder="Message"
          style={{backgroundColor: colors.primary, color: colors.text}}
          placeholderTextColor={colors.border}
          className="rounded-2xl w-3/5 p-2 text-sm h-9"
          value={currMessage}
          onChangeText={text => setCurrMessage(text)}
          multiline={true}
          returnKeyType="none"
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

export default Mehfil;
