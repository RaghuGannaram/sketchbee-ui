import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
        emit("sys:greet", { greeting: "Hello server..!" }, (response: any) => {
            console.log(`sketchbee-log: server greeted at ___${new Date(response.serverTime)}___ :`, response.greeting);
        });
    }, []);

    console.log("sketchbee-log: user handle, ", userHandle);

    return (
        <GameProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/game" element={<Game />} />
                </Routes>
            </Router>
        </GameProvider>
    );
}
