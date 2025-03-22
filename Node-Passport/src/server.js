const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://node_user:asdf1234@nodejspassport.lzxjy.mongodb.net/?retryWrites=true&w=majority&appName=NodejsPassport")
    .then(() => {
        console.log("Database connection established");
    })
    .catch(err => console.log(err));

const port = 6000;
app.listen(port, () => {
    console.log('listening on port ' + port);
});