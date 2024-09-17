import { useEffect } from "react";
import server from "../axiosConfig";

function useFetchUserData(authToken: string | null, username: string | null){
    
    useEffect(()=>{
        if(!authToken){
            return;
        }
        const config = {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        }
        const fetchMessages = async() => {
            try {
                const messages = await server.post('/user/fetchUndeliveredMessages', {receiverUsername: username}, config);
                console.log(messages.data);
            } catch (error) {
                console.log(error);
            }
        }

        const fetchFriends = async() => {
            try {
                const friends = await server.post('/user/fetchFriendList', {username}, config);
                console.log(friends.data);
            } catch (error) {
                console.log(error);
            }
        }

        fetchMessages();
        fetchFriends();
    }, [authToken])
}

export default useFetchUserData
