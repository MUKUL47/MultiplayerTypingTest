import React from 'react';
import {
    BrowserRouter,
    Route,
    Switch
} from "react-router-dom";
import Toast from '../utils/toast/toast';
import Home from './home/home';
import SocketContextData from './socketContext';
import Test from './test/test';
function Main() {
    return (
        <>
            <Toast/>
            <SocketContextData>
                <BrowserRouter>
                    <Switch>
                        <Route exact path='/' component={Home}></Route>
                        <Route exact path='/test' component={Test}></Route>
                    </Switch>
                </BrowserRouter>
            </SocketContextData>
        </>
    );
}

export default Main;