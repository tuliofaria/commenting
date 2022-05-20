const baseUrl = 'http://localhost:3000'

document.addEventListener('DOMContentLoaded', function () {
  Comments.loadAndRenderComments()
  Comments.updateTimestamps()
  Auth.checkUserSignedIn()
})
