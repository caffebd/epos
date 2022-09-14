let isAuth = false

export function getAuth() {
    return isAuth
}


export function setAuth(state) {
   isAuth = state;
}