## mdock-cache

An in-memory cache for [mdock](https://github.com/binocarlos/mdock.git) that routes requests to /images/create onto the same server as the previous /containers/create request

## install

```
$ npm install mdock-cache
```

## usage

```js
var http = require('http')
var mdock = require("mdock")
var mdockcache = require("mdock-cache")

var dockers = mdock()

// the mdockcache will remember routing decisions for images
dockers.on('route', mdockcache(function(info, next){
	customRoutingLogic(info, next)
}))

dockers.on('map', function(info, next){
	next()
})

dockers.on('start', function(info, next){
	next()
})

dockers.on('list', function(next){
	next(null, serverList)
})

var server = http.createServer(function(req, res){
	dockers.handle(req, res)
})

server.listen(80)
```

the cache will keep state between subsequent /containers/create and /images/create requests and route them to the correct address

## license

MIT