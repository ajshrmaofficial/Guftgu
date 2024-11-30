import { appSchema, tableSchema } from "@nozbe/watermelondb";

const userSchema = appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: "friends",
            columns: [
                {name: 'username', type: 'string', isIndexed: true},
                {name: 'name', type: 'string'},
                {name: 'status', type: 'string'},
                {name: 'party', type: 'string'}
            ]
        }),
        tableSchema({
            name: "messages",
            columns: [
                {name: 'sender_username', type: 'string', isIndexed: true},
                {name: 'receiver_username', type: 'string', isIndexed: true},
                {name: 'message', type: 'string'},
                {name: 'created_at', type: 'number'},
            ]
        }),
        tableSchema({
            name: "chatList",
            columns: [
                {name: 'username', type: 'string', isIndexed: true},
                {name: 'name', type: 'string'},
                {name: 'lastMessage', type: 'string'},
                {name: 'updated_at', type: 'number'},
            ]
        })
    ]
})

export default userSchema;