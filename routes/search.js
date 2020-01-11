var express = require('express');
var router = express.Router();
var search = require('../models/search')

router.get('/:index', function (req, res) {
    if (req.body && req.body.hasOwnProperty("value") && req.params.index) {
        var queryValue = req.body.value;
        var form = req.body.start ? req.body.start : 0;
        var size = req.body.end ? (req.body.end <= 10 ? req.body.end : 10) : 10;
        search.searchQueryBuilder(req.params.index, queryValue, form, size, function (err, result) {
            if (err) {
                console.log(err)
                res.status(403)
                res.send({ "err": "no document found" })
            } else {
                res.status(200)
                res.send(result)
            }
        })
    } else {
        res.status(404)
        res.send({ "err": "no valid index" });
    }
})

module.exports = router;