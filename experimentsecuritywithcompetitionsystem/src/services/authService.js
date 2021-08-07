config = require('../config/config');
const pool = require('../config/database')
const logging = require('../middlewares/logging');

module.exports.authenticate = (email, callback) => {

        pool.getConnection((err, connection) => {
            if (err) {
                if (err) throw err;

            } else {
                try {
                    connection.query(`SELECT user.user_id, fullname, email, user_password, role_name, user.role_id  
                   FROM user INNER JOIN role ON user.role_id=role.role_id AND email= ?`, [email], (err, rows) => {
                        if (err) {
                            if (err) return callback(err, null);

                        } else {
                            if (rows.length == 1) {
                                logging.info("this is it");
                                logging.info(rows[0].role_name);
                                return callback(null, rows);

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