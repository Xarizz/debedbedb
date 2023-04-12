const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const app = express();
app.use(bodyParser.json());

const SECRET_KEY = '33595c822eb6d52452e653a39aa109a185642e7d102cf2f300669911a3f5be3a';

const steamAccs = []
const windScribeAccs = []
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
app.post('/gensteam', validateBearerToken, (req, res) => {
    const { username, password } = req.query;

    if (!username || !password) {
        return res.status(400).json({ error: 'Bad Request: Missing username or password' });
    }

    steamAccs.push({ username, password });
    res.status(201).json({ message: 'Credentials added to the array' });
});

app.post('/genwind', validateBearerToken, (req, res) => {
    const { username, password } = req.query;

    if (!username || !password) {
        return res.status(400).json({ error: 'Bad Request: Missing username or password' });
    }

    windScribeAccs.push({ username, password });
    res.status(201).json({ message: 'Credentials added to the array' });
});



app.get('/steam', (req, res) => {
    if (steamAccs.length == 0) {
        return res.status(404).json({ error: 'accounts generator reached!' });
    }

    const firstCredential = steamAccs.shift();
    res.json(firstCredential);
});



app.get('/windscribe', validateBearerToken, (req, res) => {
    if (windScribeAccs.length == 0) {
        return res.status(404).json({ error: 'accounts generator reached!' });
    }
    const firstCredential = windScribeAccs.shift();
    res.json(firstCredential);
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

// const jwt = require('jsonwebtoken');
// const SECRET_KEY = '33595c822eb6d52452e653a39aa109a185642e7d102cf2f300669911a3f5be3a';

// const payload = { user_id: 1, username: 'example_user' };
// const expiresIn = '1d';
// const token = jwt.sign(payload, SECRET_KEY, { expiresIn });

// console.log(`Bearer ${token}`);