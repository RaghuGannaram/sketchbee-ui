import { useStore } from "zustand";
import { RitualStore, type IRitualStore } from "../stores/ritual.store";

function useRitual<T>(selector: (state: IRitualStore) => T): T {
    return useStore(RitualStore, selector);
}

export default useRitual;