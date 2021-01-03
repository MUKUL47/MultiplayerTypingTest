import React, { useContext, useEffect, useState } from 'react';
import HomeRender from './render';
import './home.scss'
import { SocketContext } from '../socketContext';
import { DEFAULT_PARAGRAPH, eventEmitter, FAILED_SOCKET_EVENTS, toastToggle } from '../../utils/utils';
import { useHistory } from 'react-router-dom';
function Home() {
    const history = useHistory();
    const socketContext = (useContext(SocketContext) as any);
    useEffect(() => {
        if(socketContext.sendEvent){
            const unsub = eventEmitter.subscribe(response => {
                if(['ENTERED_ROOM', 'CREATED_ROOM'].includes(response.event)){
                    console.log(response)
                    socketContext.set({ room : response.params.room, isOwner : response.event === 'CREATED_ROOM'});
                    initializeUser(response)
                    history.push('/test')
                    if(response.event === 'CREATED_ROOM') toastToggle.next(response.params.message)
                }
                else if(FAILED_SOCKET_EVENTS.includes(response.event)){
                    toastToggle.next(response.params.error)
                }
            })
            return () => unsub?.unsubscribe();
        }
    },[socketContext])
    const initializeUser = (response : any) : void => {
        let userResp = response.params.room.participants.find((p : any) => p.name === socketContext.name);;
        socketContext.set({ room : response.params.room, isOwner : response.event === 'CREATED_ROOM', userData : userResp});
    }
    const onCreate = (data : any) : void => {
        socketContext.set({  name :  data.name });
        socketContext.sendEvent('CREATE_ROOM', { roomName : data.roomName, user : data.name, paragraph : data.customParagraph, maxParticipants : data.maxParticipants })
    }
    const onEnter = (data : any) : void => {
        socketContext.set({  name :  data.name });
        socketContext.sendEvent('ENTER_ROOM', { roomName : data.roomName, user : data.name })
    }
    return (
        <>
        <button onClick={() => {socketContext.sendEvent('RESET')}}>RESET</button>
        <HomeRender onCreate={onCreate} onEnter={onEnter}/>
        </>
    );
}
export default Home;