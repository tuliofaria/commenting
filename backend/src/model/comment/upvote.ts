import bookshelf from '../../lib/bookshelf'

const Upvote = bookshelf.model('Upvote', {
  tableName: 'upvotes'
})
export default Upvote
