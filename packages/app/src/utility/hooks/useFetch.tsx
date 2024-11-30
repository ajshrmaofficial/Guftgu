import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchFriendsApiFn, fetchMessagesApiFn } from "../api/endpointFunctions";
import { saveChatToDB, updateFriendListInDB } from "../dbModel/db";


// CAUTION: This hook is no longer used in the application
// This hook was used to fetch offline data from the database
function useFetchOfflineData(){

    const messagesQuery = useQuery({queryKey: ['undeliveredMessages'], queryFn: fetchMessagesApiFn, retry: 2});
    const friendListQuery = useQuery({queryKey: ['friendList'], queryFn: fetchFriendsApiFn, retry: 2});
    
    useEffect(()=>{
        if(messagesQuery.error){
            console.log('useFetch error, messages: ',messagesQuery.error);
        }

        if(friendListQuery.error){
            console.log('useFetch error, friendList: ',friendListQuery.error);
        }

        if(messagesQuery.data){
            if(messagesQuery.data.length === 0){
                return;
            }
            messagesQuery.data.forEach((message: any) => {
                saveChatToDB(message.receiver, 'me', message.message);
            })
        }

        if(friendListQuery.data){
            if(friendListQuery.data.length === 0){
                return;
            }
            updateFriendListInDB(friendListQuery.data);
        }

    }, [messagesQuery, friendListQuery])
}

export default useFetchOfflineData
