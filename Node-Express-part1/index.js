const express = require('express');
const jwt = require("jsonwebtoken");
const app = express();

const data = [
    {
        userId: "Han",
        content: "Hello, Han"
    }, {
        userId: "Kim",
        content: "No, Thanks Kim"
    }
]

app.use(express.json());

app.post('/login', (req, res) =>{
    const userId = req.body.userId;
    const user = { userId: userId };

    const token = jwt.sign(user, "secret");
    res.json({token: token});
})

app.post('/data', authMiddleware, (req, res) => {
    console.log(req.user)
    res.json(data);
})


function authMiddleware(req, res, next) {
    const authRowToken = req.headers["authorization"];
    const authToken = authRowToken && authRowToken.split(" ")[1];
    
    if (authToken == null) {
        return res.sendStatue(401);
    }

    const rq = jwt.verify(authToken, 'secret', (err, decoded) => {
        if (err) {
            return res.sendStatue(403);
        }else{
            req.user = decoded;
            next();
        }
    })
    console.log(rq)
}

app.listen(4000, () => {
    console.log('listening on 4000');
})
