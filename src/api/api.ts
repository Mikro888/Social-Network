import axios from "axios";

// создаем instance и передаем в него все свойства, axios знает, как их использовать
const instance = axios.create({
    withCredentials: true,
    baseURL: `https://social-network.samuraijs.com/api/1.0/`,
    headers: {
        "API-KEY": "c37a79cc-8c92-4e25-964e-683eef6a124b"
    }
})
// создаем объект usersAPI и назначаем методы, вместо функций ниже
export const usersAPI = {
    getUsers(currentPage: number, pageSize: number) {
        return instance.get(`users?page=${currentPage}&count=
        ${pageSize}`).then(response => response.data)
    },
    loginMe() {
        return instance.get(`auth/me`)
    },
    getUserId(userId: number) {
        return profileAPI.getUserId(userId)
    },
    unFollowUser(id: number) {
        return instance.delete(`follow/${id}`)
    },
    followUser(id: number) {
        return instance.post(`follow/${id}`)
    }
}

export const profileAPI = {
    getUserId(userId: number) {
        return instance.get(`profile/` + userId)
    },
    getStatus(userId: number) {
        return instance.get(`profile/status/` + userId)
    },
    updateStatus(status: string) {
        return instance.put(`profile/status`, {status})
    },
}
export const AuthAPI = {
    signIn(email: string, password: string, rememberMe: boolean = false) {
        return instance.post(`/auth/login`, {email, password, rememberMe})
    },
    logout(){
        return instance.delete(`/auth/login`)
    }
}

// export const getUsers = (currentPage: number, pageSize: number) => {
//     return instance.get(`users?page=${currentPage}&count=
//         ${pageSize}`).then(response => response.data)
// }
// export const loginMe = () => {
//     return instance.get(`auth/me`)
// }
// export const getUserId = (userId: string) => {
//     return instance.get(`profile/` + userId)
// }
//
// export const unFollowUser = (id: number) => {
//     return instance.delete(`follow/${id}`)
// }
//
// export const followUser = (id: number) => {
//     return instance.post(`https://social-network.samuraijs.com/api/1.0/follow/${id}`)
// }