import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { buttonStyleBlueSmall, buttonStyleRedSmall, draggableSubMenuStyle } from "../../../_lib/tailwindShortcuts";
import { SubMenuOptions } from "../UserControls";
import { Friend } from "../../../_lib/responseTypes";

interface Props {
    friends: Friend[],
    handleAddToChannel: (userId: string) => void,
    handleSubMenu: (option: SubMenuOptions) => void
}

const FriendSubMenu = ({friends, handleAddToChannel, handleSubMenu}: Props) => {
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
        <CoreComponent friends={friends} handleAddToChannel={handleAddToChannel} handleSubMenu={handleSubMenu} />
        :
        <Draggable nodeRef={nodeRef} bounds="#chat-main">
            <div ref={nodeRef}>
                <CoreComponent friends={friends} handleAddToChannel={handleAddToChannel} handleSubMenu={handleSubMenu} />
            </div>
        </Draggable>
    )
}

const CoreComponent = ({friends, handleAddToChannel, handleSubMenu}: Props) => {
    return (
        <div id="friend-list" className={draggableSubMenuStyle}>
            <div className="flex justify-between">
                <h3>Friends</h3>
                <button className={buttonStyleRedSmall} onClick={() => handleSubMenu(SubMenuOptions.None)}>X</button>
            </div>
            <div id="friends">
                {friends.length > 0 ?
                    friends.map(friend => {
                        return (
                            <div key={"friend"+friend.userId} className="flex justify-between">
                                <p>{friend.userName}</p>
                                <button className={buttonStyleBlueSmall} onClick={() => handleAddToChannel(friend.userId)}>Invite</button>
                            </div>
                        )
                    })
                    :
                    <div>No friends :(</div>
                }
            </div>
        </div> 
    )
}

export default FriendSubMenu;