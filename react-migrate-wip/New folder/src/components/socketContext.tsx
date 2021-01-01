import React, { useEffect, useReducer, createContext } from 'react';
import { eventEmitter, setGlobalToggleFunc, SOCKET_EVENTS} from '../utils/utils';
import io from "socket.io-client";
export const SocketContext = createContext<any>({} as any);
let currentSocket : any;
export default function SocketContextData(props: any) {
    const [toggle, setToggle] = useReducer(setGlobalToggleFunc, _());
    const value = { get : toggle, set : setToggle };
    useEffect(() => {
        const socketEvent = (io as any)("http://localhost:3001");
        currentSocket = socketEvent;
        SOCKET_EVENTS.forEach((event: string) => socketEvent.on(event, (params: any) => {
            eventEmitter.next({ event: event, params: params })
        })) //listener
        const sendEvent = (key: string, data: any) => socketEvent.emit(key, {...data, id : toggle.id}) //sender
        setToggle({ sendEvent: sendEvent });
        console.log('events',socketEvent)
    }, [])
    return (
        <SocketContext.Provider value={value}>
            {props.children}
        </SocketContext.Provider>
    )
}

function _(){
    return {
        sendEvent: null, 
        id : Math.random()+"-"+new Date().valueOf(),
        room : null,
        isOwner : null,
        name : '',
        disconnect : () => currentSocket.disconnect()
    }
}