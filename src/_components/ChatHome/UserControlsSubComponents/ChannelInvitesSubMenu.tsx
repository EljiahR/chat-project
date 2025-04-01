import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";

const ChannelInvitesSubMenu = () => {
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
            <CoreComponent  />
            :
            <Draggable nodeRef={nodeRef} bounds="#chat-main">
                <div ref={nodeRef}>
                    <CoreComponent />
                </div>
            </Draggable>
    )
}

const CoreComponent = () => {
    return (
        <div></div>
    )
}

export default ChannelInvitesSubMenu;