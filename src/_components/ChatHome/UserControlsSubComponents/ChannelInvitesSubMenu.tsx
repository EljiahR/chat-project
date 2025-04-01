import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { ChannelInvite } from "../../../_lib/responseTypes";
import { SubMenuOptions } from "../../../_lib/pageTypes";
import { buttonStyleRedSmall, draggableSubMenuStyle } from "../../../_lib/tailwindShortcuts";

interface Props {
    channelInvites: ChannelInvite[],
    handleSubMenu: (option: SubMenuOptions) => void
}

const ChannelInvitesSubMenu = ({channelInvites, handleSubMenu}: Props) => {
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
            <CoreComponent channelInvites={channelInvites} handleSubMenu={handleSubMenu}  />
            :
            <Draggable nodeRef={nodeRef} bounds="#chat-main">
                <div ref={nodeRef}>
                    <CoreComponent channelInvites={channelInvites} handleSubMenu={handleSubMenu} />
                </div>
            </Draggable>
    )
}

const CoreComponent = ({channelInvites, handleSubMenu}: Props) => {
    return (
        <div className={draggableSubMenuStyle}>
            <div className="flex justify-between">
                <h3>Channel Invites</h3>
                <button className={buttonStyleRedSmall} onClick={() => handleSubMenu(SubMenuOptions.None)}>X</button>
            </div>
            {channelInvites.length > 0 ?
                <></>
            :
                <></>}
        </div>
    )
}

export default ChannelInvitesSubMenu;