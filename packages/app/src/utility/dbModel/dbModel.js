import {Model} from '@nozbe/watermelondb';
import {date, readonly, text, writer} from '@nozbe/watermelondb/decorators';

class User extends Model {
  static table = 'users';

  @text('username') username;
  @text('phone') phone;
}

class Message extends Model {
  static table = 'messages';

  @text('sender_username') senderUsername;
  @text('receiver_username') receiverUsername;
  @text('message') message;
  @readonly @date('created_at') createdAt;
}

export {User, Message};
