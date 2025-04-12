import { loadingSpinnerStyle } from "../../_lib/tailwindShortcuts";
import LoadingSpinner from "../_lib/svgs/LoadingSpinner.svg?react";

const LoadingScreen = () => {
    return (
        <div>
            <LoadingSpinner className={loadingSpinnerStyle} />
            <h1>Validating User...</h1>
        </div>
    )
};

export default LoadingScreen;