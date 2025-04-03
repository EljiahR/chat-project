import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { ChannelInvite } from "../../../_lib/responseTypes";
import { SubMenuOptions } from "../../../_lib/pageTypes";
import { buttonStyleGreenSmall, buttonStyleRedSmall, draggableSubMenuStyle } from "../../../_lib/tailwindShortcuts";

interface Props {
    channelInvites: ChannelInvite[],
    handleAcceptChannelInvite: (inviteId: string, channelId: string) => void,
    handleSubMenu: (option: SubMenuOptions) => void
}

const ChannelInvitesSubMenu = ({channelInvites, handleAcceptChannelInvite, handleSubMenu}: Props) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
    const nodeRef = useRef(null);
        
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    return (
        isMobile ?
            <CoreComponent channelInvites={channelInvites} handleAcceptChannelInvite={handleAcceptChannelInvite} handleSubMenu={handleSubMenu}  />
            :
            <Draggable nodeRef={nodeRef} bounds="#chat-main">
                <div ref={nodeRef}>
                    <CoreComponent channelInvites={channelInvites} handleAcceptChannelInvite={handleAcceptChannelInvite} handleSubMenu={handleSubMenu} />
                </div>
            </Draggable>
    )
}

const CoreComponent = ({channelInvites, handleAcceptChannelInvite, handleSubMenu}: Props) => {
    return (
        <div className={draggableSubMenuStyle}>
            <div className="flex justify-between">
                <h3>Channel Invites</h3>
                <button className={buttonStyleRedSmall} onClick={() => handleSubMenu(SubMenuOptions.None)}>X</button>
            </div>
            {channelInvites.length > 0 ?
                <div id="channel-invites">
                    {channelInvites.map((channelInvite) => {
                        return (
                            <div key={"channel-invite-" + channelInvite.id} className="flex justify-between">
                                <p>{channelInvite.channel.name}</p>
                                <button className={buttonStyleGreenSmall} onClick={() => handleAcceptChannelInvite(channelInvite.id, channelInvite.channelId)}>Accept</button>
                            </div>
                        )
                    })}
                </div>
            :
                <></>}
        </div>
    )
}

export default ChannelInvitesSubMenu;