import React, { useReducer, createContext } from 'react';
import { setGlobalToggleFunc } from '../utils/utils';
export const GlobalContext = createContext<any>({} as any);
export default function GlobalContextData(props: any) {
    const [toggle, setToggle] = useReducer(setGlobalToggleFunc, _());
    const value = { get: toggle, set: setToggle };
    return (
        <GlobalContext.Provider value={value}>
            {props.children}
        </GlobalContext.Provider>
    )
}

function _(){
    return {
        id : Math.random()+"_"+new Date().valueOf(),
    }
}