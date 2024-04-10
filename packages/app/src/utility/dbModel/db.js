import {Database, Q} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import userSchema from './userSchema';
import {User, Message} from './dbModel';

const adapter = new SQLiteAdapter({
  dbName: 'UserData ',
  schema: userSchema,
  jsi: true,
  onSetUpError: error => console.log('Problem setting up database', error),
});

const database = new Database({
  adapter,
  modelClasses: [User, Message],
});

const saveChat = async (senderUsername, receiverUsername, messageText) => {
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

const getChats = async (otherUsername, page, pageSize) => {
  const messageCollection = database.collections.get('messages');
  const messages = await messageCollection.query(
    Q.unsafeSqlQuery(
      `SELECT * FROM messages WHERE (sender_username = ? AND receiver_username = ?) OR (sender_username = ? AND receiver_username = ?) ORDER BY created_at DESC LIMIT ? OFFSET ?`, ["me", otherUsername, otherUsername, "me", pageSize, page * pageSize]
    )
  ).fetch();

  return messages;
};

export {saveChat, getChats};
