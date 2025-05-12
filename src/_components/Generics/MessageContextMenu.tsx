import { useEffect, useState } from "react"

export const MessageContextMenu = (xPos: string, yPos: string) => {
    const [showMenu, setShowMenu] = useState(false);
    const [x, setX] = useState("0px");
    const [y, setY] = useState("0px");

    useEffect(() => {

        document.addEventListener("click", handleClick);
        document.addEventListener("contextmenu", (e) => handleContextMenu(e));

        return () => {
            document.removeEventListener("click", handleClick);
            document.removeEventListener("contextmenu", (e) => handleContextMenu(e));
        };
    }, []);

    const handleClick = () => {};

    const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();

        setX(`${e.pageX}px`);
        setY(`${e.pageY}px`);
        setShowMenu(true);
    };
    
    return showMenu ? 
        <ul className="absolute" style={{ top: xPos, left: yPos }}>
            <li>Delete</li>
        </ul> 
        : null;
} 