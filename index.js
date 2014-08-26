module.exports = function(router){
	var stash = {}
	return function(info, next){

		console.log('-------------------------------------------');
		console.dir(info)
		// a container request
		if(info.name){
			var cached = stash['container:' + info.name]
			if(cached){
				delete(stash['container:' + info.name])
				return next(null, cached)
			}
		}
		// an image request
		else if(info.image){
			var cached = stash['image:' + info.image]
			if(cached){
				var use = cached.shift()
				if(cached.length<=0){
					delete(stash['image:' + info.image])
				}
				else{
					stash['image:' + info.image] = cached	
				}
				return next(null, use)
			}
			else{
				return next('no cache found - to pull images you must have called /containers/create first')
			}
		}

		// if we get to here it means we don't have a stash for the request
		// image requests should never reach here because the previous /containers/create
		// request should have cached the image

		if(!info.name) return next('image request should not make it to routing')
		
		router(info, function(err, address){
			if(err) return next(err)
			stash['container:' + info.name] = address
			var arr = stash['image:' + info.image] || []
			arr.push(address)
			stash['image:' + info.image] = arr
			next(null, address)
		})
	}
}