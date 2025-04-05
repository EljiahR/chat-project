import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { buttonStyleBlueSmall, buttonStyleGreenSmall, buttonStyleRedSmall, draggableSubMenuStyle } from "../../../_lib/tailwindShortcuts";
import { SubMenuOptions } from "../../../_lib/pageTypes";
import { useAppDispatch, useAppSelector } from "../../../_lib/redux/hooks";
import { selectAllFriendRequests, selectAllFriends } from "../../../_lib/redux/userSlice";
import { setSelectedSubMenuOption } from "../../../_lib/redux/chatHubSlice";
import { Friendship } from "../../../_lib/responseTypes";

interface Props {
    handleAcceptFriendRequest: (request: Friendship) => void,
    handleInviteToChannel: (userId: string) => void,
}

const FriendSubMenu = ({handleAcceptFriendRequest, handleInviteToChannel}: Props) => {
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
        <CoreComponent handleAcceptFriendRequest={handleAcceptFriendRequest} handleInviteToChannel={handleInviteToChannel} />
        :
        <Draggable nodeRef={nodeRef} bounds="#chat-main">
            <div ref={nodeRef}>
                <CoreComponent handleAcceptFriendRequest={handleAcceptFriendRequest} handleInviteToChannel={handleInviteToChannel} />
            </div>
        </Draggable>
    )
}

const CoreComponent = ({handleAcceptFriendRequest, handleInviteToChannel}: Props) => {
    const dispatch = useAppDispatch();
    const friends = useAppSelector(selectAllFriends);
    const friendRequests = useAppSelector(selectAllFriendRequests);
    
    return (
        <div id="friend-list" className={draggableSubMenuStyle}>
            <div className="flex justify-between">
                <h3>Friends</h3>
                <button className={buttonStyleRedSmall} onClick={() => dispatch(setSelectedSubMenuOption(SubMenuOptions.None))}>X</button>
            </div>
            {friendRequests.length > 0 ? 
                <div id="friend-requests">
                    <div>Pending Request</div>
                    {friendRequests.map(friendRequest => {
                        return (
                            <div key={"friend-request"+friendRequest.id} className="flex justify-between">
                                <p>{friendRequest.initiator.userName}</p>
                                <button className={buttonStyleGreenSmall} onClick={() => handleAcceptFriendRequest(friendRequest)}>Accept</button>
                            </div>
                        )
                    })}
                </div>
                :
                <></>
            }
            <div id="friends">
                {friends.length > 0 ?
                    friends.map(friend => {
                        return (
                            <div key={"friend"+friend.id} className="flex justify-between">
                                <p>{friend.userName}</p>
                                <button className={buttonStyleBlueSmall} onClick={() => handleInviteToChannel(friend.id)}>Invite</button>
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