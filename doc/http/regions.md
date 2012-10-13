Regions
=======

Get regions
-----------

* `GET /regions` will return a list of regions

```json
[
  {
      "name": "rectangle"
    , "posX": 10
    , "posY": 20
    , "width": 40
    , "height": 40
  },
  {
      "name": "polygon"
    , "points": [ { "x": 10, "y":10 } ]
  }
]
```

Create new region
-----------------

* `POST /regions` will create/update a region

```json
{
  "success": true
}
```

Delete region
--------------

* `DELETE /regions/:name` will delete a region

```json
{
  "success": true
}
```
