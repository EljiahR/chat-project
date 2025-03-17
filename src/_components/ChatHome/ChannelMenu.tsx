import { Channel } from "../../_lib/responseTypes";
import "../../_styles/ChannelMenu.css"

interface Props {
    channel: Channel
}

const ChannelMenu = ({channel}: Props) => {
    return (
        <div id="channel-menu">
            <h3>Owner</h3>
            <div id="channel-owner">
                <p>{channel.owner.userName}</p>
            </div>
            <h3>Members</h3>
            <div id="channel-members">
                {channel.members.concat(channel.admins).map(u => {
                    return (
                        <p key={"members"+u.userId}>{u.userName}</p>
                    )
                })}
            </div>
        </div>
    )
}

export default ChannelMenu;