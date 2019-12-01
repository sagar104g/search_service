var elasticsearch = require('../services/elasticSearch')

var searchQueryBuilder = function(indexName, queryObject, cb){
    indexName = 'bank' 
    queryObject = {
        "query": {
          "multi_match" : {
            "query":    "Angelique",
            "fields": [ "firstname" ] 
          }
        }
      }
    elasticsearch.searchData(indexName,queryObject, function(err, result){
        if(err){
            cb(err)
        }else{
            cb(null, result)
        }
    })
}

exports.searchQueryBuilder = searchQueryBuilder;
