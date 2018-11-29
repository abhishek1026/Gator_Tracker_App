/* Dependencies */
var express = require('express'), 
    http = require('unirest'),
    User = require('../models/users.server.model.js'),
    router = express.Router();

    router.get("/", function(req, res, next){
        http.get(`https://one.ufl.edu/apix/soc/schedule/?category=CSWP&term=2188`)
            .end(function(response){
                if(response.status !== 200){
                    res.status(500).send("Internal Server Error while attempting to make GET request to ONE.UF API!");
                    return;
                }
                res.status(200).json({courses: response.body[0].COURSES, user: req.session.user});
            });
    });

    router.get("/TA/:code", function(req, res, next){

        let code = req.params.code;
        let result = [];

        if(!code || code.trim() === ""){
            return res.status(400).send("Invalid URL Parameter Input for Professor Name/Term!");
        }

        User.find({}, function(err, users){
            if(err){
                return res.status(500).send("Internal Server Error Occured while querying MongoDB!");
            }
            users.forEach(function(user){
                if(user.role === "TA" && user.courses.indexOf(code) !== -1){
                    result.push(user.name);
                }
            });
            return res.json(result);
        });

        
    });

    router.get("/professor/:term/:name", function(req, res, next){

        let name = req.params.name;
        let term = req.params.term;

        if(!name || name.trim() === "" || !term || term.trim() === ""){
            return res.status(400).send("Invalid URL Parameter Input for Professor Name/Term!");
        }

        http.get(`https://one.ufl.edu/apix/soc/schedule/?category=CSWP&term=${term}&instructor=${name}`)
            .end(function(response){
                if(response.status !== 200){
                    res.status(500).send("Internal Server Error while attempting to make GET request to ONE.UF API!");
                    return;
                }
                res.status(200).json(response.body[0].COURSES);
            });
    });

    router.get("/title/:term/:title", function(req, res, next){

        let title = req.params.title;
        let term = req.params.term;

        if(!title || title.trim() === "" || !term || term.trim() === ""){
            return res.status(400).send("Invalid URL Parameter Input for Course Title/Term!");
        }

        http.get(`https://one.ufl.edu/apix/soc/schedule/?category=CSWP&term=${term}&course-title=${title}`)
            .end(function(response){
                if(response.status !== 200){
                    res.status(500).send("Internal Server Error while attempting to make GET request to ONE.UF API!");
                    return;
                }
                return res.status(200).json(response.body[0].COURSES);
            });
    });

    router.get("/code/:term/:code", function(req, res, next){

        let code = req.params.code;
        let term = req.params.term;

        if(!code || code.trim() === "" || !term || term.trim() === ""){
            return res.status(400).send("Invalid URL Parameter Input for Course Code/Term!");
        }

        http.get(`https://one.ufl.edu/apix/soc/schedule/?category=CSWP&term=${term}&course-code=${code}`)
            .end(function(response){
                if(response.status !== 200){
                    res.status(500).send("Internal Server Error while attempting to make GET request to ONE.UF API!");
                    return;
                }
                res.status(200).json(response.body[0].COURSES);
            });

    });

module.exports = router;