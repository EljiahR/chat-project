import { loadingPageStyle, pageLoadingSpinnerStyle } from "../../_lib/tailwindShortcuts";
import LoadingSpinner from "../../_lib/svgs/LoadingSpinner.svg?react";

const LoadingScreen = () => {
    return (
        <div className={loadingPageStyle}>
            <LoadingSpinner className={pageLoadingSpinnerStyle} />
            <h2>Validating User...</h2>
        </div>
    )
};

export default LoadingScreen;