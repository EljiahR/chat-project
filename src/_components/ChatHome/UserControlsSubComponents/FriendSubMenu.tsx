import { useRef } from "react";
import Draggable from "react-draggable";
import { buttonStyleBlueSmall, buttonStyleRedSmall, draggableSubMenuStyle } from "../../../_lib/tailwindShortcuts";
import { SubMenuOptions } from "../UserControls";
import { Friend } from "../../../_lib/responseTypes";

interface Props {
    friends: Friend[],
    handleAddToChannel: (userId: string) => void,
    handleSubMenu: (option: SubMenuOptions) => void
}

interface CoreProps extends Props {
    nodeRef: React.MutableRefObject<null>
}

const FriendSubMenu = ({friends, handleAddToChannel, handleSubMenu}: Props) => {
    const nodeRef = useRef(null);

    const isMobile = () => window.innerWidth < 640;

    return (
        isMobile() ?
        <CoreComponent friends={friends} handleAddToChannel={handleAddToChannel} handleSubMenu={handleSubMenu} nodeRef={nodeRef} />
        :
        <Draggable nodeRef={nodeRef} bounds="#chat-main">
            <CoreComponent friends={friends} handleAddToChannel={handleAddToChannel} handleSubMenu={handleSubMenu} nodeRef={nodeRef} />
        </Draggable>
    )
}

const CoreComponent = ({friends, handleAddToChannel, handleSubMenu, nodeRef}: CoreProps) => {
    return (
        <div id="friend-list" className={draggableSubMenuStyle} ref={nodeRef}>
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