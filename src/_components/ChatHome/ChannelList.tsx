import { useAppDispatch, useAppSelector } from "../../_lib/redux/hooks";
import { addChannel, selectAllChannels } from "../../_lib/redux/userInfoSlice";
import { buttonStyleLight, mobileSubMenuStyle } from "../../_lib/tailwindShortcuts";
import { SubMenu } from "../../_lib/pageTypes";
import { setSelectedChannel } from "../../_lib/redux/chatUiSlice";
import { useAuth } from "../AuthContext";

const ChannelList = () => {
    const userInfo = useAppSelector((state) => state.userInfo);
    const channels = useAppSelector(selectAllChannels);
    const selectedSubMenu = useAppSelector((state) => state.chatUi.selectedSubMenu)
    const dispatch = useAppDispatch();
    const { newChannel } = useAuth();
    
    const handleNewChannel = async () => {
        const newChannelName = prompt("Enter new channel name: ");
        if (newChannelName == null || newChannelName.trim() == "") return;
        
        try {
            const data = await newChannel(newChannelName)
            console.log("New channel created", data);
            dispatch(addChannel(data));
        } catch (error) {
            console.error("Failed to create channel: " + error);
        }
    }
    
    return (
        <div id="channel-list" className={(selectedSubMenu == SubMenu.ChannelList ? mobileSubMenuStyle + " " : "") + "flex flex-col gap-2"}>
            {userInfo != null ? 
                channels.map(channel => {
                    return (
                        <button key={channel.id} title={channel.name} className={`${buttonStyleLight} channel-selector`} onClick={() => dispatch(setSelectedChannel(channel))}>
                            {channel.name}
                        </button>
                    )
                }) :
                <></>
            }
            <button className={`${buttonStyleLight} new-channel`} onClick={handleNewChannel}>+</button>
        </div>
    )
}

export default ChannelList;