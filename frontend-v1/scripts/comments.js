const Comments = {
  loadComments: async () => {
    const data = await fetch(baseUrl + '/comments', {
      headers: Auth.genAuthHeaders()
    })
    const comments = await data.json()
    return comments
  },
  loadAndRenderComments: async () => {
    const comments = await Comments.loadComments()
    Comments.renderComments(comments)
  },

  renderComments: (comments) => {
    document.getElementById('comments').innerHTML = ''
    comments.forEach((comment) => {
      const div = document.createElement('div')
      div.innerHTML = `
            <div class="comment" id="comment-${comment.id}">
                <p class="author">
                  <img
                    class="avatar"
                    src="https://i.pravatar.cc/250?u=${comment.commenter_id}"
                    width="30"
                    height="30"
                  />${
                    comment.commenter_name
                  }<span class="datetime" data-time="${comment.created_at}">${
        ' ・ ' + timeAgo(comment.created_at)
      }</span>
                </p>
                <p class="comment-body">
                  ${comment.comment}
                </p>
                <div class="action-btns">
                  <button>${
                    !comment.upvoted_at ? '▲ Upvote' : 'Upvoted 🎉'
                  }</button> | ${comment.upvotes} upvotes
                </div>
              </div>
            `
      document.getElementById('comments').append(div)
      const commentById = document.getElementById(`comment-${comment.id}`)
      commentById
        .getElementsByTagName('button')[0]
        .addEventListener('click', () => {
          if (comment.upvoted_at === null) {
            Comments.upvoteComment(comment.id)
          } else {
            Comments.removeUpvoteComment(comment.id)
          }
        })
    })
  },
  submitComment: async () => {
    const userId = localStorage.getItem('userId')
    const comment = document.getElementById('commentContent').value
    const data = await fetch(baseUrl + '/comments', {
      method: 'POST',
      headers: Auth.genAuthHeaders(),
      body: JSON.stringify({ comment })
    })
    document.getElementById('commentContent').value = ''
    await Comments.loadAndRenderComments()
  },

  upvoteComment: async (commentId) => {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      alert('you must be signed in to upvote')
      return
    }
    await fetch(baseUrl + `/comments/${commentId}/upvote`, {
      method: 'POST',
      headers: Auth.genAuthHeaders(),
      body: JSON.stringify({
        commenterId: userId,
        action: 'upvote'
      })
    })
    await Comments.loadAndRenderComments()
  },
  removeUpvoteComment: async (commentId) => {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      alert('you must be signed in to upvote')
      return
    }
    await fetch(baseUrl + `/comments/${commentId}/upvote`, {
      method: 'POST',
      headers: Auth.genAuthHeaders(),
      body: JSON.stringify({
        commenterId: userId,
        action: 'removeUpvote'
      })
    })
    await Comments.loadAndRenderComments()
  },
  updateTimestamps: () => {
    setInterval(() => {
      const datetimes = document.getElementsByClassName('datetime')
      for (let i = 0; i < datetimes.length; i++) {
        const datetime = datetimes[i]
        const time = new Date(datetime.dataset.time)
        datetime.innerHTML = ' ・ ' + timeAgo(time)
      }
    }, 10000)
  }
}
