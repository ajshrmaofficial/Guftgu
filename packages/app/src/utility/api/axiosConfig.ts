import axios, { AxiosInstance } from "axios";
import Config from 'react-native-config'

const {ENV, PROD_SERVER_IP, DEV_SERVER_IP} = Config;

const server: AxiosInstance = axios.create({
    baseURL: ENV==="prod" ? PROD_SERVER_IP: DEV_SERVER_IP,
    headers: {
        "Content-Type": "application/json",
    }
});

export default server;
