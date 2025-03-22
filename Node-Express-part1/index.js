const express = require('express');
const jwt = require("jsonwebtoken");
const app = express();
const cookieParser = require("cookie-parser");

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

app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("Cookies")
})

let refreshTokenList = [];

app.post('/login', (req, res) =>{
    const userId = req.body.userId;
    const user = { userId: userId };

    const accessToken = jwt.sign(user, "secret", {expiresIn: "30s"});
    console.log(accessToken);
    const refreshToken = jwt.sign(
                                user,
                                "superSecret", 
                                {expiresIn: "1d"}
                            )
    
    
    refreshTokenList.push(refreshToken);

    res.cookie("refreshToken", refreshToken, {httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 2});

    res.json({accessToken: accessToken});
})

app.post('/data', authMiddleware, (req, res) => {
    console.log(req.user)
    res.json(data);
})


function authMiddleware(req, res, next) {
    const authRowToken = req.headers["authorization"];
    const authToken = authRowToken && authRowToken.split(" ")[1];
    
    if (authToken == null) {
        return res.sendStatus(401);
    }

    const rq = jwt.verify(authToken, 'secret', (err, decoded) => {
        if (err) {
            return res.sendStatus(403);
        }else{
            req.user = decoded;
            next();
        }
    })
    console.log(rq)
}

app.post("/token", (req, res) => {
    console.log(req.cookies.refreshToken)
    if(!req.cookies.refreshToken){
        return res.sendStatus(403);
    }

    if (!refreshTokenList.includes(req.cookies.refreshToken)){
        return res.sendStatus(403);
    }

    jwt.verify(req.cookies.refreshToken, "superSecret", (err, decoded) => {
        if(err) {
            return res.sendStatus(403)
        }

        const accessToken = jwt.sign({user : decoded.userId}, "secret", { expiresIn: "30s"});

        res.json({accessToken:accessToken})
    });

})

app.listen(4000, () => {
    console.log('listening on 4000');
})
