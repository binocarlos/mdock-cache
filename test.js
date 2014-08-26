var tape = require('tape')
var Cache = require('./index')

var servers = [
	'127.0.0.1:1231',	
	'127.0.0.1:1232',
	'127.0.0.1:1233',
	'127.0.0.1:1234',
	'127.0.0.1:1235',
	'127.0.0.1:1236',
	'127.0.0.1:1237',
	'127.0.0.1:2231',	
	'127.0.0.1:2232',
	'127.0.0.1:2233',
	'127.0.0.1:2234',
	'127.0.0.1:2235',
	'127.0.0.1:2236',
	'127.0.0.1:2237',
	'127.0.0.1:3231',	
	'127.0.0.1:3232',
	'127.0.0.1:3233',
	'127.0.0.1:3234',
	'127.0.0.1:3235',
	'127.0.0.1:3236',
	'127.0.0.1:3237'
]

tape('do a create -> image -> create loop', function(t){
	var cache = Cache(function(info, next){
		var index = Math.floor(Math.random()*servers.length)
		next(null, servers[index])
	})

	cache({
		name:'test',
		image:'apples',
		container:{
			env:'apples'
		}
	}, function(err, address1){
		if(err){
			t.fail(err, 'address1')
			t.end()
			return
		}
		cache({
			image:'apples'
		}, function(err, address2){
			if(err){
				t.fail(err, 'address2')
				t.end()
				return
			}
			cache({
				name:'test2',
				image:'apples',
				container:{
					env:'apples'
				}
			}, function(err, address3){
				if(err){
					t.fail(err, 'address3')
					t.end()
					return
				}
				cache({
					name:'test',
					image:'apples',
					container:{
						env:'apples'
					}
				}, function(err, address4){
					if(err){
						t.fail(err, 'address4')
						t.end()
						return
					}
					t.equal(address1, address2, 'address1 is address2')
					t.equal(address1, address4, 'address1 is address4')
					t.notEqual(address1, address3, 'address1 is NOT address3')
					t.end()
				})
			})
		})
	})
})