var elasticsearch = require('../services/elasticSearch');
var mongoService = require('../services/mongo');
var ObjectId = require('mongodb').ObjectID;
var insertIndex = function (id, collectionName, cb){
    if(typeof(id) == 'string' && ObjectId.isValid()){
        id  = new ObjectId(id)
    }

    if(collectionName == 'video'){
        projection = {"projection": {"video_id": 1, "hashtags": 1, "live": 1, "thumbnail_link": 1}}
    }else{
        if(collectionName == 'product'){
            projection = {"projection": {"product_id": 1, "name": 1, "price": 1, "currency": 1, "default_image": 1, "brand_name": 1, "active": 1}}
        }else{
            if(collectionName == 'user'){
                projection = {"projection": {"user_id": 1, "username": 1, "first_name": 1, "last_name": 1, "profile_pic_link": 1, "active": 1}}
            }
        }
    }
    var db = mongoService.getMongoConnection('fu-test-db')
    var query = {_id: id}
    db.collection(collectionName).findOne({
        $and:[query]
    },projection, function(err, doc){
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
    var queryObjArray = {
        "query" : {
            "term" : {
                        "_id" : id
                      }
        }
    }
    elasticsearch.searchData(indexName, queryObjArray, null, null, function(err, result){
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