import React, { useEffect, useReducer, useState } from 'react';
import { setGlobalToggleFunc } from '../../utils/utils';
import './test.scss'
const para = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis quae doloremque porro in ab neque architecto tenetur repudiandae quidem assumenda minima commodi eius praesentium, laborum, quisquam sed nisi mollitia. Velit'.split(' ');
function TestRender(props : any) {
    const { isOwner, room, name, onExit, onReadyToggle, userData, onRoomLockToggle, onStartRace } = props;
    const [roomData, setRoomData] = useReducer(setGlobalToggleFunc, { roomLocked : true })
    //
    const [paragraph, setParagraph] = useState<number>(0)
    const [target, setTarget] = useState<string>('Lorem')
    const [value, setValue] = useState<string>('')
    // useEffect(()=>{
    //         const t = [...para].splice(paragraph,1).join(' ');
    //         setTarget(t);
    //         (window as any).para.innerHTML = `
    //         ${[...para].splice(0, paragraph).length > 0 ? `<h3>${[...para].splice(0, paragraph).join(' ')}</h3>` : ''}
    //         ${[...para].splice(paragraph,1).length > 0 ?  `<h3 id='active'>${t}</h3>` : ''}
    //         ${[...para].splice(paragraph+1).length > 0 ?  `<h3>${[...para].splice(paragraph+1).join(' ')}</h3>` : ''}
    //         `;
    //         (window as any)['progress-data'].style.width = ((paragraph/para.length) * 100).toFixed()+"%"
    // },[paragraph])
    const onParaChange = (e : any) : void => {
        const v = e.target.value;
        setValue(v)
        if(v === target+' '){
            setParagraph(paragraph+1)
            setValue('');
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
                            isOwner && usersReady? 
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
                            { participants > 1 ? <button onClick={onReadyToggle}>{userData.isReady ? 'Not Ready' : "Ready"}</button> : null }
                        </div>
                    </div>
                    <div className="progress-users">
                        { 
                            room['participants'].map((participant : any, i :number) => {
                                return <div className="p-user" key={i}>
                                        <div className="room-admin">
                                            { room.owner === participant.name ? <i className="fas fa-user-cog"></i>: <i className="fas fa-user icon"></i> }
                                        </div>
                                        <div className={ participant.name === name ? 'p-name p-name-me' : 'p-name' }>{participant.name === name ? 'You' : participant.name}</div>
                                        
                                        {
                                            room.started?
                                            <div className="race-started">
                                                <div className="p-status">
                                                    <div className="progress-data" style={{ width : `${participant.progress}%` }}></div>
                                                </div>
                                                <p className="p-data">{participant.progress}%</p>
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
                    <div className="paragraph" id='para'>
                        {/* <h3 id='active'>Numquam</h3> */}
                        {/* <h3> Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eum nihil quod ullam? Excepturi at soluta, voluptate corrupti quis illum facere. Ex, aperiam. Numquam suscipit quod corporis nostrum ea! Illo, quaerat. </h3> */}
                        <h3>{room.parargraph}</h3>
                    </div>
                    <div className="typing-area">
                        <input type="text" 
                            value={value} 
                            placeholder={target} 
                            onChange={onParaChange} 
                            disabled={!room.started}
                            style={{opacity : !room.started ? '0.25' : '1'}}
                        />
                        <i className="fas fa-pen"></i>
                    </div>
                </div>
            </div>
        </div>
    );

    function getGlobalMessage(){
        const participants :any= room.participants.length;
        const ready = room.participants.filter((p : any) => p.isReady).length;
        const globalMessage = ready === participants ? 
        <p>All users are ready!</p> :
        <>
            <p>{`${ready} out of ${participants} users are ready `}</p> 
            <p className="g-msg-info">(Race will start once all users are ready)</p>
        </>
        return { usersReady : ready === participants, globalMessage : globalMessage }
    }

    function getAdminBtn(){
        const message = <div>Start the race!</div>;
        return { adminBtnMessage : message }
    }
}
export default TestRender;