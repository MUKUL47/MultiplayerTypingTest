import React, { createRef, useEffect, useReducer, useState } from 'react';
import { setGlobalToggleFunc } from '../../utils/utils';
import './test.scss'
// const para = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis quae doloremque porro in ab neque architecto tenetur repudiandae quidem assumenda minima commodi eius praesentium, laborum, quisquam sed nisi mollitia. Velit'.split(' ');
function TestRender(props : any) {
    const { isOwner, room, name, onExit, onReadyToggle, userData, onRoomLockToggle, onStartRace, timer, started, updateProgress } = props;
    const [roomData, setRoomData] = useReducer(setGlobalToggleFunc, 
        { paraIdx : 0, typeTarget : '', typeValue : '', para : [], inpFocus : createRef()}
    )
    const [paraInnerHtml ,setParaInnerHtml] = useState<string>('')
    useEffect(() => {
        setRoomData({ para : room.parargraph.split(' ') })
    },[])
    useEffect(()=>{
        // console.log('room123 2',room)
        if(roomData.para.length > 0){
            const para = roomData.para;
            const t = [...para].splice(roomData.paraIdx, 1).join(' ');
            setRoomData({ typeTarget : t})
            const innerhtml = `
            ${[...para].splice(0, roomData.paraIdx).length > 0 ? `<h3>${[...para].splice(0, roomData.paraIdx).join(' ')}</h3>` : ''}
            ${[...para].splice(roomData.paraIdx,1).length > 0 ?  `<h3 id='active'>${t}</h3>` : ''}
            ${[...para].splice(roomData.paraIdx+1).length > 0 ?  `<h3>${[...para].splice(roomData.paraIdx+1).join(' ')}</h3>` : ''}
            `;
            setParaInnerHtml(innerhtml)
            if(started){
                updateProgress(((roomData.paraIdx/para.length) * 100).toFixed(1))
            }
        }
    },[roomData.paraIdx, roomData.para])
    useEffect(() => {
        if(started){
            roomData.inpFocus.current.focus()
        }
    },[started])
    const onParaChange = (e : any) : void => {
        if(!started) return
        const v = e.target.value;
        setRoomData({ typeValue : v })
        if(v === `${roomData.typeTarget} `){
            setRoomData({ paraIdx : roomData.paraIdx+1, typeValue : '' })
        }
    }
    const participants = room?.participants?.length || 1;
    const { globalMessage, usersReady } = getGlobalMessage();
    const { adminBtnMessage } = getAdminBtn();
    return (
        <div className="test">
            <div className="test-nav">
                <div className="exit" onClick={onExit}>
                    <i className="fas fa-door-open icon"></i>
                    <span><p>Leave</p></span>
                </div>
                <div className="room-name">
                    {room.roomName || '...'}
                </div>
                <div className="lock-togle">
                    {
                        isOwner ? 
                        <div onClick={onRoomLockToggle} className="lock-toggle-btn">
                            <>
                                {
                                    room.locked ?
                                    <>Unlock Room</>:
                                    <>Lock Room</> 
                                }
                            </>
                        </div> : 
                        <p>Room is { room.locked ? 'locked' : 'open' }</p>
                    }
                </div>
            </div>
            <div className="socket-message">
                    {
                        participants > 1 ?
                        <>
                        {
                            isOwner && usersReady && !room.started? 
                            <div className="admin-options">
                                <button className="start-race" onClick={onStartRace}> {adminBtnMessage} </button>
                            </div>: null
                        }
                        <div className={isOwner ? 'global-messages' : 'global-messages g-m-t'}>
                            {globalMessage}
                        </div>
                    </>
                        :null
                    }
                </div>
            <div className="room-activity">
                <div className="progress">
                    <div className="participant-nav">
                        <div className="info">
                            <i className="fas fa-users icon"></i>
                            <span><p>Participants ({participants})</p></span>
                        </div>
                        <div className="action">
                            { participants > 1 && !started ? <button onClick={onReadyToggle}>{userData.isReady ? 'Not Ready' : "Ready"}</button> : null }
                        </div>
                    </div>
                    <div className="progress-users">
                        { 
                            room['participants'].map((participant : any, i :number) => {
                                return <div className="p-user" key={i}>
                                        <div className="room-admin">
                                            { room.owner === participant.name ? <i className="fas fa-user-cog"></i>: <i className="fas fa-user icon"></i> }
                                        </div>
                                        <div className={ participant.name === name ? 'p-name p-name-me' : 'p-name' } style={{ flexGrow : room.started ? 1 : 0 }}>
                                            {participant.name === name ? 'You' : participant.name}
                                        </div>
                                        {
                                            room.started?
                                            <div className="race-started">
                                                <div className="p-status">
                                                    <div className="progress-data" id="progress-data" style={{ width : `${participant.progress}%` }}></div>
                                                </div>
                                                <div className="p-data">
                                                    <p className="percent">
                                                        {participant.progress}%
                                                    </p>
                                                    {
                                                        Number(participant.progress).toFixed() === '100' ? 
                                                        <div className="position">{getPos(i+1)}</div> :
                                                        null
                                                    }
                                                </div>
                                            </div> :
                                            <div className="p-progress"> {participant.isReady ? ' Ready' : ' Not Ready'} </div>
                                        }
                                    </div>
                            })
                        }
                    </div>
                </div>
                <div className="typing-playground">
                    <div className="paragraph-detail">
                        <i className="fas fa-keyboard icon"></i>
                        <span><p>Paragraph</p></span>
                    </div>
                    <div className="paragraph" dangerouslySetInnerHTML={ { __html : paraInnerHtml } }>
                        {/* <h3>{room.parargraph}</h3> */}
                    </div>
                    <div className="typing-area">
                        <input type="text" 
                            value={roomData.typeValue} 
                            placeholder={roomData.typeTarget} 
                            onChange={onParaChange} 
                            style={{opacity : !started ? '.5' : '1'}}
                            ref={roomData.inpFocus}
                        />
                        <i className="fas fa-pen"></i>
                    </div>
                </div>
            </div>
        </div>
    );

    function getPos(n : number){
        if(n === 1) return `1st`
        else if(n === 2) return `2nd`
        else if(n === 3) return `3rd`
        return `${n}th`
    }

    function getGlobalMessage(){
        const participants :any= room.participants.length;
        const ready = room.participants.filter((p : any) => p.isReady).length;
        const globalMessage = ready === participants ? 
        <p>All users are ready!</p> :
        <>
            <p>{`${ready} out of ${participants} users are ready `}</p> 
            <p className="g-msg-info">(Race will start once all users are ready)</p>
        </>
        const raceTimer = room.started ? `${timer < 1 ? 'Race has started!' : `Race will start in ${timer} seconds...`}` : null
        return { usersReady : ready === participants, globalMessage : raceTimer ? raceTimer : globalMessage }
    }

    function getAdminBtn(){
        const message = <div>Start the race!</div>;
        return { adminBtnMessage : message }
    }
}
export default TestRender;