import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { JoinRoom } from "./pages/JoinRoom";
import { NotFound } from "./pages/NotFound";

export default function App() {
    return (
        <div className="h-screen bg-custom-1">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout/>}>
                        <Route path="/" element={<JoinRoom/>}></Route>
                        <Route path="/" element={<JoinRoom/>}></Route>
                        <Route path="*" element={<NotFound/>}></Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}