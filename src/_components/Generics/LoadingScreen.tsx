import { loadingPageStyle, pageLoadingSpinnerStyle } from "../../_lib/tailwindShortcuts";
import LoadingSpinner from "../../_lib/svgs/LoadingSpinner.svg?react";
import { useEffect, useState } from "react";

const LoadingScreen = () => {
    const [ellipses, setEllipses] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setEllipses(prev => prev.length < 3 ? prev + "." : "");
        }, 1000);

        return () => {
            clearInterval(interval);
        }
    }, []);

    
    return (
        <div className={loadingPageStyle}>
            <LoadingSpinner className={pageLoadingSpinnerStyle} />
            <h2>Validating User{ellipses}</h2>
        </div>
    )
};

export default LoadingScreen;