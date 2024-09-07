exports.INVALID_CREDENTIALS = {
    message: "Invalid Credentials !!",
    statusCode: 401,    
    errorCode: "INVALID_CREDENTIALS"
};
exports.USERNAME_TAKEN = {
    message: "Username already taken !!",
    statusCode: 406,
    errorCode: "USERNAME_TAKEN"
};
exports.MISSING_FIELDS = {
    message: "Missing fields !!",
    statusCode: 400,
    errorCode: "MISSING_FIELDS"
};
exports.USER_NOT_FOUND = {
    message: "User not found !!",
    statusCode: 404,
    errorCode: "USER_NOT_FOUND"
};
exports.SERVER_ERROR = {
    message: "Some error occured at server !!",
    statusCode: 500,
    errorCode: "SERVER_ERROR"
};
