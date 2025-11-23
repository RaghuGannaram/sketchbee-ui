import { create } from "zustand";

interface UserState {
    username: string;
    setUsername: (username: string) => void;
}

interface GameState {
    currentDrawer: string;
    guessedUsers: string[];
    setCurrentDrawer: (drawer: string) => void;
    addGuessedUser: (user: string) => void;
}

interface WebSocketState {
    events: string[];
    addEvent: (event: string) => void;
}

const useGameStore = create<UserState & GameState & WebSocketState>((set) => ({
    // User State
    username: "",
    setUsername: (username: string) => set(() => ({ username })),

    // Game State
    currentDrawer: "",
    guessedUsers: [],
    setCurrentDrawer: (drawer: string) => set(() => ({ currentDrawer: drawer })),
    addGuessedUser: (user: string) => set((state) => ({ guessedUsers: [...state.guessedUsers, user] })),

    // WebSocket State
    events: [],
    addEvent: (event: string) => set((state) => ({ events: [...state.events, event] })),
}));

export default useGameStore;
