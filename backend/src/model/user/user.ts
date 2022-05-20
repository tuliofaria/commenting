import bookshelf from '../../lib/bookshelf'

const User = bookshelf.model('User', {
  tableName: 'users'
})
export default User
