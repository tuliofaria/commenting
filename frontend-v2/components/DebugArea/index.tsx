import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useGet } from '../../utils/useGet'
import styles from './styles.module.css'

interface IUser {
  id: string
  name: string
}

const DebugArea = () => {
  const auth = useAuth()
  const { data } = useGet<IUser[]>('/users')
  const [selectedUser, setSelectedUser] = useState<string>('')
  const onChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUser(evt.target.value)
  }
  const signIn = () => {
    const userId = selectedUser
    if (userId) {
      auth.signIn(userId)
    }
  }
  return (
    <div className={styles['debug-area']}>
      <h2 className={styles.title}>This area is just for debugging</h2>
      {!auth.isAuthenticated && (
        <p>
          Your are: not authenticated
          <br />
          <select onChange={onChange} value={selectedUser}>
            <option value='' disabled>
              Select a user
            </option>
            {data?.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <button onClick={signIn}>Sign-in as selected user</button>
        </p>
      )}
      {auth.isAuthenticated && (
        <p>
          Your are: authenticated (userId: {auth.user?.id})
          <br />
          <button onClick={auth.signOut}>Sign-out</button>
        </p>
      )}
    </div>
  )
}

export default DebugArea
