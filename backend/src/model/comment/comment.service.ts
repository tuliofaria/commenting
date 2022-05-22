import bookshelf, { knex } from '../../lib/bookshelf'
import Comment from './comment'
import Upvote from './upvote'

export const findAllComments = async () => {
  const comments = await Comment.collection()
    .query((qb) => {
      qb.select('users.name as commenter_name', 'comments.*')
      qb.leftJoin('users', 'users.id', 'comments.commenter_id')
      qb.where('comments.comment_id', 'is', null)
      //qb.orderBy('comments.upvotes', 'desc')
      qb.orderBy('comments.created_at', 'desc')
    })
    .fetch()

  const commentsId = comments.map((comment) => comment.id)
  const nestedComments = await findAllNestedComments(commentsId)
  const commentsWithNestedComments = comments.map((comment) => {
    const newComment = {
      ...comment.toJSON(),
      // @ts-ignore
      comments: nestedComments.filter((nestedComment) => {
        const nested = nestedComment.toJSON()
        console.log(nested.comment_id === comment.id)
        return nested.comment_id === comment.id
      })
    }
    return newComment
  })
  return commentsWithNestedComments
}

export const findAllNestedComments = async (parentComment: string[]) => {
  const comments = await Comment.collection()
    .query((qb) => {
      qb.select('users.name as commenter_name', 'comments.*')
      qb.leftJoin('users', 'users.id', 'comments.commenter_id')
      //qb.orderBy('comments.upvotes', 'desc')
      qb.orderBy('comments.created_at', 'desc')
      qb.where('comments.comment_id', 'in', parentComment)
    })
    .fetch()
  return comments
}

export const findCommentByIdSignedIn = async (id: string, userId: string) => {
  const comment = await Comment.collection()
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
      //qb.orderBy('comments.upvotes', 'desc')
      qb.orderBy('comments.created_at', 'desc')
    })
    .where('comments.id', id)
    .fetchOne()

  const commentsId: string[] = [comment.id]
  const nestedComments = await findAllNestedCommentsSignedIn(commentsId, userId)

  const newComment = {
    ...comment.toJSON(),
    // @ts-ignore
    comments: nestedComments.filter((nestedComment) => {
      const nested = nestedComment.toJSON()
      console.log(nested.comment_id === comment.id)
      return nested.comment_id === comment.id
    })
  }
  return newComment
}

export const findCommentById = async (id: string) => {
  const comment = await Comment.collection()
    .query((qb) => {
      qb.select('users.name as commenter_name', 'comments.*')
      qb.leftJoin('users', 'users.id', 'comments.commenter_id')
      qb.orderBy('comments.created_at', 'desc')
    })
    .where('comments.id', '=', id)
    .fetchOne()

  const commentsId: string[] = [comment.id]
  const nestedComments = await findAllNestedComments(commentsId)

  const newComment = {
    ...comment.toJSON(),
    // @ts-ignore
    comments: nestedComments.filter((nestedComment) => {
      const nested = nestedComment.toJSON()
      console.log(nested.comment_id === comment.id)
      return nested.comment_id === comment.id
    })
  }

  return newComment
}

export const findAllCommentsSignedIn = async (userId: string) => {
  const comments = await Comment.collection()
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
      qb.where('comments.comment_id', 'is', null)
      //qb.orderBy('comments.upvotes', 'desc')
      qb.orderBy('comments.created_at', 'desc')
    })
    .fetch()
  const commentsId = comments.map((comment) => comment.id)
  const nestedComments = await findAllNestedCommentsSignedIn(commentsId, userId)
  const commentsWithNestedComments = comments.map((comment) => {
    const newComment = {
      ...comment.toJSON(),
      // @ts-ignore
      comments: nestedComments.filter((nestedComment) => {
        const nested = nestedComment.toJSON()
        console.log(nested.comment_id === comment.id)
        return nested.comment_id === comment.id
      })
    }
    return newComment
  })
  return commentsWithNestedComments
}

export const findAllNestedCommentsSignedIn = async (
  parentComment: string[],
  userId: string
) => {
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
      qb.where('comments.comment_id', 'in', parentComment)
      //qb.orderBy('comments.upvotes', 'desc')
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

export const createCommentReply = async (
  userId: string,
  commentParent: string,
  commentContent: string
) => {
  const parent = await new Comment({
    id: commentParent,
    comment_id: null
  })
  if (parent) {
    const commenterId = userId
    const comment = new Comment({
      comment: commentContent,
      commenter_id: commenterId,
      comment_id: commentParent
    })
    return await comment.save()
  }
  return null
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
