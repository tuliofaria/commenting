import bookshelf, { knex } from '../../lib/bookshelf'
import Comment from './comment'
import Upvote from './upvote'

export const findAllComments = async () => {
  // select comments.id, upvotes.created_at from comments left join upvotes on comments.id = upvotes.comment_id and comments.commenter_id = 'c4a4b68b-e8da-48a0-8593-a0cdb6db3807';
  return await Comment.collection()
    .query((qb) => {
      qb.select('users.name as commenter_name', 'comments.*')
      qb.leftJoin('users', 'users.id', 'comments.commenter_id')
      qb.orderBy('comments.upvotes', 'desc')
      qb.orderBy('comments.created_at', 'desc')
    })
    .fetch()
}

export const findAllCommentsSignedIn = async (userId: string) => {
  // select comments.id, upvotes.created_at from comments left join upvotes on comments.id = upvotes.comment_id and comments.commenter_id = 'c4a4b68b-e8da-48a0-8593-a0cdb6db3807';
  return await Comment.collection()
    .query((qb) => {
      qb.select(
        'users.name as commenter_name',
        'comments.*',
        'upvotes.created_at as upvoted_at'
      )
      qb.leftJoin('users', 'users.id', 'comments.commenter_id')
      qb.leftJoin('upvotes', function () {
        this.on('upvotes.comment_id', '=', 'comments.id')
        this.andOn(
          // @ts-ignore
          knex.raw(`upvotes.upvoter_id = '${userId}'`)
        )
      })
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
  // ideally it would be better to use transactions
  // but bookshelf didnt allow me to use the way I wanted
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
      const upvoted = await new Upvote()
        .where({ upvoter_id: userId, comment_id: id })
        .fetch({ require: false })
      if (upvoted) {
        await new Upvote({ id: upvoted.id }).destroy()
        const count = await new Upvote().where({ comment_id: id }).count()
        await new Comment({ id }).save(
          { upvotes: count },
          { transacting: transaction }
        )
      }
    }

    return true
  })

  return true
}
