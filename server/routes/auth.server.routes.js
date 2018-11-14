/* Dependencies */
var express = require('express'),
    User = require('../models/users.server.model.js');
    router = express.Router();

function getUser(username) {
    return new Promise((resolve, reject) => {
        User.findOne({username}, function(err, doc){
            if(err){
                reject(err);
            }
            else{
                resolve(doc);
            }
        });
    });
}

function getUserByEmail(email) {
    return new Promise((resolve, reject) => {
        User.findOne({ email }, function(err, doc){
            if(err){
                reject(err);
            }
            else{
                resolve(doc);
            }
        });
    });
}

router.put("/change", async (req, res, next) => {

    try {
        const user = await getUser(req.body.username);
        if (!user) {
            return res.status(400).send("Error in PUT request: username entered does not exist!");
        }
        if(req.body.oldpass !== user.password){
            return res.status(401).send("Unauthorized attempt to change password. Incorrect old password entered!");
        }

        user.password = req.body.newpass;
        var putUser = new User(user);
    
        putUser.save(function(err){
            if(err){
                return res.status(500).send("Internal Server Error while trying to save document!");
            }
            return res.status(200).json(putUser);
        });

    } catch (error) {
        return res.status(500).send("Internal Server Error occured while trying to query MongoDB!");
    }
});

router.delete("/delete", async (req, res, next) => {

    try {
        const user = await getUser(req.body.username);
        if (!user) {
            return res.status(400).send(`The username (${req.body.username}) you tried to delete does not exist in the system!`);
        }

        User.findOneAndRemove({username: req.body.username}, function(err, data){
            if(err){
                return res.status(500).send("Internal Server Error occured while attempting to delete user object with username " + req.body.username);
            }
            return res.status(200).json(data);
        });

    } catch (error) {
        return res.status(500).send("Internal Server Error occured while trying to query MongoDB!");
    }
});

router.post("/create", async (req, res, next) => {

    try {
        const user = await getUser(req.body.username);
        if (user) {
            return res.status(400).send("Invalid request! Username already exists in the system!");
        }

        const userByEmail = await getUserByEmail(req.body.email);

        if (userByEmail) {
            return res.status(400).send("Invalid request! Email already exists in the system!");
        }

        var userObject = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            isAdmin: req.body.isAdmin,
            name: req.body.name,
            role: req.body.role
        };
    
        var newUser = new User(userObject);
        newUser.save(function(err){
    
            if(err){
                console.log(err.message);
                return res.status(500).send("Internal Server Error while trying to write new user object into DB!");
            }
    
            return res.status(200).json(newUser);
    
        });

    } catch (error) {
        return res.status(500).send("Internal Server Error occured while trying to query MongoDB!");
    }
});

router.post("/authorize", async (req, res, next) => {

    try {
        const user = await getUser(req.body.username);
        if (!user) {
            return res.status(400).send("The following username entered does not exist in the DB: " + req.body.username);
        }

        if(user.password === req.body.password){
            req.session = {
                user: user
            };
            if(user.isAdmin)
                return res.status(200).send("Admin Login!");
            return res.status(201).send("User Login!");
        }
    
        return res.status(401).send("UNAUTHORIZED ACCESS: Incorrect password for username " + req.body.username + "!!!");
    
    } catch (error) {
        return res.status(500).send("Internal Server Error occured while trying to query MongoDB!");
    }


});

router.delete("/logout", async (req, res, next) => {

    try {
        req.session.reset();
        res.status(200).send('logged out!');

    } catch (error) {
        return res.status(500).send("Internal Server Error Occured!");
    }
});

module.exports = router;