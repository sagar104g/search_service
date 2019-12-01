var mongoService = require('../services/mongo')
var elasticsearch = require('./elasticSearch')
var index = require('../models/index')

const changeStream = mongoService.getMongoConnection('fu-test-db').watch();
changeStream.on("change", next => {
   mongoToEs(next)
});

function mongoToEs(doc){
    if(doc.documentKey._id && doc.operationType){
        switch(doc.operationType){
            case 'insert':
                index.insertIndex(doc.documentKey._id, doc.ns.coll )
            break;
            case 'update':
                index.insertIndex(doc.documentKey._id, doc.ns.coll )
            break;
            case 'replace':
                index.insertIndex(doc.documentKey._id, doc.ns.coll )
            break;
            case 'delete':
                index.deleteIndex(doc.documentKey._id, doc.ns.coll )
            break;
            default:

        }
    }
}
