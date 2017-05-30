//  Replace with your password salty key
var passwordSecretKey = 'replace me';
//  Replace with your token salty key
var tokenSecretKey = 'replace me';

var crypto = require('crypto-js');
var jwt = require('jsonwebtoken');

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
        if (typeof(passwordSecretKey) != 'string'){
            if (typeof(password) != 'string') return reject('Password not a string');

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

            if (typeof(notEncryptedPassword) != 'string' || typeof(encryptedPassword) != 'string') {
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
        
            // Encrypts our user JSON object
            var encryptedData = crypto.AES.encrypt(userData, secretKey).toString();
            
            // Get our token encrypted data 
            var token = jwt.sign({
                token: encryptedData
            }, tokenSecretKey);
            
            resolve(token);
            
        } catch (e){
            reject(e);
        }   
    });
};

// Validate token
exports.decryptToken = function(token){
    
    return new Promise(function (resolve, reject) {
        
        try {
        
            var decodedJWT = jwt.verify(token, tokenSecretKey);
            var bytes = crypto.AES.decrypt(decodedJWT.token, secretKey);
            var tokenData = JSON.parse(bytes.toString(crypto.enc.Utf8));
            
            resolve(tokenData);
            
        } catch (e) {
            reject();
        }    
        
    });      
};