//  Replace with your token salty key
var tokenSecretKey = 'replace me';
//  Replace with your data salty key
var dataSecretKey = 'replace me';

var crypto = require('crypto-js');
var jwt = require('jsonwebtoken');

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

            var encryptedUserData = crypto.AES.encrypt(userData, dataSecretKey).toString();
            
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
            var tokenInBytes = crypto.AES.decrypt(decodedJWT.token, dataSecretKey);
            var tokenData = JSON.parse(tokenInBytes.toString(crypto.enc.Utf8));
            
            return resolve(tokenData);
            
        } catch (e) {
            return reject(e);
        }    
    });      
};