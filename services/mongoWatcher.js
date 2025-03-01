var mongoService = require('../services/mongo')
var elasticsearch = require('./elasticSearch')
var index = require('../models/index')
var config = require('../config/config')

const changeStream = mongoService.getMongoConnection(config.MAIN_DB).watch();
changeStream.on("change", next => {
    mongoToEs(next)
});

function mongoToEs(doc) {
    if (doc.documentKey._id && doc.operationType) {
        if (doc.ns.coll == 'video' || doc.ns.coll == 'product' || doc.ns.coll == 'user') {
            switch (doc.operationType) {
                case 'insert':
                    index.insertIndex(doc.documentKey._id, doc.ns.coll, function (err, result) {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log("doc indexed")
                        }
                    })
                    break;
                case 'update':
                    index.insertIndex(doc.documentKey._id, doc.ns.coll, function (err, result) {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log("doc indexed")
                        }
                    })
                    break;
                case 'replace':
                    index.insertIndex(doc.documentKey._id, doc.ns.coll, function (err, result) {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log("doc indexed")
                        }
                    })
                    break;
                case 'delete':
                    index.deleteIndex(doc.documentKey._id, doc.ns.coll, function (err, result) {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log("doc deleted")
                        }
                    })
                    break;
                default:

            }
        }
    }
}
