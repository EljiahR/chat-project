import "../../_styles/ChannelList.css"
import instance from "../../_lib/axiosBase";
import {  Channel } from "../../_lib/responseTypes";

interface Props {
    channels: Channel[],
    setSelectedChannel: React.Dispatch<React.SetStateAction<Channel | null>>
}

const ChannelList = ({channels, setSelectedChannel}: Props) => {
    const handleSelectedChannel = (channel: Channel) => {
        setSelectedChannel(channel);
        console.log("channel: " + channel);
    }

    const handleNewChannel = async () => {
        const newChannelName = prompt("Enter new channel name: ");
        const newChannel = {name: newChannelName};
        try {
            const response = await instance.post("/channel/new", newChannel, {withCredentials: true});
            console.log("New channel created" + response.data);
        } catch (error) {
            console.error("Failed to create channel: " + error);
        }
    }
    
    return (
        <div id="channel-list">
            {channels.map(channel => {
                return (
                    <button key={channel.id} title={channel.name} className="channel-selector" onClick={() => handleSelectedChannel(channel)}>{channel.name}</button>
                )
            })}
            <button className="new-channel" onClick={handleNewChannel}>+</button>
        </div>
    )
}

export default ChannelList;