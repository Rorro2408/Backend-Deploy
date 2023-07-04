const dotenv = require('dotenv');
var jwt = require('jsonwebtoken');

dotenv.config();

//chatgpt me ayudo a hacer esta función para decodificar jwt enviados por el header
//tambien me ayudo a aprender como acceder al header

async function Decode(authorizationHeader){
    let token = "";
    if (authorizationHeader) {
        token = authorizationHeader.replace('Bearer ', '');
        console.log(token);
        const JWT_PRIVATE_KEY = process.env.JWT_SECRET;
        const decodedToken = await jwt.verify(token, JWT_PRIVATE_KEY);
        return decodedToken;
      }
    return "";
}

module.exports = Decode;