import { useEffect, useState, useRef } from "react";
import { Button } from "../components/ui/Button";

export const Room = ({ socket }: { socket: WebSocket }) => {
    const [messages, setMessages] = useState<{ name: string; message: string, room: string }[]>([]);
    const messageInputRef = useRef<HTMLInputElement>(null);

    // Listen for incoming messages from the WebSocket
    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.message && data.name) {
                    setMessages((prevMessages) => [...prevMessages, data]);
                }
            };
        }
    }, [socket]);

    // Handle sending a message
    const sendMessage = () => {
        const textMessage = messageInputRef.current?.value;

        if (textMessage) {
            socket.send(
                JSON.stringify({
                    type: "chat",
                    payload: {
                        textMessage,
                    },
                })
            );

            // Add "You" message to the state
            // setMessages((prevMessages) => [
            //     ...prevMessages,
            //     { name: "You", message: textMessage },
            // ]);

            messageInputRef.current.value = ""; // Clear the input after sending
        }
    };

    // Trigger sendMessage on Enter key press
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white">
            <div className="">
                <div className="flex mt-3 justify-center">
                    <Button variant="other" text="Leave Room" onClick={() => {window.location.reload()}}/>
                </div>

                <div className="flex justify-center p-4">
                    {messages.length > 0 && messages[0]?.room && (
                        <div className="max-w-lg px-4 py-2 rounded-lg bg-gray-600 transition-all animate-bounce duration-300">
                            <div className="text-lg text-center cursor-pointer text-white font-semibold">
                                Welcome to the room <span className="text-red-500 hover:underline hover:-translate-y-2 font-bold">{messages[0].room} </span> !
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Messages Section */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`max-w-lg px-4 py-2 rounded-lg hover:-translate-y-2 transition-all duration-300 ${msg.name === "You" ? "bg-blue-600 self-end" : "bg-gray-700"
                                }`}
                            style={{
                                alignSelf: msg.name === "You" ? "flex-end" : "flex-start",
                            }}
                        >
                            <div className="text-lg cursor-pointer font-semibold text-emerald-300"> <span className="text-white">||</span> <span className="hover:underline">{msg.name}</span> <span className="text-white">||</span></div>
                            <div className="mt-1 cursor-pointer text-md font-semibold">{msg.message}</div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-400">No messages yet. Start chatting!</div>
                )}
            </div>

            {/* Input Section */}
            <div className="sticky bottom-0 bg-gray-800 p-4 flex items-center">
                <input
                    type="text"
                    ref={messageInputRef}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none"
                />
                <button
                    onClick={sendMessage}
                    className="ml-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white"
                >
                    Send
                </button>
            </div>
        </div>
    );
};
