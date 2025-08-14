const jwt = require('jsonwebtoken');

const isLoggin = async (req,res,next)=>{
   try {
    const token = req.cookies.token;
    if(!token) return res.redirect('/admin')
     const tokenData = jwt.verify(token,process.env.JWT_SCERET)
      req.id = tokenData.id,
      req.role =tokenData.role,
      req.fullname = tokenData.fullname   
      next()
   } catch (error) {
    console.log(error);
    res.status(401).send('Unauthrized:Invalid Token')
   }
}
module.exports = isLoggin;