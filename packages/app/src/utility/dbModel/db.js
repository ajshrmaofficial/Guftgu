import {Database, Q} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import userSchema from './schema';
import {FriendModel, MessageModel} from './dbModel';

const adapter = new SQLiteAdapter({
  dbName: 'UserData ',
  schema: userSchema,
  jsi: true,
  onSetUpError: error => console.log('Problem setting up database', error),
});

const database = new Database({
  adapter,
  modelClasses: [FriendModel, MessageModel],
});

const saveChatToDB = async (senderUsername, receiverUsername, messageText) => {
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

const getChatsFromDB = (otherUsername, page, pageSize) => {
  return database.collections.get('messages')
  .query(
    Q.unsafeSqlQuery(
      `SELECT * FROM messages WHERE (sender_username = ? AND receiver_username = ?) OR (sender_username = ? AND receiver_username = ?) ORDER BY created_at DESC LIMIT ? OFFSET ?`, ["me", otherUsername, otherUsername, "me", pageSize, page * pageSize]
    )
  )
}

const getFriendListFromDB = () => {
  return database.collections.get('friends')
  .query(
    Q.where('status', Q.notEq('blocked'))
  )
}

const updateFriendList = async (newFriendList) => {
  const friendCollection = database.collections.get('friends');

  try {
    // Get all existing friends in one query
    const existingFriends = await friendCollection
      .query(Q.where('status', Q.notEq('blocked')))
      .fetch();
    
    // Create a map of existing friends for O(1) lookup
    const existingFriendsMap = new Map(
      existingFriends.map(friend => [friend.username, friend])
    );

    // Prepare batch operations
    const friendsToUpdate = [];
    const friendsToCreate = [];

    // Categorize operations
    newFriendList.forEach(friend => {
      const existing = existingFriendsMap.get(friend.username);
      if (existing) {
        friendsToUpdate.push({
          existing,
          newData: friend
        });
      } else {
        friendsToCreate.push(friend);
      }
    });

    // Perform batch operations
    await database.write(async () => {
      // Batch updates
      await Promise.all(
        friendsToUpdate.map(({existing, newData}) =>
          existing.update(friend => {
            friend.name = newData.name;
            friend.status = newData.status;
            friend.party = newData.party;
          })
        )
      );

      // Batch creates
      await Promise.all(
        friendsToCreate.map(friend =>
          friendCollection.create(newFriend => {
            newFriend.username = friend.username;
            newFriend.name = friend.name;
            newFriend.status = friend.status;
            newFriend.party = friend.party;
          })
        )
      );
    });
  } catch (error) {
    console.error('Error updating friend list:', error);
    throw error;
  }
}

const addFriendRequestToDB = async (friendUsername, friendName, party) => {
  const friendCollection = database.collections.get('friends');
  party = party || 2;

  await database.write(async () => {
    await friendCollection
      .create(friend => {
        friend.username = friendUsername;
        friend.name = friendName;
        friend.status = 'pending';
        friend.party = 2;
      });
  });
}

const updateFriendEntryInDB = async (friendUsername, status) => {
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

const getChatListFromDB = () => {
  return database.collections.get('chatList')
  .query(
    Q.unsafeSqlQuery(
      `SELECT * FROM chatList ORDER BY updated_at DESC`
    )
  )
}

const updateChatEntryInDB = async (username, name, lastMessage) => {
  const chatCollection = database.collections.get('chatList');

  await database.write(async () => {
    const chat = await chatCollection.query(Q.where('username', username)).fetch();
    if (chat.length !== 1) {
      await chatCollection.create(chat => {
        chat.username = username;
        chat.name = name;
        chat.lastMessage = lastMessage;
      });
    } else {
      await chat[0].update(chat => {
        chat.name = name;
        chat.lastMessage = lastMessage;
      });
    }
  });
}

export {saveChatToDB, getChatsFromDB, getFriendListFromDB, updateFriendList, addFriendRequestToDB, updateFriendEntryInDB, getChatListFromDB, updateChatEntryInDB};
