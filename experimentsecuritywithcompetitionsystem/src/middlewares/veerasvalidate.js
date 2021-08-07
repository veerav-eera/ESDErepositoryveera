config = require('../config/config');
const { Console } = require('console');
const pool = require('../config/database')
const logging = require('../middlewares/logging');

module.exports.authenticate = (user_id, callback) => {
        logging.info("userID is:"+ user_id)
        pool.getConnection((err, connection) => {
            if (err) {
                if (err) throw err;

            } else {
                try {
                    connection.query(`SELECT user.user_id, fullname, email, user_password, role_name, user.role_id  
                   FROM user INNER JOIN role ON user.role_id=role.role_id AND user_id= ?`, [user_id], (err, rows) => {
                        if (err) {
                            if (err) return callback(err, null);

                        } else {
                            if (rows.length == 1) {
                                logging.info("role name" + rows[0].role_name);
                                return callback(null,rows[0].role_name);
                            } else {

                                return callback('Login has failed', null);
                            }
                        }
                        connection.release();

                    });
                } catch (error) {
                    return callback(error, null);;
                }
            }
        }); //End of getConnection

    } //End of authenticate