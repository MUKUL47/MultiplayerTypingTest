import React, { useContext, useEffect, useState } from 'react';
import HomeRender from './render';
import './home.scss'
import { SocketContext } from '../socketContext';
import { eventEmitter, FAILED_SOCKET_EVENTS, toastToggle } from '../../utils/utils';
import { useHistory } from 'react-router-dom';
function Home() {
    const history = useHistory();
    const socketContext = (useContext(SocketContext) as any);
    useEffect(() => {
        //CREATED_ROOM ENTERED_ROOM
        console.log('homeevents')
        const unsub = eventEmitter.subscribe(response => {
            console.log('HOME EVENTS-',response)
            if(response.event === 'CREATED_ROOM' || response.event === 'ENTERED_ROOM'){
                socketContext.set({ room : response.params.room, isOwner : response.event === 'CREATED_ROOM'});
                history.push('/test')
                if(response.event === 'CREATED_ROOM'){
                    toastToggle.next(response.params.message)
                }
            }
            else if(FAILED_SOCKET_EVENTS.includes(response.event)){
                toastToggle.next(response.params.error)
            }
        })
        return () => unsub?.unsubscribe();
    },[])
    const onCreate = (data : any) : void => {
        console.log(data)
        socketContext.set({  name :  data.name });
        socketContext.get.sendEvent('CREATE_ROOM', { roomName : data.roomName, user : data.name })
    }
    const onEnter = (data : any) : void => {
        socketContext.set({  name :  data.name });
        socketContext.get.sendEvent('ENTER_ROOM', { roomName : data.roomName, user : data.name })
    }
    return (
        <>
        <button onClick={() => {socketContext.get.sendEvent('RESET')}}>RESET</button>
        <HomeRender onCreate={onCreate} onEnter={onEnter}/>
        </>
    );
}
export default Home;