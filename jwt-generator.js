const jwt = require('jwt-simple');
const moment = require('moment');
const fs = require('fs');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const PAYLOAD_SUB_REFORMAS = process.env.PAYLOAD_SUB_REFORMAS;

function generateToken() {
    const payload = {
        sub: PAYLOAD_SUB_REFORMAS,
        iat: moment().unix(),
        exp: moment().add(20, 'years').unix()
    }
    
    let token = jwt.encode(payload, JWT_SECRET);

    if (token != null) {
        fs.writeFileSync('token.json', token);
        return token;
    } else {
        console.log('Hubo un error!!! Token no generado.')
    }
}
generateToken();