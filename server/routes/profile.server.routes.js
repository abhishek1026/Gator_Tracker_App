/* Dependencies */
var express = require('express'),
    User = require('../models/users.server.model.js'),
    router = express.Router();


router.post("/link", function (req, res, next) {

    let user = req.session.user;
    if (!user || !user.isAdmin) {
        return res.status(400).send("Invalid Request!");
    }

    User.findOneAndUpdate({ username: user.username }, { linkedIn: (req.body.linkedIn || ""), twitter: (req.body.twitter || "") }
        , function (err, doc) {
            if (err) {
                return res.status(500).send("Internal Server Error during MongoDB Write!");
            }
            return res.status(200).json(doc);
        });

});

module.exports = router;