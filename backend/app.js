const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/users');
const bookRoutes = require('./routes/books');
const librarianRoutes = require('./routes/librarians');
const authRoutes = require('./routes/auth');


const app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));


// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     next();
// })


app.use("/images", express.static(path.join("backend/images")));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/books/', bookRoutes);
app.use('/api/users/', userRoutes);
app.use('/api/librarians/', librarianRoutes);
app.use('/api/auth/', authRoutes);
app.listen(8080);
