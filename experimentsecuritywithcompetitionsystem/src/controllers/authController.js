const user = require('../services/userService');
const auth = require('../services/authService');
const vauth = require('../middlewares/veerasvalidate');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const logging = require('../middlewares/logging');
exports.processLogin = (req, res, next) => {

    let email = req.body.email;
    let password = req.body.password;
    logging.info("processLogin:\n"+email+"\nTime:")
    try {
        auth.authenticate(email, function (error, results) {
            if (error) {
                let message = 'Credentials are not valid.';
                //return res.status(500).json({ message: message });
                //If the following statement replaces the above statement
                //to return a JSON response to the client, the SQLMap or
                //any attacker (who relies on the error) will be very happy
                //because they relies a lot on SQL error for designing how to do 
                //attack and anticipate how much "rewards" after the effort.
                //Rewards such as sabotage (seriously damage the data in database), 
                //data theft (grab and sell). 
                return res.status(500).json({ message: error });

            } else {
                if (results.length == 1) {
                    if ((password == null) || (results[0] == null)) {
                        return res.status(500).json({ message: 'login failed' });
                    }
                    if (bcrypt.compareSync(password, results[0].user_password) == true) {

                        let data = {
                            user_id: results[0].user_id,
                            role_name: results[0].role_name,
                            token: jwt.sign({ id: results[0].user_id }, config.JWTKey, {
                                expiresIn: 1800 //Expires in 30 min
                            })
                        }; //End of data variable setup

                        return res.status(200).json(data);
                    } else {
                        // return res.status(500).json({ message: 'Login has failed.' });
                        return res.status(500).json({ message: error });
                    } //End of passowrd comparison with the retrieved decoded password.
                } //End of checking if there are returned SQL results

            }

        })

    } catch (error) {
        return res.status(500).json({ message: error });
    } //end of try



};

exports.processRegister = (req, res, next) => {
    logging.info('\n\nprocessRegister running.');
    let fullName = req.body.fullName;
    let email = req.body.email;
    let password = req.body.password;
    logging.info("processRegister:\nBy:"+fullName+"\nTime:")
    //Check regex
    //check that userid matches a valid number.
    var reUsername = new RegExp(`^[a-zA-Z0-9\s, ']+$`);
    var reEmail = new RegExp(`^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$`);
    var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    logging.info(reUsername.test(fullName))
    logging.info(reEmail.test(email))
    if ((reUsername.test(fullName)) && (reEmail.test(email)) && (strongRegex.test(password))) {
        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                logging.info('\n\nError on hashing password');
                return res.status(500).json({ statusMessage: 'Unable to complete registration' });
            } else {

                results = user.createUser(fullName, email, hash, function (results, error) {
                    if (results != null) {
                        logging.info(results);
                        return res.status(200).json({ statusMessage: 'Completed registration.' });
                    }else if (error) {
                        logging.info('processRegister method : callback error block section is running.');
                        logging.info(error, '==================================================================');
                        return res.status(500).json({ statusMessage: 'Unable to complete registration' });
                    }else{
                        logging.info('processRegister method : callback error block section is running.');
                        logging.info(error, '==================================================================');
                        return res.status(500).json({ statusMessage: 'Unable to complete registration' });
                    }
                });//End of anonymous callback function


            }
        });
    }else{
        logging.info('\n\nworks fine');
        logging.info(error, '==================================================================');
        return res.status(500).send({ statusMessage: 'REGEX Failure' })
    }
}; // End of processRegister

exports.processAccessControl = (req, res, next) => {

    let userid = req.body.userid;
    let userRole = req.body.userrole;
    logging.info("processAccessControl:\n"+userRole+"\n"+userRole+"\nTime:")
    logging.info("userrole check "+userRole)
    logging.info("user id check "+userid)
    try {
        vauth.authenticate(userid, function (error, results) {
            if (error) {
                logging.info("Error on vauth")
                let message = 'Credentials are not valid.';
                //return res.status(500).json({ message: message });
                //If the following statement replaces the above statement
                //to return a JSON response to the client, the SQLMap or
                //any attacker (who relies on the error) will be very happy
                //because they relies a lot on SQL error for designing how to do 
                //attack and anticipate how much "rewards" after the effort.
                //Rewards such as sabotage (seriously damage the data in database), 
                //data theft (grab and sell). 
                return res.status(500).json({ message: error });

            } else {
                logging.info(results)
                if (results == userRole ) {
                        return res.status(200).json({ userrole: results });
                    } else{
                        
                        return res.status(500).json({ userrole: results });
                    }
                    //End of checking if there are returned SQL results

            }

        })

    } catch (error) {
        return res.status(500).json({ message: error });
    } //end of try



};