import axios, { AxiosInstance } from "axios";
import {SERVER_IP} from "@env";

console.log("SERVER_IP:", SERVER_IP);
const server: AxiosInstance = axios.create({
    baseURL: "https://backendapi-git-9e847d31bc95.herokuapp.com",
    headers: {
        "Content-Type": "application/json",
    }
});

export default server;