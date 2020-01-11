const elasticsearch = require('@elastic/elasticsearch')
var config = require('../config/config')
var fs = require('fs')
var path = require('path')
var indexData = require('../models/index');

var nodes = [];
for (node in config.elasticsearch) {
    let connectionString = config.elasticsearch[node].protocol + '://' + config.elasticsearch[node].host + ':' + config.elasticsearch[node].port;
    nodes.push(connectionString)
}

const elasticsearchClient = new elasticsearch.Client({
    nodes: nodes,
    maxRetries: 5,
    requestTimeout: 60000,
    sniffOnStart: true
})

function indexSetup(cb) {
    var indices = config.indices;
    for (var indice in indices) {
        indexCreater(indices[indice].indexName, indices[indice].aliasName, function (err, result) {
            if (err) {
                console.log(err)
                cb(err)
            } else {
                console.log(result)
                cb(null, result)
            }
        })
    }
}
exports.indexSetup = indexSetup

var indexCreater = function (indexName, aliasName) {
    checkIndex(indexName, function (err, result) {
        if (err) {
            cb(err)
        } else {
            if (!result) {
                var fileName = '../config/' + indexName + '_setting.json';
                fs.readFile(path.join(__dirname, fileName), 'utf8', function (err, setting) {
                    if (err) {
                        cb(err)
                    } else {
                        createIndice(indexName, setting, function (err, result) {
                            if (err) {
                                cb(err)
                            } else {
                                var fileName = '../config/' + indexName + '_mapping.json';
                                fs.readFile(path.join(__dirname, fileName), 'utf8', function (err, mapping) {
                                    if (err) {
                                        cb(err)
                                    } else {
                                        setMapping(indexName, mapping, function (err, result) {
                                            if (err) {
                                                cb(err)
                                            } else {
                                                checkAlias(indexName, aliasName, function (err, result) {
                                                    if (err) {
                                                        cb(err)
                                                    } else {
                                                        if (!result) {
                                                            setAlias(indexName, aliasName, function (err) {
                                                                if (err) {
                                                                    cb(err)
                                                                } else {
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
                        })
                    }
                })
            }
        }
    })
}

function fillIndice(indexName) {

    switch (indexName) {
        case 'user':
            indexData.indexAll(indexName, indexName, function (err, result) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(result)
                }
            })
            break;
        case 'product':
            indexData.indexAll(indexName, indexName, function (err, result) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(result)
                }
            })
            break;
        case 'video':
            indexData.indexAll(indexName, indexName, function (err, result) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(result)
                }
            })
            break;
        default:

    }
}
exports.fillIndice = fillIndice

function addDocument(indexName, document, cb) {
    var docId = document._id;
    delete document._id
    document.active = document.active == 1 ? true : (document.active == true ? true : false)
    if (indexName == 'video') {
        document.live = document.live == 1 ? true : (document.live == true ? true : false)
    }
    elasticsearchClient.index({
        id: docId,
        index: indexName,
        body: document
    }, function (err, result) {
        if (err) {
            cb(err)
        } else {
            cb(null, result)
        }
    })
}
exports.addDocument = addDocument;

function addDocuments(indexName, documents, cb) {
    var body = []
    for (var documentIterator = 0; documentIterator < documents.length; documentIterator++) {
        documents[documentIterator].active = documents[documentIterator].active == 1 ? true : (documents[documentIterator].active == true ? true : false)
        if (indexName == 'video') {
            documents[documentIterator].live = documents[documentIterator].live == 1 ? true : (documents[documentIterator].live == true ? true : false)
        }
        var action = { index: { _index: indexName, _id: documents[documentIterator]._id } }
        delete documents[documentIterator]._id
        body.push(action)
        body.push(documents[documentIterator])
    }
    elasticsearchClient.bulk({
        body: body
    }, function (err, result) {
        if (err) {
            cb(err)
        } else {
            cb(null, result)
        }
    })
}
exports.addDocuments = addDocuments;

function deleteDocument(documentId, indexName, cb) {

    elasticsearchClient.delete({
        id: documentId,
        index: indexName
    }, function (err, result) {
        if (err) {
            cb(err)
        } else {
            cb(null, result)
        }
    })
}
exports.deleteDocument = deleteDocument;

function deleteDocumentByQuery(indexName, query) {
    elasticsearchClient.deleteByQuery({
        index: indexName,
        body: query
    }, function (err, result) {
        if (err) {

        } else {

        }
    })
}
exports.deleteDocumentByQuery = deleteDocumentByQuery;


function createIndice(indexName, setting, cb) {

    elasticsearchClient.indices.create({
        index: indexName,
        body: setting
    }, function (err, result) {
        if (err) {
            cb(err)
        } else {
            cb(null, result)
        }
    })
}
exports.createIndice = createIndice;

function deleteIndice(indexName, cb) {

    elasticsearchClient.indices.delete({
        index: indexName
    }, function (err, result) {
        if (err) {
            cb(err)
        } else {
            cb(null, result)
        }
    })
}
exports.deleteIndice = deleteIndice;

function getDocumentById(indexName, documentId) {
    elasticsearchClient.getSource({
        id: documentId,
        index: indexName
    }, function (err, result) {
        if (err) {
            cb(err)
        } else {
            cb(null, result)
        }
    })
}
exports.getDocumentById = getDocumentById;

function checkIndex(indexName, cb) {

    elasticsearchClient.indices.exists({
        index: indexName
    }, function (err, result) {
        if (err) {
            cb(err)
        } else {
            if (result.body) {
                cb(null, true)
            } else {
                cb(null, false)
            }
        }
    })

}
exports.checkIndex = checkIndex;

function checkAlias(indexName, aliasName, cb) {

    elasticsearchClient.indices.existsAlias({
        name: aliasName,
        index: indexName
    }, function (err, result) {
        if (err) {
            cb(err)
        } else {
            if (result.body) {
                cb(null, true)
            } else {
                cb(null, false)
            }

        }
    })

}
exports.checkAlias = checkAlias;

function getMapping(indexName, cb) {

    elasticsearchClient.indices.getMapping({
        index: indexName
    }, function (err, result) {
        if (err) {
            cb(err)
        } else {
            cb(null, result)
        }
    })

}
exports.getMapping = getMapping;

function setAlias(indexName, aliasName, cb) {

    elasticsearchClient.indices.putAlias({
        index: indexName,
        name: aliasName
    }, function (err, result) {
        if (err) {
            cb(err)
        } else {
            if (result.body && result.body.acknowledged) {
                cb(null, result)
            } else {
                cb(result)
            }
        }
    })

}
exports.setAlias = setAlias;

function setMapping(indexName, mapping, cb) {

    elasticsearchClient.indices.putMapping({
        index: indexName,
        body: mapping
    }, function (err, result) {
        if (err) {
            console.log(err)
            cb(err)
        } else {
            if (result.body && result.body.acknowledged) {
                cb(null, result)
            } else {
                console.log(result)
                cb(result)
            }
        }
    })

}
exports.setMapping = setMapping;

function searchData(indexName, searchQuery, size, from, cb) {
    size = size ? (size > 10 ? 10 : size) : 10
    from = from || 0
    // scroll option for smooth scrolling and eficient also
    elasticsearchClient.search({
        index: indexName,
        body: searchQuery,
        size: size,
        from: from,
        search_type: 'query_then_fetch'
    }, function (err, result) {
        if (err) {
            cb(err)
        } else {
            cb(null, result)
        }
    })

}
exports.searchData = searchData;

function updateData(indexName, document, cb) {

    elasticsearchClient.update({
        id: document._id,
        index: indexName,
        body: document
    }, function (err, result) {
        if (err) {
            cb(err)
        } else {
            cb(null, result)
        }
    })

}
exports.updateData = updateData;
