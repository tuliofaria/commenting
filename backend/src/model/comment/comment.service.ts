import bookshelf from '../../lib/bookshelf'
import Comment from './comment'
import Upvote from './upvote'

export const findAllComments = async () => {
  return await Comment.collection()
    .query((qb) => {
      qb.select('users.name as commenter_name', 'comments.*')
      qb.leftJoin('users', 'users.id', 'comments.commenter_id')
      qb.orderBy('comments.upvotes', 'desc')
      qb.orderBy('comments.created_at', 'desc')
    })
    .fetch()
}
export const createComment = async (userId: string, commentContent: string) => {
  const commenterId = userId
  const comment = new Comment({
    comment: commentContent,
    commenter_id: commenterId
  })
  return await comment.save()
}

export const upvoteComment = async (
  id: string,
  action: string,
  userId: string
) => {
  await bookshelf.transaction(async (transaction) => {
    if (action === 'upvote') {
      const alreadyUpvoted = await new Upvote()
        .where({ upvoter_id: userId, comment_id: id })
        .fetch({ require: false })
      if (!alreadyUpvoted) {
        await new Upvote({
          upvoter_id: userId,
          comment_id: id
        }).save(undefined, { transaction })
      }
      const count = await new Upvote().where({ comment_id: id }).count()
      await new Comment({ id }).save(
        { upvotes: count },
        { transacting: transaction }
      )
    } else {
    }

    return true
  })

  return null
}
