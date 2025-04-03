/* 
    connect                -> receiving
    connect_error          -> receiving
    chat:group (mehfil)    -> sending / receiving
    chat:personal (guftgu) -> sending / receiving
    friendRequest:sent     -> sending
    friendRequest:received -> receiving
    friendRequest:accepted -> sending / receiving
    friendRequest:rejected -> sending / receiving
    location
    => sender will be called emitters and receivers would be called simple events
*/

import { fetchFriendsApiFn, fetchMessagesApiFn, searchUserApiFn } from "../api/endpointFunctions";
import { addFriendRequestToDB, saveChatToDB, updateFriendEntryInDB, updateFriendListInDB } from "../dbModel/db";
// import useUserStore from "../store/userStore"
import { chatSocket } from "./socketConfig";

export interface socketEvent {
    name: 'connect' | 'connect_error' | 'chat:group' | 'chat:personal' | 'friendRequest:received' | 'friendRequest:accepted' | 'friendRequest:rejected' | 'location',
    handler: (args: any) => any
}

export const connectionEvent: socketEvent = {
    name: 'connect',
    async handler(){
        console.log('Connected to chat server...🥳');
        try {
            const offlineMessages = await fetchMessagesApiFn();
            console.log('Offline messages:', offlineMessages);
            
            if (offlineMessages?.length > 0) {
                for (const message of offlineMessages) {
                    await saveChatToDB(message.sender, message.receiver, message.message);
                }
                console.log('Offline messages saved to DB');
            }

            const friendList = await fetchFriendsApiFn();
            console.log('Friend list:', friendList);
            
            if (friendList?.length > 0) {
                await updateFriendListInDB(friendList);
                console.log('Friend list updated in DB');
            }

        } catch (error) {
            console.error('Offline data fetch failed:', {
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });
        }
    }
}

export const connectionErrorEvent: socketEvent = {
    name: 'connect_error',
    handler(err){
        console.log('Socket connection error...', err);
    }
}

export function chatGroupEmit<T>(data: T){
    chatSocket.emit('chat:group', data);
}

export const chatGroupEvent: socketEvent = {
    name: 'chat:group',
    handler(){}
}

export function chatPersonalEmit<T>(data: T){
    chatSocket.emit('chat:personal', data);
}

export const chatPersonalEvent: socketEvent = {
    name: 'chat:personal',
    async handler({message, fromUsername}: {message: string, fromUsername: string}){
        console.log(`Message from ${fromUsername}: ${message}`);
        try {
            await saveChatToDB(fromUsername, "me", message);
        } catch (error) {
            throw new Error('Failed to save chat to DB');
        }
    }
}

export function friendRequestSendEmit<T>(data: T){
    chatSocket.emit('friendRequest:sent', data);
}

export const friendRequestReceivedEvent: socketEvent = {
    name: 'friendRequest:received',
    async handler({fromUsername}: {fromUsername: string}){
        console.log(`Friend Request from ${fromUsername}`);
        try {
            const userResult = await searchUserApiFn(fromUsername)
            if(!userResult || !userResult.username || !userResult.name){
                throw new Error('Invalid user data received');
            }
            await addFriendRequestToDB(userResult.username, userResult.name, '1');
            console.log('Friend Request added to DB');
        } catch (error) {
            console.error('Friend request processing failed:', {
                fromUsername,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}

export function friendRequestAcceptEmit<T>(data: T){
    chatSocket.emit('friendRequest:accepted', data);
}

export const friendRequestAcceptedEvent: socketEvent = {
    name: 'friendRequest:accepted',
    async handler({fromUsername}: {fromUsername: string}){
        console.log(`Friend Request to ${fromUsername} accepted`);
        await updateFriendEntryInDB(fromUsername, 'accepted');
    }
}

export function friendRequestRejectEmit<T>(data: T){}

export const friendRequestRejectedEvent: socketEvent = {
    name: 'friendRequest:rejected',
    handler(){}
}
