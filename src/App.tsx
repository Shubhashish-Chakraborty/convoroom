import { useEffect, useRef, useState } from "react";

export default function App() {

    const [socket , setSocket] = useState();
    const [message , setMessage] = useState([]);
    const messageRef = useRef<HTMLInputElement>(null);


    // Creating a WebSocket Connection:
    useEffect(() => {
        const ws = new WebSocket("ws://localhost:3000");
        //@ts-ignore
        setSocket(ws);
        // abhi ws.onmessage = (e) => ismei jo e hai ismei e.data mei wo saare messages aaenge jo server se aaye

        ws.onmessage = (e) => {
            //@ts-ignore
            setMessage(m => [...m , e.data])
        }
        
        // ws.onopen() //jub bhi server se connection bun jaata hai, then do this

        ws.onopen = () => {
            ws.send(JSON.stringify({
                type: "join",
                payload: {
                    name: "",
                    roomId: "r1"
                }
            }))
        }

    } , [])

    return (
        <div className="h-screen bg-custom-3 flex flex-col justify-between">
            <div className="text-white w-60 m-4 text-center">
                {message.map(message => <div className="bg-white text-black m-5 font-bold p-3 rounded-lg cursor-pointer hover:-translate-y-2 transition-all duration-500">
                    {message}
                </div>)}
            </div>

            <div className="flex justify-center mb-6 px-4">
                <div className="flex flex-col sm:flex-row items-center w-full max-w-2xl">
                    <input 
                        type="text" 
                        placeholder="Message..." 
                        className="placeholder-black p-2 w-full sm:w-3/4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                        ref={messageRef}
                    />
                    <button 
                        className="mt-3 sm:mt-0 sm:ml-3 bg-blue-300 text-black p-2 rounded-xl hover:-translate-y-1 hover:bg-blue-400 transition-all duration-300 w-full sm:w-auto"
                        onClick={() => {
                            //@ts-ignore
                            socket.send(JSON.stringify({
                                type: "chat",
                                payload: {
                                    name: "",
                                    textMessage: messageRef.current?.value
                                }
                            }))     
                        }}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
