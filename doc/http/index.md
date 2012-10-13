HTTP API DOCUMENTATION
======================

Resources
---------

* [Actions](actions.md)
* [Commands](commands.md)
* [Kinects](kinects.md)
* [Regions](regions.md)
* [Users](users.md)

Example [GET] Response
----------------------

### Collections
Status: 200
Content-Type: 'application/json'
Body:
```json
{
    "size": 'SIZE'
  , "actions|commands|kinects|regions|users": []
}
```

Example POST|DEL|PUT-Request Response
-------------------------------

### Collections
Status: 200
Content-Type: 'application/json'
```json
{
    "success": true
}
```

Example Error Response
----------------------

### GET - Requests

Status: Error Code
Body:
```
MESSAGE
```

### POST|DEL|PUT - Requests

Status: Error Code
Content-Type: 'application/json'
Body:
```json
{
    "success": false
  , "msg": '..'
}
```
