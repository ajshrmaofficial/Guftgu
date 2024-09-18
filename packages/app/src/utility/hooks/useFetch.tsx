import { useEffect } from "react";
import server from "../axiosConfig";
import useUserStore from "../store/userStore";

function useFetchUserData(){

    const username = useUserStore(state => state.username);
    const authToken = useUserStore(state => state.authToken);
    
    useEffect(()=>{
        if(!authToken || !username){
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
    }, [authToken, username])
}

export default useFetchUserData
