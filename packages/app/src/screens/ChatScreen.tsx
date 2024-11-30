import React, {useEffect, useState, useCallback} from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {getChatsFromDB, saveChatToDB, updateChatEntryInDB} from '../utility/dbModel/db';
import {AppNavigationProps} from '../utility/navigation/NavigationStackTypes';
import {FlashList} from '@shopify/flash-list';
import { MessageType } from '../utility/definitionStore'
import useUserStore from '../utility/store/userStore';
import { useSocketEvents } from '../utility/socket/useSocketEvents';
import { chatPersonalEmit, chatPersonalEvent } from '../utility/socket/socketEvents';
import getThemeColors from '../utility/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function ChatScreen({
  navigation,
  route,
}: AppNavigationProps): React.JSX.Element {
  const usernameAliasForDB = 'me';
  const username = useUserStore(state => state.username);
  const friendUsername = (route.params as {username: string}).username;
  const friendName = (route.params as {name: string}).name;
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [currMessage, setCurrMessage] = useState<string>('');
  const [chatPage, setChatPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const PAGE_SIZE = 10;
  const {background, text} = getThemeColors();
  const insets = useSafeAreaInsets();

  const trimMessageTime = (time: any) => {
    return time.toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit'}).toLowerCase();
  }

  const messagesObserver = React.useMemo(
    () => getChatsFromDB(friendUsername, chatPage, PAGE_SIZE).observe(),
    []
  );

  // Add effect to create/update chat list entry when chat opens
  useEffect(() => {
    const initializeChatEntry = async () => {
      try {
        // Initialize with empty message if no messages exist yet
        await updateChatEntryInDB(friendUsername, friendName, '');
      } catch (error) {
        console.error('Failed to initialize chat entry:', error);
      }
    };
    
    initializeChatEntry();
  }, [friendUsername, friendName]);

  // Modify the cleanup effect
  useEffect(() => {
    const updateChatEntry = async () => {
      try {
        const lastMessage = messages.length > 0 ? messages[0].message : '';
        await updateChatEntryInDB(
          friendUsername,
          friendName,
          lastMessage
        );
      } catch (error) {
        console.error('Failed to update chat entry:', error);
      }
    };

    const unsubscribe = navigation.addListener('beforeRemove', () => {
      updateChatEntry();
    });

    return () => {
      unsubscribe();
      updateChatEntry();
    };
  }, [navigation, friendUsername, friendName, messages]);

  // useEffect for making chat screen component reactive
  useEffect(() => {
    if (!friendUsername) {
      console.log('No friend username found');  
      navigation.goBack();
      return;
    }

    const messageSubscription = messagesObserver.subscribe((newMessages: any) => {
      setMessages(prevMessages => {
        if (chatPage === 0) return newMessages;
        return [...prevMessages, ...newMessages];
      });
      setIsLoading(false);
    });

    return () => messageSubscription.unsubscribe();
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
      chatPersonalEmit({message: currMessage, toUsername: friendUsername});
      setCurrMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  useSocketEvents([chatPersonalEvent]);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      className={`${background.primary.tailwind}`}
    >
      <View style={{paddingTop: insets.top, paddingBottom: insets.bottom}} className="flex-1">
        <View className="items-center justify-center">
          <Text className={`${text.primary.tailwind} text-2xl`}>{friendName}</Text>
          <Text className={`text-sm ${text.secondary.tailwind}`}>@{friendUsername}</Text>
        </View>
        <FlashList
          data={messages}
          estimatedItemSize={60}
          inverted={true}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          renderItem={({item}) => (
            <View
              className={`my-2 p-2 rounded-md ${
                item.senderUsername === usernameAliasForDB ? 'self-end' : 'self-start'
              } ${item.senderUsername === usernameAliasForDB ? background.accent.tailwind : background.card.tailwind} flex-row`}>
              <Text className={`text-base ${text.primary.tailwind}`}>{item.message}</Text>
              <Text className={`text-xs ${text.secondary.tailwind} self-end ml-2`}>{trimMessageTime(item.createdAt)}</Text>
            </View>
          )}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        />
        <View className="flex-row items-center justify-between w-full px-4 py-2">
          <TextInput
            placeholder="Message"
            placeholderTextColor={text.secondary.hex}
            className={`rounded-2xl w-11/12 p-2 text-sm ${background.card.tailwind} ${text.primary.tailwind}`}
            value={currMessage}
            onChangeText={text => setCurrMessage(text)}
            multiline={true}
            returnKeyType='none'
            />
          <TouchableOpacity
            onPress={sendMessage}
            className="p-2 rounded-2xl justify-center">
            <Icon name='send' size={24} color={text.primary.hex}/>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default ChatScreen;
