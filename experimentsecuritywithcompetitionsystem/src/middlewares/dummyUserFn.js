const logging = require('../middlewares/logging');

module.exports.useDummyUserForTesting = (req, res, next) => {

        //When I reinitialize the database from scratch and have prepared
        //a dummy user account (e.g. Bob with userId 100), I will
        //set the value here so that I can use this for testing.
        //This middleware is no longer in use after I have provided the login feature.
        req.body.userId = 100;
        next()
        return;

    } //End of useDummyUserForTesting