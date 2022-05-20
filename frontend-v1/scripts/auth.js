const Auth = {
  genAuthHeaders: function () {
    const userId = localStorage.getItem('userId')
    const baseHeaders = {
      ['Content-Type']: 'application/json',
      Accept: 'application/json'
    }
    if (userId) {
      return { ...baseHeaders, Authorization: 'Bearer ' + userId }
    }
    return baseHeaders
  },
  signIn: async () => {
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
  },
  signOut: () => {
    window.localStorage.removeItem('userId')
    window.location.reload()
  },
  checkUserSignedIn: () => {
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
}
