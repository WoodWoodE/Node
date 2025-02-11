const express = require('express');
const app = express();

app.use(express.json());

app.post('/login', (req, res) =>{
    const userId = req.body.userId;
    const userPw = req.body.userPw;
})

app.listen(4000, () => {
    console.log('listening on 4000');
})
