const encrypt = require('./encrypt');

/* 
    07/09/2016
    Valida o token do usuario em todos os request que precisam de token valido
    Caso nao haja token ou o mesmo seja invalido redireciona ele para a tela
    de login
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