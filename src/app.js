const express = require('express');
const signuproute = require('./routes/SignUp');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 6000;

app.use(bodyParser.json());

app.use('/user', signuproute);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
