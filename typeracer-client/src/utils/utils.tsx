import { Subject } from 'rxjs';
export const setGlobalToggleFunc = (toggle: any, data: any) => {
    const currentKeys = Object.keys(toggle);
    Object.keys(data).forEach(key => {
        if (!currentKeys.includes(key)) throw Error('Unexpected property found :' + key)
    })
    return { ...toggle, ...data }
}
export const eventEmitter = new Subject<{ event: string, params: any }>();
export const toastToggle = new Subject<string>();
export const SOCKET_EVENTS = [
'CREATE_ROOM_ERROR', 
'CREATED_ROOM', 
'ENTER_ROOM_ERROR', 
'ENTERED_ROOM', 
'READY_PLAYER_ERROR', 
'PLAYER_READY', 
'LOGOUT_ERROR', 
'LOGOUT_DONE',
// 
'READY_TOGGLE',
'READY_TOGGLED',
'ROOM_LOCK_TOGGLED',
'RACE_STARTED',
'UPDATED_TYPE_PROGRESS']
export const FAILED_SOCKET_EVENTS = [
    'CREATE_ROOM_ERROR',
    'ENTER_ROOM_ERROR',
    'START_RACE_ERROR'
]

export const DEFAULT_PARAGRAPH = 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aperiam quisquam quidem omnis labore perspiciatis est obcaecati, temporibus doloribus ab minima autem odit sed et aut facilis recusandae itaque culpa quae.'