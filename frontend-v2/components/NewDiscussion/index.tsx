/* eslint-disable @next/next/no-img-element */
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { usePost } from '../../utils/usePost'
import styles from './styles.module.css'

interface Props {
  parentComment?: string
}

const NewDiscussion = ({ parentComment }: Props) => {
  const auth = useAuth()
  const { doPost } = usePost(
    !parentComment ? `/comments` : `/comments/${parentComment}/comments`
  )
  const [commentContent, setCommentContent] = useState('')
  const onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setCommentContent(evt.target.value)
  }
  const submitComment = async () => {
    if (commentContent.length > 0) {
      await doPost({
        comment: commentContent
      })
      setCommentContent('')
    }
  }
  return (
    <div className={styles.wrapper}>
      <img
        className={styles.avatar}
        src={`https://i.pravatar.cc/250?u=${auth.user?.id}`}
        width='30'
        height='30'
        alt=''
      />
      <form className={styles.form}>
        <input
          type='text'
          placeholder='What are your thougths?'
          className={styles.input}
          onChange={onChange}
          value={commentContent}
        />
        <button type='button' className={styles.button} onClick={submitComment}>
          {parentComment ? 'Reply' : 'Comment'}
        </button>
      </form>
    </div>
  )
}
export default NewDiscussion
