# Commenting system

This is a small commenting system where we can comment using different frontend solutions.

## Commitizen

This is a commitizen friendly repo. In order to commit, use:

```
cz
```

This way, all commit messages are going to have the same format. Allowing in the future rely in an automated way of generating changelogs, for example.

## Folder and project structure

- `html-template`: this folder/project houses the initial HTML template draft. The goal is to extract some CSS values from the Figma design. Published at: [https://commenting-template.tuliofaria.dev/](https://commenting-template.tuliofaria.dev/)
- `frontend-v1`: first version of the frontend created using Vanilla Javascript. Published at: [https://commenting-frontend-v1.tuliofaria.dev/](https://commenting-frontend-v1.tuliofaria.dev). Copy one user id from the list of users, paste in the input field and click Signin.
- `frontend-v2`: second version of the frontend created using React. Published at: [https://commenting-frontend-v2.tuliofaria.dev/](https://commenting-frontend-v2.tuliofaria.dev). It uses NextJS as platform and besides having a better UX it alse integrates with Socket.io to receive realtime updates.

## Sign-in:
In order to see the available users in this endpoint (this is relevant for frontend-v1 in order to get a user id to sign-in):

[https://commenting-test.herokuapp.com/users](https://commenting-test.herokuapp.com/users)

* Additionally, you can also create a new user with a POST request to the same endpoint, sending a json body like this:
```
{
	"name": "Tulio Faria"
}
```

# Author

Tulio Faria

- [https://github.com/tuliofaria](https://github.com/tuliofaria)
- [https://linkedin.com/in/tuliofaria](https://linkedin.com/in/tuliofaria)
- [https://tuliofaria.dev](https://tuliofaria.dev)