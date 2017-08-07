/**
 * Password management module
 * @module passwordUtils
 */

/**
 * Password encryptation key
 * @readonly
 * @const {string}
 */
const passwordSecretKey = 'replace me';

var crypto = require('crypto-js');

/**
 * Encrypt user's password
 * Get a user's password an encrypt with the encryptation key
 *
 * @param {string} password - Not encrypted user's password
 * @return {Promise.string} - Returns a promise with user`s encrypted password
 * @throws {Promise.string} - Returns the error found while encrypting user's password
 * 
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

/**
 * Compare if a encrypted password is equal to a no encrypted password
 * 
 * @param {string} notEncryptedPassword - Not encrypted user's password
 * @param {string} encryptedPassword - Encrypted user's password
 * @return {Promise.boolean} - Returns a promise with the equivalence of both password
 * 
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
