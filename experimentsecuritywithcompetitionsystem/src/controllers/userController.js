const userManager = require('../services/userService');
const fileDataManager = require('../services/fileService');
const config = require('../config/config');
const logging = require('../middlewares/logging');
// 

exports.processDesignSubmission = (req, res, next) => {
    let designTitle = req.body.designTitle;
    let designDescription = req.body.designDescription;
    let userId = req.body.userId;
    let file = req.body.file;
    logging.info("processDesignSubmission:\n"+designTitle+"\n"+designDescription+file+"\n"+designDescription+"\nBy:"+userId+"\nTime:")
    fileDataManager.uploadFile(file, async function(error, result) {
        logging.info('\n\ncheck result variable in fileDataManager.upload code block\n', result);
        logging.info('\n\ncheck error variable in fileDataManager.upload code block\n', error);
        let uploadResult = result;
        if (error) {
            let message = 'Unable to complete file submission.';
            res.status(500).json({ message: message });
            res.end();
        } else {
            //Update the file table inside the MySQL when the file image
            //has been saved at the cloud storage (Cloudinary)
            let imageURL = uploadResult.imageURL;
            let publicId = uploadResult.publicId;
            logging.info('\n\ncheck uploadResult before calling createFileData in try block', uploadResult);
            var reText = new RegExp(`^[a-zA-Z0-9\s, ']+$`);
            try {
                if(reText.test(designTitle)&& reText.test(designDescription)){
                    let result = await fileDataManager.createFileData(imageURL, publicId, userId, designTitle, designDescription);
                    logging.info('\n\nInspert result variable inside fileDataManager.uploadFile code');
                    logging.info(result);
                }else{
                    throw error;
                }
                if (result) {
                    let message = 'File submission completed.';
                    res.status(200).json({ message: message, imageURL: imageURL });
                }else{
                    let message = 'File submission Failed.';
                    res.status(200).json({ message: message});
                }
            } catch (error) {
                let message = 'File submission failed.';
                res.status(500).json({
                    message: message
                });
            }
        }
    })
}; //End of processDesignSubmission

exports.processGetSubmissionData = async(req, res, next) => {
    let pageNumber = req.params.pagenumber;
    let search = req.params.search;
    let userId = req.body.userId;
    logging.info("processGetSubmissionData:\n"+pageNumber+"\n"+search+"\nBy:"+userId+"\nTime:")
    try {
        let results = await fileDataManager.getFileData(userId, pageNumber, search);
        logging.info('\n\nInspect result variable inside processGetSubmissionData code\n', results);
        if (results) {
            var jsonResult = {
                'number_of_records': results[0].length,
                'page_number': pageNumber,
                'filedata': results[0],
                'total_number_of_records': results[2][0].total_records
            }
            return res.status(200).json(jsonResult);
        }
    } catch (error) {
        let message = 'Server is unable to process your request.';
        return res.status(500).json({
            message: error
        });
    }

}; //End of processGetSubmissionData

exports.processGetSubmissionsbyEmail = async(req, res, next) => {
    let pageNumber = req.params.pagenumber;
    let search = req.params.search;
    let userId = req.body.userId;
    logging.info("processGetSubmissionsbyEmail:\n"+pageNumber+"\n"+search+"\nBy:"+userId+"\nTime:")
    try {
        //Need to search and get the id information from the database
        //first. The getOneuserData method accepts the userId to do the search.
        let userData = await userManager.getOneUserDataByEmail(search);
        logging.info('\n\nResults in userData after calling getOneUserDataByEmail');
        logging.info(userData);
        if (userData){       
        let results = await fileDataManager.getFileDataByUserId(userData[0].user_id, pageNumber);
        logging.info('\n\nInspect result variable inside processGetSubmissionsbyEmail code\n', results);
        if (results) {
            var jsonResult = {
                'number_of_records': results[0].length,
                'page_number': pageNumber,
                'filedata': results[0],
                'total_number_of_records': results[2][0].total_records
            }
            return res.status(200).json(jsonResult);
        }//Check if there is any submission record found inside the file table
    }//Check if there is any matching user record after searching by email
    } catch (error) {
        let message = 'Server is unable to process your request.';
        return res.status(500).json({
            message: error
        });
    }

}; //End of processGetSubmissionsbyEmail

