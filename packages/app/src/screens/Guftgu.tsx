import React, {useEffect, useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useAuth} from '../utility/context/AuthContext';
import {
  chatSocket,
  connectChatSocket,
  setSocketUsername,
} from '../utility/socket/socketConfig';
import {Event, useSocketEvents} from '../utility/socket/useSocketEvents';
import {useUser} from '../utility/context/UserContext';
import { saveChat, getChats } from '../utility/dbModel/db';
import { Message as MessageModel } from '../utility/dbModel/dbModel';
// import useLocation from '../utility/hooks/useLocation';
interface Message {
  senderUsername: string;
  receiverUsername: string;
  message: string;
}

function Guftgu(): React.JSX.Element {
  const {authData} = useAuth();
  const {setFriendLocations} = useUser();
  // const {} = useLocation();
  const myUsername = 'me';
  const [messages, setMessages] = useState<Message[]>([] as Message[]);
  const [currMessage, setCurrMessage] = useState<string>('');
  const [error, setError] = useState<string | null>('');
  const [friendUsername, setFriendUsername] = useState<string>('');
  const [friendFound, setFriendFound] = useState<boolean>(false);

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
        setMessages(prev => [...prev, {message, senderUsername: fromUsername, receiverUsername: myUsername}]);
      },
    },
    {
      name: 'location',
      handler({location, fromUsername}) {
        setFriendLocations(prev => {
          const existingIndex = prev.findIndex(
            item => item.title === fromUsername,
          );
          if (existingIndex !== -1) {
            const newLocations = [...prev];
            newLocations[existingIndex].latlng = location;
            return newLocations;
          } else {
            return [
              ...prev,
              {latlng: location, title: fromUsername, description: null},
            ];
          }
        });
      },
    },
  ];
  useSocketEvents(events);

  const sendMessage = async () => {
    if (!currMessage || !authData.username) {
      return;
    }
    chatSocket.emit('guftgu', {
      message: currMessage,
      toUsername: friendUsername,
    });
    await saveChat(myUsername, friendUsername, currMessage);
    setMessages(prev => [
      ...prev,
      {message: currMessage, senderUsername: myUsername, receiverUsername: friendUsername},
    ]);
    setCurrMessage('');
  };

  const findFriend = (): void => {
    if (!friendUsername || !authData.username) {
      return;
    }
    fetchMessages(friendUsername);
    setFriendFound(true);
  };

  const fetchMessages = async (username: string) => {
    try {
      const chats: MessageModel[] = await getChats(username, 0, 10) as MessageModel[];
      console.log(chats);
      chats.map((chat)=>{
        setMessages(prev => [
          ...prev,
          {message: chat.message, senderUsername: chat.senderUsername, receiverUsername: chat.receiverUsername},
        ]);
      })
    } catch (error) {
     console.log(error) 
    }
  }

  useEffect(() => {
    if (!authData.authToken || !authData.username) {
      return;
    }
    setSocketUsername(authData.username);
    connectChatSocket();
  }, []);

  return (
    <View className="h-full w-full">
      <Text className="text-2xl font-bold m-2 text-white">Guftgu</Text>
      {!friendFound ? (
        <View className="items-center">
          <TextInput
            placeholder="Friend Username"
            className="border-2 border-white rounded-md w-3/4 p-2 mb-2 text-white"
            value={friendUsername}
            onChangeText={text => setFriendUsername(text)}
          />
          <TouchableOpacity
            onPress={() => findFriend()}
            className="border-2 border-white p-2 w-1/4 rounded-md justify-center">
            <Text className='text-white'>Find</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
        <Text className='text-white'>Chatting with {friendUsername}</Text>
          {messages.map((item: Message, index) => (
            <View
              className={`w-3/4 border border-white rounded-md ${
                item.senderUsername === myUsername ? 'self-end' : 'self-start'
              }`}
              key={index}>
              {item.senderUsername != myUsername && <Text className="text-sm text-slate-500">{item.senderUsername}</Text>}
              <Text className="text-base text-white">{item.message}</Text>
            </View>
          ))}
          <View className="absolute bottom-2 flex-row items-center justify-between w-full">
            <TextInput
              placeholder="Message"
              className="border-2 border-white rounded-md w-4/5 p-2 text-white"
              value={currMessage}
              onChangeText={text => setCurrMessage(text)}
            />
            <TouchableOpacity
              onPress={sendMessage}
              className="border-2 border-white p-2 rounded-md h-full justify-center">
              <Text className='text-white'>Send</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

export default Guftgu;
