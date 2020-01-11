var config = require('../config/config');
const request = require('request');

var authorization = function (req, res, next) {
    var splitUrl = req.url ? req.url.split("/") : [];
    if (splitUrl[1] == 'status') {
        return next()
    }
    var modelName = splitUrl.length >= 3 ? splitUrl[2] : null;
    var accessType = req.method == 'POST' ? 'WRITE' : (req.method == 'GET' ? 'READ' : null)
    if (modelName && accessType && req.headers && modelName != 'status') {
        const options = {
            url: config.AUTH_BASE_URL + '/permission/check_role',
            body: JSON.stringify({
                modelName: modelName,
                accessType: accessType,
                serviceName: 'search_service'
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': req.headers.authorization,
            }
        }
        request.post(options, function (err, response) {
            if (err) {
                res.json({ "mesage": "not authorize" })
            } else {
                let body = JSON.parse(response.body)
                if (body && body.allow) {
                    return next()
                } else {
                    res.json({ "mesage": "not authorize" })
                }
            }
        })
    } else {
        res.json({ "mesage": "not authorize" })
    }
}
exports.authorization = authorization;