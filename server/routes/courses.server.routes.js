/* Dependencies */
var express = require('express'), 
    http = require('unirest'),
    router = express.Router();

    router.get("/", function(req, res, next){
        http.get(`https://one.ufl.edu/apix/soc/schedule/?category=CSWP&term=2188`)
            .end(function(response){
                if(response.status !== 200){
                    res.status(500).send("Internal Server Error while attempting to make GET request to ONE.UF API!");
                    return;
                }
                res.status(200).json(response.body[0].COURSES);
            });
    });

    router.get("/professor/:name", function(req, res, next){

        let name = req.params.name;

        if(!name || name.trim() === ""){
            return res.status(400).send("Invalid URL Parameter Input for Professor Name!");
        }

        http.get(`https://one.ufl.edu/apix/soc/schedule/?category=CSWP&term=2188&instructor=${name}`)
            .end(function(response){
                if(response.status !== 200){
                    res.status(500).send("Internal Server Error while attempting to make GET request to ONE.UF API!");
                    return;
                }
                res.status(200).json(response.body[0].COURSES);
            });
    });

    router.get("/title/:title", function(req, res, next){

        let title = req.params.title;

        if(!title || title.trim() === ""){
            return res.status(400).send("Invalid URL Parameter Input for Course Title!");
        }

        http.get(`https://one.ufl.edu/apix/soc/schedule/?category=CSWP&term=2188&course-title=${title}`)
            .end(function(response){
                if(response.status !== 200){
                    res.status(500).send("Internal Server Error while attempting to make GET request to ONE.UF API!");
                    return;
                }
                return res.status(200).json(response.body[0].COURSES);
            });
    });

    router.get("/code/:code", function(req, res, next){

        let code = req.params.code;

        if(!code || code.trim() === ""){
            return res.status(400).send("Invalid URL Parameter Input for Course Code!");
        }

        http.get(`https://one.ufl.edu/apix/soc/schedule/?category=CSWP&term=2188&course-code=${code}`)
            .end(function(response){
                if(response.status !== 200){
                    res.status(500).send("Internal Server Error while attempting to make GET request to ONE.UF API!");
                    return;
                }
                res.status(200).json(response.body[0].COURSES);
            });

    });

module.exports = router;