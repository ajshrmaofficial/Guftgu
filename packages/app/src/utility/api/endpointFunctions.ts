import useUserStore from "../store/userStore"
import server from "./axiosConfig";

export const fetchMessagesApiFn = async() => {
    const authToken = useUserStore.getState().authToken;

    if (!authToken) {
        throw new Error('No auth token');
    }

    const config = {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    }

    try {
        const messages = await server.get('/user/fetchUndeliveredMessages', config);
        return messages.data;
    } catch (error) {
        console.error('Fetch messages error:', error);
        throw error;
    }
}

export const fetchFriendsApiFn = async() => {
    const authToken = useUserStore.getState().authToken;
    
    if (!authToken) {
        throw new Error('No auth token');
    }

    const config = {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    }

    try {
        const friends = await server.get('/user/fetchFriendList', config);
        return friends.data;
    } catch (error) {
        console.error('Fetch friends error:', error);
        throw error;
    }
}

export const searchUserApiFn = async (username: string) => {
    const authToken = useUserStore.getState().authToken;
    
    if (!authToken || !username) {
        throw new Error('No auth token or username');
    }

    const config = {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    }

    try {
        const data = await server.get(
            `/user/searchUser?username=${username}`,
            config
        );
        return data.data;
    } catch (error) {
        console.error('Search user error:', error);
        throw error;
    }
}

export const sendFriendRequestApiFn = async (friendUsername: string) => {
    const authToken = useUserStore.getState().authToken;
    
    if (!authToken || !friendUsername) {
        throw new Error('No auth token or username');
    }

    const config = {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    }

    try {
        const data = await server.post('/user/addFriend', {friendUsername}, config);
        return data.data;
    } catch (error) {
        console.error('Send friend request error:', error);
        throw error;
    }
}

export const acceptFriendRequestApiFn = async (friendUsername: string) => {
    const authToken = useUserStore.getState().authToken;
    
    if (!authToken || !friendUsername) {
        throw new Error('No auth token or username');
    }

    const config = {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    }

    try {
        const data = await server.post('/user/acceptFriendRequest', {friendUsername}, config);
        return data.data;
    } catch (error) {
        console.error('Accept friend request error:', error);
        throw error;
    }
}
