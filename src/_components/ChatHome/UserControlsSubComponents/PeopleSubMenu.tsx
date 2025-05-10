import React, { useEffect, useRef, useState } from "react";
import { Person } from "../../../_lib/responseTypes";
import Draggable from "react-draggable";
import { buttonStyleGreenSmall, buttonStyleRedSmall, draggableSubMenuStyle } from "../../../_lib/tailwindShortcuts";
import { SubMenuOptions } from "../../../_lib/pageTypes";
import { useAppDispatch } from "../../../_lib/redux/hooks";
import { setSelectedSubMenuOption } from "../../../_lib/redux/chatUiSlice";
import { useAuth } from "../../AuthContext";

interface Props {
    handleNewFriendRequest: (id: string) => void,
}

interface CoreProps extends Props {
    searchQuery: string,
    searchResults: Person[]
    handleSearch: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>
}

const PeopleSubMenu = ({handleNewFriendRequest}: Props) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Person[]>([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
    const nodeRef = useRef(null);
    const { findByName } = useAuth();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key == "Enter") {
            try {
                const data = await findByName(searchQuery);
                
                setSearchResults(data);
            } catch (error) {
                console.error(error);
                setSearchResults([]);
            }
        }
    }
    
    return (
        isMobile ?
        <CoreComponent handleNewFriendRequest={handleNewFriendRequest} searchQuery={searchQuery} handleSearch={handleSearch} setSearchQuery={setSearchQuery} searchResults={searchResults} />
        :
        <Draggable nodeRef={nodeRef} bounds="#chat-main">
            <div ref={nodeRef}>
                <CoreComponent handleNewFriendRequest={handleNewFriendRequest} searchQuery={searchQuery} handleSearch={handleSearch} setSearchQuery={setSearchQuery} searchResults={searchResults} />
            </div>
        </Draggable>
    )
}

const CoreComponent = ({handleNewFriendRequest, searchQuery, searchResults, handleSearch, setSearchQuery}: CoreProps) => {    
    const dispatch = useAppDispatch();
    
    return (
        <div id="people-search" className={draggableSubMenuStyle}>
            <div className="flex justify-between gap-2">
                <input type="text" id="people-search-bar" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => handleSearch(e)} placeholder="Search by name..." />
                <button className={buttonStyleRedSmall} onClick={() => dispatch(setSelectedSubMenuOption(SubMenuOptions.None))}>X</button>
            </div>
            <div id="search-results" className="flex flex-col gap-2 mt-auto">
                {searchResults.length > 0 ?
                    searchResults.map(person => {
                        return (
                            <div key={"people"+person.id} className="flex justify-between">
                                <p>{person.userName}</p>
                                <button className={buttonStyleGreenSmall} onClick={() => handleNewFriendRequest(person.id)} disabled={person.isFriend}>Add</button>
                            </div>
                        )
                    }) :
                    <div className="person-result">No users found</div>
                }
            </div>
        </div>
    )
}

export default PeopleSubMenu;