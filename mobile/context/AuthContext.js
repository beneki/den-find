import react, { createContext, useState } from 'react'


export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [userToken, setUserToken] = useState(null)

    const login = () => {
        setUserToken('something')
        setIsLoading(false)
        return true;
    }

    const logout = () => {
        setUserToken(null)
        setIsLoading(false)
    }


    return (
        <AuthContext.Provider value={{ login, logout, isLoading, userToken }}>
            {children}
        </AuthContext.Provider>
    )
}