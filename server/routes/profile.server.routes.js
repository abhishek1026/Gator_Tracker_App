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

router.post("/location", function (req, res, next) {

    let user = req.session.user;
    if (!user || !user.isAdmin) {
        return res.status(400).send("Invalid Request!");
    }

    User.findOneAndUpdate({ username: user.username }, { location: { longitude: req.body.long, latitude: req.body.lat}, lastBuilding: req.body.bldg}
        , function (err, doc) {
            if (err) {
                return res.status(500).send("Internal Server Error during MongoDB Write!");
            }
            return res.status(200).json(doc);
        });

});

router.put("/OH", function(req, res, next){

    let user = req.session.user;
    if (!user || !user.isAdmin) {
        return res.status(400).send("Invalid Request!");
    }

    User.findOne({username: user.username}, function(err, doc){

        if(err){
            return res.status(500).send("keks");
        }

        let alias = req.body.alias;

        doc.officeHours.forEach(function(oh, i){
            if(oh.alias.trim() === alias){
                doc.officeHours.splice(i, 1);
                doc.save(function(err){
                    if(err){
                        return res.status(500).send("keks");
                    }
                    return res.status(200).json(doc);
                });
            }
        });

    });

});

router.post("/OH", function (req, res, next) {

    let user = req.session.user;
    if (!user || !user.isAdmin) {
        return res.status(400).send("Invalid Request!");
    }

    User.find({ username: user.username },
        function (err, docs) {
            if (err) {
                return res.status(500).send("Internal Server Error during MongoDB Write!");
            }
            let doc = docs[0];
            let found = false;
            let oh = req.body.oh;
            let alias = oh.alias;

            for (let i = 0; i < doc.officeHours.length; i++) {
                let officeHour = doc.officeHours[i];
                if (officeHour.alias === alias) {
                    doc.officeHours[i] = oh;
                    found = true;
                    break;
                }
            }

            if (found) {
                let newDoc = new User(doc);
                newDoc.save(function (err) {
                    if (err) {
                        return res.status(500).send("Internal Server Error!");
                    }
                    return res.status(200).json(doc);
                });
                return;
            }


            doc.officeHours.push(oh);
            let newDoc = new User(doc);
            newDoc.save(function (err) {
                if (err) {
                    return res.status(500).send("Internal Server Error!");
                }
                return res.status(200).json(doc);
            });

        });

});

router.post("/addCourse", function(req, res, next){

    let user = req.session.user;

    if (!user) {
        return res.status(400).send("Invalid Request!");
    }

    let code = req.body.code;
    
    User.findOne({username: user.username}, function(err, doc){

        if(err){
            return res.status(500).send("Internal Server Error occured while trying to write to MongoDB!");
        }

        doc.courses.push(code);
        doc.save(function(err){
            if(err){
                console.log(err.message);
                return res.status(500).send("Internal Server Error Keks!");
            }
            return res.status(200).send(doc);
        });
        
    });

});

router.post("/removeCourse", function(req, res, next){

    let user = req.session.user;

    if (!user) {
        return res.status(400).send("Invalid Request!");
    }

    let code = req.body.code;
    
    User.findOne({username: user.username}, function(err, doc){

        if(err){
            return res.status(500).send("Internal Server Error occured while trying to write to MongoDB!");
        }

        doc.courses.splice(doc.courses.indexOf(code), 1);
        doc.save(function(err){
            if(err){
                return res.status(500).send("Internal Server Error occured while trying to write to MongoDB!");
            }
            return res.status(200).send(doc);
        });
        
        
    });

});

module.exports = router;