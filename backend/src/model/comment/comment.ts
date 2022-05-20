import bookshelf from '../../lib/bookshelf'
import User from '../user/user'

const Comment = bookshelf.model('Comment', {
  tableName: 'comments',
  user() {
    // @ts-ignore
    return this.belongsTo('User')
  }
})
export default Comment
