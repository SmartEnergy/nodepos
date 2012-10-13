Commands
========

Get commands
------------

* `GET /commands` will return a list of commands

```json
[
  {
      "name": "turnOn"
    , "conditions": [CONDITION]
    , "actions": [ACTION] 
  }
]
```

Create new command
------------------

* `POST /commands` will create/update a command

```json
{
  "success": true
}
```

Delete command
--------------

* `DELETE /commands/:name` will delete a command

```json
{
  "success": true
}
```
