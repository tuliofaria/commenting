const baseUrl = 'http://localhost:3000'

async function signIn() {
  try {
    const userId = document.getElementById('userId').value
    const data = await fetch(baseUrl + '/users/' + userId)
    const user = await data.json()
    alert('you are now signed in as ' + user.name)
    window.localStorage.setItem('userId', userId)
    window.location.reload()
  } catch (e) {
    alert('user does not exist')
  }
}
function signOut() {
  window.localStorage.removeItem('userId')
  window.location.reload()
}

function checkUserSignedIn() {
  const userId = localStorage.getItem('userId')
  if (userId) {
    document.getElementById('signin-alert').style.display = 'none'
    document
      .getElementById('new-discussion')
      .getElementsByClassName('avatar')[0]
      .setAttribute('src', 'https://i.pravatar.cc/250?u=' + userId)
  } else {
    document.getElementById('new-discussion').style.display = 'none'
  }
}

async function submitComment() {
  const userId = localStorage.getItem('userId')
  const comment = document.getElementById('commentContent').value
  const data = await fetch(baseUrl + '/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + userId
    },
    body: JSON.stringify({ comment })
  })
  await loadAndRenderComments()
}

async function loadComments() {
  const data = await fetch(baseUrl + '/comments')
  const comments = await data.json()
  return comments
}

async function upvoteComment(commentId) {
  const userId = localStorage.getItem('userId')
  if (!userId) {
    alert('you must be signed in to upvote')
    return
  }
  await fetch(baseUrl + `/comments/${commentId}/upvote`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      ['Content-Type']: 'application/json'
    },
    body: JSON.stringify({
      commenterId: userId,
      action: 'upvote'
    })
  })
  await loadAndRenderComments()
}

function timeAgo(timeStr) {
  const time = new Date(timeStr)
  let delta = (new Date().getTime() - time) / 1000
  if (delta < 60) {
    return Math.floor(delta) + ' seconds ago'
  }
  // minutes
  delta = delta / 60
  if (delta < 60) {
    return Math.floor(delta) + ' minutes ago'
  }
  // hours
  delta = delta / 60
  if (delta < 24) {
    return Math.floor(delta) + ' hrs ago'
  }
  return delta
}

setInterval(() => {
  const datetimes = document.getElementsByClassName('datetime')
  for (let i = 0; i < datetimes.length; i++) {
    const datetime = datetimes[i]
    const time = new Date(datetime.dataset.time)
    datetime.innerHTML = ' ・ ' + timeAgo(time)
  }
}, 1000)

function renderComments(comments) {
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
              />${comment.commenter_name}<span class="datetime" data-time="${
      comment.created_at
    }">${' ・ ' + timeAgo(comment.created_at)}</span>
            </p>
            <p class="comment-body">
              ${comment.comment}
            </p>
            <div class="action-btns">
              <button>▲ Upvote</button> | ${comment.upvotes} upvotes
            </div>
          </div>
        `
    document.getElementById('comments').append(div)
    const commentById = document.getElementById(`comment-${comment.id}`)
    commentById
      .getElementsByTagName('button')[0]
      .addEventListener('click', () => {
        upvoteComment(comment.id)
      })
  })
}

async function loadAndRenderComments() {
  const comments = await loadComments()
  renderComments(comments)
}

document.addEventListener('DOMContentLoaded', function (event) {
  loadAndRenderComments()
  checkUserSignedIn()
})
