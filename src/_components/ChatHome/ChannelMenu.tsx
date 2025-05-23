import { useAppDispatch, useAppSelector } from "../../_lib/redux/hooks";
import { Channel } from "../../_lib/responseTypes";
import { updateChannelToConnection } from "../../_lib/signalr/signalRMiddleware";
import { buttonStyleBlue, buttonStyleBlueDisabled, buttonStyleRed } from "../../_lib/tailwindShortcuts";

interface Props {
    channel: Channel,
    handleChannelMenuDisplay: (forceClose?: boolean) => void;
}

const ChannelMenu = ({channel, handleChannelMenuDisplay}: Props) => {
    const userId = useAppSelector((state) => state.userInfo.id);
    const dispatch = useAppDispatch();
    
    const handleChannelFreeze = () => {
        dispatch(updateChannelToConnection({id: channel.id, isFrozen: !channel.isFrozen}));
    }

    return (
        <div id="channel-menu" className="fixed right-0 translate-x-full h-screen w-80 bg-gray-600 transform transition-transform duration-500 px-5 py-2 rounded-xl" >
            <div className="flex justify-between">
                <h2 className="text-2xl">{channel.name}</h2>
                <button onClick={() => handleChannelMenuDisplay(true)} className={buttonStyleRed}>X</button>
            </div>
            {userId == channel.owner.id &&
            <div className="grid grid-cols-2 grid-rows-2 gap-2">
                <button className={buttonStyleBlueDisabled + " col-span-2"} disabled>Edit Channel Name</button>
                <button className={buttonStyleRed + " cursor-not-allowed"} disabled>Delete</button>
                <button className={buttonStyleBlue} onClick={handleChannelFreeze}>{channel.isFrozen ? "Unfreeze" : "Freeze"}</button>
            </div>}
            
            <h3 className="text-xl">Owner</h3>
            <div id="channel-owner">
                <p>{channel.owner.userName}</p>
            </div>
            <h3 className="text-xl">Members</h3>
            <div id="channel-members">
                {channel.members.concat(channel.admins).map(u => {
                    return (
                        <p key={"members"+u.id}>{u.userName}</p>
                    )
                })}
            </div>
        </div>
    )
}

export default ChannelMenu;