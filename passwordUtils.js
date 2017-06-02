//  Replace with your password salty key
var passwordSecretKey = 'replace me';

var crypto = require('crypto-js');

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
