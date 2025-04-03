// import React, { useState } from 'react';
// import {KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View} from 'react-native';
// import getThemeColors from '../utility/theme';
// import { FlashList } from '@shopify/flash-list';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import useUserStore from '../utility/store/userStore';
// import {ReceiveEvent, SendEvent, useSocketReceiveEvents, useSocketSendEvents} from '../utility/socket/useSocketEvents';
// import {useTheme} from '@react-navigation/native';
// import {FlashList} from '@shopify/flash-list';
// import {Message} from '../utility/definitionStore';
// import useUserStore from '../utility/store/userStore';

import { View } from "react-native";

function Mehfil(): React.JSX.Element {
  // const username = useUserStore(state => state.username);
  // const usernameAliasForDB = 'me';
  // const [messages, setMessages] = useState();
  // const [currMessage, setCurrMessage] = useState<string>('');
  // const [error, setError] = useState<string | null>('');
  // const {background, text} = getThemeColors();
  // const insets = useSafeAreaInsets();

  // const events: ReceiveEvent[] = [
  //   {
  //     name: 'connect_error',
  //     handler(err: any) {
  //       setError('Connection Error...');
  //     },
  //   },
  //   {
  //     name: 'mehfil',
  //     handler({
  //       message,
  //       fromUsername,
  //     }: {
  //       message: string;
  //       fromUsername: string;
  //     }) {
  //       console.log(message, fromUsername);
  //       setMessages(prev => [
  //         ...prev,
  //         {message, senderUsername: fromUsername, receiverUsername: myUsername},
  //       ]);
  //     },
  //   },
  // ];
  // useSocketReceiveEvents(events);

  // const SenderEvents: SendEvent[] = [
  //   {
  //     name: 'mehfil',
  //   }
  // ]

  // const {mehfil} = useSocketSendEvents(SenderEvents);

  // const sendMessage = (): void => {
  //   if (!currMessage || !username) {
  //     return;
  //   }
  //   // mehfil(currMessage);
  //   setMessages(prev => [
  //     {
  //       message: currMessage,
  //       senderUsername: username,
  //       receiverUsername: 'others',
  //     },
  //     ...prev,
  //   ]);
  //   setCurrMessage('');
  // };

  // return (
    // <KeyboardAvoidingView 
    //   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    //   style={{flex: 1}}
    //   keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    //   className={`${background.primary.tailwind}`}
    // >
  //   <View style={{paddingTop: insets.top, paddingBottom: insets.bottom}} className="flex-1">
  //     <FlashList
  //       data={messages}
  //       estimatedItemSize={60}
  //       inverted={true}
  //       renderItem={({item}) => (
  //         <View
  //           style={{
  //             backgroundColor:
  //               item.senderUsername === usernameAliasForDB
  //                 ? colors.primary
  //                 : colors.border,
  //           }}
  //           className={`my-2 p-2 rounded-md ${
  //             item.senderUsername === usernameAliasForDB ? 'self-end' : 'self-start'
  //           }`}>
  //           <Text style={{color: colors.text}} className="text-base">
  //             {item.message}
  //           </Text>
  //         </View>
  //       )}
  //     />
  //     <View
  //       style={{borderTopColor: colors.primary}}
  //       className="bottom-2 border-t-2 flex-row items-center justify-around w-full h-14">
  //       <TextInput
  //         placeholder="Message"
  //         style={{backgroundColor: colors.primary, color: colors.text}}
  //         placeholderTextColor={colors.border}
  //         className="rounded-2xl w-3/5 p-2 text-sm h-9"
  //         value={currMessage}
  //         onChangeText={text => setCurrMessage(text)}
  //         multiline={true}
  //         returnKeyType="none"
  //       />
  //       <TouchableOpacity
  //         onPress={sendMessage}
  //         style={{backgroundColor: colors.primary}}
  //         className="p-2 rounded-2xl justify-center h-9">
  //         <Text style={{color: colors.border}}>Send</Text>
  //       </TouchableOpacity>
  //     </View>
  //   </View>
  //   </KeyboardAvoidingView>
  // );
  return(
    <View></View>
  )
}

export default Mehfil;
