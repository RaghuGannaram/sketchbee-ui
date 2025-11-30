import { useStore } from "zustand";
import { stylusStore, type IStylusStore } from "../stores/stylus.store";

const useStylus = <T>(selector: (state: IStylusStore) => T): T => {
    return useStore(stylusStore, selector);
};

export default useStylus;
