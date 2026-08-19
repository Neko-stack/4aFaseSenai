/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedEmail = localStorage.getItem("email")
        const savedToken = localStorage.getItem("accessToken")

        if (savedEmail && savedToken) {
            return { email: savedEmail }
        }

        return null
    })

    const login = (email) => {
        localStorage.setItem("email", email)
        setUser({ email })
    }

    const logout = () => {
        localStorage.removeItem("email")
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
