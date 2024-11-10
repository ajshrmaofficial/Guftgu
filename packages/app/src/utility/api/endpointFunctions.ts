import useUserStore from "../store/userStore"
import server from "./axiosConfig";

const authToken = useUserStore.getState().authToken;
const username = useUserStore.getState().username;
const config = {
    headers: {
        Authorization: `Bearer ${authToken}`
    }
}

export const fetchMessagesApiFn = async() => {
    const messages = await server.post('/user/fetchUndeliveredMessages', {receiverUsername: username}, config);
    return messages.data;
}

export const fetchFriendsApiFn = async() => {
    const friends = await server.post('/user/fetchFriendList', {username}, config);
    return friends.data;
}

export const searchUserApiFn = async (username: string) => {
    const data = await server.get(
        `/user/searchUser?username=${username}`,
        config
    );
    return data.data;
}

export const sendFriendRequestApiFn = async (friendUsername: string) => {
    const data = await server.post('/user/addFriend', {friendUsername}, config);
    return data.data;
}

export const acceptFriendRequestApiFn = async (friendUsername: string) => {
    const data = await server.post('/user/acceptFriendRequest', {friendUsername}, config);
    return data.data;
}
