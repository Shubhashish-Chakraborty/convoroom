import { useEffect, useState, useRef } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { EnterRoom } from "../icons/EnterRoom";
import { Redirect } from "../icons/Redirect";
import { Navbar } from "../components/Navbar";
import { Copy } from "../icons/Copy";
import { SERVER_URL } from "../config";
import { funnyHeadings } from "./funnyHeading";
import { Room } from "./Room";

export const JoinRoom = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [displayedText, setDisplayedText] = useState("");
    const [index, setIndex] = useState(0);
    const nameRef = useRef<HTMLInputElement>(null);
    const roomIdRef = useRef<HTMLInputElement>(null);
    const [isRoomJoined, setIsRoomJoined] = useState(false);
    const [copyMessage, setCopyMessage] = useState("");
    const [copyMessageStatus, setCopyMessageStatus] = useState<"success" | "error" | null>(null);
    const [username, setUsername] = useState("");

    // Connecting to WebSocket Server:
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

    // Typing Effect for Headings
    useEffect(() => {
        let charIndex = 0;
        const currentText = funnyHeadings[index];

        setDisplayedText(""); // Reset text before animation starts

        const timeout = setTimeout(() => {
            const interval = setInterval(() => {
                if (charIndex < currentText.length) {
                    setDisplayedText((prev) => prev + currentText.charAt(charIndex));
                    charIndex++;
                } else {
                    clearInterval(interval);
                    setTimeout(() => {
                        setIndex((prevIndex) => (prevIndex + 1) % funnyHeadings.length);
                    }, 2000);
                }
            }, 100);

            return () => clearInterval(interval);
        }, 50);

        return () => clearTimeout(timeout);
    }, [index]);

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
    };

    return (
        <div className="bg-custom-1 min-h-screen flex flex-col">
            {isRoomJoined ? (
                <Room socket={socket as WebSocket} username={username} />
            ) : (
                <>
                    <Navbar />
                    <div className="flex justify-center items-center flex-grow px-4 sm:px-6 md:px-10 lg:px-20">
                        <div className="bg-gray-900 text-white p-8 sm:p-12 md:p-16 lg:p-32 rounded-2xl gap-y-4 hover:-translate-y-4 cursor-pointer transition-all duration-500 shadow-lg shadow-blue-200 hover:shadow-2xl hover:shadow-emerald-200 flex flex-col items-center w-full max-w-4xl">
                            <div className="text-md font-semibold flex">
                                <div className="mr-1">Made by</div>
                                <div
                                    onClick={() => {
                                        window.open("https://imshubh.site");
                                    }}
                                    className="text-blue-400 hover:underline flex"
                                >
                                    Shubhashish <Redirect />
                                </div>
                            </div>

                            <h2 className="text-2xl md:text-3xl font-bold text-center mt-4 mb-6">
                                {displayedText}
                            </h2>

                            <h3 className="text-emerald-300 font-bold text-lg md:text-xl mb-6">
                                Create a private room & Chat
                            </h3>

                            <div className="w-full mb-4">
                                <Input placeholder="Your Name" type="text" ref={nameRef} onChange={(e) => setUsername(e.target.value)} />
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
                                    className={`text-center font-bold mt-2 ${copyMessageStatus === "success"
                                            ? "text-green-500"
                                            : copyMessageStatus === "error"
                                                ? "text-red-500"
                                                : ""
                                        }`}
                                >
                                    {copyMessage}
                                </div>
                            </div>

                            <div className="w-full flex justify-center">
                                <Button variant="other" text="Join Room" endIcon={<EnterRoom />} onClick={joinRoom} />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};