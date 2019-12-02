const elasticsearch = require('@elastic/elasticsearch')
var config =  require('../config/config')
var fs = require('fs')
var path = require('path')

const elasticsearchClient = new elasticsearch.Client({ 
    nodes: ['http://localhost:9200'],
    maxRetries: 5,
    requestTimeout: 60000,
    sniffOnStart: true
    })

function indiceSetup(cb){
    var indices = config.indices;
    for(var indice in indices){
        indexCreater(indices[indice].indexName, indices[indice].aliasName, function(err, result){
            if(err){
                console.log(err)
            }else{
                console.log(result)
            }
        })
    }
}
exports.indiceSetup = indiceSetup

var indexCreater = function(indexName, aliasName){
    checkIndice(indexName, function(err, result){
        if(err){
            cb(err)
        }else{
            if(!result){
                var fileName = '../config/'+indexName+'_setting.json';
                fs.readFile(path.join(__dirname, fileName), 'utf8',function(err, setting){
                    if(err){
                        cb(err)
                    }else{
                        createIndice(indexName, setting, function(err, result){
                            if(err){
                                cb(err)
                            }else{
                                checkAlias(indexName, aliasName, function(err, result){
                                    if(err){
                                        cb(err)
                                    }else{
                                        if(!result){
                                            setAlias(indexName, aliasName, function(err){
                                                if(err){
                                                    cb(err)
                                                }else{
                                                    fillIndice(indexName);
                                                }
                                            })
                                        }
                                    }
                                })
                            }
                        })
                    }
                })
            }
        }
    })
}

function fillIndice(indexName){
    
    switch(indexName){
        case 'indexName' :
            break;
        default:

    }
}
exports.fillIndice = fillIndice

function addDocument(indexName ,document, cb){
    var docId = document._id;
    delete document._id
    elasticsearchClient.index({
        id: docId,
        index: indexName,
        body: document
      }, function(err, result){
        if(err){
            cb(err)
        }else{
            cb(null, result)
        }
      })
}
exports.addDocument = addDocument;

function addDocuments(indexName, documents, cb){
    var body = []
    for(var documentIterator=0; documentIterator<documents.length; documentIterator++){
        var action = { index:  { _index: indexName, _id: documents[documentIterator]._id }}
        delete documents[documentIterator]._id
        body.push(action)
        body.push(documents[documentIterator])
    }
    elasticsearchClient.bulk({
        body: body
    }, function(err, result){
        if(err){
            cb(err)
        }else{
            cb(null, result)
        }
    })
}
exports.addDocuments = addDocuments;

function deleteDocument(documentId, indexName, cb){

    elasticsearchClient.delete({
        id: documentId,
        index: indexName
    }, function(err, result){
        if(err){
            cb(err)
        }else{
            cb(null, result)
        }
      })
}
exports.deleteDocument = deleteDocument;

function deleteDocumentByQuery(indexName, query){
    elasticsearchClient.deleteByQuery({
        index: indexName,
        body: query
    }, function(err, result){
            if(err){

            }else{

            }
        })
}
exports.deleteDocumentByQuery = deleteDocumentByQuery;


function createIndice(indexName, setting, cb){

    elasticsearchClient.indices.create({
        index: indexName,
        body: setting
    }, function(err, result){
        if(err){
            cb(err)
        }else{
            cb(null, result)
        }
    })
}
exports.createIndice = createIndice;

function deleteIndice(indexName, cb){

    elasticsearchClient.indices.delete({
        index: indexName
      }, function(err, result){
        if(err){
            cb(err)
        }else{
            cb(null, result)
        }
    })
}
exports.deleteIndice = deleteIndice;

function getDocumentById(indexName, documentId){
    elasticsearchClient.getSource({
        id: documentId,
        index: indexName
      }, function(err, result){
        if(err){
            cb(err)
        }else{
            cb(null, result)
        }
    })
}
exports.getDocumentById = getDocumentById;

function checkIndice(indexName, cb){

    elasticsearchClient.indices.exists({
        index: indexName
      }, function(err, result){
        if(err){
            cb(err)
        }else{
            if(result.body){
                cb(null, true)
            }else{
                cb(null, false)    
            }
        }
    })

}
exports.checkIndice = checkIndice;

function checkAlias(indexName, aliasName, cb){

    elasticsearchClient.indices.existsAlias({
        name: aliasName,
        index: indexName
      }, function(err, result){
        if(err){
            cb(err)
        }else{
            if(result.body){
                cb(null, true)
            }else{
                cb(null, false)
            }
            
        }
    })

}
exports.checkAlias = checkAlias;

function getMapping(indexName, cb){

    elasticsearchClient.indices.getMapping({
        index: indexName
      }, function(err, result){
        if(err){
            cb(err)
        }else{
            cb(null, result)
        }
    })

}
exports.getMapping = getMapping;

function setAlias(indexName, aliasName, cb){

    elasticsearchClient.indices.putAlias({
        index: indexName,
        name: aliasName
      }, function(err, result){
        if(err){
            cb(err)
        }else{
            cb(null, result)
        }
    })

}
exports.setAlias = setAlias;

function setMapping(indexName, mapping, cb){

    elasticsearchClient.indices.putMapping({
        index: indexName,
        body: mapping
      }, function(err, result){
        if(err){
            cb(err)
        }else{
            cb(null, result)
        }
    })

}
exports.setMapping = setMapping;

function searchData(indexName, searchQuery, cb){

    elasticsearchClient.search({
        index: indexName,
        body: searchQuery
      }, function(err, result){
        if(err){
            cb(err)
        }else{
            cb(null, result)
        }
    })

}
exports.searchData = searchData;

function updateData( indexName, document, cb){

    elasticsearchClient.update({
        id: document._id,
        index: indexName,
        body: document
      }, function(err, result){
        if(err){
            cb(err)
        }else{
            cb(null, result)
        }
    })

}
exports.updateData = updateData;
