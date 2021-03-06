import {AuthAPI, profileAPI, usersAPI} from "../api/api";
import {stopSubmit} from "redux-form";


export type ActionTypes =
    ReturnType<typeof setAuthUserDataAC> | ReturnType<typeof signInAC>

let initialState = {
    userId: null,
    email: null,
    login: null,
    isAuth: false
}
type initialStateType = {
    userId: any
    email: any
    login: any
    isAuth: boolean
}

export const authReducer = (state: initialStateType = initialState, action: ActionTypes) => {

    switch (action.type) {
        case SET_USER_DATA:
            return {
                ...state,
                ...action.payload,
            }
        case SIGN_IN:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state;
    }
}

const SET_USER_DATA = 'SET_USER_DATA';
const SIGN_IN = 'SIGN-IN';

export const setAuthUserDataAC = (userId: number | null, email: string | null, login: string | null, isAuth: boolean) => {
    return {
        type: SET_USER_DATA,
        payload: {
            userId,
            email,
            login,
            isAuth
        }
    } as const
}
export const signInAC = (email: string, password: string, rememberMe: boolean) => {
    return {
        type: SIGN_IN,
        payload: {
            email,
            password,
            rememberMe
        }
    } as const
}
// using Async Await instead of .then
export const loginThunkCreator = () => async (dispatch: any) => {
    let response = await usersAPI.loginMe()
    if (response.data.resultCode === 0) {
        let {id, email, login} = response.data.data
        dispatch(setAuthUserDataAC(id, email, login, true))
    }
}
export const signMeIn = (email: string, password: string, rememberMe: boolean) => async (dispatch: any) => {
    let response = await AuthAPI.signIn(email, password, rememberMe)
    // AuthAPI.signIn(email, password, rememberMe).then(response => {
    if (response.data.resultCode === 0) {
        dispatch(loginThunkCreator())
        // }
        dispatch(signInAC
        (response.data.email, response.data.password, response.data.rememberMe))
    }
}
export const logout = () => async (dispatch: any) => {
    let response = await AuthAPI.logout()
    if (response.data.resultCode === 0) {
        dispatch(setAuthUserDataAC(null, null, null, false))

    }
}
export default authReducer;