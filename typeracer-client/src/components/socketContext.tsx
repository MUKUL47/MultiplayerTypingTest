import React, { useEffect, useReducer, createContext } from 'react';
import { eventEmitter, setGlobalToggleFunc, SOCKET_EVENTS} from '../utils/utils';
import io from "socket.io-client";
export const SocketContext = createContext<any>({} as any);
export default function SocketContextData(props: any) {
    const [toggle, setToggle] = useReducer(setGlobalToggleFunc, 
        {
            sendEvent: null, 
            id : null,
            room : null,
            isOwner : null,
            name : '',
            userData : {}
        }    
    );
    const value = { ...toggle, set : setToggle };
    useEffect(() => {
        const socketEvent = (io as any)("http://localhost:3001");
        SOCKET_EVENTS.forEach((event: string) => socketEvent.on(event, (params: any) => eventEmitter.next({ event: event, params: params }))) //listener
        const sendEvent = (key: string, data: any) => socketEvent.emit(key, data) //sender
        socketEvent.on('connect', () => setToggle({ sendEvent: sendEvent, id : socketEvent.id }))
    }, [])
    return (
        <SocketContext.Provider value={value}>
            {props.children}
        </SocketContext.Provider>
    )
}