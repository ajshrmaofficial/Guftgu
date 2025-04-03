import {Database, Q} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import userSchema from './schema';
import {ChatListModel, FriendModel, MessageModel} from './dbModel';

const adapter = new SQLiteAdapter({
  dbName: 'UserData ',
  schema: userSchema,
  jsi: true,
  onSetUpError: error => console.log('Problem setting up database', error),
});

const database = new Database({
  adapter,
  modelClasses: [FriendModel, MessageModel, ChatListModel],
});

export const saveChatToDB = async (senderUsername, receiverUsername, messageText) => {
  const messageCollection = database.collections.get('messages');

  await database.write(async () => {
    await messageCollection
      .create(message => {
        message.senderUsername = senderUsername;
        message.receiverUsername = receiverUsername;
        message.message = messageText;
      });
  });
};

export const getChatsFromDB = (otherUsername, page, pageSize) => {
  return database.collections.get('messages')
  .query(
    Q.unsafeSqlQuery(
      `SELECT * FROM messages WHERE (sender_username = ? AND receiver_username = ?) OR (sender_username = ? AND receiver_username = ?) ORDER BY created_at DESC LIMIT ? OFFSET ?`, ["me", otherUsername, otherUsername, "me", pageSize, page * pageSize]
    )
  )
}

export const searchChatsFromDB = (searchText) => {
  return database.collections.get('messages')
  .query(
    Q.unsafeSqlQuery(
      `SELECT * FROM messages WHERE message LIKE ? ORDER BY created_at DESC`, [`%${searchText}%`]
    )
  ).fetch();
}

export const getFriendListFromDB = () => {
  return database.collections.get('friends')
  .query(
    Q.where('status', Q.notEq('blocked'))
  )
}

export const updateFriendListInDB = async (newFriendList) => {
  const friendCollection = database.collections.get('friends');

  try {
    const existingFriends = await friendCollection
      .query(Q.where('status', Q.notEq('blocked')))
      .fetch();
    
    const existingFriendsMap = new Map(
      existingFriends.map(friend => [friend.username, friend])
    );

    const friendsToUpdate = [];
    const friendsToCreate = [];

    // Match backend response structure
    newFriendList.forEach(friend => {
      // Backend sends: { username, name, status, party }
      const existing = existingFriendsMap.get(friend.username);
      if (existing) {
        friendsToUpdate.push({
          existing,
          newData: {
            username: friend.username,
            name: friend.name,
            status: friend.status,
            party: friend.party.toString() // Convert to string for consistency
          }
        });
      } else {
        friendsToCreate.push({
          username: friend.username,
          name: friend.name,
          status: friend.status,
          party: friend.party.toString()
        });
      }
    });

    await database.write(async () => {
      await Promise.all([
        ...friendsToUpdate.map(({existing, newData}) =>
          existing.update(friend => {
            friend.name = newData.name;
            friend.status = newData.status;
            friend.party = newData.party;
          })
        ),
        ...friendsToCreate.map(newData =>
          friendCollection.create(friend => {
            friend.username = newData.username;
            friend.name = newData.name;
            friend.status = newData.status;
            friend.party = newData.party;
          })
        )
      ]);
    });
  } catch (error) {
    console.error('Error updating friend list:', error);
    throw error;
  }
}

export const addFriendRequestToDB = async (friendUsername, friendName, party='2') => {
  const friendCollection = database.collections.get('friends');

  await database.write(async () => {
    await friendCollection
      .create(friend => {
        friend.username = friendUsername;
        friend.name = friendName;
        friend.status = 'pending';
        friend.party = party.toString();
      });
  });
}

export const updateFriendEntryInDB = async (friendUsername, status) => {
  const friendCollection = database.collections.get('friends');

  await database.write(async () => {
    const friend = await friendCollection.query(Q.where('username', friendUsername)).fetch();
    if (friend.length !== 1) {
      throw new Error('Friend not found');
    } else {
      await friend[0].update(friend => {
        friend.status = status
      })
    }
  });
}

export const getChatListFromDB = () => {
  return database.collections.get('chatList')
  .query(
    Q.unsafeSqlQuery(
      `SELECT * FROM chatList ORDER BY updated_at DESC`
    )
  )
}

export const updateChatEntryInDB = async (username, name, lastMessage) => {
  const chatCollection = database.collections.get('chatList');
  console.log('Updating chat entry:', username, name, lastMessage);
  await database.write(async () => {
    try {
      // Try to find existing chat
      const existingChat = await chatCollection
        .query(Q.where('username', username))
        .fetch();

      if (existingChat[0]) {
        // Update existing chat
        await existingChat[0].update(chat => {
          chat.name = name;
          chat.username = username;
          chat.lastMessage = lastMessage;
        });
      } else {
        // Create new chat entry
        await chatCollection.create(chat => {
          chat.username = username;
          chat.name = name;
          chat.lastMessage = lastMessage || '';
        });
      }
    } catch (error) {
      console.error('Error updating chat entry:', error);
      throw error;
    }
  });
}

export const updateFriendProfilePicInDB = async (friendUsername, profilePic, extension) => {
  const friendCollection = database.collections.get('friends');

  await database.write(async () => {
    const friend = await friendCollection.query(Q.where('username', friendUsername)).fetch();
    if (friend.length !== 1) {
      throw new Error('Friend not found');
    } else {
      await friend[0].update(friend => {
        friend.profilePic = profilePic;
        friend.profilePicExtension = extension;
      })
    }
  });
}

