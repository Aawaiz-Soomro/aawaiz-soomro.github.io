import { createContext, useContext } from "react";

/** True once the opening sequence has finished and the page may animate in. */
export const ReadyContext = createContext(true);
export const useReady = () => useContext(ReadyContext);
