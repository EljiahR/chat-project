// Pages
export const pageBaseStyle = "h-full w-screen bg-gray-900 text-white p-5 fixed top-0 left-0 right-0 bottom-0";
export const pageSignInStyle = pageBaseStyle + " flex items-center justify-between flex-col";
export const pageChatHomeStyle = pageBaseStyle + " grid grid-rows-12 grid-cols-1 sm:grid-rows-1 sm:grid-cols-6 gap-5";
export const loadingPageStyle = pageBaseStyle + "h-full w-full flex flex-col justify-center items-center text-3xl gap-5";

// Components
export const formStyle = "flex flex-col items-stretch gap-5";
export const mobileSubMenuStyle = "visible bg-gray-600 p-5 sm:p-0 rounded-xl sm:bg-inherit absolute sm:static h-80 sm:h-auto w-90 sm:w-auto top-1/6 -translate-y-1/6 left-1/2 -translate-x-1/2 sm:translate-0";
export const draggableSubMenuStyle = "absolute sm:static top-1/6 -translate-y-1/6 left-1/2 -translate-x-1/2 sm:translate-0 visible w-90 sm:min-w-1/4 bg-gray-600 p-2 bg-light border border-2 rounded flex flex-col gap-2";
export const usersTypingStyle = "absolute top-0 left-2 left-0 bg-gray-500 rounded-t w-1/2 text-sm pl-1 z-1 transition duration-150 ease-in-out";
export const chatMessageStyle = "flex flex-col";
export const chatMessageUserStyle = "font-bold text-purple-200 flex gap-1 items-center";
export const chatMessageContentStyle = "break-all whitespace-pre-line";
export const chatMessageDateStyle = "font-light text-sm";

// Buttons
export const buttonStyleBlue = "relative text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800";
export const buttonStyleBlueSmall = "relative focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-small rounded-lg text-sm px-1 py-0.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800";
export const buttonStyleBlueDisabled = buttonStyleBlue + " cursor-not-allowed";

export const buttonStyleGreen = "relative focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800";
export const buttonStyleGreenSmall = "relative focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-small rounded-lg text-sm px-1 py-0.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800";
export const buttonStyleGreenDisabled = buttonStyleGreen + " cursor-not-allowed"

export const buttonStyleLight = "relative text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2 sm:py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700";
export const buttonStyleLightDisabled = buttonStyleLight + " cursor-not-allowed"; 

export const buttonStyleRed = "relative focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900";
export const buttonStyleRedSmall = "relative focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium text-xsm px-1 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900";

export const notificationBubble = "absolute inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-blue-500 border-2 border-white rounded-full -top-1 -end-1 dark:border-gray-900 notification-bubble";

// Inputs
export const textInputStyle = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block mw-60 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
export const textInputErrorStyle = "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500";
export const inputLabelStyle = "flex gap-2 items-center justify-between";
export const signInErrorStyle = "text-sm text-center text-red-300";

// Loading elements
export const loadingSpinnerStyle = "inline w-4 h-4 me-3 text-white animate-spin";
export const pageLoadingSpinnerStyle = "inline w-8 h-8 me-3 text-white animate-spin";
