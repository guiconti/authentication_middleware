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
            
            // Decrypt the token
            encrypt.decryptToken(token).then(function(token){
                
                // Look for the ID tokenq
                User.findById(token.id, function (err, user){
                    
                    // If the token find gives an error
                    // Handle this error better (look for connect failure)
                    if (err){

                        res.status(500);
                        /*res.json({
                            type: false,
                            data: "Error occured: " + err     
                        });*/
                        res.sendFile(frontPath + '/admin/user_login.html');
                        
                    // Case the token is not found    
                    } else if (!user){

                        res.status(401);
                        /*res.json({
                            type: false,
                            data: "Invalid Token"    
                        });*/
                        res.sendFile(frontPath + '/admin/user_login.html');
                        
                    // Case the token is found    
                    } else {

                        // If the token password has changed or it expired
                        if (!(user.password == token.password)){

                            res.status(401);
                            /*res.json({
                                type: false,
                                data: "Invalid Token" // Actually expired
                            });*/
                            res.sendFile(frontPath + '/admin/user_login.html');

                        // If everything is ok move on   
                        } else {
                            
                            // Put our user in the req 
                            req.user = user;
                            next();
                            
                        } 
                    }
                });
                
            // Reject call    
            }, function(){

                res.status(401);
                /*res.json({
                    type: false,
                    data: "Invalid Token"
                });*/
                res.sendFile(frontPath + '/admin/user_login.html');

            });
            
        }    

    } catch (e) {

        console.log("err: " + e);

    }   
};

exports.validateUserPrivilege = function(req, res, next){

    if (!validation.isUser(req.user.privilege.role)){

        res.status(401);
        res.json({
            data: "You don't have enough privileges to do this operation."
        });

    } else {

        next();
        
    }
};

exports.validateAdminPrivilege = function(req, res, next){

    if (!validation.isAdmin(req.user.privilege.role)){

        res.status(401);
        res.json({
            data: "You don't have enough privileges to do this operation."
        });

    } else {
        
        next();

    }
};