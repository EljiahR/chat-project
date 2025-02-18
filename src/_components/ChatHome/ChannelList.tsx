import "../../_styles/ChannelList.css"
import instance from "../../_lib/axiosBase";
import {  Channel, UserInfo } from "../../_lib/responseTypes";

interface Props {
    userInfo: UserInfo,
    setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>,
    setSelectedChannel: React.Dispatch<React.SetStateAction<Channel | null>>,
    addNewChannel: (id: number) => void;
}

const ChannelList = ({userInfo, setUserInfo, setSelectedChannel, addNewChannel}: Props) => {
    const handleSelectedChannel = (channel: Channel) => {
        setSelectedChannel(channel);
    }

    const handleNewChannel = async () => {
        const newChannelName = prompt("Enter new channel name: ");
        if (newChannelName == null || newChannelName.trim() == "") return;
        
        const newChannel = {name: newChannelName};
        try {
            const response = await instance.post("/channel/new", newChannel, {withCredentials: true});
            console.log("New channel created", response.data);
            const createdChannel: Channel = response.data;

            setUserInfo(previousInfo => {
                const newInfo = {...previousInfo};
                if (newInfo.channels.length > 0) {
                    newInfo.channels = [...newInfo.channels, createdChannel];
                } else {
                    newInfo.channels = [response.data];
                }
                return newInfo;
            });
            addNewChannel(createdChannel.id);
        } catch (error) {
            console.error("Failed to create channel: " + error);
        }
    }
    
    return (
        <div id="channel-list">
            {userInfo != null ? 
                userInfo.channels.map(channel => {
                    return (
                        <button key={channel.id} title={channel.name} className="channel-selector" onClick={() => handleSelectedChannel(channel)}>{channel.name}</button>
                    )
                }) :
                <></>
            }
            <button className="new-channel" onClick={handleNewChannel}>+</button>
        </div>
    )
}

export default ChannelList;