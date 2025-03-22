// Pages
export const pageBaseStyle = "h-screen w-screen bg-gray-900 text-white p-5";
export const pageSignInStyle = pageBaseStyle + " flex items-center justify-center flex-col";
export const pageChatHomeStyle = pageBaseStyle + " grid grid-rows-12 sm:grid-rows-1 sm:grid-cols-4 gap-5";

// Components
export const formStyle = "flex flex-col items-center gap-5";
export const subMenuStyle = "visible mx-auto bg-red-500 fixed h-80 w-90";

// Buttons
export const buttonStyleBlue = "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800";
export const buttonStyleBlueDisabled = buttonStyleBlue + " cursor-not-allowed";
export const buttonStyleGreen = "focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800";
export const buttonStyleGreenDisabled = buttonStyleGreen + " cursor-not-allowed"
export const buttonStyleLight = "text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700";
export const buttonStyleLightDisabled = buttonStyleLight + " cursor-not-allowed"; 
export const buttonStyleRed = "focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900";

// Inputs
export const textInputStyle = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
export const inputLabelStyle = "flex gap-2 items-center justify-center";

// Loading elements
export const loadingSpinnerStyle = "inline w-4 h-4 me-3 text-white animate-spin";
