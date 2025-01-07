import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { JoinRoom } from "./pages/JoinRoom";
import { NotFound } from "./pages/NotFound";

export default function App() {
    return (
        <div className="bg-custom-1 min-h-screen">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<JoinRoom />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}