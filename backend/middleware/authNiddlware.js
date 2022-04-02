const jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');




module.exports.auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    //console.log(token,'<----------------')
    const isCustomAuth = token.length < 500;

    let decodedData;

    if (token && isCustomAuth) {      
      decodedData = jwt.verify(token,process.env.SECRET );

      req.userId = decodedData.id;
      req.user =decodedData
    } else {
      decodedData = jwt.decode(token);

      req.userId = decodedData?.sub;
    }    

    next();
  } catch (error) {
    console.log(error);
  }
};







// expressJwt({
//      secret: process.env.SECRET,
//      algorithms: ["HS256"], // added later
//      userProperty: "auth",
//    });





// async(req,res,next) => {
//      const {authToken} = req.cookies;
//      console.log(authToken,'-------------->')
//      if(authToken){
//           const deCodeToken = await jwt.verify(authToken,process.env.SECRET);
//           req.myId = deCodeToken.id;
//           next();
//      }else{
//           res.status(400).json({
//                error:{
//                     errorMessage: ['Please Loing First']
//                }
//           })
//      } 
// }