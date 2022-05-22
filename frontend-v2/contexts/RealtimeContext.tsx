import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from './AuthContext'

export interface IRealtimeData {
  isConnected: boolean
  subscribeTo: (channel: string, cb: (data: any) => void) => void
  unsubscribeFrom: (channel: string) => void
}
export const RealtimeContext = createContext<IRealtimeData>({
  isConnected: false,
  subscribeTo: () => {},
  unsubscribeFrom: () => {}
})

export const useRealtime = () => useContext(RealtimeContext)
interface Props {
  children: React.ReactNode
}
export const RealtimeProvider = ({ children }: Props) => {
  const [isConnected, setIsConnected] = useState(false)
  const socket = useRef<Socket>()
  const auth = useAuth()
  useEffect(() => {
    const socketOptions = auth.isAuthenticated
      ? { query: { userId: auth.user?.id } }
      : {}
    socket.current = io(
      process.env.NEXT_PUBLIC_BASE_URL as string,
      socketOptions
    )

    return () => {
      // disconnect socket
    }
  }, [auth])
  const subscribeTo = (channel: string, cb: (data: any) => void) => {
    socket?.current?.on(channel, cb)
  }
  const unsubscribeFrom = (eventName: string) => {
    socket?.current?.off(eventName)
  }
  return (
    <RealtimeContext.Provider
      value={{ isConnected, subscribeTo, unsubscribeFrom }}
    >
      {children}
    </RealtimeContext.Provider>
  )
}
