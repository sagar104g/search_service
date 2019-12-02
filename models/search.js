var elasticsearch = require('../services/elasticSearch')

var searchQueryBuilder = function(indexName, queryObject, cb){
    indexName = 'bank'
    queryObject = [{ "firstname" : ["john", "jack", "bill"]},
                  { "lastname" : ["john", "jack", "bill"]}]
    var searchQuery = {"query" : {"bool" : {"should" : []}}}
    for(var termObj in queryObject){
        searchQuery.query.bool.should.push({"terms" : queryObject[termObj]})
    }
    elasticsearch.searchData(indexName,searchQuery, function(err, result){
        if(err){
            cb(err)
        }else{
            cb(null, result)
        }
    })
}

exports.searchQueryBuilder = searchQueryBuilder;
