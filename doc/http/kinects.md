Kinects
=======

Get kinects
-----------

* `GET /kinects` will return a list of kinects

```json
[
  {
      "name": "kinect1"
    , "x": 10
    , "y": 20
    , "angle": 40
  }
]
```

Create new kinect
-----------------

* `POST /kinects` will create/update a kinect

```json
{
  "success": true
}
```

Delete kinect
--------------

* `DELETE /kinects/:name` will delete a kinect

```json
{
  "success": true
}
```
