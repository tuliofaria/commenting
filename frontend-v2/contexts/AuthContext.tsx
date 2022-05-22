import { createContext, useContext, useEffect, useState } from 'react'

export interface IUser {
  id: string
}
export interface IAuthData {
  isAuthenticated: boolean
  user?: IUser
  signOut: () => void
  signIn: (userId: string) => void
}
const AuthContext = createContext<IAuthData>({
  isAuthenticated: false,
  signIn: () => {},
  signOut: () => {}
})

export const useAuth = () => useContext(AuthContext)

interface Props {
  children: React.ReactNode
}
export const AuthProvider = ({ children }: Props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<IUser>()
  useEffect(() => {
    const token = localStorage.getItem('userId')
    if (token) {
      setIsAuthenticated(true)
      setUser({ id: token })
    }
  }, [])
  const signIn = (userId: string) => {
    setIsAuthenticated(true)
    setUser({ id: userId })
    localStorage.setItem('userId', userId)
  }
  const signOut = () => {
    setIsAuthenticated(false)
    setUser(undefined)
    localStorage.removeItem('userId')
  }
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        signOut,
        signIn
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
