const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());

const SECRET_KEY = '33595c822eb6d52452e653a39aa109a185642e7d102cf2f300669911a3f5be3a';


function validateBearerToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden: Invalid token' });
        }
        req.user = decoded;
        next();
    });
}


app.get('/protected', validateBearerToken, (req, res) => {
    res.json({ message: 'You have access to the protected resource!' });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});



// const jwt = require('jsonwebtoken');
// const SECRET_KEY = '33595c822eb6d52452e653a39aa109a185642e7d102cf2f300669911a3f5be3a';

// const payload = { user_id: 1, username: 'example_user' };
// const expiresIn = '1m';
// const token = jwt.sign(payload, SECRET_KEY, { expiresIn });

// console.log(`Bearer ${token}`);