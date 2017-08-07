/**
 * Módulo de ações do IoT
 * @module bot/gmail
 */

const encrypt = require('./encrypt');

/**
 * Executa uma ação IoT utilizando as APIs do mesmo.
 * Receba uma mensagem enviada pelo Telegram, avalia a ação e executa caso tudo esteja de acordo
 *
 * @param {object} msg - Mensagem enviada para o bot solicitando ação no IoT.
 * @param {object} msg.chat - Informações do chat em que a solicitação aconteceu.
 * @param {integer} msg.chat.id - ID do chat em que a solicitação ocorreu.
 * @param {object} msg.from - Informações sobre a pessoa que realizou a solicitação.
 * @param {integer} msg.from.id - ID da pessoa que solicitou a ação.
 * @param {string[]} match - Array com todas as informações da requisição (após o /i).
 * @return {bot.sendMessage} - Retorna a execução da resposta no Telegram.
 */
exports.validateToken = function (req, res, next){
    
    try {
        
        var token = req.cookies.session;

        if (typeof(token) != 'string'){
            
            //  Change for your use case on not authorize access
            res.status(401);
            res.json({
                type: false,
                data: 'You do not have the permission to access this.'
            });

        } else {
            
            encrypt.decryptToken(token).then((token) => {
                 res.status(200).json({
                    msg: "Invalid Token"
                });
            }, (err) => {
                //  Change for your use case on invalid token
                res.status(401).json({
                    msg: "Valid Token"
                });
            });      
        }    
    } catch (e) {
        console.log("err: " + e);
    }   
};