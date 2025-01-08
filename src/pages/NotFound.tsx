import { Redirect } from "../icons/Redirect";
import { useNavigate } from "react-router-dom";

export const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center bg-custom-1 min-h-screen">
            <div>
                <div className="animate-bounce cursor-pointer flex justify-center">
                    <svg
                        fill="currentColor"
                        stroke="currentColor"
                        className="h-20 w-20 md:h-40 md:w-40 text-red-500 hover:text-red-900 animate-spin transition-all duration-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                    >
                        <path d="M367.2 412.5L99.5 144.8C77.1 176.1 64 214.5 64 256c0 106 86 192 192 192c41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3C434.9 335.9 448 297.5 448 256c0-106-86-192-192-192c-41.5 0-79.9 13.1-111.2 35.5L412.5 367.2zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" />
                    </svg>
                </div>
                <div className="font-bold cursor-pointer text-4xl text-center text-red-400 mt-4">
                    Page Not Found
                </div>
                <div onClick={() => {
                    navigate('/')
                }} className="text-blue-500 hover:underline font-semibold flex justify-center mt-10 text-2xl cursor-pointer">
                    Go to HomePage <Redirect/>
                </div>
            </div>
        </div>
    );
};
