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
'READY_TOGGLED']
export const FAILED_SOCKET_EVENTS = [
    'CREATE_ROOM_ERROR',
    'ENTER_ROOM_ERROR'
]