import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { SubMenuOptions } from "../../../_lib/pageTypes";
import { buttonStyleGreenSmall, buttonStyleRedSmall, draggableSubMenuStyle } from "../../../_lib/tailwindShortcuts";
import { useAppDispatch, useAppSelector } from "../../../_lib/redux/hooks";
import { setSelectedSubMenuOption } from "../../../_lib/redux/chatUiSlice";
import { selectAllChannelInvites } from "../../../_lib/redux/userInfoSlice";

interface Props {
    handleAcceptChannelInvite: (inviteId: string, channelId: string) => void;
    isMobile: boolean;
}

interface CoreComponentProps extends Omit<Props, "isMobile"> {}

const ChannelInvitesSubMenu = ({handleAcceptChannelInvite}: Props) => {
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
            <CoreComponent handleAcceptChannelInvite={handleAcceptChannelInvite} />
            :
            <Draggable nodeRef={nodeRef} bounds="#chat-main">
                <div ref={nodeRef}>
                    <CoreComponent handleAcceptChannelInvite={handleAcceptChannelInvite} />
                </div>
            </Draggable>
    )
}

const CoreComponent = ({handleAcceptChannelInvite}: CoreComponentProps) => {
    const dispatch = useAppDispatch();
    const channelInvites = useAppSelector(selectAllChannelInvites);

    return (
        <div className={draggableSubMenuStyle}>
            <div className="flex justify-between">
                <h3>Channel Invites</h3>
                <button className={buttonStyleRedSmall} onClick={() => dispatch(setSelectedSubMenuOption(SubMenuOptions.None))}>X</button>
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