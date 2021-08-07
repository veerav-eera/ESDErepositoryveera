var jwt = require('jsonwebtoken');
const logging = require('../../middlewares/logging');
var config = require('../config');

function verifyToken(req, res, next){
    logging.info(req.headers);
    

    var token = req.headers['authorization']; //retrieve authorization header's content
    //console.log('token :'+token);

    if(!token || !token.includes('Bearer')){ //process the token || !token.includes('Bearer')
        logging.info('\n\nbearer error')
       res.status(403);
       return res.send({auth:'false', message:'Not authorized!'});
    }else{
       token=token.split('Bearer ')[1]; //obtain the token's value
    //logging.info(token);
       jwt.verify(token, config.JWTKey, function(err, decoded){ //verify token
        if(err){
            logging.info('\n\ndecoder error')
            res.status(403);
            return res.end({auth:false, message:'Not authorized!'});
        }else{
            logging.info(req.body.userid)
            req.params.userid=decoded.userid; //decode the userid and store in req for use
            next();
        }
       });
    }
}

module.exports = verifyToken;