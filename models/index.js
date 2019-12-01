var elasticsearch = require('../services/elasticSearch')
var mongoService = require('../services/mongo')

var insertIndex = function (id, collectionName, cb){
    var db = mongoService.getMongoConnection('fu-test-db')
    var query = {_id: id}
    db.collection(collectionName).findOne({
        $and:[query]
    }, function(err, doc){
        if(err){
            console.log(err)
            cb(err)
        }else{
            if(doc){
                doc._id = doc._id.toString()
                elasticsearch.addDocument(collectionName, doc, function(err, result){
                    if(err){
                        console.log(err)
                        cb(err)
                    }else{
                        console.log(result)
                        cb(null, result)
                    }
                })
            }else{
                cb({"err":"no doc found"})
            }
        }
    })
}
exports.insertIndex = insertIndex;

var getIndex = function (id, indexName, cb){
    var queryObjArray = [{"_id" : [id]}]
    elasticsearch.searchData(indexName, queryObjArray, function(err, result){
        if(err){
            cb(err)
        }else{
            cb(null, result)
        }
    })   
}
exports.getIndex = getIndex;

var deleteIndex = function(id, collectionName, cb){
    elasticsearch.deleteDocument(id, collectionName, function(err, result){
        if(err){
            cb(err)
        }else{
            cb(null, result)
        }
    })
}
exports.deleteIndex = deleteIndex;

var indexAll = function(indexName, cb){
    var db = mongoService.getMongoConnection('fu-test-db')
    db.collection(indexName).find({}).toArray(function(err, result) {
        if(err){
            cb(err)
        }else{
            elasticsearch.addDocuments(indexName, result, function(err, result){
                if(err){
                    cb(err)
                }else{
                    cb(null, result)
                }
            })
        }
    });
}
exports.indexAll = indexAll;