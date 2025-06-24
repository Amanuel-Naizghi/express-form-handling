const express = require('express');
const app = express();
const usersRouter = require('./routes/userRouter');

app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use('/',usersRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT , ()=>console.log(`You are viewing you app from this port number ${PORT}`));
