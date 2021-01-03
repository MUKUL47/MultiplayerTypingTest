import React, { useEffect, useReducer } from 'react';
import { DEFAULT_PARAGRAPH, setGlobalToggleFunc, toastToggle } from '../../utils/utils';
function HomeRender(props : { onCreate : Function, onEnter : Function }) {
    const { onCreate, onEnter } = props;
    const [createRoomForm, setCreateRoomForm] = useReducer(setGlobalToggleFunc, { roomName : '', name : '', maxParticipants : 5, customParagraph : '' })
    const [enterRoomForm, setEnterRoomForm] = useReducer(setGlobalToggleFunc, { roomName : '', name : '' });
    const [validator, setValidator] = useReducer(setGlobalToggleFunc, { createRoomValid : false, enterRoomValid : false });
    const uniqueError : string  = 'Invalid room or user name';
    useEffect(() => {
        setValidator(
            {
                createRoomValid : createRoomForm.roomName.trim().length > 0 && createRoomForm.name.trim().length > 0,
                enterRoomValid : enterRoomForm.roomName.trim().length > 0 && enterRoomForm.name.trim().length > 0,
            }
        )
    },[createRoomForm, enterRoomForm])
    const onCreateRoomChange = (type : string, value: any) : void => {
        const f : any = {};
        f[type] = value;
        setCreateRoomForm(f);
    }
    const onEnterRoomChange = (type : string, value: any) : void => {
        const f : any = {};
        f[type] = value;
        setEnterRoomForm(f);
    }
    
    const onSubmit = (isCreate ?: boolean) : void => {
        if(isCreate){
            const trimCP = createRoomForm.customParagraph.trim().length > 0;
            if(!validator.createRoomValid){
                toastToggle.next(uniqueError);
            }
            else if(createRoomForm.maxParticipants < 2){
                toastToggle.next('Max participants cannot be less than 2');
            }
            else if(trimCP && createRoomForm.customParagraph.split(' ').length < 10){
                toastToggle.next('Custom paragraph should have atleast 10 words');
            }else{
                onCreate({...createRoomForm, customParagraph : trimCP ? createRoomForm.customParagraph.trim() : DEFAULT_PARAGRAPH })
            }
        }else{
            if(!validator.enterRoomValid){
                toastToggle.next(uniqueError);
                return
            }
            onEnter(enterRoomForm)
        }
    }
    return (
        <div className="home-div">
            <div className="create-room">
                <div className="create-head">
                    <h1>Create Room <i className="fas fa-plus-circle"></i></h1>
                </div>
                <div className="room__name">
                    <h3>Enter room name</h3>
                    <input type="text" placeholder="Room1" value={createRoomForm.roomName} onChange={e => onCreateRoomChange('roomName', e.target.value)}/>
                </div>
                <div className="user__name">
                    <h3>Enter name</h3>
                    <input type="text" placeholder="John Doe" value={createRoomForm.name} onChange={e => onCreateRoomChange('name', e.target.value)}/>
                </div>
                <div className="max__limit">
                    <h3>Max participants</h3>
                    <input type="number" placeholder="5" value={Number(createRoomForm.maxParticipants)} onChange={e => onCreateRoomChange('maxParticipants', e.target.value)}/>
                </div>
                <div className="custom__paragraph">
                    <h3>Custom Paragraph</h3>
                    <textarea className="custom-paragraph" placeholder="Lorem ipsum..." value={createRoomForm.customParagraph} onChange={e => onCreateRoomChange('customParagraph', e.target.value)}>
                    </textarea>
            </div>
                <div className="s-btn">
                    <button className="submit-room"  onClick={() => onSubmit(true)}>
                        Create
                    </button>
                </div>
            </div>
            <div className="enter-room">
                <div className="enter-head">
                    <h1>Enter Room<i className="fas fa-arrow-right"></i></h1>
                </div>
                <div className="room__name">
                    <h3>Enter room name</h3>
                    <input type="text" placeholder="Room1" value={enterRoomForm.roomName} onChange={e => onEnterRoomChange('roomName', e.target.value)}/>
                </div>
                <div className="user__name">
                    <h3>Enter your name</h3>
                    <input type="text" placeholder="John Doe" value={enterRoomForm.name} onChange={e => onEnterRoomChange('name', e.target.value)}/>
                </div>
                <div className="e-btn">
                        <button className="enter-room"   onClick={() => onSubmit()}>
                            Enter
                        </button>
                    </div>
            </div>
        </div>
    );
}
export default HomeRender;