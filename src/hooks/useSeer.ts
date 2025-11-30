import { useStore } from "zustand";
import { seerStore, type ISeerStore } from "../stores/seer.store";

function useSeer<T>(selector: (state: ISeerStore) => T): T {
    return useStore(seerStore, selector);
}

export default useSeer;
