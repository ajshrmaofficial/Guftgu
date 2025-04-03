import {Model} from '@nozbe/watermelondb';
import {date, readonly, text} from '@nozbe/watermelondb/decorators';

// class User extends Model {
//   static table = 'users';

//   @text('username') username;
//   @text('name') name;
//   @text('phone') phone;
// }

class FriendModel extends Model {
  static table = 'friends';

  @text('username') username;
  @text('name') name;
  @text('status') status;
  @text('party') party;
  @text('profile_pic') profilePic;
}

class MessageModel extends Model {
  static table = 'messages';

  @text('sender_username') senderUsername;
  @text('receiver_username') receiverUsername;
  @text('message') message;
  @readonly @date('created_at') createdAt;
}

class ChatListModel extends Model {
  static table = 'chatList';

  @text('username') username;
  @text('name') name;
  @text('lastMessage') lastMessage;
  @readonly @date('updated_at') updatedAt;
}

export {FriendModel, MessageModel, ChatListModel};
