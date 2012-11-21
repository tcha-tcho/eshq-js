var app     = require('express')()
  , request = require('./support/http')
    , eshq    = require('../')({
     key    : "9ccf66d2-1a3e-4f83-8d19-63fd7b920100"
    ,secret : "a8ffc2c7-d238-439b-b364-71c84cdd64c4"
  }).listen(app)


app.set('views',__dirname + '/fixtures');

app.locals.hello = 'there';

var fs = require('fs');
app.get('/',function(req,res,next){
  fs.readFile(__dirname.substr(0,__dirname.length - 5) + '/example/views/index.html', 'utf8', function(err, text){
    res.send(text);
  });
});

// override the default error handler so it doesn't log to console:
app.use(function(err,req,res,next) {
  console.log(err.stack);
  // res.send(500, err.stack);
})



describe('app',function(){

  describe('GET /',function(){
    it('should render with default stuff',function(done){
      request(app)
        .get('/')
        .end(function(res){
          res.should.have.status(200);
          res.body.should.include('<html>');
          res.body.should.include('http://app.eventsourcehq.com/es.js');
          res.body.should.include('var es = new ESHQ(');
          res.body.should.include('es.addEventListener(');
          done();
        })
    })
  })
  describe('POST /',function(){
    it('should create a new socket on POST /eshq/socket',function(done){
      request(app)
        .post('/eshq/socket',
        {channel:"some-channel"}
        ,function(res){
          // {"channel":"some-channel","presence_id":null,"socket":"dfe32287-e367-43c2-8e5a-0bb4623742d5"}
          res.should.include('some-channel');
          res.should.include('presence_id');
          res.should.include('null');
          res.should.include('socket');
          res.should.include('-');
          done();
        })
    })
    it('should post a new message on POST /eshq/event',function(done){
      request(app)
        .post('/eshq/event',
        {channel:"some-channel",data:"My message"}
        ,function(res){
          res.should.equal('{}');
          done();
        })
    })
  })

})