exports.processGetUserData = async(req, res, next) => {
    let pageNumber = req.params.pagenumber;
    let search = req.params.search;
    logging.info("processGetUserData:\n"+pageNumber+"\n"+search+"\nTime:")
    try {
        let results = await userManager.getUserData(pageNumber, search);
        logging.info('\n\nInspect result variable inside processGetUserData code\n', results);
        if (results) {
            var jsonResult = {
                'number_of_records': results[0].length,
                'page_number': pageNumber,
                'userdata': results[0],
                'total_number_of_records': results[2][0].total_records
            }
            return res.status(200).json(jsonResult);
        }
    } catch (error) {
        let message = 'Server is unable to process your request.';
        return res.status(500).json({
            message: error
        });
    }

}; //End of processGetUserData

exports.processGetOneUserData = async(req, res, next) => {
    let recordId = req.params.recordId;
    logging.info("processGetOneUserData:\n"+recordId+"\nTime:")
    try {
	logging.info("getting userdata");
        let results = await userManager.getOneUserData(recordId);
        logging.info('\n\nInspect result variable inside processGetOneUserData code\nresults: '+results);
        if (results) {
            var jsonResult = {
                'userdata': results[0],
            }
            return res.status(200).json(jsonResult);
        }
    } catch (error) {
        let message = 'Server is unable to process your request.';
        return res.status(500).json({
            message: error
        });
    }

}; //End of processGetOneUserData

exports.processUpdateOneUser = async(req, res, next) => {
    logging.info('\n\nprocessUpdateOneUser running');
    //Collect data from the request body 
    let recordId = req.body.recordId;
    let newRoleId = req.body.roleId;
    logging.info("Send Invitation:\n"+recordId+"\n"+newRoleId+"\nTime:")
    try {
        results = await userManager.updateUser(recordId, newRoleId);
        logging.info(results);
        return res.status(200).json({ message: 'Completed update' });
    } catch (error) {
        logging.info('\n\nprocessUpdateOneUser method : catch block section code is running');
        logging.info(error, '=======================================================================');
        return res.status(500).json({ message: 'Unable to complete update operation' });
    }


}; //End of processUpdateOneUser

exports.processGetOneDesignData = async(req, res, next) => {
    let recordId = req.params.fileId;
    console.log(recordId)
    logging.info("processGetOneDesignData:\n"+recordId+"\nTime:")
    try {
        let results = await userManager.getOneDesignData(recordId);
        logging.info('\n\nInspect result variable inside processGetOneFileData code\n', results);
        if (results) {
            var jsonResult = {
                'filedata': results[0],
            }
            return res.status(200).json(jsonResult);
        }
    } catch (error) {
        let message = 'Server is unable to process the request.';
        return res.status(500).json({
            message: error
        });
    }

}; //End of processGetOneDesignData

exports.processSendInvitation = async(req, res, next) => {
    
    let userId = req.body.userId;
    let recipientEmail = req.body.recipientEmail;
    let recipientName = req.body.recipientName;
    logging.info('\n\nuserController processSendInvitation method\'s received values');
    logging.info(userId);
    logging.info(recipientEmail);
    logging.info(recipientName);
    logging.info("Send Invitation:\n"+recipientEmail+"\n"+recipientName+"\n by:"+userId+"\nTime:")
    var reUsername = new RegExp(`^[a-zA-Z0-9\s, ']+$`);
    var reEmail = new RegExp(`^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$`);
    try {
        if(reUsername.test(recipientName)&&reEmail.test(recipientEmail)){

            //Need to search and get the user's email information from the database
            //first. The getOneuserData method accepts the userId to do the search.
            let userData = await userManager.getOneUserData(userId);
            logging.info(userData);
            let results = await userManager.createOneEmailInvitation(userData[0],recipientName, recipientEmail);
            if (results) {
                var jsonResult = {
                    result: 'Email invitation has been sent to ' + recipientEmail + ' ',
                }
                return res.status(200).json(jsonResult);
            }
        }else{
            throw err;
        }
    } catch (error) {
        logging.info(error);
        let message = 'Server is unable to process the request.';
        return res.status(500).json({
            message: message,
            error:error
        });
    }

}; //End of processSendInvitation

exports.processUpdateOneDesign = async(req, res, next) => {
    logging.info('\n\nprocessUpdateOneFile running');
    //Collect data from the request body 
    let fileId = req.body.fileId;
    let designTitle = req.body.designTitle;
    let designDescription = req.body.designDescription;
    logging.info("\n"+designTitle+"\n"+designDescription+"\n"+fileId+"\n")
    try {
        results = await userManager.updateDesign(fileId, designTitle, designDescription);
        logging.info(results);
        return res.status(200).json({ message: 'Completed update' });
    } catch (error) {
        logging.info('\n\nprocessUpdateOneUser method : catch block section code is running');
        logging.info(error, '=======================================================================');
        return res.status(500).json({ message: 'Unable to complete update operation' });
    }


}; //End of processUpdateOneDesign