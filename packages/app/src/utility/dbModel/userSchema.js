import { appSchema, tableSchema } from "@nozbe/watermelondb";

const userSchema = appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: "users",
            columns: [
                {name: 'username', type: 'string'},
                {name: 'name', type: 'string'},
                {name: 'phone', type: 'string'},
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
        })
    ]
})

export default userSchema;