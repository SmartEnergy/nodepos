Users
=====

Get users
---------

* `GET /users` will return a list of users

```json
[
  {
      "id": "user1"
    , "position" {
          "x": 10
        , "y": 20
      }
  }
]
```

Create new user
---------------

* `POST /users/new` will create/update a user 

```json
{
  "success": true
}
```
