import {put, delay} from 'redux-saga/effects';
import { authSuccess, authFail} from '../actions';
import {checkAuthType, setLogoutTimerType, authType, logoutType, authResponseType} from '../types/auth.module';
import axios from 'axios';
import { clearAuth, setLogoutTimer, authStart, logout } from '../actions/auth';

export function* authSaga(action: authType){
    yield put(authStart());
    try{
        const response: authResponseType = yield axios.post("http://127.0.0.1:8080/auth/" + action.extension,{
            ...action.authData
        });
        const expirationTime = new Date().getTime() + (3600*1000);
        localStorage.setItem("id", response.data.user.id);
        localStorage.setItem("token", response.data.user.token);
        localStorage.setItem("firstName", response.data.user.firstName);
        localStorage.setItem("lastName", response.data.user.lastName);
        localStorage.setItem("email", response.data.user.email);
        localStorage.setItem("expirationTime", expirationTime.toString());
        
        yield put(authSuccess({
            id: response.data.user.id,
            token: response.data.user.token,
            firstName: response.data.user.firstName,
            lastName: response.data.user.lastName,
            email: response.data.user.email
        }));
        yield put(setLogoutTimer(expirationTime));

    }catch(err: any){
        yield put(authFail(err.response.data.message));
    }
}

export function* checkAuthSaga(action: checkAuthType){
    const fetchedExpTime = localStorage.getItem("expirationTime") || new Date().toString();
    const currentTime = new Date().getTime()
    if(+fetchedExpTime < currentTime){
        yield put(logout());
        return;
    }
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");
    const email = localStorage.getItem("email");
    if(!token || !email || !firstName){
        yield put(logout());
        return;
    }
    yield put(authSuccess({
        id,
        token,
        firstName,
        lastName,
        email
    }));
    yield put(setLogoutTimer(+fetchedExpTime));
}

export function* setLogoutTimerSaga(action: setLogoutTimerType){
    const currentTime = new Date().getTime()
    yield delay(action.expirationTime - currentTime);
    yield put(logout());
} 

export function* logoutSaga(action: logoutType){
    yield put(clearAuth());
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("email");
    localStorage.removeItem("expirationTime");
}