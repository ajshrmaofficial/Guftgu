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

import { searchUserApiFn } from "../api/endpointFunctions";
import { addFriendRequestToDB, updateFriendEntryInDB } from "../dbModel/db";
// import useUserStore from "../store/userStore"
import { chatSocket } from "./socketConfig";

export interface socketEvent {
    name: 'connect' | 'connect_error' | 'chat:group' | 'chat:personal' | 'friendRequest:received' | 'friendRequest:accepted' | 'friendRequest:rejected' | 'location',
    handler: (args: any) => any
}

export const connectionEvent: socketEvent = {
    name: 'connect',
    handler(){
        console.log('Connected to chat server...🥳');
    }
}

export const connectionErrorEvent: socketEvent = {
    name: 'connect_error',
    handler(){
        console.log('Socket connection error...');
    }
}

export function chatGroupEmit<T>(data: T){}

export const chatGroupEvent: socketEvent = {
    name: 'chat:group',
    handler(){}
}

export function chatPersonalEmit<T>(data: T){
    chatSocket.emit('chat:personal', data);
}

export const chatPersonalEvent: socketEvent = {
    name: 'chat:personal',
    handler({message, fromUsername}: {message: string, fromUsername: string}){
        console.log(`Message from ${fromUsername}: ${message}`);
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
            const result = await searchUserApiFn(fromUsername);
            addFriendRequestToDB(result.username, result.name, 1);
        } catch (error) {
            console.log(error);
        }
    }
}

export function friendRequestAcceptEmit<T>(data: T){
    chatSocket.emit('friendRequest:accepted', data);
}

export const friendRequestAcceptedEvent: socketEvent = {
    name: 'friendRequest:accepted',
    handler({fromUsername}: {fromUsername: string}){
        console.log(`Friend Request to ${fromUsername} accepted`);
        updateFriendEntryInDB(fromUsername, 'accepted');
    }
}

export function friendRequestRejectEmit<T>(data: T){}

export const friendRequestRejectedEvent: socketEvent = {
    name: 'friendRequest:rejected',
    handler(){}
}
