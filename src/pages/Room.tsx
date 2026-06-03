import { useEffect, useState, useRef } from "react";
import { Button } from "../components/ui/Button";
import { Copy } from "../icons/Copy";
import toast, { Toaster } from "react-hot-toast";

interface Message {
    name: string;
    message: string;
    room: string;
    isYou?: boolean;
    type?: string;
    timestamp?: string;
}

export const Room = ({ socket, username, roomId }: { socket: WebSocket; username: string; roomId: string }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [users, setUsers] = useState<string[]>([]);
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
                        position: "top-right",
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    });
                    return;
                }

                if (data.type === "userList") {
                    setUsers(data.users);
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
            room: roomId,
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

    const copyRoomId = () => {
        navigator.clipboard.writeText(roomId);
        toast.success("Room ID copied to clipboard!", {
            position: "top-center",
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        });
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white overflow-hidden font-sans">
            <Toaster />
            
            {/* Sidebar - Participants */}
            <div className="hidden md:flex flex-col w-64 bg-gray-800 border-r border-gray-700 shadow-xl">
                <div className="p-6 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-emerald-400 flex items-center">
                        <span className="mr-2">👥</span> Participants
                    </h2>
                    <p className="text-xs text-gray-400 mt-2 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
                        {users.length} members online
                    </p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {users.map((user, idx) => (
                        <div key={idx} className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${user === username ? 'bg-gray-700/50 border border-gray-600' : 'hover:bg-gray-700/30'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${user === username ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'}`}>
                                {user.charAt(0).toUpperCase()}
                            </div>
                            <span className={`font-medium truncate ${user === username ? 'text-white' : 'text-gray-300'}`}>
                                {user} {user === username && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded ml-1 uppercase">You</span>}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="p-4 bg-gray-800/50 border-t border-gray-700">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">ConvoRoom v1.0</div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-gray-900 relative">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-10 shadow-sm">
                    <div className="flex items-center space-x-4">
                        <div className="md:hidden w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center font-extrabold text-gray-900 shadow-lg shadow-emerald-500/20">
                            CR
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h1 className="text-lg font-bold tracking-tight">Room: <span className="text-blue-400">{roomId}</span></h1>
                                <button 
                                    onClick={copyRoomId} 
                                    className="p-1.5 hover:bg-gray-700 rounded-lg transition-all text-gray-400 hover:text-white" 
                                    title="Copy Room ID"
                                >
                                    <Copy />
                                </button>
                            </div>
                            <div className="text-xs text-emerald-400 md:hidden flex items-center">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
                                {users.length} online
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button variant="other" text="Leave Room" onClick={leaveRoom} />
                    </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
                    {messages.length > 0 ? (
                        messages.map((msg, index) => (
                            <div
                                key={`${index}-${msg.timestamp}`}
                                className={`flex flex-col ${msg.isYou ? "items-end" : "items-start"} transition-all duration-300`}
                            >
                                <div className={`flex items-center space-x-2 mb-1.5 ${msg.isYou ? "flex-row-reverse space-x-reverse" : "flex-row"}`}>
                                    <span className="text-xs font-bold text-gray-400 px-1">
                                        {msg.isYou ? "You" : msg.name}
                                    </span>
                                    <span className="text-[10px] text-gray-500">
                                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                    </span>
                                </div>
                                <div
                                    className={`max-w-[85%] md:max-w-lg px-4 py-3 rounded-2xl shadow-lg transition-all transform hover:scale-[1.01] ${
                                        msg.isYou
                                            ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none border border-blue-500/30"
                                            : "bg-gray-800 text-gray-100 rounded-tl-none border border-gray-700"
                                    }`}
                                >
                                    <div className="text-sm md:text-base leading-relaxed break-words whitespace-pre-wrap">{msg.message}</div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-6">
                            <div className="w-24 h-24 bg-gray-800/80 rounded-full flex items-center justify-center text-5xl shadow-inner border border-gray-700 animate-bounce">
                                💬
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-xl font-bold text-gray-300">Quiet in here...</p>
                                <p className="text-sm italic text-gray-400">Be the first to break the silence!</p>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Section */}
                <div className="p-4 md:p-6 bg-gray-800/30 backdrop-blur-sm border-t border-gray-700">
                    <div className="max-w-5xl mx-auto flex items-center space-x-3 bg-gray-800 border border-gray-700 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500/50 transition-all shadow-2xl">
                        <input
                            type="text"
                            ref={messageInputRef}
                            onKeyDown={handleKeyDown}
                            placeholder={`Message in #${roomId}...`}
                            className="flex-1 bg-transparent border-none focus:outline-none text-white px-4 py-2 text-sm md:text-base"
                            autoFocus
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!messageInputRef.current?.value.trim()}
                            className="p-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl text-white transition-all transform active:scale-90 flex items-center justify-center shadow-lg shadow-blue-600/20"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                        </button>
                    </div>
                    <div className="max-w-5xl mx-auto mt-2 px-2 flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-tighter font-bold">
                        <span>Press Enter to send</span>
                        <span className="flex items-center"><span className="w-1 h-1 bg-emerald-500 rounded-full mr-1"></span> End-to-end connected</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
