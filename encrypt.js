//  Replace with your password salty key
var passwordSecretKey = 'replace me';
//  Replace with your token salty key
var tokenSecretKey = 'replace me';

var crypto = require('crypto-js');
var jwt = require('jsonwebtoken');

//  TODO: Split password encryption and token encryption in two files
//  TODO: Default comment format

/*
    31/07/2016
    This function is responsible to encrypt a password that it receives from a parameter.
    The parameter it receives should be an string or a number
    It uses a secret key to salty the password so it becomes encrypted via the AES algorithm
    The AES algorithm is provided by the crypto package, so we don`t implement it.
    After the encryptation it returns the encrypted password as a string
*/
exports.passwordEncrypt = function(password){
    
    return new Promise((resolve, reject) => {

        //  Check if this can lead to any errors
        if (typeof(passwordSecretKey) != 'null'){
            if (typeof(password) == 'null') return reject('Password to be encrypted is null.');

            // Encrypt Message with our salty key
            var encryptedPassword = crypto.AES.encrypt(password, passwordSecretKey);
            
            return resolve(encryptedPassword.toString());
        }
    });
};

/*
    Compare if a not encrypted password is equal to a encrypted password
    The function receives two parameter. The first is the not encrypted password
    the second is the encrypted password that we want to compare
*/
exports.compareEncrypt = function(notEncryptedPassword, encryptedPassword){
    
    return new Promise((resolve, reject) => {

        try {

            if (typeof(notEncryptedPassword) == 'null' || typeof(encryptedPassword) == 'null') {
                return reject(false);
            }

            var passwordInBytes = crypto.AES.decrypt(encryptedPassword, passwordSecretKey);
            var decryptedPassword = passwordInBytes.toString(crypto.enc.Utf8);

            if (decryptedPassword == notEncryptedPassword){
                return resolve(true);
            } else {
                return reject(false);
            }

        } catch (e){
            return reject(false);
        }
    });
};

/*
    31/07/2016
    This function is responsible to generate a valid token for the user 
    The function receives a parameter userData that expected a JSON object with the data about the user
    The function returns a promise with the token case the encryptation succeeds
*/
exports.generateToken = function(userData){

    return new Promise(function (resolve, reject) {
        
        try {

            if(typeof(userData) == 'null') return reject('Not a valid user data');

            var encryptedUserData = crypto.AES.encrypt(userData, passwordSecretKey).toString();
            
            // Get our token encrypted data 
            var token = jwt.sign({
                token: encryptedUserData
            }, tokenSecretKey);
            
            return resolve(token);
            
        } catch (e){
            return reject(e);
        }   
    });
};

/*
    30/05/2017
    This function is responsible to check if a user token is valid
    The function receives a parameter token that expected a object with the user token
    The function returns a promise with the token data if it's valid
*/
exports.decryptToken = function(token){
    
    return new Promise(function (resolve, reject) {
        
        try {
        
            var decodedJWT = jwt.verify(token, tokenSecretKey);
            var tokenInBytes = crypto.AES.decrypt(decodedJWT.token, passwordSecretKey);
            var tokenData = JSON.parse(tokenInBytes.toString(crypto.enc.Utf8));
            
            return resolve(tokenData);
            
        } catch (e) {
            return reject(e);
        }    
    });      
};