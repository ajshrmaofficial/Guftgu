import { useEffect } from "react";
// import server from "../api/axiosConfig";
// import useUserStore from "../store/userStore";
import { useQuery } from "@tanstack/react-query";
import { fetchFriendsApiFn, fetchMessagesApiFn } from "../api/endpointFunctions";

function useFetchUserData(){

    // const username = useUserStore(state => state.username);
    // const authToken = useUserStore(state => state.authToken);
    const messagesQuery = useQuery({queryKey: ['undeliveredMessages'], queryFn: fetchMessagesApiFn});
    const friendListQuery = useQuery({queryKey: ['friendList'], queryFn: fetchFriendsApiFn});
    
    useEffect(()=>{
        if(messagesQuery.data){
            console.log(messagesQuery.data);
        }
        if(friendListQuery.data){
            console.log(friendListQuery.data);
        }
    }, [])

    // useEffect(()=>{
    //     if(!authToken || !username){
    //         return;
    //     }
    //     const config = {
    //         headers: {
    //             Authorization: `Bearer ${authToken}`
    //         }
    //     }
    //     const fetchMessages = async() => {
    //         try {
    //             const messages = await server.post('/user/fetchUndeliveredMessages', {receiverUsername: username}, config);
    //             console.log(messages.data);
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }

    //     const fetchFriends = async() => {
    //         try {
    //             const friends = await server.post('/user/fetchFriendList', {username}, config);
    //             console.log(friends.data);
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }

    //     fetchMessages();
    //     fetchFriends();
    // }, [authToken, username])
}

export default useFetchUserData
