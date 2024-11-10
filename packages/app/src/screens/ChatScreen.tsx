import React, {useEffect, useState, useCallback} from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// import {ReceiveEvent, SendEvent, useSocketReceiveEvents, useSocketSendEvents} from '../utility/socket/useSocketEvents';
import {getChatsFromDB, saveChatToDB, updateChatEntryInDB} from '../utility/dbModel/db';
import {MessageModel} from '../utility/dbModel/dbModel';
import {AppNavigationProps} from '../utility/navigation/NavigationStackTypes';
import {FlashList} from '@shopify/flash-list';
import { useTheme } from '@react-navigation/native';
// import { MessageType } from '../utility/definitionStore'
import useUserStore from '../utility/store/userStore';
import { useSocketEvents } from '../utility/socket/useSocketEvents';
import { chatPersonalEvent } from '../utility/socket/socketEvents';

function ChatScreen({
  navigation,
  route,
}: AppNavigationProps): React.JSX.Element {
  const usernameAliasForDB = 'me';
  const username = useUserStore(state => state.username);
  const friendUsername = (route.params as {username: string}).username;
  const friendName = (route.params as {name: string}).name;
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [currMessage, setCurrMessage] = useState<string>('');
  const [chatPage, setChatPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const PAGE_SIZE = 10;
  const {colors} = useTheme();

  const messagesObserver = React.useMemo(
    () => getChatsFromDB(friendUsername, chatPage, PAGE_SIZE).observe(),
    [friendUsername, chatPage]
  );

  useEffect(() => {
    if (!friendUsername) {
      console.log('No friend username found');  
      navigation.goBack();
      return;
    }

    const messageSubscription = messagesObserver.subscribe((newMessages: any) => {
      setMessages(prevMessages => {
        const transformedMessages = newMessages.map((msg: any) => ({
          senderUsername: msg.senderUsername,
          receiverUsername: msg.receiverUsername,
          message: msg.message,
          createdAt: msg.createdAt,
        })) as MessageModel[];
        // console.log('transformed message: ', transformedMessages);
        if (chatPage === 0) return transformedMessages;
        return [...prevMessages, ...transformedMessages];
      });
      setIsLoading(false);
    });

    return () => {
      messageSubscription.unsubscribe()
      updateChatEntryInDB(friendUsername, friendName, messages[messages.length - 1]?.message || '');
    };
  }, [messagesObserver]);

  const loadMore = useCallback(() => {
    if (!isLoading) {
      setIsLoading(true);
      setChatPage(prev => prev + 1);
    }
  }, [isLoading]);

  const sendMessage = async () => {
    if (!currMessage || !username) return;
    try {
      await saveChatToDB(usernameAliasForDB, friendUsername, currMessage);
      setCurrMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  useSocketEvents([chatPersonalEvent]);

  return (
    <View className="h-full w-full">
      <View className="h-14 items-center justify-center">
        <Text className='text-black text-2xl'>{friendName}</Text>
        <Text style={{color: colors.text}} className="text-sm">{friendUsername}</Text>
      </View>
      <FlashList
        data={messages}
        estimatedItemSize={60}
        inverted={true}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        renderItem={({item}) => (
          <View
            style={{backgroundColor: item.senderUsername === usernameAliasForDB ? colors.primary : colors.border}}
            className={`my-2 p-2 rounded-md ${
              item.senderUsername === usernameAliasForDB ? 'self-end' : 'self-start'
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


/*
<View className="h-14 items-center justify-center">
        <Text style={{color: colors.text}} className="text-2xl">{friendUsername}</Text>
      </View>
        <FlashList
        data={messages}
        estimatedItemSize={60}
        inverted={true}
        renderItem={({item}) => (
          <View
            style={{backgroundColor: item.senderUsername === usernameAliasForDB ? colors.primary : colors.border}}
            className={`my-2 p-2 rounded-md ${
              item.senderUsername === usernameAliasForDB ? 'self-end' : 'self-start'
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
*/