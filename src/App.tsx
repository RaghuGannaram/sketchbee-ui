import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SocketProvider } from "./contexts/SocketContext";
import Atrium from "./pages/Atrium";
import Sanctum from "./pages/Sanctum";
import useSeer from "./hooks/useSeer";
import "./App.css";

export default function App() {
    const epithet = useSeer((state) => state.epithet);

    console.log("sketchbee-log: user handle, ", epithet);

    return (
        <SocketProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Atrium />} />
                    <Route path="/sanctum" element={<Sanctum />} />
                </Routes>
            </Router>
        </SocketProvider>
    );
}
