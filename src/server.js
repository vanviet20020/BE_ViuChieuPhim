const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const route = require('./routes');
require('./configs/connectRedis');
const { setUserInRequest } = require('./middleware/auth');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());

//config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//config cookie-parser
app.use(cookieParser());

// setup the logger
app.use(morgan('tiny'));

app.use(setUserInRequest);

route(app);

app.listen(PORT, () => {
    console.log(`Server is runing on http://localhost:${PORT} !!`);
});
