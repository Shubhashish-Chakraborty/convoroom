import { useEffect, useState, useRef } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { EnterRoom } from "../icons/EnterRoom";
import { Redirect } from "../icons/Redirect";
import { funnyHeadings } from "./funnyHeading";
import { SERVER_URL } from "../config";
import { Room } from "./Room";
import { Navbar } from "../components/Navbar";
import { Copy } from "../icons/Copy";

export const JoinRoom = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [heading, setHeading] = useState(funnyHeadings[Math.floor(Math.random() * funnyHeadings.length)]);
    const nameRef = useRef<HTMLInputElement>(null);
    const roomIdRef = useRef<HTMLInputElement>(null);
    const [isRoomJoined, setIsRoomJoined] = useState(false); // Track if the user joined a room
    const [copyMessage, setCopyMessage] = useState("");
    const [copyMessageStatus, setCopyMessageStatus] = useState<"success" | "error" | null>(null);
    // const [username, setUsername] = useState("");
    // const [roomId, setRoomId] = useState("");

    // Connecting to the WebSocket Server:
    useEffect(() => {
        const ws = new WebSocket(SERVER_URL);

        ws.onopen = () => {
            console.log("Connected to WebSocket server");
        };

        ws.onerror = (error) => {
            console.error("WebSocket error: ", error);
        };

        ws.onclose = (event) => {
            if (event.wasClean) {
                console.log("WebSocket closed cleanly");
            } else {
                console.error("WebSocket closed with error");
            }
        };

        setSocket(ws);

        return () => {
            if (ws) {
                ws.close();
                console.log("WebSocket connection closed");
            }
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setHeading(funnyHeadings[Math.floor(Math.random() * funnyHeadings.length)]);
        }, 1800);

        return () => clearInterval(interval);
    }, []);

    // Handle Join Room Button Click
    const joinRoom = () => {
        const enteredRoomId = roomIdRef.current?.value;
        const enteredUsername = nameRef.current?.value;

        if (enteredRoomId && enteredUsername) {
            socket?.send(
                JSON.stringify({
                    type: "join",
                    payload: {
                        roomId: enteredRoomId,
                        username: enteredUsername,
                    },
                })
            );

            // Update states to indicate room joined
            // setUsername(enteredUsername);
            // setRoomId(enteredRoomId);
            setIsRoomJoined(true);
        }
    };

    const copyRoomCode = () => {
        const enteredRoomId = roomIdRef.current?.value;
        if (enteredRoomId) {
            navigator.clipboard
                .writeText(enteredRoomId)
                .then(() => {
                    setCopyMessage("Copied to clipboard, Now Share!");
                    setCopyMessageStatus("success");
                })
                .catch((err) => alert("Failed to copy text: " + err));
        } else {
            setCopyMessage("Enter a Room Code to Copy!");
            setCopyMessageStatus("error");
        }
    }

    return (
        <div className="bg-custom-1 min-h-screen flex flex-col">
            {isRoomJoined ? (
                <Room socket={socket as WebSocket} />
            ) : (
                <>
                    <Navbar /> {/* Ensure Navbar is placed correctly at the top */}
                    <div className="flex justify-center items-center flex-grow px-4 sm:px-6 md:px-10 lg:px-20">
                        <div className="bg-gray-900 text-white p-8 sm:p-12 md:p-16 lg:p-32 rounded-2xl gap-y-4 hover:-translate-y-4 cursor-pointer transition-all duration-500 shadow-lg shadow-blue-200 hover:shadow-2xl hover:shadow-emerald-200 flex flex-col items-center w-full max-w-4xl">
                            <div className="text-md font-semibold flex">
                                <div className="mr-1">Made by</div>
                                <div
                                    onClick={() => {
                                        window.open(
                                            "https://shubhhere.vercel.app"
                                        );
                                    }}
                                    className="text-blue-400 hover:underline flex"
                                >
                                    Shubhashish <Redirect />
                                </div>
                            </div>

                            <h2 className="text-2xl md:text-3xl font-bold text-center mt-4 mb-6">
                                {heading}
                            </h2>

                            <h3 className="text-emerald-300 font-bold text-lg md:text-xl mb-6">
                                Create a private room & Chat
                            </h3>

                            <div className="w-full mb-4">
                                <Input placeholder="Your Name" type="text" ref={nameRef} />
                            </div>

                            <div className="w-full mb-4">
                                <Input placeholder="Room Code" type="text" ref={roomIdRef} />

                                <div className="flex mt-2 justify-end">
                                    <Button
                                        variant="primary"
                                        text="Copy Code"
                                        endIcon={<Copy />}
                                        onClick={copyRoomCode}
                                    />

                                </div>
                                <div
                                    className={`text-center font-bold mt-2 ${copyMessageStatus === "success" ? "text-green-500" : copyMessageStatus === "error" ? "text-red-500" : ""
                                        }`}
                                >
                                    {copyMessage}
                                </div>
                            </div>

                            <div className="w-full flex justify-center">
                                <Button
                                    variant="other"
                                    text="Join Room"
                                    endIcon={<EnterRoom />}
                                    onClick={joinRoom} // Use the joinRoom function
                                />

                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>

    );
};
