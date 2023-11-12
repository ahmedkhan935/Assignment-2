const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
 async function Authtoken(req, res, next) {
    const token = req.headers.token;
    if (!token) return res.status(401).send('Access denied. No token provided')
    try {
        const decoded =jwt.verify(token, process.env.TOKEN)
        req.body.email = decoded.email;
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.')
    }
}
module.exports = Authtoken;