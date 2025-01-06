import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { JoinRoom } from "./pages/JoinRoom";
import { NotFound } from "./pages/NotFound";
import { Room } from "./pages/Room";

export default function App() {
    return (
        <div className="bg-custom-1 min-h-screen">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<JoinRoom />} />
                        <Route
                            path="/room"
                            element={
                                // Check if the user has joined a room, otherwise redirect to JoinRoom
                                localStorage.getItem("roomJoined") === "true" ? <Room /> : <Navigate to="/" />
                            }
                        />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}
