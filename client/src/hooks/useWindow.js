import {React, useState, useEffect} from "react";

function useWindowSize() {
    const isSSR = typeof window !== "undefined";
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    function changeWindowSize() {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }

    useEffect(() => {
        window.addEventListener("resize", changeWindowSize);
        changeWindowSize()
        return () => {
            window.removeEventListener("resize", changeWindowSize);
        };
    }, []);

    return windowSize;

}

export default useWindowSize