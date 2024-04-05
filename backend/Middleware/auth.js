const config = require ("config");
const jwt = require ("jsonwebtoken");
const auth =(req,res,next) => {
    const token =req.header("X_auth_token");

if (!token )
return res.status("401").json({msg:"Accès refusé, veuillez vous connecter"});

try{
    const decoded = jwt.verify(token,config.get("jwtSecret"));
    req.userid=decoded.indexOf;
    next();
}
catch(error){
    return res.status("400").json({msg:"Token non valide"});
}
};
module.exports=auth;
