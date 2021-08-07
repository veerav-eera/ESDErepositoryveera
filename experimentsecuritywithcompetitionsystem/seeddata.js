const express = require("express");
const config = require('./src/config/config');




//Reference: https://cloudinary.com/documentation/node_integration
const cloudinary = require('cloudinary').v2;
const pool = require('./src/config/database')


cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
    upload_preset: 'upload_to_design'
});
async function prepareRitaDataAndFiles() {
    try {
        let createUserResult = await createUser('rita', 'rita@designer.com', '$2b$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WrxJx/FeC9.gCyYvIbs6', 2);
        console.log('\n\nInspecting createUserResult variable\n', createUserResult)
        let index = 1;
        //I have prepared 12 design data for the user rita.
        //The code here need to create 1 user record, 12 images in cloudinary and 12 records in the file table
        for (index = 1; index <= 12; index++) {
            let designTitle = `rita design ${index}`;
            let designDescription = `rita design ${index} description text 1 text 2 text 3 text 4 ....`;
            try {
                let uploadResult = await uploadFileToCloudinary(`./rita_design_files/rita_${index}.png`);
                let imageURL = uploadResult.imageURL;
                let publicId = uploadResult.publicId;
                console.log('\n\nChecking uploadResult before calling createFileData in try block\n', uploadResult);
                try {
                    let createFileDataResult = await createFileData(imageURL, publicId, createUserResult.insertId, designTitle, designDescription);
                    if (createFileDataResult) {
                        console.log(`rita_design${index}.png is uploaded. 1 record created in file table.`)
                    }
                } catch (error) {
                    console.log(`rita_design${index}.png is is not uploaded. Did not create 1 record in file table.`)
                    console.log(error);
                }
            } catch (error) {
                console.log('\n\nuploadFileToCloudinary has error\n', error);

            } //End of try .. catch for calling uploadFileToCloudinary
        } //End of for loop block

    } catch (error) {
        console.log('\n\nCreate rita user record has error\n', error);
        return;
    } finally {
        console.log('\n\nData seeding of rita record in user table, rita file record in file table and image files in cloud has completed.');
        return;
    }
} //End of function prepareRitaDataAndFiles

function createFileData(imageURL, publicId, userId, designTitle, designDescription) {
    return new Promise((resolve, reject) => {
        //I referred to https://www.codota.com/code/javascript/functions/mysql/Pool/getConnection
        //to prepare the following code pattern which does not use callback technique (uses Promise technique)
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('\n\nDatabase connection error ', err);
                resolve(err);
            } else {
                let query = `INSERT INTO file ( cloudinary_file_id, cloudinary_url , 
                 design_title, design_description,created_by_id ) 
                 VALUES (?,'${imageURL}','${designTitle}','${designDescription}','${userId}') `;

                connection.query(query, [publicId], (err, rows) => {
                    if (err) {
                        console.log('\n\nError on query on creating record inside file table', err);
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation

} //End of createFileData

//roleId=1 for admin roleId=2 for user
function createUser(fullname, email, password, roleId) {

    return new Promise((resolve, reject) => {
        //I referred to https://www.codota.com/code/javascript/functions/mysql/Pool/getConnection
        //to prepare the following code pattern which does not use callback technique (uses Promise technique)
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('\n\nDatabase connection error ', err);
                resolve(err);
            } else {
                connection.query('INSERT INTO user ( fullname, email, user_password, role_id) VALUES (?,?,?,?) ', [fullname, email, password, roleId], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    connection.release();
                });
            }
        });
    }); //End of new Promise object creation
} //End of createUser
function uploadFileToCloudinary(filePath) {
    return new Promise((resolve, reject) => {
        //The following code will upload image to cloudinary
        cloudinary.uploader.upload(filePath, { upload_preset: 'upload_to_design' })
            .then((result) => {
                //Inspect whether I can obtain the file storage id and the url from cloudinary
                //after a successful upload.
                //console.log({imageURL: result.url, publicId: result.public_id});
                let data = { imageURL: result.url, publicId: result.public_id, status: 'success' };
                resolve(data);

            }).catch((error) => {

                let message = 'fail';
                reject(error);

            }); //End of try..catch
    }); //End of Promise
} //End of uploadFileToCloudinary



async function prepareAdminRobertData() {
    try {
        let createUserResult = await createUser('robert', 'robert@admin.com', '$2b$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WrxJx/FeC9.gCyYvIbs6', 1);
        console.log('\n\nInspecting createUserResult variable\n', createUserResult)
    } catch (error) {
        console.log('\n\nCreate robert user record has error\n', error);
        return;
    } finally {
        console.log('\n\nData seeding of robert record in user table has completed.');
        return;
    }
} //End of function prepareAdminRobertData 

async function prepareDeignerUserData() {
    try {
        let createUserResult = await createUser('bob', 'bob@designer.com', '$2b$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WrxJx/FeC9.gCyYvIbs6', 2);
        createUserResult = await createUser('braddy', 'braddy@designer.com', '$2b$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WrxJx/FeC9.gCyYvIbs6', 2);
        createUserResult = await createUser('josh', 'josh@designer.com', '$2b$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WrxJx/FeC9.gCyYvIbs6', 2);
        createUserResult = await createUser('john', 'john@designer.com', '$2b$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WrxJx/FeC9.gCyYvIbs6', 2);
        createUserResult = await createUser('fred', 'fred@designer.com', '$2b$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WrxJx/FeC9.gCyYvIbs6', 2);
        createUserResult = await createUser('ashley', 'ashley@designer.com', '$2b$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WrxJx/FeC9.gCyYvIbs6', 2);
        createUserResult = await createUser('amy', 'amy@designer.com', '$2b$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WrxJx/FeC9.gCyYvIbs6', 2);
        createUserResult = await createUser('anita', 'anita@designer.com', '$2b$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WrxJx/FeC9.gCyYvIbs6', 2);
        createUserResult = await createUser('eddy', 'eddy@designer.com', '$2b$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WrxJx/FeC9.gCyYvIbs6', 2);
        createUserResult = await createUser('larry', 'larry@designer.com', '$2b$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WrxJx/FeC9.gCyYvIbs6', 2);
        createUserResult = await createUser('ahtan', 'ahtan@designer.com', '$2b$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WrxJx/FeC9.gCyYvIbs6', 2);
        //Creating a user who is by default a user role record. This test record is used 
        //for simulating the use case, whereby the administrator robert@admin.com login to change
        //joe user to "admin" role.
        createUserResult = await createUser('joe', 'joe@admin.com', '$2b$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WrxJx/FeC9.gCyYvIbs6', 2);
        createUserResult = await createUser('gabby', 'gabby@designer.com', '$2b$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WrxJx/FeC9.gCyYvIbs6', 2);
        console.log('\n\nData seeding of user records in user table has completed.');
    } catch (error) {
        console.log(error);
        return;
    } finally {
        return;
    }
} //End of function prepareDesignerUserData

//startSeedingData is the root function method which is called 
//to execute three other functions

async function startSeedingData(){
try{
await prepareRitaDataAndFiles(); //Create records in user and file table to describe Rita who has 12 file submissions.
await prepareAdminRobertData(); //Create admin role user.
await prepareDeignerUserData(); //Create additional 13 user records.
}catch(error){

}finally{
    console.log('\n\nData seeding operations has completed');
    process.exit();
}
};

startSeedingData();