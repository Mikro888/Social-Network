import {UsersPageType, UsersType} from "./redux-store";
import {usersAPI} from "../api/api";


export type ActionTypes =
    ReturnType<typeof followSuccess>
    | ReturnType<typeof unfollowSuccess>
    | ReturnType<typeof setUsers>
    |
    ReturnType<typeof changePage>
    |
    ReturnType<typeof setUsersCount>
    | ReturnType<typeof toggleIsFetching>
    | ReturnType<typeof toggleFollowInProgress>

let initialState = {
    users: [],
    pageSize: 5,
    totalUsersCount: 0, //если указать 0, то при начальной отрисовке Paginator не отрисует страницы
    currentPage: 1,
    isFetching: true,
    followInProgress: []
}
export const usersReducer = (state: UsersPageType = initialState, action: ActionTypes) => {

    switch (action.type) {
        case FOLLOW:
            return {
                ...state,
                users: state.users.map(el => {
                    if (el.id === action.id) {
                        return {...el, followed: true}
                    }
                    return el
                })
            }
        case UNFOLLOW:
            return {
                ...state,
                users: state.users.map(el => {
                    if (el.id === action.id) {
                        return {...el, followed: false}
                    }
                    return el
                })
            }
        case SET_USER:
            return {
                ...state,
                users: [...action.users]
            }
        case CHANGE_CURRENT_PAGE:
            return {
                ...state,
                currentPage: action.currentPage
            }
        case SET_TOTAL_COUNT:
            return {
                ...state,
                totalUsersCount: action.totalCount
            }
        case TOGGLE_IS_FETCHING:
            return {
                ...state,
                isFetching: action.isFetching
            }
        case FOLLOW_IN_PROGRESS:
            return {
                ...state,
                followInProgress: action.isFetching ?
                    [...state.followInProgress, action.userId] :
                    state.followInProgress.filter(id => id !== action.userId)
            }

        default:
            return state;
    }
}

const FOLLOW = 'FOLLOW';
const UNFOLLOW = 'UNFOLLOW';
const SET_USER = 'SET_USER';
const CHANGE_CURRENT_PAGE = 'CHANGE-CURRENT-PAGE'
const SET_TOTAL_COUNT = 'SET-TOTAL-COUNT'
const TOGGLE_IS_FETCHING = 'TOGGLE-IS-FETCHING'
const FOLLOW_IN_PROGRESS = 'FOLLOW_IN_PROGRESS'
//
export const toggleFollowInProgress = (isFetching: boolean, userId: number) => {
    return {
        type: FOLLOW_IN_PROGRESS,
        isFetching,
        userId
    } as const
}
export const changePage = (page: number) => {
    return {
        type: CHANGE_CURRENT_PAGE,
        currentPage: page
    } as const
}
export const followSuccess = (id: number) => {
    return {
        type: FOLLOW,
        id: id
    } as const
}
export const unfollowSuccess = (id: number) => {
    return {
        type: UNFOLLOW,
        id: id
    } as const
}
export const setUsers = (users: Array<UsersType>) => {
    return {
        type: SET_USER,
        users: users
    } as const

}
export const setUsersCount = (totalCount: number) => {
    return {
        type: SET_TOTAL_COUNT,
        totalCount: totalCount
    } as const
}
export const toggleIsFetching = (isFetching: boolean) => {
    return {
        type: TOGGLE_IS_FETCHING,
        isFetching
    } as const
}

//getUsersThunkCreator
export const getUsers = (currentPage: number, pageSize: number) => async (dispatch: any) => {
    dispatch(toggleIsFetching(true))
    let data = await usersAPI.getUsers(currentPage, pageSize)
    dispatch(toggleIsFetching(false))
    dispatch(setUsers(data.items));
    dispatch(setUsersCount(data.totalCount));
    dispatch(changePage(currentPage))
}
export const followThunkCreator = (id: number) => async (dispatch: any) => {
    dispatch(toggleFollowInProgress(true, id))
    let data = await usersAPI.followUser(id)
    if (data.data.resultCode === 0) {
        dispatch(followSuccess(id))
    }
    dispatch(toggleFollowInProgress(false, id))
}
export const unFollowThunkCreator = (id: number) => async (dispatch: any) => {
    dispatch(toggleFollowInProgress(true, id))
    let data = await usersAPI.unFollowUser(id)
    if (data.data.resultCode === 0) {
        dispatch(unfollowSuccess(id))
    }
    dispatch(toggleFollowInProgress(false, id))

}


export default usersReducer;