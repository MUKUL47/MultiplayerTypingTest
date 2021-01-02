import { timeStamp } from 'console';
import React, { useEffect, useState } from 'react';
import { toastToggle } from '../utils';
import './toast.scss'
function Toast() {
    const [r, sR] = useState<string | boolean>(false)
    let timeId : any = -1;
    useEffect(() => {
        toastToggle.subscribe(message => {
            sR(message);
            clearTimeout(timeId)
            timeId = setTimeout(() => sR(false), 2000);
        })
    },[])
    return (
        r ?
        <div className="toast-message">
            {r}
        </div> :null
    );
}
export default Toast;