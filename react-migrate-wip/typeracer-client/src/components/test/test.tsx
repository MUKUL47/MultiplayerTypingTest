import React, { useContext, useEffect, useReducer } from 'react';
import TestRender from './render';
import { SocketContext } from '../socketContext';
import { eventEmitter, FAILED_SOCKET_EVENTS, setGlobalToggleFunc, toastToggle } from '../../utils/utils';
import { useHistory } from 'react-router-dom';
function Test() {
    const history = useHistory();
    const socketContext = (useContext(SocketContext) as any);
    const [testData, setTestData] = useReducer(setGlobalToggleFunc, { viewReady : false })
    useEffect(() => {
        let unsub : any;
        if(socketContext.room){
            setTestData({ viewReady : true });
            unsub = eventEmitter.subscribe(response => {
                if(['READY_TOGGLED', 'ROOM_RESPONSE', 'ENTERED_ROOM'].includes(response.event)){
                    socketContext.set({ 
                        room : response.params.room, 
                        isOwner : response.params.room.owner === socketContext.name,
                        userData : response.params.room.participants.find((p : any) => p.name === socketContext.name)
                    });
                    if(response.params.message) toastToggle.next(response.params.message)
                }
                else if('ROOM_LOCK_TOGGLED' === response.event){
                    socketContext.set({ room : {...socketContext.room, locked : response.params.room.locked} });
                }
                else if(FAILED_SOCKET_EVENTS.includes(response.event)){
                    toastToggle.next(response.params.error)
                }
            })
        }else{
            history.push('/')
        }
        return () => unsub?.unsubscribe();
    },[]);
    const onExit = () : void => {
        history.push('/')
        socketContext.set({room : null})        
        socketContext.sendEvent('LEAVE_ROOM')
    }
    const onRoomLockToggle = () : void => {
        socketContext.sendEvent('ROOM_LOCK_TOGGLE')
    }
    const onReadyToggle = () : void => {
        socketContext.sendEvent('READY_TOGGLE')
    }
    return (
        testData.viewReady ? 
            <TestRender 
                {...socketContext} 
                onExit={onExit} 
                onReadyToggle={onReadyToggle}
                onRoomLockToggle={onRoomLockToggle}
            />
        : null
    );
}
export default Test;