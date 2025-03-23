import instance from "../../_lib/axiosBase";
import {  Channel } from "../../_lib/responseTypes";
import { useAppDispatch, useAppSelector } from "../../_lib/redux/hooks";
import { addChannel, selectAllChannels } from "../../_lib/redux/userSlice";
import { buttonStyleLight, mobileSubMenuStyle } from "../../_lib/tailwindShortcuts";
import { SubMenu } from "../../pages/ChatHome";
import React from "react";

interface Props {
    setSelectedChannel: React.Dispatch<React.SetStateAction<Channel | null>>;
    addNewChannel: (id: string) => void;
    selectedSubMenu: SubMenu;
    setSelectedSubMenu: React.Dispatch<React.SetStateAction<SubMenu>>;
}

const ChannelList = ({setSelectedChannel, addNewChannel, selectedSubMenu, setSelectedSubMenu}: Props) => {
    const userInfo = useAppSelector((state) => state.user);
    const channels = useAppSelector(selectAllChannels);
    const dispatch = useAppDispatch();
    
    const handleSelectedChannel = (channel: Channel) => {
        setSelectedChannel(channel);
        setSelectedSubMenu(SubMenu.None);
    }

    const handleNewChannel = async () => {
        const newChannelName = prompt("Enter new channel name: ");
        if (newChannelName == null || newChannelName.trim() == "") return;
        
        const newChannel = {name: newChannelName};
        try {
            const response = await instance.post("/channel/new", newChannel, {withCredentials: true});
            console.log("New channel created", response.data);
            const createdChannel: Channel = response.data;

            dispatch(addChannel(createdChannel));
            addNewChannel(createdChannel.id);
            setSelectedSubMenu(SubMenu.None);
        } catch (error) {
            console.error("Failed to create channel: " + error);
        }
    }
    
    return (
        <div id="channel-list" className={(selectedSubMenu == SubMenu.ChannelList ? mobileSubMenuStyle + " " : "") + "flex flex-col gap-2"}>
            {userInfo != null ? 
                channels.map(channel => {
                    return (
                        <button key={channel.id} title={channel.name} className={`${buttonStyleLight} channel-selector`} onClick={() => handleSelectedChannel(channel)}>
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