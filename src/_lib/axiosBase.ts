import axios from "axios";

const instance = axios.create({
    baseURL: "https://chatproject-reck.onrender.com"
})

export default instance;