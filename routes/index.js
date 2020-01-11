var express = require('express');
var router = express.Router();
var index = require('../models/index')
var config = require('../config/config')
ObjectId = require('mongodb').ObjectID;

router.get('/:index/:id', function (req, res) {
    if (config.indices[req.params.index]) {
        index.getIndex(req.params.id, req.params.index, function (err, result) {
            if (err) {
                res.status(404)
                res.json({ "err": "no doc found" })
            } else {
                res.status(200)
                res.json(result)
            }
        })
    } else {
        res.status(404)
        res.json({ "err": "no valid index" });
    }
})

router.post('/:index/all', function (req, res) {
    if (config.indices[req.params.index]) {
        index.indexAll(req.params.index, req.params.index, function (err, result) {
            if (err) {
                res.status(404)
                res.json({ "err": "no doc found" })
            } else {
                res.status(200)
                res.json({ "message": req.params.index + " indexed sucessfully" })
            }
        })
    } else {
        res.status(404)
        res.json({ "err": "no valid index" });
    }
})

router.post('/:index/:id', function (req, res) {
    if (config.indices[req.params.index]) {
        index.insertIndex(id, req.params.index, function (err, result) {
            if (err) {
                res.status(404)
                res.json({ "err": "no doc found" })
            } else {
                res.status(200)
                res.json({ "message": "doc indexed sucessfully" })
            }
        })
    } else {
        res.status(404)
        res.json({ "err": "no valid index" });
    }
})

router.delete('/:index/:id', function (req, res) {
    if (config.indices[req.params.index]) {
        index.deleteIndex(id, req.params.index, function (err, result) {
            if (err) {
                res.status(404)
                res.json({ "err": "no doc found" })
            } else {
                res.status(200)
                res.json({ "message": "doc deleted sucessfully" })
            }
        })
    } else {
        res.status(404)
        res.json({ "err": "no valid index" });
    }
})

module.exports = router;