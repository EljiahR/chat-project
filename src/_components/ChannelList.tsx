import {  Channel } from "../_lib/responseTypes";

interface Props {
    channels: Channel[],
    setSelectedChannel: React.Dispatch<React.SetStateAction<number | null>>
}

const ChannelList = ({channels, setSelectedChannel}: Props) => {
    const handleSelectedChannel = (id: number) => {
        setSelectedChannel(id);
    }
    
    return (
        <div id="channel-list">
            {channels.map(channel => {
                return (
                    <button className="channelSelector" onClick={() => handleSelectedChannel(channel.id)}>{channel.name}</button>
                )
            })}
        </div>
    )
}

export default ChannelList;