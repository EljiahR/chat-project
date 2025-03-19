import axios from "axios";
import backendUrl from "./backendUrl";

const instance = axios.create({
    baseURL: backendUrl
})

export default instance;