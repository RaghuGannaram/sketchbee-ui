import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SocketProvider } from "./contexts/SocketContext";
import Home from "./pages/Home";
import Game from "./pages/Game";
import useSeer from "./hooks/useSeer";
import "./App.css";

export default function App() {
    const epithet = useSeer((state) => state.epithet);

    console.log("sketchbee-log: user handle, ", epithet);

    return (
        <SocketProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/game" element={<Game />} />
                </Routes>
            </Router>
        </SocketProvider>
    );
}
