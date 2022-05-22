/* eslint-disable @next/next/no-img-element */
import styles from './styles.module.css'
import { timeAgo } from '../../utils/datetime'
import { usePost } from '../../utils/usePost'
import { useAuth } from '../../contexts/AuthContext'
import { useGet } from '../../utils/useGet'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRealtime } from '../../contexts/RealtimeContext'
import NewDiscussion from '../NewDiscussion'
import TimeAgo from '../TimeAgo'

export interface IComment {
  id: string
  commenter_name: string
  commenter_id: string
  comment: string
  created_at: string
  upvotes: number
  upvoted_at?: string
  comments?: IComment[]
}

interface Props {
  comment: IComment
  replyButton?: () => void
}

const Comment = ({ comment: initialComment, replyButton }: Props) => {
  const { doPost } = usePost(`/comments/${initialComment.id}/upvote`)
  const allowUpdate = useRef(false)
  const [isReplying, setIsReplying] = useState(false)
  const { data: comment, mutate } = useGet<IComment>(
    `/comments/${initialComment.id}`,
    {
      fallbackData: initialComment,
      isPaused: () => {
        return !allowUpdate.current
      }
    }
  )
  const refreshData = useCallback(async () => {
    allowUpdate.current = true
    await mutate()
  }, [mutate])
  const realtime = useRealtime()
  useEffect(() => {
    realtime.subscribeTo('comment-' + initialComment.id, (data) => {
      refreshData()
    })
    return () => {
      realtime.unsubscribeFrom('comment-' + initialComment.id)
    }
  }, [realtime, initialComment.id, refreshData])

  const auth = useAuth()
  const upvote = async () => {
    if (!auth.isAuthenticated) {
      alert('you must be signed in to upvote')
      return
    }
    await doPost({
      commenterId: auth.user?.id,
      action: 'upvote'
    })
    await refreshData()
  }
  const removeUpvote = async () => {
    if (!auth.isAuthenticated) {
      alert('you must be signed in to upvote')
      return
    }
    await doPost({
      commenterId: auth.user?.id,
      action: 'removeUpvote'
    })
    await refreshData()
  }
  const toggleReply = () => {
    if (replyButton) {
      replyButton()
    } else {
      setIsReplying((old) => !old)
    }
  }
  if (!comment) {
    return <p>Something went wrong :(</p>
  }
  const hasReplies = comment.comments && comment.comments.length > 0
  return (
    <>
      <div
        className={`${styles.comment} ${
          hasReplies ? styles['comment-has-replies'] : ''
        }`}
      >
        <p className={styles.author}>
          <img
            className={styles.avatar}
            src={`https://i.pravatar.cc/250?u=${comment.commenter_id}`}
            width='30'
            height='30'
            alt='avatar'
          />
          {comment.commenter_name}{' '}
          <span className={styles.datetime}>
            {' '}
            ・ <TimeAgo date={comment.created_at} />
          </span>
        </p>
        <p className={styles['comment-body']}>{comment.comment}</p>
        <div className={styles['action-btns']}>
          {comment.upvoted_at && (
            <button onClick={removeUpvote} className={styles.upvote}>
              Upvoted 🎉
            </button>
          )}
          {!comment.upvoted_at && (
            <button onClick={upvote} className={styles.upvote}>
              ▲ Upvote
            </button>
          )}{' '}
          | {comment.upvotes} upvotes{' '}
          {auth.isAuthenticated && (
            <>
              {' '}
              |{' '}
              <button onClick={toggleReply} className={styles.upvote}>
                Reply
              </button>
            </>
          )}
        </div>
        {hasReplies && (
          <div>
            {comment?.comments?.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                replyButton={toggleReply}
              />
            ))}
          </div>
        )}
        {isReplying && <NewDiscussion parentComment={comment.id} />}
      </div>
    </>
  )
}
export default Comment
