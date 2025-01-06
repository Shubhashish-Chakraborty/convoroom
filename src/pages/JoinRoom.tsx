import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { EnterRoom } from "../icons/EnterRoom";
import { Redirect } from "../icons/Redirect";

import { funnyHeadings } from "./funnyHeading";

export const JoinRoom = () => {
    
    const [heading, setHeading] = useState(funnyHeadings[Math.floor(Math.random() * funnyHeadings.length)]);

    useEffect(() => {
        const interval = setInterval(() => {
            setHeading(funnyHeadings[Math.floor(Math.random() * funnyHeadings.length)]);
        }, 1800);

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    return (
        <div className="flex justify-center mt-10 bg-custom-1 px-4 sm:px-6 md:px-10 lg:px-20">
            <div className="bg-gray-900 text-white p-8 sm:p-12 md:p-16 lg:p-32 rounded-2xl gap-y-4 hover:-translate-y-4 cursor-pointer transition-all duration-500 shadow-lg shadow-blue-200 hover:shadow-2xl hover:shadow-emerald-200 flex flex-col items-center w-full max-w-4xl">
                
                <div className="text-md font-semibold flex">
                    <div className="mr-1">
                        Made by
                    </div>
                    <div onClick={() => {window.open("https://github.com/Shubhashish-Chakraborty")}} className="text-blue-400 hover:underline flex">
                        Shubhashish <Redirect/> 
                    </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-center mt-4 mb-6">
                    {heading}                
                </h2>

                <h3 className="text-emerald-300 font-bold text-lg md:text-xl mb-6">
                    Create a private room & Chat
                </h3>

                <div className="w-full mb-4">
                    <Input
                        placeholder="Your Name"
                        type="text"
                    />
                </div>

                <div className="w-full mb-4">
                    <Input
                        placeholder="Room Code"
                        type="text"
                    />
                </div>
                
                <div className="w-full flex justify-center">
                    <Button
                        variant="other"
                        text="Join Room"
                        endIcon={<EnterRoom />}
                    />
                </div>
            </div>
        </div>
    );
};
