import { useEffect, useState, useRef } from "react";
import { Button } from "../components/ui/Button";
import toast, { Toaster } from "react-hot-toast";

export const Room = ({ socket, username }: { socket: WebSocket; username: string }) => {
    const [messages, setMessages] = useState<{
        name: string;
        message: string;
        room: string;
        isYou?: boolean;
        type?: string;
        timestamp?: string;
    }[]>([]);
    // Sometimes it is okay to ts-ignore!
    //@ts-ignore
    const [roomName, setRoomName] = useState("");
    const messageInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [hasSent, setHasSent] = useState(false);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);

                if (data.type === "system") {
                    toast(data.message, {
                        icon: data.message.includes("joined") ? "👋" : "🚪",
                        position: "top-center"
                    });
                    return;
                }

                if (data.type === "chat") {
                    // Only add if we haven't already added it via optimistic update
                    if (!hasSent || data.name !== username) {
                        setMessages(prev => [...prev, {
                            ...data,
                            isYou: data.name === username
                        }]);
                    }
                    setHasSent(false);
                }
            };
        }

        return () => {
            if (socket) socket.onmessage = null;
        };
    }, [socket, username, hasSent]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = () => {
        const textMessage = messageInputRef.current?.value.trim();
        if (!textMessage) return;

        // Optimistic update
        setMessages(prev => [...prev, {
            name: username,
            message: textMessage,
            room: roomName,
            isYou: true,
            timestamp: new Date().toISOString()
        }]);
        setHasSent(true);

        socket.send(JSON.stringify({
            type: "chat",
            payload: { textMessage }
        }));

        if (messageInputRef.current) {
            messageInputRef.current.value = "";
            messageInputRef.current.focus();
        }
    };

    const leaveRoom = () => {
        socket.send(JSON.stringify({ type: "leave", payload: {} }));
        window.location.reload();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") sendMessage();
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white">
            <Toaster />
            <div className="">
                <div className="flex mt-3 justify-center">
                    <Button variant="other" text="Leave Room" onClick={leaveRoom} />
                </div>
                {roomName && (
                    <div className="flex justify-center p-4">
                        <div className="max-w-lg px-4 py-2 rounded-lg bg-gray-600 transition-all animate-bounce duration-300">
                            <div className="text-lg text-center cursor-pointer text-white font-semibold">
                                Welcome to the room <span className="text-red-500 hover:underline hover:-translate-y-2 font-bold">{roomName}</span>!
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div
                            key={`${index}-${msg.timestamp}`}
                            className={`max-w-lg px-4 py-2 rounded-lg transition-all duration-300 ${msg.isYou
                                ? "bg-blue-600 ml-auto"
                                : "bg-gray-700 mr-auto"
                                }`}
                        >
                            <div className="text-lg font-semibold text-emerald-300">
                                <span className="text-white">||</span>{" "}
                                <span>{msg.name}</span>{" "}
                                <span className="text-white">||</span>
                                {msg.isYou && <span className="ml-2 text-xs text-gray-200">(You)</span>}
                            </div>
                            <div className="mt-1 text-md font-semibold">{msg.message}</div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-400">No messages yet. Start chatting!</div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="sticky bottom-0 bg-gray-800 p-4 flex items-center">
                <input
                    type="text"
                    ref={messageInputRef}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none"
                    autoFocus
                />
                <button
                    onClick={sendMessage}
                    className="ml-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold transition-colors duration-300"
                >
                    Send
                </button>
            </div>
        </div>
    );
};