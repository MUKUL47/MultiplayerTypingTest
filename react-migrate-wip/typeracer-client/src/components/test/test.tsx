import React, { useContext, useEffect, useReducer } from 'react';
import TestRender from './render';
import { SocketContext } from '../socketContext';
import { eventEmitter, FAILED_SOCKET_EVENTS, setGlobalToggleFunc, toastToggle } from '../../utils/utils';
import { useHistory } from 'react-router-dom';
function Test() {
    const history = useHistory();
    const socketContext = (useContext(SocketContext) as any);
    const [testData, setTestData] = useReducer(setGlobalToggleFunc, { viewReady : false, timer : -1, started : false })
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
                else if(['ROOM_LOCK_TOGGLED', 'RACE_STARTED', 'UPDATED_TYPE_PROGRESS'].includes(response.event)){
                    socketContext.set({ room : response.params.room });
                    console.log(response.params.room )
                    if(response.event === 'RACE_STARTED'){
                        setTestData({ timer : 5 })
                    }
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
    useEffect(() => {
        if(testData.timer > 0){
            setTimeout(() => setTestData({ timer : testData.timer - 1, started : testData.timer - 1 === 0 ? true : false }), 1000)
        }
    },[testData.timer])
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
    const onStartRace = () : void => {
        socketContext.sendEvent('START_RACE')
    }
    const updateProgress = (percentage : number | string) : void => {
        socketContext.sendEvent('UPDATE_TYPE_PROGRESS', { percent : percentage })
    }
    return (
        testData.viewReady ? 
            <TestRender 
                {...socketContext} 
                onExit={onExit} 
                onReadyToggle={onReadyToggle}
                onRoomLockToggle={onRoomLockToggle}
                onStartRace={onStartRace}
                updateProgress = {updateProgress}
                {...testData}
            />
        : null
    );
}
export default Test;