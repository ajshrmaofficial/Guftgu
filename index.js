import { Server } from "socket.io";
const  app = require('express')();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const io = Server({
    cors
})

app.listen(3000, ()=>{
    console.log("Server is running on port 3000")
})