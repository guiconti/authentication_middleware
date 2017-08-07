/**
 * Token management module
 * @module tokenUtils
 */

/**
 * Token encrypt and decrypt key
 * @readonly
 * @const {string}
 */
const tokenSecretKey = 'replace me';

/**
 * User's data encrypt and decrypt key
 * @readonly
 * @const {string}
 */
const dataSecretKey = 'replace me';

var crypto = require('crypto-js');
var jwt = require('jsonwebtoken');

/**
 * Generates a encrypted token
 * Receive user's information and generate a new token
 *
 * @param {object} userData - Dados do usuário
 * @return {Promise.string} - Retorna uma promise contendo o token do usuário
 * @throws {Promise.string} - Retorna o erro encontrado durante a criação do token
 * 
 */
exports.generateToken = function(userData){

    return new Promise(function (resolve, reject) {
        
        try {

            if(typeof(userData) == 'null') return reject('Not a valid user data');

            var encryptedUserData = crypto.AES.encrypt(userData, dataSecretKey);
            
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

/**
 * Decripta um token encriptado
 * Recebe um token e faz a decriptação com a chave do token
 *
 * @param {string} token - Token do usuário
 * @return {Promise.object} - Retorna uma promise contendo o as informações do usuário
 * @throws {Promise.string} - Retorna o erro encontrado durante a decriptação do token
 * 
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