module.exports = function(router){
	var stash = {}
	return function(info, next){

		// a container request
		if(info.name){
			var cached = stash['container:' + info.name]
			if(cached){
				delete(stash['container:' + info.name])
				return next(null, cached)
			}
			else{
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
		// an image request
		else if(info.image){
			var cached = stash['image:' + info.image]
			if(cached){
				var use = cached.shift()

				if(cached.length>0){
					stash['image:' + info.image] = cached
				}
				else{
					delete(stash['image:' + info.image])
				}
				return next(null, use)
			}
			else{
				return next('no cache found - to pull images you must have called /containers/create first')
			}
		}
	}
}