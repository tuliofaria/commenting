const baseUrl =
  window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://commenting-test.herokuapp.com'

console.log('using ', baseUrl, 'as endpoint.')

document.addEventListener('DOMContentLoaded', function () {
  Comments.loadAndRenderComments()
  Comments.updateTimestamps()
  Auth.checkUserSignedIn()
})
