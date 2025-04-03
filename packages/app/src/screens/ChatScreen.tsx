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
// import { useSocketEvents } from '../utility/socket/useSocketEvents';
import { chatPersonalEmit } from '../utility/socket/socketEvents';
import getThemeColors from '../utility/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { pick, types } from 'react-native-document-picker';

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
  const [documentsArr, setDocumentsArr] = useState<any[]>([]);
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

  // useSocketEvents([chatPersonalEvent]);

  const openDocumentPicker = async() => {
    try {
      const res = await pick({
        type: [types.allFiles],
        mode: 'open',
        allowMultiSelection: true
      });
      if (res) {
        setDocumentsArr(res);
      }
    } catch (error) {
      console.error('Document picker error:', error);
    }
  }

  const DocumentList = ({documents}: {documents: any[]}) => {
    const trimDocName = (docName: string, trimLen: number) => {
      // If docname is greater than 40 characters, trim it from the middle e.g "Hello World.pdf" => "Hel...rld.pdf"
      if(docName.length > trimLen){
        const halfLen = trimLen / 2;
        return docName.slice(0, halfLen - 2) + '...' + docName.slice(docName.length - halfLen + 1);
      }
      return docName;
    }
    return(
      <>
        {
          documents.length > 0 && (
            <View className={`${background.card.tailwind} p-2 rounded-xl`}> 
              {documents.map((doc, index) => (
                <View key={index} className={`flex-row items-center justify-between h-10 mt-1 px-2 rounded-xl ${background.primary.tailwind}`}>
                  <View className='flex-row gap-1 items-center'>
                    <FontAwesomeIcon name={doc.type === 'application/pdf' ? 'file-pdf-o' : doc.type === 'image/jpeg' ? 'image' : 'description'
                    } size={16} color={text.primary.hex}/>
                    <View className='flex-row items-center'>
                      <Text className={`${text.primary.tailwind} text-sm mr-2`}>{trimDocName(doc.name, 30)}</Text>
                      <Text className={`${text.secondary.tailwind} text-xs`}>{(doc.size / (1024*1024)).toFixed(2)}MB</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={()=>setDocumentsArr(
                    documents.filter((_, i) => i !== index)
                  )}>
                    <Icon name='cancel' size={18} color={text.primary.hex}/>
                  </TouchableOpacity>
                </View>
                ))}
            </View>
          )
        }
      </>
    )
  }

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
        <DocumentList documents={documentsArr} />
        <View className="flex-row items-center justify-between w-full px-4 py-2">
          <View className={`rounded-2xl w-11/12 ${background.card.tailwind} flex-row items-center justify-between`}>
            <TextInput
              placeholder="Message"
              placeholderTextColor={text.secondary.hex}
              className={` ${text.primary.tailwind} text-sm w-10/12`}
              value={currMessage}
              onChangeText={text => setCurrMessage(text)}
              multiline={true}
              returnKeyType='none'
              />
            <TouchableOpacity onPress={openDocumentPicker} className='mx-2'>
              <Icon name='attach-file' size={24} color={text.primary.hex}/>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={sendMessage}>
            <Icon name='send' size={24} color={text.primary.hex}/>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default ChatScreen;
