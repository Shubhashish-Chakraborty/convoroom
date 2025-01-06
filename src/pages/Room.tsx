import { useEffect, useRef, useState } from "react";

export const Room = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const messageRef = useRef<HTMLInputElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Creating a WebSocket Connection
    useEffect(() => {
        const ws = new WebSocket("ws://localhost:3000");
        setSocket(ws);

        ws.onmessage = (e) => {
            setMessages((prev) => [...prev, e.data]);
        };

        ws.onopen = () => {
            ws.send(
                JSON.stringify({
                    type: "join",
                    payload: {
                        name: "",
                        roomId: "r1",
                    },
                })
            );
        };

        return () => {
            ws.close();
        };
    }, []);

    // Scroll to the latest message
    useEffect(() => {
        chatContainerRef.current?.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);

    return (
        <div className="h-screen bg-gray-900 flex flex-col">
            {/* Header */}
            <div className="text-white text-center font-bold text-2xl py-4 border-b border-gray-700">
                Chat Room
            </div>

            {/* Chat Messages */}
            <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto px-4 py-6 bg-gray-800"
            >
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className="bg-blue-500 text-white p-3 rounded-lg max-w-md mb-4 shadow-lg w-fit hover:scale-105 transition-transform"
                    >
                        {message}
                    </div>
                ))}
            </div>

            {/* Input Section */}
            <div className="bg-gray-800 p-4 border-t border-gray-700">
                <div className="flex items-center space-x-3">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 p-3 rounded-xl border border-gray-600 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ref={messageRef}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-all"
                        onClick={() => {
                            if (messageRef.current?.value.trim()) {
                                socket?.send(
                                    JSON.stringify({
                                        type: "chat",
                                        payload: {
                                            name: "",
                                            textMessage: messageRef.current?.value,
                                        },
                                    })
                                );
                                messageRef.current.value = ""; // Clear input
                            }
                        }}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
