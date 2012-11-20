var express = require('express')
  , request = require('./support/http')
  , engine = require('../')

var app = express();
app.set('views',__dirname + '/fixtures');

app.locals.hello = 'there';

app.get('/',function(req,res,next){
  res.render('index.ejs')
})

// override the default error handler so it doesn't log to console:
app.use(function(err,req,res,next) {
  // console.log(err.stack);
  res.send(500, err.stack);
})

describe('app',function(){

  describe('GET /',function(){
    it('should render with default stuff',function(done){
      request(app)
        .get('/')
        .end(function(res){
          res.should.have.status(200);
          // res.body.should.equal('<html><head><title>ejs-locals</title></head><body><h1>Index</h1></body></html>');
          done();
        })
    })
  })

})
