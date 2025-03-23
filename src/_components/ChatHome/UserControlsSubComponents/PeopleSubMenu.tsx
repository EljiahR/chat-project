import React, { useRef, useState } from "react";
import { Person } from "../../../_lib/responseTypes";
import Draggable from "react-draggable";
import { buttonStyleGreenSmall, buttonStyleRedSmall, draggableSubMenuStyle } from "../../../_lib/tailwindShortcuts";
import { SubMenuOptions } from "../UserControls";
import instance from "../../../_lib/axiosBase";

interface Props {
    handleNewFriend: (id: string) => void,
    handleSubMenu: (option: SubMenuOptions) => void
}

interface CoreProps extends Props {
    nodeRef: React.MutableRefObject<null>,
    searchQuery: string,
    searchResults: Person[]
    handleSearch: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>
}

const PeopleSubMenu = ({handleNewFriend, handleSubMenu}: Props) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Person[]>([]);
    const nodeRef = useRef(null);

    const isMobile = () => window.innerWidth < 640;

    const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key == "Enter") {
            try {
                const response = await instance.get(`/User/FindByName/${searchQuery}`, {withCredentials: true});
                console.log("Search results", response.data);
                setSearchResults(response.data);
            } catch (error) {
                console.error(error);
                setSearchResults([]);
            }
        }
    }
    
    return (
        isMobile() ?
        <CoreComponent handleNewFriend={handleNewFriend} nodeRef={nodeRef} searchQuery={searchQuery} handleSubMenu={handleSubMenu} handleSearch={handleSearch} setSearchQuery={setSearchQuery} searchResults={searchResults} />
        :
        <Draggable nodeRef={nodeRef} bounds="#chat-main">
            <CoreComponent handleNewFriend={handleNewFriend} nodeRef={nodeRef} searchQuery={searchQuery} handleSubMenu={handleSubMenu} handleSearch={handleSearch} setSearchQuery={setSearchQuery} searchResults={searchResults} />
        </Draggable>
    )
}

const CoreComponent = ({handleNewFriend, handleSubMenu, nodeRef, searchQuery, searchResults, handleSearch, setSearchQuery}: CoreProps) => {    
    return (
        <div id="people-search" className={draggableSubMenuStyle} ref={nodeRef}>
            <div className="flex justify-between gap-2">
                <input type="text" id="people-search-bar" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => handleSearch(e)} placeholder="Search by name..." />
                <button className={buttonStyleRedSmall} onClick={() => handleSubMenu(SubMenuOptions.None)}>X</button>
            </div>
            <div id="search-results" className="flex flex-col gap-2 mt-auto">
                {searchResults.length > 0 ?
                    searchResults.map(person => {
                        return (
                            <div key={"people"+person.userId} className="flex justify-between">
                                <p>{person.userName}</p>
                                <button className={buttonStyleGreenSmall} onClick={() => handleNewFriend(person.userId)} disabled={person.isFriend}>Add</button>
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