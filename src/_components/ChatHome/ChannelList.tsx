import instance from "../../_lib/api";
import {  Channel } from "../../_lib/responseTypes";
import { useAppDispatch, useAppSelector } from "../../_lib/redux/hooks";
import { addChannel, selectAllChannels } from "../../_lib/redux/userInfoSlice";
import { buttonStyleLight, mobileSubMenuStyle } from "../../_lib/tailwindShortcuts";
import { SubMenu } from "../../_lib/pageTypes";
import { setSelectedChannel } from "../../_lib/redux/chatUiSlice";

const ChannelList = () => {
    const userInfo = useAppSelector((state) => state.userInfo);
    const channels = useAppSelector(selectAllChannels);
    const selectedSubMenu = useAppSelector((state) => state.chatUi.selectedSubMenu)
    const dispatch = useAppDispatch();
    
    const handleNewChannel = async () => {
        const newChannelName = prompt("Enter new channel name: ");
        if (newChannelName == null || newChannelName.trim() == "") return;
        
        const newChannel = {name: newChannelName};
        try {
            const response = await instance.post("/channel/new", newChannel, {withCredentials: true});
            console.log("New channel created", response.data);
            const createdChannel: Channel = response.data;

            dispatch(addChannel(createdChannel));
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