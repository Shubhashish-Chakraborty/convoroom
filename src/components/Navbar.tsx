import { Button } from "./ui/Button";
import { Github } from "../icons/Github";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-custom-2 sticky top-0 z-50 backdrop-blur-lg flex flex-col md:flex-row justify-between items-center px-4 py-4 md:px-16 md:py-8">
            {/* Logo Section */}
            <div
                className="cursor-pointer hover:-translate-y-2 transition-all duration-500"
                onClick={() => {
                    navigate('/')
                }}
            >
                <img
                    src="/convoRoomLogo.png"
                    className="w-28 md:w-36 lg:w-48"
                    alt="ConvoRoomLogo"
                />
            </div>

            {/* Github Button */}
            <div className="flex items-center gap-3 mt-4 md:mt-0">
                <div
                    onClick={() =>
                        window.open(
                            "https://github.com/Shubhashish-Chakraborty/convoroom"
                        )
                    }
                >
                    <Button variant="primary" text="Frontend" endIcon={<Github />} />
                </div>
                
                <div
                    onClick={() =>
                        window.open(
                            "https://github.com/Shubhashish-Chakraborty/convoroom-api"
                        )
                    }
                >
                    <Button variant="other" text="Server" endIcon={<Github />} />
                </div>
            </div>
        </div>
    );
};
