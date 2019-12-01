var mongo = require('mongodb').MongoClient;
var config = require('../config/config')

var mongoConnectionsPool ;
var mongoPromise = [];
mongoPromise.push(new Promise(function(resolve, reject){
	var url = config.mongo.connectionString;
	mongo.connect(url, {useUnifiedTopology: true}, {
		poolSize: 10
	}, function(err, db){
		if(err){
			reject(err);
		} else{
			mongoConnectionsPool = db;
			resolve();
		}
	})
}))

exports.getMongoConnection = function(name){
	return mongoConnectionsPool.db(mongoConnectionsPool.s.options.dbName);
}

exports.ready = Promise.all(mongoPromise);