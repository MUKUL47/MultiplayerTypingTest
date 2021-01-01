import React, { useEffect, useReducer, useState } from 'react';
import { setGlobalToggleFunc } from '../../utils/utils';
import './test.scss'
const para = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis quae doloremque porro in ab neque architecto tenetur repudiandae quidem assumenda minima commodi eius praesentium, laborum, quisquam sed nisi mollitia. Velit'.split(' ');
function TestRender(props : any) {
    const { isOwner, id, room, name, onExit, onReadyToggle } = props;
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
    const isReady :any = participants > 1 ? room?.participants.find((p : any) => p.name === name) : {};
    return (
        <div className="test">
            <div className="test-nav">
                <div className="exit" onClick={onExit}>
                    <i className="fas fa-door-open icon"></i>
                    <span><p>Leave</p></span>
                </div>
                <div className="room-name">
                    {room?.roomName || room || '...'}
                </div>
                <div className="lock-togle">
                    {
                        isOwner ? 
                        <>
                            {
                                roomData.roomLocked ? 
                                <i className="fas fa-lock icon"></i> : <i className="fas fa-lock-open icon"></i>
                            }
                        </> : null
                    }
                </div>
            </div>
            <div className="progress">
                <div className="participant-nav">
                    <div className="info">
                        <i className="fas fa-users icon"></i>
                        <span><p>Participants ({participants})</p></span>
                    </div>
                    <div className="action">
                        {
                            participants > 1 ?
                                <button onClick={onReadyToggle}>{isReady.isReady ? 'Not Ready' : "Ready"}</button>
                            : null
                        }
                    </div>
                </div>
                <div className="progress-users">
                    {
                        typeof room !== 'object' ?
                        <>
                            <div className="p-user">
                                <div className="room-admin">
                                    {
                                        isOwner ? <i className="fas fa-cog"></i> : null
                                    }
                                </div>
                                <div className="p-name p-name-me">You</div>
                                <div className="p-progress">Not Ready</div>
                            </div>
                        </>:
                        room['participants'].map((participant : any, i :number) => {
                            return <div className="p-user" key={i}>
                                    <div className="room-admin">
                                        {
                                            room.owner === participant.name ? <i className="fas fa-cog"></i> : null
                                        }
                                    </div>
                                    <div className={ participant.name === name ? 'p-name p-name-me' : 'p-name' }>{participant.name === name ? 'You' : participant.name}</div>
                                    
                                    {
                                        room.started?
                                        <>
                                            <div className="p-status">
                                                <div className="progress-data" style={{ width : `${participant.progress}%` }}></div>
                                            </div>
                                            <p className="p-data">{participant.progress}%</p>
                                        </> :
                                        <div className="p-progress">
                                            {participant.isReady ? ' - Ready' : ' - Not Ready'}
                                        </div>
                                    }
                                </div>
                        })
                    }
                </div>
            </div>
            <div className="socket-message">
                {
                    isOwner ? 
                    <div className="admin-options">
                        <button className="start-race">
                            Start
                        </button>
                        {/* <button className="restart-race">
                            Restart
                        </button> */}
                    </div>: null
                }
                {/* <div className={isOwner ? 'global-messages' : 'global-messages g-m-t'}>2</div> */}
            </div>
            <div className="typing-playground">
                <i className="fas fa-keyboard icon"></i>
                <span><p>Paragraph</p></span>
                <div className="paragraph" id='para'>
                    {/* <h3 id='active'></h3>
                    <h3> </h3> */}
                </div>
                <div className="typing-area">
                    <input type="text" value={value} placeholder={target} onChange={onParaChange}/>
                    <i className="fas fa-pen"></i>
                </div>
            </div>
        </div>
    );
}
export default TestRender;