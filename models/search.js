var elasticsearch = require('../services/elasticSearch')
var bodybuilder = require('bodybuilder');

var searchQueryBuilder = function (indexName, queryValue, from, size, cb) {

    let feildsData = []
    if (indexName == 'all') {
        feildsData.push("name", "brand_name", "username", "first_name", "last_name", "hashtags")
    } else {
        if (indexName == 'video') {
            feildsData.push("hashtags")
        } else {
            if (indexName == 'product') {
                feildsData.push("name", "brand_name")
            } else {
                if (indexName == 'user') {
                    feildsData.push("username", "first_name", "last_name")
                }
            }
        }
    }
    if (feildsData.length) {
        let esSearchQuery = bodybuilder().query('multi_match', {
            query: queryValue,
            fields: feildsData
        }).build()

        searchElasticSearch(indexName, esSearchQuery, from, size, function (err, result) {
            if (err) {
                cb(err)
            } else {
                cb(null, result)
            }
        })
    } else {
        cb(null, {})
    }
}

exports.searchQueryBuilder = searchQueryBuilder;

var searchElasticSearch = function (indexName, query, from, size, cb) {

    from = from ? from : 0;
    size = (size != null && size <= 10) ? size : 10;
    elasticsearch.searchData(indexName, query, size, from, function (err, result) {
        if (err) {
            cb(err)
        } else {
            let searchResult = {}
            if (result && result.body && result.body.hits && result.body.hits.hits && result.body.hits.hits.length) {
                for (let hit in result.body.hits.hits) {
                    if (searchResult[result.body.hits.hits[hit]._index]) {
                        searchResult[result.body.hits.hits[hit]._index].data.push(result.body.hits.hits[hit]._source)
                    } else {
                        searchResult[result.body.hits.hits[hit]._index] = {
                            data: [result.body.hits.hits[hit]._source]
                        }
                    }
                }
            }
            cb(null, searchResult)
        }
    })
}
exports.searchElasticSearch = searchElasticSearch;
