<link href="http://kevinburke.bitbucket.org/markdowncss/markdown.css"
rel="stylesheet"></link>
# nodePos

nodePos is a nodeJS project that makes it possible to execute actions, if
a person is in a special area of a room. You can send positions of a person and you can configure a scene with interactions in a room.

## Installation

### Install nodejs (v0.6.11)

[Official nodeJS website](http://www.nodejs.org "Official nodeJS Website")

[Building and Installing Node.js](https://github.com/joyent/node/wiki/Installation "Wiki Installation
guide" )

### Install modules

#### GNU/Linux and other UNIX
```
npm install
```

If you used option `-g` please change the directory to your node_modules root dir of
nodepos before next step. (`cd NODE_PATH/nodepos`)

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

    port          port number

    persist       boolean flag to indicate if server should persist

    viewpath      filepath to WebApp

    wlanNotify    boolean flag

    wlanInterv    interval in milliseconds to send user objects 

    wlanHost      wlan host

    wlanPort      wlan port

    wlanPath      wlan path

### Example conf.json

```
{ 
  "port": 8000,
  "persist": false,
  "viewpath": "../../../webapp/smartwebapp",
  "wlanNotify": true,
  "wlanInterv": 1000,
  "wlanHost": "http://baall-server-2.informatik.uni-bremen.de",
  "wlanPort": 8080,
  "wlanPath": "/setPosition" 
}
```

## Author

Andree Klattenhoff - andreek@tzi.de 
