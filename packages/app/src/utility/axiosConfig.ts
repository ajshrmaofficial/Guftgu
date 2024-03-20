import axios, { AxiosInstance } from "axios";
import {SERVER_IP} from "@env";

const server: AxiosInstance = axios.create({
    baseURL: SERVER_IP,
    headers: {
        "Content-Type": "application/json",
    }
});

export default server;
