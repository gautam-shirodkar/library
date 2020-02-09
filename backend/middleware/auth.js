const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, 'MY_SECRET_KEY');
        req.userData = {userId: decodedToken.userId};
        next();
    } catch (e) {
        res.status(401).json({
            message: 'Auth Failed'
        })
    }
}
