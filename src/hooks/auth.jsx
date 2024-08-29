import React, { createContext, useContext, useState, useEffect } from "react"

export const AuthContext = createContext({})

function AuthProvider({ children }) {
    const [ data, setData     ] = useState({})

    async function Login(user) {
        setData({user})

        sessionStorage.setItem('@portapalete:user', JSON.stringify(user))
    }

    function LogOut() {
        sessionStorage.removeItem('@portapalete:user')
        setData({})
    }

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem('@portapalete:user')) 

        if(user) {
            setData({user})
        }
    }, [])

    return (
        <AuthContext.Provider
            value={{
                Login,
                LogOut,
                user: data.user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);

    return context;
}

export { AuthProvider, useAuth };
