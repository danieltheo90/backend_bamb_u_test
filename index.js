const express      = require('express');
const morgan       = require('morgan');
const cors         = require('cors');
const app          = express();
const peopleLikeYouRoutes	= require('./routes/people-like-you');

app.use(cors());
app.use(morgan('dev'));

app.use(function(req, res, next){
  res.setHeader('Access-Control-Allow-Origin', "*");
  // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type','Authorization',' Accept');
  next();
});

app.get("/", function(req, res){
  res.send("<p> BAMBU Backend Engineer Test<br></p>");
});

app.use('/people-like-you', peopleLikeYouRoutes);


app.listen(process.env.PORT || 3000, err => {
  console.log('Running Apps');
});
