var express = require('express');
var router = express.Router();
var search = require('../models/search')

router.get('/:index', function(req, res){
    if(req.body && req.body.hasOwnProperty("query")){
        if(req.params.index){
            search.searchQueryBuilder(req.params.index, {}, function(err, result){
                if(err){
                    res.status(404)
                    res.send(err)
                }else{
                    res.status(200)
                    res.send(result)
                }
            })
        }
    }else{
        res.status(404)
        res.send({"err":"no valid index"});
    }
})

module.exports = router;