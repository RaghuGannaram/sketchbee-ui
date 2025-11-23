import { GameProvider } from "./contexts/GameContext";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import useLocalStorage from "./hooks/useLocalStorage";
import "./App.css";

export default function App() {
    const [handle, _setHandle] = useLocalStorage<string>("sketchbee:handle", "");

    console.log("sketchbee-log: user handle, ", handle);

    return (
        <GameProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/game" element={handle ? <Game /> : <Navigate to="/" replace />} />
                </Routes>
            </Router>
        </GameProvider>
    );
}
