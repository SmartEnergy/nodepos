Smart Energy nodepos
====================

nodePos is a node.js project that makes it possible to execute actions, if
a person is in a special area of a room. You can send positions of a person and you can configure a scene with interactions in a room.

This software was developed during the [Smart Energy](http://smartenergy.uni-bremen.de) project at the University of 
Bremen from 2010 till 2012. One aim of the project was to find a new way of interactions with devices in rooms.
We use house automation systems like KNX and digitalSTROM to demonstrate interactions with devices. The localisation 
of people in a room is realised with a Kinect camera (see KinectController).
nodepos was tested in a real-world environment in the [Bremen Ambient Assisted Living Lab](http://www.baall.net) with Kinect 
camera and KNX automation system.

We will not maintain this project in future.

Features
--------

* Position tracking of people in rooms
* Execution of different actions depending on position of a person
* Control KNX devices

API Documentation
-----------------

* [HTTP API](https://github.com/SmartEnergy/nodepos/tree/master/doc/http/index.md)

Installation
------------

### Install nodejs (v0.6.11)

[Official nodeJS website](http://www.nodejs.org "Official nodeJS Website")

[Building and Installing Node.js](https://github.com/joyent/node/wiki/Installation "Wiki Installation
guide" )

### Install modules

#### GNU/Linux and other UNIX
```
npm install
```

```
make config
```
    
#### Windows
```
npm install
```

## Usage

Run tests to verify that nothing is wrong

```
make test
```

### GNU/Linux and other UNIX
```
./bin/nodepos
```
### Windows
```
node bin/nodepos
```

## Configuration

The configuration file is conf.json

### Options

* port          port number

* persist       boolean flag to indicate if server should persist

* viewpath      filepath to WebApp

* knxHost knx hostname

### Example conf.json

```
{ 
  "port": 8000,
  "persist": false,
  "viewpath": "../../../webapp/smartwebapp"
}
```

TODO
----

* Authentication layer

Contributors
------------

* [Andree Klattenhoff](https://github.com/andreek)
