const HOME_ID = import.meta.env.VITE_HOME_ID;
const homeId = HOME_ID != null && HOME_ID != undefined ? HOME_ID : "";

export default homeId;