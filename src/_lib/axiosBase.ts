import axios from "axios";

const instance = axios.create({
    baseURL: "https://localhost:7058"
})

export default instance;