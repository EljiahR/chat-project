import instance from "../_lib/axiosBase";
import {  Channel } from "../_lib/responseTypes";

interface Props {
    channels: Channel[],
    setSelectedChannel: React.Dispatch<React.SetStateAction<number | null>>
}

const ChannelList = ({channels, setSelectedChannel}: Props) => {
    const handleSelectedChannel = (id: number) => {
        setSelectedChannel(id);
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
            <button className="new-channel" onClick={handleNewChannel}>+</button>
            {channels.map(channel => {
                return (
                    <button className="channel-selector" onClick={() => handleSelectedChannel(channel.id)}>{channel.name}</button>
                )
            })}
        </div>
    )
}

export default ChannelList;