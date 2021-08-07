// Import controlers
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const checkUserFn = require('./middlewares/checkUserFn');
const checkUserFnSolution = require('./middlewares/checkUserFnSolution');
const verifytoken = require('./config/auth/verifyToken')

// Match URL's with controllers
exports.appRoute = router => {

    router.post('/api/user/login',authController.processLogin);
    router.post('/api/user/register', authController.processRegister);
    router.post('/api/user/process-submission',   checkUserFn.getClientUserId, userController.processDesignSubmission);
    router.put('/api/user/',  userController.processUpdateOneUser);
    router.put('/api/user/design/',  userController.processUpdateOneDesign);
    router.post('/api/user/processInvitation/', checkUserFn.getClientUserId, userController.processSendInvitation);

    router.get('/api/user/process-search-design/:pagenumber/:search?',  checkUserFn.getClientUserId, userController.processGetSubmissionData);
    router.get('/api/user/process-search-user/:pagenumber/:search?', checkUserFn.getClientUserId, userController.processGetUserData);
    router.get('/api/user/process-search-user-design/:pagenumber/:search?',  userController.processGetSubmissionsbyEmail);
    router.get('/api/user/:recordId',  userController.processGetOneUserData);
    router.get('/api/user/design/:fileId',userController.processGetOneDesignData);
    router.post('/api/controluser/', verifytoken,authController.processAccessControl);

};