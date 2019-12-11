var elasticsearch = require('../services/elasticSearch')

var searchQueryBuilder = function(indexName, queryValue, from, size, cb){
    
    var query = {}
    if(indexName == "all"){
        indexName = '_all';
        query = {"query": {"multi_match" : {"query": queryValue, "fields": [ "name", "brand_name", "username", "first_name", "last_name", "hashtags"] }}}
    }else{
        if(indexName == 'video'){
            query = {"query": {"match" : {"hashtags": queryValue }}}
        }else{
            if(indexName == 'product'){
                query = {"query": {"multi_match" : {"query": queryValue, "fields": [ "name", "price", "brand_name"] }}}
            }else{
                query = {"query": {"multi_match" : {"query": queryValue, "fields": [ "username", "*_name"] }}}
            }
        }
    }
    searchElasticSearch(indexName, query, from, size, function(err, result){
        if(err){
            cb(err)
        }else{
            cb(null, result)
        }
    }) 
}

exports.searchQueryBuilder = searchQueryBuilder;

var searchElasticSearch = function(indexName, query, from, size, cb){

    elasticsearch.searchData(indexName,query, size, from, function(err, result){
        if(err){
            cb(err)
        }else{
            cb(null, result)
        }
    })
}
exports.searchElasticSearch = searchElasticSearch;
