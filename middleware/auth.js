const jwt = require('jsonwebtoken');

module.exports = () => {
  return (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    if (req.headers.authorization){
      const token = req.headers.authorization.split(" ")[1];
      const user = jwt.verify(token, process.env.JWT_KEY)

      try {
        if(jwt.verify(token, process.env.JWT_KEY)){
          res.locals.userConnected = user
          next();
        }
        else{
          res.status(401).json({ message: "Authentication KO - failed -- PROBLEM TOKEN"});
      }
      } catch (error) {
        res.status(401).json({ message: "Authentication KO - failed -- PROBLEM TOKEN"});
      }
    } else {
      res.status(401).json({ message: "no authorization provided"});
    }
  }
}
