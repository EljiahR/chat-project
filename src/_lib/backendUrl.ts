const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const backendUrl = BACKEND_URL != "" && BACKEND_URL != null && BACKEND_URL != undefined ? BACKEND_URL : "https://chatproject-reck.onrender.com";

export default backendUrl;