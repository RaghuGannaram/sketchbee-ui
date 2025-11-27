import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { GameProvider } from "./contexts/GameContext";
import Home from "./pages/Home";
import Game from "./pages/Game";
import useLocalStorage from "./hooks/useLocalStorage";
import useSocket from "./hooks/useSocket";
import "./App.css";

export default function App() {
    const [userHandle, _setUserHandle] = useLocalStorage<string>("sketchbee:handle", "");
    const { emit } = useSocket();

    useEffect(() => {
        emit("greet", { greeting: "Hello server..!" }, (response: any) => {
            console.log(`sketchbee-log: server greeted at ${response.serverTime} :`, response.greeting);
        });
    }, []);

    console.log("sketchbee-log: user handle, ", userHandle);

    return (
        <GameProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/game" element={userHandle ? <Game /> : <Navigate to="/" replace />} />
                </Routes>
            </Router>
        </GameProvider>
    );
}
