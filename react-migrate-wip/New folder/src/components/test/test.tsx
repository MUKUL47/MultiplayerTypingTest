import React, { useContext, useEffect, useReducer } from 'react';
import TestRender from './render';
import { SocketContext } from '../socketContext';
import { eventEmitter, FAILED_SOCKET_EVENTS, setGlobalToggleFunc, toastToggle } from '../../utils/utils';
import { useHistory } from 'react-router-dom';
function Test() {
    const history = useHistory();
    const socketContext = (useContext(SocketContext) as any);
    const [testData, setTestData] = useReducer(setGlobalToggleFunc, { viewReady : false })
    useEffect(()=>{
        let unsub : any;
        if(socketContext.get.room){
            console.log(socketContext.get)
            setTestData({ viewReady : true });
            unsub = eventEmitter.subscribe(response => {
                if(response.event === 'ROOM_RESPONSE' || response.event === 'ENTERED_ROOM' || response.event === 'READY_TOGGLED'){
                    console.log(response.params.room.owner , socketContext.get.name)
                    socketContext.set({ room : response.params.room, isOwner : response.params.room.owner === socketContext.get.name});
                    if(response.params.message){
                        toastToggle.next(response.params.message)
                    }
                }
                else if(FAILED_SOCKET_EVENTS.find(e => e === response.event)){
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
        socketContext.get.sendEvent('LEAVE_ROOM')
    }
    const onReadyToggle = () : void => {
        socketContext.get.sendEvent('READY_TOGGLE')
    }
    return (
        testData.viewReady ? 
        <TestRender {...socketContext.get} onExit={onExit} onReadyToggle={onReadyToggle}/>
        : null
    );
}
export default Test;