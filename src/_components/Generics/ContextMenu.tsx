import React, { useEffect, useState } from "react"

export const ContextMenu: React.FC<{children: React.ReactNode}> = ({children}) => {
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
        <div className="absolute" style={{ top: x, left: y }}>
            {children}
        </div> 
        : null;
} 

