import { useStore } from "zustand";
import { ritualStore, type IRitualStore } from "../stores/ritual.store";

function useRitual<T>(selector: (state: IRitualStore) => T): T {
    return useStore(ritualStore, selector);
}

export default useRitual;