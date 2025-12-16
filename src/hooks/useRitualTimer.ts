import { useState, useEffect } from "react";
import useRitual from "./useRitual";

const useRitualTimer = () => {
    const terminus = useRitual((state) => state.terminus);
    const [secondsLeft, setSecondsLeft] = useState<number>(0);

    useEffect(() => {
        if (!terminus) {
            setSecondsLeft(0);
            return;
        }

        const calculateTime = () => {
            const now = Date.now();
            const diff = Math.ceil((terminus - now) / 1000);
            return Math.max(0, diff);
        };

        setSecondsLeft(calculateTime());

        const intervalId = setInterval(() => {
            const remaining = calculateTime();
            setSecondsLeft(remaining);

            if (remaining <= 0) {
                clearInterval(intervalId);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [terminus]);

    return secondsLeft;
};

export default useRitualTimer;
