import axios, { AxiosInstance } from "axios";
import {DEV_SERVER_IP, PROD_SERVER_IP, ENV} from "@env";

const server: AxiosInstance = axios.create({
    baseURL: ENV==="prod" ? PROD_SERVER_IP: DEV_SERVER_IP,
    headers: {
        "Content-Type": "application/json",
    }
});

export default server;
