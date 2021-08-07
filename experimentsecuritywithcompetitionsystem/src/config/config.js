//config.js
const dotenv = require('dotenv');
dotenv.config(); //Build the process.env object.
module.exports = {
    databaseUserName: process.env.DB_USERNAME,
    databasePassword: process.env.DB_PASSWORD,
    databaseName: process.env.DB_DATABASE_NAME,

    cloudinaryUrl: process.env.CLOUDINARY_URL,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    JWTKey: process.env.JWTKEY,

    mailtrapUserName: process.env.MAILTRAP_USERNAME,
    mailtrapPassword:process.env.MAILTRAP_PASSWORD
};
//Reference:
//https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786
